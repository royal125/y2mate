import express from "express";
import cors from "cors";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";

const app = express();
const PORT = 3000;

app.use(cors({
  origin: [
    "https://savefrom.in",
    "https://www.savefrom.in",
    "https://api.savefrom.in/",
  ]
}));

app.use(express.json());

const DOWNLOAD_DIR = path.join(os.tmpdir(), "yt-downloads");
if (!fs.existsSync(DOWNLOAD_DIR)) fs.mkdirSync(DOWNLOAD_DIR);

/* ===================== INFO ===================== */
app.post("/info", (req, res) => {

  const { url } = req.body;

  if (!url) {
    return res.json({
      error: "URL is required",
      formats: [],
    });
  }

  const cmd = `
yt-dlp \
--extractor-args "youtube:player_client=android" \
--dump-json \
"${url}"
`;

  exec(cmd, { maxBuffer: 1024 * 1024 * 10 }, (err, stdout) => {
    if (err || !stdout) {
      return res.json({
        error: "yt-dlp failed to fetch info",
        formats: [],
      });
    }

    let data;
    try {
      data = JSON.parse(stdout);
    } catch (e) {
      return res.json({
        error: "Invalid yt-dlp response",
        formats: [],
      });
    }

    const formats = Array.isArray(data.formats)
      ? data.formats
          .filter(f => f.ext === "mp4" && f.format_id)
          .map(f => {
            let label = "Unknown";

            if (f.height >= 2160) label = "4K (Ultra HD)";
            else if (f.height >= 1440) label = "1440p (2K)";
            else if (f.height >= 1080) label = "1080p (Full HD)";
            else if (f.height >= 720) label = "720p (HD)";
            else if (f.height) label = `${f.height}p`;

            return {
              itag: f.format_id,
              quality: label,
              size: f.filesize
                ? `${(f.filesize / 1024 / 1024).toFixed(2)} MB`
                : "Unknown",
              height: f.height || 0,
              hasAudio: f.acodec !== "none",
            };
          })
      : [];

    // ✅ ALWAYS respond with predictable shape
    return res.json({
      title: data.title || "Unknown title",
      thumbnail: data.thumbnail || "",
      duration: data.duration_string || "",
      formats,
    });
  });
});



/* ===================== DOWNLOAD ===================== */
app.get("/download", (req, res) => {
  const { url, itag, title } = req.query;
  if (!url || !itag) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  const safeTitle = (title || "video")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "_");

  const output = path.join(DOWNLOAD_DIR, `${safeTitle}.%(ext)s`);

  const cmd = `
yt-dlp \
--extractor-args "youtube:player_client=android" \
--force-ipv4 \
-f "${itag}+bestaudio/best" \
--merge-output-format mp4 \
-o "${output}" \
"${url}"
`;

  exec(cmd, { maxBuffer: 1024 * 1024 * 20 }, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Download failed" });
    }

    const file = fs
      .readdirSync(DOWNLOAD_DIR)
      .find(f => f.startsWith(safeTitle));

    const filePath = path.join(DOWNLOAD_DIR, file);

    res.download(filePath, () => {
      fs.unlinkSync(filePath);
    });
  });
});

app.listen(PORT, () => {
  console.log(`✅ yt-dlp backend running on port ${PORT}`);
});
