import { spawn } from "child_process";
import cors from "cors";
import express from "express";
import fs from "fs";
import os from "os";
import path from "path";
import { fileURLToPath } from "url";
/* ===================== ROUTERS ===================== */
import instagramRouter from "../instagram-downloader.js";
import mp3ConverterRouter from "../mp3-converter.js";

/* ===================== PATH SETUP ===================== */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
/* ===================== YT-DLP SETUP ===================== */
const YTDLP_PATH = path.join(__dirname, "youtube-dl-exec");
console.log("🔧 youtube-dl-exec path:", YTDLP_PATH);
console.log("📁 youtube-dl-exec exists:", fs.existsSync(YTDLP_PATH));
/* ===================== APP INIT ===================== */
const app = express();
/* ===================== CORS ===================== */
const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:5000"
];
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true,
    exposedHeaders: ["Content-Disposition", "Content-Length", "Content-Type"]
}));
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
function estimateSize(fmt, duration) {
    if (fmt.filesize) return fmt.filesize;
    if (fmt.filesize_approx) return fmt.filesize_approx;
    if (fmt.tbr && duration) return (fmt.tbr * 1024 * duration) / 8;
    return null;
}
/* ===================== YOUTUBE INFO ===================== */
app.post("/api/info", async (req, res) => {
    try {
        const { url } = req.body;

        if (!url) {
            console.log("❌ Missing URL in request");
            return res.json({ success: false, error: "Missing URL" });
        }

        console.log("📥 Fetching info for:", url);

        // Add 5 second delay to simulate real fetching
        await new Promise(resolve => setTimeout(resolve, 5000));

        const responseData = {
            success: true,
            title: "Test Video - " + (url.split('v=')[1]?.substring(0, 8) || "Sample"),
            thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
            formats: [
                {
                    itag: "22",
                    quality: "1080p",
                    ext: "mp4",
                    size: "80MB"
                },
                {
                    itag: "18",
                    quality: "720p",
                    ext: "mp4",
                    size: "42MB"
                },
                {
                    itag: "136",
                    quality: "480p",
                    ext: "mp4",
                    size: "28MB"
                },
                {
                    itag: "134",
                    quality: "360p",
                    ext: "mp4",
                    size: "13MB"
                }
            ],
            audio: {
                itag: "140",
                quality: "248kbps",
                ext: "m4a"
            }
        };

        console.log("📤 Sending response:", JSON.stringify(responseData, null, 2));

        return res.json(responseData);
    } catch (err) {
        console.error("❌ Error in /api/info:", err.message);
        return res.json({ success: false, error: err.message || "Unknown error" });
    }
});
/* ===================== YOUTUBE DOWNLOAD + SSE ===================== */
app.get("/api/download", async (req, res) => {
    try {
        const { url, title, type } = req.query;

        if (!url || !title) {
            return res.status(400).json({ error: "Missing parameters" });
        }

        const safeTitle = title
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "_")
            .slice(0, 50);

        const ext = type === "audio" ? "mp3" : "mp4";
        const outputFile = path.join(
            downloadsDir,
            `${safeTitle}_${Date.now()}.${ext}`
        );

        const args = [
            url,
            "-o", outputFile,
            "--no-playlist",
            "--no-warnings"
        ];

        if (type === "audio") {
            args.push("-x", "--audio-format", "mp3");
        } else {
            args.push(
                "-f", "bestvideo+bestaudio/best",
                "--merge-output-format", "mp4"
            );
        }

        console.log("▶ youtube-dl-exec args:", args.join(" "));

        const ytdlp = spawn(YTDLP_PATH, args);

        ytdlp.stderr.on("data", d => {
            console.error("youtube-dl-exec:", d.toString());
        });

        ytdlp.on("close", code => {
            if (code !== 0) {
                console.error("❌ youtube-dl-exec failed");
                return res.status(500).json({ error: "Download failed" });
            }

            if (!fs.existsSync(outputFile)) {
                return res.status(500).json({ error: "File not created" });
            }

            const stat = fs.statSync(outputFile);

            res.setHeader(
                "Content-Disposition",
                `attachment; filename="${safeTitle}.${ext}"`
            );
            res.setHeader("Content-Length", stat.size);
            res.setHeader(
                "Content-Type",
                type === "audio" ? "audio/mpeg" : "video/mp4"
            );

            fs.createReadStream(outputFile).pipe(res);

            res.on("finish", () => {
                setTimeout(() => {
                    if (fs.existsSync(outputFile)) {
                        fs.unlinkSync(outputFile);
                        console.log("🗑️ cleaned:", outputFile);
                    }
                }, 8000);
            });
        });

    } catch (err) {
        console.error("❌ Download error:", err);
        res.status(500).json({ error: err.message });
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
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log("Allowed origins:", allowedOrigins);
});
