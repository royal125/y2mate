/* ===================== IMPORTS ===================== */
import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import os from "os";
import { fileURLToPath } from "url";
import ytdlp from "yt-dlp-exec";
import { checkAndUpdateYtDlp } from "./update-ytdlp.js";

/* ===================== ROUTERS ===================== */
import instagramRouter from "./instagram-downloader.js";
import mp3ConverterRouter from "./mp3-converter.js";

/* ===================== PATH SETUP ===================== */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ===================== APP INIT ===================== */
const app = express();

/* ===================== CORS ===================== */
const allowedOrigins = [
  "http://localhost:3000",
  "https://savefrom.in",
  "https://www.savefrom.in",
  "https://api.savefrom.in"
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true,
    exposedHeaders: [
      "Content-Disposition",
      "Content-Length",
      "Content-Type"
    ]
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

/* ===================== ROOT ENDPOINT ===================== */
app.get("/", (req, res) => {
  res.send("API WORKING");
});

/* ===================== TEMP DIR ===================== */
const downloadsDir = path.join(os.tmpdir(), "ytube-downloads");
if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir, { recursive: true });
}

/* ===================== CLEANUP OLD FILES ===================== */
function cleanupOldFiles() {
  try {
    const files = fs.readdirSync(downloadsDir);
    const now = Date.now();
    files.forEach(file => {
      const filePath = path.join(downloadsDir, file);
      const stats = fs.statSync(filePath);
      if (now - stats.mtimeMs > 3600000) {
        fs.unlinkSync(filePath);
        console.log(`🗑️  Cleaned: ${file}`);
      }
    });
  } catch (err) {
    console.error("Cleanup error:", err.message);
  }
}

setInterval(cleanupOldFiles, 1800000);
cleanupOldFiles();

/* ===================== HELPERS ===================== */
function formatBytes(bytes) {
  if (!bytes || bytes <= 0) return "Unknown";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, i)).toFixed(2) + " " + units[i];
}

function estimateSize(fmt, duration) {
  if (fmt.filesize) return fmt.filesize;
  if (fmt.filesize_approx) return fmt.filesize_approx;
  if (fmt.tbr && duration) return (fmt.tbr * 1024 * duration) / 8;
  return null;
}

/* ===================== SSE CLIENTS ===================== */
const sseClients = new Map();

/* ===================== SSE ENDPOINT ===================== */
app.get("/api/progress/:id", (req, res) => {
  const { id } = req.params;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  sseClients.set(id, res);

  req.on("close", () => {
    sseClients.delete(id);
  });
});

/* ===================== YOUTUBE INFO ===================== */
app.post("/api/info", async (req, res) => {
  const { url } = req.body;

  if (!url || (!url.includes("youtube.com") && !url.includes("youtu.be"))) {
    return res.json({ success: false, error: "Invalid YouTube URL" });
  }

  try {
    const info = await ytdlp(url, { dumpJson: true, noWarnings: true });
    const formats = info.formats || [];
    const duration = info.duration || 0;

    const realHeight =
      formats.filter(f => f.height && f.vcodec !== "none")
        .map(f => f.height)
        .sort((a, b) => b - a)[0] || null;

    const videoFormats = [];
    const seen = new Set();

    formats.forEach(fmt => {
      if (!fmt.height || fmt.vcodec === "none") return;
      if (seen.has(fmt.height)) return;
      seen.add(fmt.height);

      const size = estimateSize(fmt, duration);

      videoFormats.push({
        itag: fmt.format_id,
        quality: `${fmt.height}p`,
        height: fmt.height,
        ext: fmt.ext || "mp4",
        size: size ? `~${formatBytes(size)}` : "Unknown",
        real: realHeight ? fmt.height <= realHeight : true
      });
    });

    videoFormats.sort((a, b) => b.height - a.height);

    const bestAudio = formats.find(
      f => f.acodec !== "none" && (!f.vcodec || f.vcodec === "none")
    );

    res.json({
      success: true,
      title: info.title,
      thumbnail: info.thumbnail,
      formats: videoFormats,
      audio: bestAudio ? {
        itag: bestAudio.format_id,
        quality: "Best Audio",
        ext: "mp3"
      } : null
    });
  } catch (err) {
    console.error("Parse error:", err.message);
    res.json({ success: false, error: "Failed to fetch video info" });
  }
});

/* ===================== YOUTUBE DOWNLOAD + SSE ===================== */
app.get("/api/download", async (req, res) => {
  const { url, itag, title, type, progressId } = req.query;

  if (!url || !itag || !title) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  const client = sseClients.get(progressId);
  const safeTitle = title.replace(/[^\w\s-]/g, "").replace(/\s+/g, "_").slice(0, 50);
  const ext = type === "audio" ? "mp3" : "mp4";
  const outputFile = path.join(downloadsDir, `${safeTitle}_${Date.now()}.${ext}`);

  try {
    const args = {
      format: itag,
      output: outputFile,
      noWarnings: true
    };

    if (type === "audio") {
      args.extractAudio = true;
      args.audioFormat = "mp3";
    } else {
      args.mergeOutputFormat = "mp4";
    }

    await ytdlp(url, args);

    if (client) client.write("data: 100\n\n");

    const finalFile = fs.existsSync(outputFile)
      ? outputFile
      : outputFile.replace(".mp3", ".m4a");

    if (!fs.existsSync(finalFile)) {
      console.error(`Output file not found: ${finalFile}`);
      return res.status(500).json({ error: "File not created" });
    }

    const stat = fs.statSync(finalFile);

    res.setHeader("Content-Disposition", `attachment; filename="${safeTitle}.${ext}"`);
    res.setHeader("Content-Length", stat.size);
    res.setHeader("Content-Type", type === "audio" ? "audio/mpeg" : "video/mp4");

    fs.createReadStream(finalFile).pipe(res);

    res.on("finish", () => {
      setTimeout(() => {
        if (fs.existsSync(finalFile)) fs.unlinkSync(finalFile);
      }, 3000);
    });
  } catch (err) {
    console.error("Download failed:", err.message);
    res.status(500).json({ error: "Download failed" });
  }
});

/* ===================== EXTERNAL ROUTES ===================== */
app.use("/instagram", instagramRouter);
app.use("/converter", mp3ConverterRouter);

/* ===================== HEALTH ===================== */
app.get("/health", (_, res) => {
  res.json({ success: true });
});

/* ===================== START ===================== */
const PORT = process.env.PORT || 5000;
checkAndUpdateYtDlp();
app.listen(PORT, () => {
  console.log(`🚀 Server running on https://savefrom.in:${PORT}`);
  console.log("Allowed origins:", allowedOrigins);
});
