/* ===================== YOUTUBE INFO ===================== */
app.post("/api/info", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.json({ success: false, error: "Missing URL" });
  }

  try {
    const ytdlp = spawn(YTDLP_PATH, [
      url,
      "--dump-json",
      "--no-warnings",
      "--ignore-errors"
    ]);

    let data = "";
    ytdlp.stdout.on("data", chunk => data += chunk);

    ytdlp.on("close", code => {
      if (code !== 0) {
        return res.json({ success: false, error: "Failed to fetch video info" });
      }

      const info = JSON.parse(data);
      const formats = info.formats
        .filter(f => f.vcodec !== "none")
        .map(f => ({
          itag: f.format_id,
          quality: f.height ? `${f.height}p` : f.quality,
          ext: f.ext,
          size: estimateSize(f, info.duration)
        }));

      const audio = info.formats
        .filter(f => f.vcodec === "none")
        .sort((a, b) => b.abr - a.abr)[0];

      res.json({
        success: true,
        title: info.title,
        thumbnail: info.thumbnail,
        formats,
        audio: {
          itag: audio.format_id,
          quality: `${audio.abr}kbps`,
          ext: audio.ext
        }
      });
    });
  } catch (err) {
    console.error("YouTube info error:", err);
    res.json({ success: false, error: err.message });
  }
});

/* ===================== YOUTUBE DOWNLOAD ===================== */
app.get("/api/download", async (req, res) => {
  try {
    const { url, itag, title, type } = req.query;

    if (!url || !title || !itag) {
      return res.status(400).json({ error: "Missing parameters" });
    }

    const safeTitle = title
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "_")
      .slice(0, 50);

    const ext = type === "audio" ? "mp3" : "mp4";
    const outputPath = path.join(downloadsDir, `${safeTitle}.${ext}`);
    
    const args = [url, "-f", itag, "-o", outputPath];
    if (type === "audio") args.push("--extract-audio", "--audio-format", "mp3");

    const ytdlp = spawn(YTDLP_PATH, args);
    
    ytdlp.on("close", code => {
      if (code !== 0) {
        return res.status(500).json({ error: "Download failed" });
      }

      const stats = fs.statSync(outputPath);
      res.setHeader("Content-Disposition", `attachment; filename="${safeTitle}.${ext}"`);
      res.setHeader("Content-Length", stats.size);
      res.setHeader("Content-Type", type === "audio" ? "audio/mpeg" : "video/mp4");
      
      const fileStream = fs.createReadStream(outputPath);
      fileStream.pipe(res);
    });
  } catch (err) {
    console.error("❌ Download error:", err);
    res.status(500).json({ error: err.message });
  }
});