import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import os from "os";
import { spawn } from "child_process";
import multer from "multer";
import mp3ConverterRouter from "./mp3-converter.js";
import instagramRouter from "./instagram-downloader.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ✅ CORS configuration for downloads
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
    exposedHeaders: ["Content-Disposition", "Content-Length", "Content-Type"]
}));

app.use(express.json());
app.use(express.urlencoded({ limit: "500mb" }));

// Setup temp directories
const downloadsDir = path.join(os.tmpdir(), "youtube-downloader");
if (!fs.existsSync(downloadsDir)) {
    fs.mkdirSync(downloadsDir, { recursive: true });
}

const converterDir = path.join(os.tmpdir(), "mp3_converter");
if (!fs.existsSync(converterDir)) {
    fs.mkdirSync(converterDir, { recursive: true });
}

console.log("✅ Downloads directory:", downloadsDir);
console.log("✅ Converter directory:", converterDir);

/* ============ VIDEO INFO ENDPOINTS ============ */
app.post("/api/info", handleVideoInfo);
app.post("/info", handleVideoInfo);

async function handleVideoInfo(req, res) {
    try {
        const { url } = req.body;

        if (!url || (!url.includes("youtube.com") && !url.includes("youtu.be") && !url.includes("instagram.com") && !url.includes("facebook.com") && !url.includes("tiktok.com"))) {
            return res.json({ success: false, error: "Invalid URL" });
        }

        console.log("\n📥 Fetching info for:", url);

        const ytdlp = spawn("yt-dlp", [
            url,
            "--dump-json",
            "--no-warnings",
            "--socket-timeout=30",
            "--user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "--add-header", "Accept-Language:en-US,en;q=0.9",
            "--add-header", "Sec-Fetch-Dest:document",
            "--add-header", "Sec-Fetch-Mode:navigate"
        ]);

        let output = "";
        let errorOutput = "";

        ytdlp.stdout.on("data", (data) => {
            output += data.toString();
        });

        ytdlp.stderr.on("data", (data) => {
            errorOutput += data.toString();
            console.log("   📝:", data.toString().trim());
        });

        await new Promise((resolve, reject) => {
            ytdlp.on("close", (code) => {
                if (code !== 0) {
                    console.error("   ❌ yt-dlp exit code:", code);
                    console.error("   Error output:", errorOutput);
                    reject(new Error(`yt-dlp failed with code ${code}`));
                } else {
                    console.log("   ✅ yt-dlp completed");
                    resolve();
                }
            });

            ytdlp.on("error", (err) => {
                console.error("   ❌ Spawn error:", err.message);
                reject(new Error(`Cannot run yt-dlp: ${err.message}`));
            });

            setTimeout(() => {
                ytdlp.kill();
                reject(new Error("yt-dlp timeout"));
            }, 30000);
        });

        const info = JSON.parse(output);
        console.log("   ✅ Parsed successfully");

        const title = info.title || "Unknown";
        const thumbnail = info.thumbnail || "";
        const formats = info.formats || [];

        // VIDEO FORMATS
        const videoFormats = [];
        const seenVideoQualities = new Set();
        const excludeHeights = [144, 240, 1440];

        formats.forEach(fmt => {
            if (fmt.vcodec && fmt.vcodec !== "none" && fmt.height) {
                if (excludeHeights.includes(fmt.height)) return;

                let quality = fmt.format_note || `${fmt.height}p`;
                if (fmt.height === 2160) {
                    quality = "4K";
                }

                if (!seenVideoQualities.has(quality)) {
                    seenVideoQualities.add(quality);
                    videoFormats.push({
                        itag: fmt.format_id,
                        quality: quality,
                        ext: fmt.ext || "mp4",
                        height: fmt.height,
                        type: "video"
                    });
                }
            }
        });

        const sortedVideos = videoFormats.sort((a, b) => b.height - a.height);

        sortedVideos.unshift({
            itag: "bestvideo+bestaudio/best",
            quality: "Best Quality",
            ext: "mp4",
            height: 9999,
            type: "video"
        });

        // AUDIO FORMATS
        const audioFormats = [];
        const seenAudioQualities = new Set();

        formats.forEach(fmt => {
            if (fmt.acodec && fmt.acodec !== "none" && (!fmt.vcodec || fmt.vcodec === "none")) {
                const bitrate = fmt.abr || fmt.bitrate || 0;
                const quality = fmt.format_note || `${bitrate}kbps`;

                if (!seenAudioQualities.has(quality)) {
                    seenAudioQualities.add(quality);
                    audioFormats.push({
                        itag: fmt.format_id,
                        quality: quality,
                        ext: fmt.ext || "mp3",
                        bitrate: bitrate,
                        type: "audio"
                    });
                }
            }
        });

        const sortedAudio = audioFormats.sort((a, b) => b.bitrate - a.bitrate);

        sortedAudio.unshift({
            itag: "bestaudio/best",
            quality: "Best Audio",
            ext: "mp3",
            bitrate: 320,
            type: "audio"
        });

        console.log("   ✅ Found", sortedVideos.length, "video and", sortedAudio.length, "audio formats");

        res.json({
            success: true,
            title,
            thumbnail,
            formats: sortedVideos,
            audio: sortedAudio[0]
        });

    } catch (err) {
        console.error("\n❌ ERROR:", err.message);
        res.json({
            success: false,
            error: err.message
        });
    }
}

/* ============ DOWNLOAD ENDPOINTS ============ */
/* DOWNLOAD - BOTH ENDPOINTS */
app.get("/api/download", handleDownload);
app.get("/download", handleDownload);

async function handleDownload(req, res) {
    const { url, itag, title, type, format_id } = req.query;
    const realItag = itag || format_id;

    if (!url || !realItag || !title) {
        return res.status(400).json({ error: "Missing parameters" });
    }

    // ✅ CRITICAL: Remove ALL special characters including emojis
    const safe = title
        .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, "") // Remove emojis
        .replace(/[^\w\s\-]/g, "") // Remove special chars
        .replace(/\s+/g, "_") // Replace spaces with underscore
        .substring(0, 50);

    const timestamp = Date.now();
    const outputExt = type === "audio" ? "mp3" : "mp4";
    const outputFile = path.join(downloadsDir, `${safe}_${timestamp}.${outputExt}`);

    try {
        console.log(`\n📝 Download: ${type || 'video'}`);
        console.log("   Title (original):", title);
        console.log("   Title (safe):", safe);
        console.log("   Format:", realItag);

        let args;

        if (type === "audio") {
            const baseFile = outputFile.replace(/\.mp3$/, "");
            args = [
                url,
                "-f", realItag,
                "-x",
                "--audio-format", "mp3",
                "--audio-quality", "192",
                "-o", baseFile,
                "--no-warnings",
                "--user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                "--add-header", "Accept-Language:en-US,en;q=0.9"
            ];
        } else {
            args = [
                url,
                "-f", realItag,
                "-o", outputFile,
                "--merge-output-format", "mp4",
                "--no-warnings",
                "--user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                "--add-header", "Accept-Language:en-US,en;q=0.9"
            ];
        }

        const ytdlp = spawn("yt-dlp", args);

        ytdlp.stderr.on("data", (data) => {
            const text = data.toString();
            console.log("   " + text.trim());
        });

        await new Promise((resolve, reject) => {
            ytdlp.on("close", (code) => {
                if (code !== 0) {
                    console.error(`\n   ❌ Exit code: ${code}`);
                    reject(new Error(`yt-dlp failed`));
                } else {
                    console.log("\n   ✅ yt-dlp finished");
                    resolve();
                }
            });

            ytdlp.on("error", (err) => {
                reject(new Error(`Cannot run yt-dlp: ${err.message}`));
            });

            setTimeout(() => {
                ytdlp.kill();
                reject(new Error("Download timeout"));
            }, 30 * 60 * 1000);
        });

        let finalOutputFile = outputFile;
        
        if (type === "audio" && !fs.existsSync(outputFile)) {
            const baseFile = outputFile.replace(/\.mp3$/, "");
            const possibleFiles = [baseFile + ".mp3", baseFile + ".m4a", baseFile + ".wav"];
            for (const file of possibleFiles) {
                if (fs.existsSync(file)) {
                    finalOutputFile = file;
                    console.log("   Found audio file:", finalOutputFile);
                    break;
                }
            }
        }

        if (!fs.existsSync(finalOutputFile)) {
            console.error("   ❌ Output file NOT found:", finalOutputFile);
            throw new Error("Output file not created");
        }

        const fileSize = fs.statSync(finalOutputFile).size;
        console.log(`   📊 File size: ${(fileSize / 1024 / 1024).toFixed(2)} MB`);

        if (fileSize < 100000) {
            throw new Error(`File too small`);
        }

        // ✅ Create safe filename for header (remove all special chars)
        const headerFileName = type === "audio" 
            ? `${safe}.mp3` 
            : `${safe}.mp4`;

        console.log("   📤 Sending file...");
        console.log("   Header filename:", headerFileName);

        // ✅ Set response headers with SAFE filename
        res.setHeader('Content-Type', type === "audio" ? 'audio/mpeg' : 'video/mp4');
        res.setHeader('Content-Length', fileSize);
        res.setHeader('Content-Disposition', `attachment; filename="${headerFileName}"`);

        const fileStream = fs.createReadStream(finalOutputFile);

        fileStream.on('error', (err) => {
            console.error("   ❌ Stream error:", err);
            if (!res.headersSent) {
                res.status(500).json({ error: "Stream error" });
            }
        });

        fileStream.pipe(res);

        res.on('finish', () => {
            console.log("   ✅ Download complete\n");
            
            setTimeout(() => {
                try {
                    if (fs.existsSync(finalOutputFile)) {
                        fs.unlinkSync(finalOutputFile);
                    }
                } catch (e) {}
            }, 3000);
        });

    } catch (err) {
        console.error(`\n   ❌ Error: ${err.message}`);
        res.status(500).json({ success: false, error: err.message });
    }
}

/* ============ MP3 CONVERTER ROUTES ============ */
app.use("/converter", mp3ConverterRouter);
app.use("/instagram", instagramRouter);
/* ============ START SERVER ============ */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`\n🚀 Backend running on http://localhost:${PORT}`);
    console.log(`✅ Using system yt-dlp\n`);
});
