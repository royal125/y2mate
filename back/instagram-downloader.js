import express from "express";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";

const router = express.Router();
const igDownloadsDir = path.join(os.tmpdir(), "instagram_downloads");

if (!fs.existsSync(igDownloadsDir)) {
    fs.mkdirSync(igDownloadsDir, { recursive: true });
}

console.log("✅ Instagram Downloads directory:", igDownloadsDir);

// ✅ GET INSTAGRAM REEL INFO
// ✅ GET INSTAGRAM REEL INFO
router.post("/info", async (req, res) => {
    try {
        const { url } = req.body;

        if (!url || !url.includes("instagram.com")) {
            return res.json({ success: false, error: "Invalid Instagram URL" });
        }

        console.log("\n📥 Fetching Instagram info:", url);

        const ytdlp = spawn("yt-dlp", [
            url,
            "--dump-json",
            "--no-warnings",
            "--quiet",
            "--socket-timeout=30",
            "--user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "-e"
        ]);

        let output = "";
        let errorOutput = "";

        ytdlp.stdout.on("data", (data) => {
            output += data.toString();
        });

        ytdlp.stderr.on("data", (data) => {
            errorOutput += data.toString();
        });

        await new Promise((resolve, reject) => {
            ytdlp.on("close", (code) => {
                if (code !== 0) {
                    console.error("   ❌ yt-dlp error:", code);
                    reject(new Error(`yt-dlp failed`));
                } else {
                    console.log("   ✅ yt-dlp completed");
                    resolve();
                }
            });

            ytdlp.on("error", (err) => {
                reject(new Error(`yt-dlp spawn error: ${err.message}`));
            });

            setTimeout(() => {
                ytdlp.kill();
                reject(new Error("yt-dlp timeout"));
            }, 30000);
        });

        // ✅ Extract JSON from output
        let jsonString = output.trim();
        const jsonStartIndex = jsonString.indexOf('{');
        
        if (jsonStartIndex !== -1) {
            jsonString = jsonString.substring(jsonStartIndex);
        }

        if (!jsonString || jsonString.length === 0) {
            throw new Error("yt-dlp returned empty response");
        }

        let info;
        try {
            info = JSON.parse(jsonString);
        } catch (parseErr) {
            console.error("   ❌ JSON parse error:", parseErr.message);
            throw new Error("Could not parse video info");
        }

        console.log("   ✅ Parsed successfully");

        const title = info.title || "Instagram_Reel";
        let thumbnail = info.thumbnail || "";
        const duration = info.duration || 0;

        // ✅ Try multiple thumbnail sources
        if (!thumbnail && info.thumbnails && info.thumbnails.length > 0) {
            const sorted = info.thumbnails.sort((a, b) => (b.width || 0) - (a.width || 0));
            thumbnail = sorted[0].url || "";
            console.log("   📸 Found thumbnail from array");
        }

        // ✅ If still no thumbnail, try to extract from webpage_url
        if (!thumbnail && info.webpage_url) {
            // Instagram thumbnail URL pattern
            const reelId = info.id || info.display_id || "";
            if (reelId) {
                thumbnail = `https://instagram.com/p/${reelId}/media/?size=m`;
                console.log("   📸 Generated thumbnail from reel ID");
            }
        }

        // ✅ Use SVG placeholder if no thumbnail found
        if (!thumbnail) {
            thumbnail = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='230' height='230'%3E%3Crect fill='%23e0e0e0' width='230' height='230'/%3E%3Ctext x='50%25' y='50%25' font-size='20' fill='%23999' text-anchor='middle' dy='.3em'%3EInstagram Reel%3C/text%3E%3C/svg%3E`;
            console.log("   📸 Using SVG placeholder");
        }

        console.log("   🖼️  Thumbnail: Available");

        // ✅ Get video formats
        const formats = info.formats || [];
        const videoFormats = [];

        formats.forEach(fmt => {
            if (fmt.vcodec && fmt.vcodec !== "none" && fmt.height) {
                const height = fmt.height;
                videoFormats.push({
                    itag: fmt.format_id,
                    quality: `${height}p`,
                    height: height,
                    ext: fmt.ext || "mp4"
                });
            }
        });

        // ✅ Remove duplicates and sort
        let uniqueFormats = [];
        const seenHeights = new Set();

        videoFormats
            .sort((a, b) => b.height - a.height)
            .forEach(fmt => {
                if (!seenHeights.has(fmt.height)) {
                    seenHeights.add(fmt.height);
                    uniqueFormats.push(fmt);
                }
            });

        // ✅ Filter to show: 360p, 480p, 720p, and High Quality
        let filteredFormats = uniqueFormats.filter(fmt => 
            fmt.height === 360 || fmt.height === 480 || fmt.height === 720 || fmt.height >= 1080
        );

        // If not enough, include what we have
        if (filteredFormats.length === 0) {
            filteredFormats = uniqueFormats.slice(0, 4);
        }

        // ✅ Rename qualities
        filteredFormats = filteredFormats.map(fmt => {
            let quality = `${fmt.height}p`;
            if (fmt.height >= 1080) {
                quality = "High Quality";
            }
            return {
                ...fmt,
                quality: quality
            };
        });

        // ✅ Add "Best Quality" at top
        filteredFormats.unshift({
            itag: "bestvideo+bestaudio/best",
            quality: "Best Quality",
            height: 9999,
            ext: "mp4"
        });

        // ✅ Get audio formats
        const audioFormats = [];
        const seenAudioBitrates = new Set();

        formats.forEach(fmt => {
            if (fmt.acodec && fmt.acodec !== "none" && (!fmt.vcodec || fmt.vcodec === "none")) {
                const bitrate = fmt.abr || 128;
                
                if (!seenAudioBitrates.has(bitrate)) {
                    seenAudioBitrates.add(bitrate);
                    audioFormats.push({
                        itag: fmt.format_id,
                        quality: `${bitrate}kbps`,
                        bitrate: bitrate,
                        ext: fmt.ext || "mp3"
                    });
                }
            }
        });

        const sortedAudio = audioFormats.sort((a, b) => b.bitrate - a.bitrate);

        console.log("   ✅ Found", filteredFormats.length, "video formats and", sortedAudio.length, "audio formats");

        res.json({
            success: true,
            title,
            thumbnail,
            duration,
            formats: filteredFormats,
            audioFormats: sortedAudio
        });

    } catch (err) {
        console.error("\n❌ Error:", err.message);
        res.json({
            success: false,
            error: err.message
        });
    }
});


// ✅ DOWNLOAD INSTAGRAM REEL
router.get("/download", async (req, res) => {
    const { url, itag, title } = req.query;

    if (!url || !itag || !title) {
        return res.status(400).json({ error: "Missing parameters" });
    }

    // ✅ Sanitize filename
    const safe = title
        .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, "")  // Remove emojis
        .replace(/[^\w\s\-]/g, "")  // Remove special chars
        .replace(/\s+/g, "_")  // Replace spaces
        .substring(0, 50);

    const timestamp = Date.now();
    const outputFile = path.join(igDownloadsDir, `${safe}_${timestamp}.mp4`);

    try {
        console.log(`\n📥 Instagram Download: ${title}`);
        console.log("   Safe name:", safe);
        console.log("   Format:", itag);
        console.log("   Output:", outputFile);

        const args = [
            url,
            "-f", itag,
            "-o", outputFile,
            "--merge-output-format", "mp4",
            "--no-warnings",
            "--quiet",
            "--user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "--socket-timeout=30"
        ];

        const ytdlp = spawn("yt-dlp", args);

        ytdlp.stderr.on("data", (data) => {
            const text = data.toString();
            if (text.includes("time=") || text.includes("%")) {
                const match = text.match(/time=[\d:.]+|(\d+)%/);
                if (match) {
                    process.stdout.write("\r   ⏱️  " + match[0]);
                }
            }
        });

        await new Promise((resolve, reject) => {
            ytdlp.on("close", (code) => {
                if (code !== 0) {
                    console.error(`\n   ❌ Exit code: ${code}`);
                    reject(new Error("Download failed"));
                } else {
                    console.log("\n   ✅ Download complete");
                    resolve();
                }
            });

            ytdlp.on("error", (err) => {
                reject(new Error(`yt-dlp error: ${err.message}`));
            });

            setTimeout(() => {
                ytdlp.kill();
                reject(new Error("Download timeout"));
            }, 10 * 60 * 1000);
        });

        // ✅ Verify file exists
        if (!fs.existsSync(outputFile)) {
            console.error("   ❌ Output file not created");
            throw new Error("Failed to create video file");
        }

        const fileSize = fs.statSync(outputFile).size;
        console.log(`   📊 File size: ${(fileSize / 1024 / 1024).toFixed(2)} MB`);

        if (fileSize < 100000) {
            throw new Error("File too small");
        }

        // ✅ REDIRECT to stream endpoint instead of returning JSON
        const downloadFilename = path.basename(outputFile);
        const streamUrl = `/instagram/stream/${encodeURIComponent(downloadFilename)}`;
        
        console.log("   📤 Redirecting to:", streamUrl);
        res.redirect(streamUrl);

    } catch (err) {
        console.error(`\n   ❌ Error: ${err.message}`);
        
        try {
            if (fs.existsSync(outputFile)) fs.unlinkSync(outputFile);
        } catch (e) {}

        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});


// ✅ STREAM/DOWNLOAD VIDEO FILE
router.get("/stream/:filename", (req, res) => {
    let filename = req.params.filename;

    console.log(`\n📥 Stream request: ${filename}`);

    try {
        filename = decodeURIComponent(filename);
    } catch (e) {
        console.log("   ❌ Decode error");
        return res.status(400).json({ error: "Invalid filename" });
    }

    const filePath = path.join(igDownloadsDir, filename);

    console.log("   Full path:", filePath);

    // ✅ Security check
    const normalizedPath = path.normalize(filePath);
    const normalizedDir = path.normalize(path.resolve(igDownloadsDir));
    
    if (!normalizedPath.startsWith(normalizedDir)) {
        console.log("   ❌ Security violation");
        return res.status(400).json({ error: "Invalid path" });
    }

    // ✅ Check if file exists
    if (!fs.existsSync(filePath)) {
        console.error("   ❌ File not found:", filePath);
        console.log("   Available files:");
        try {
            const files = fs.readdirSync(igDownloadsDir);
            console.log("   ", files.slice(0, 5));
        } catch (e) {}
        return res.status(404).json({ error: "File not found" });
    }

    const fileSize = fs.statSync(filePath).size;
    console.log(`   📊 File size: ${(fileSize / 1024 / 1024).toFixed(2)} MB`);

    // ✅ Set headers BEFORE streaming
    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Content-Length', fileSize);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Accept-Ranges', 'bytes');

    console.log("   📤 Streaming...");

    // ✅ Create read stream
    const stream = fs.createReadStream(filePath);

    stream.on('error', (err) => {
        console.error("   ❌ Stream error:", err.message);
        if (!res.headersSent) {
            res.status(500).json({ error: "Stream error" });
        }
    });

    stream.on('end', () => {
        console.log("   ✅ Stream complete");
    });

    // ✅ Pipe to response
    stream.pipe(res);

    res.on('finish', () => {
        console.log("   ✅ Download finished");
        
        // ✅ Delete file after download
        setTimeout(() => {
            try {
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                    console.log("   🗑️  Cleaned up file\n");
                }
            } catch (e) {}
        }, 2000);
    });

    res.on('error', (err) => {
        console.error("   ❌ Response error:", err.message);
        stream.destroy();
    });
});


// ✅ Health check
router.get("/health", (req, res) => {
    res.json({ success: true, message: "Instagram downloader ready" });
});

export default router;
