import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import os from "os";
import { spawn } from "child_process";

const router = express.Router();
const converterDir = path.join(os.tmpdir(), "mp3_converter");  // ✅ FIXED: underscore instead of hyphen

if (!fs.existsSync(converterDir)) {
    fs.mkdirSync(converterDir, { recursive: true });
}

console.log("✅ MP3 Converter directory:", converterDir);

// ✅ Configure multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, converterDir);
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const randomNum = Math.floor(Math.random() * 1000000);
        const safeFilename = `${timestamp}${randomNum}`;
        console.log("   📁 Saved as:", safeFilename);
        cb(null, safeFilename);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 500 }
});

// ✅ Helper: Detect file type by magic bytes
function detectFileType(filePath) {
    try {
        const buffer = Buffer.alloc(12);
        const fd = fs.openSync(filePath, 'r');
        fs.readSync(fd, buffer, 0, 12);
        fs.closeSync(fd);

        if (buffer.slice(4, 8).toString('ascii') === 'ftyp') {
            return 'mp4';
        }
        if (buffer.slice(0, 4).toString('hex') === '1a45dfa3') {
            return 'webm';
        }
        if (buffer.slice(0, 4).toString('ascii') === 'RIFF') {
            return 'avi';
        }

        return 'mp4';
    } catch (e) {
        console.log("   ⚠️  Could not detect file type, assuming mp4");
        return 'mp4';
    }
}

// ✅ MP4 TO MP3 CONVERSION ENDPOINT
router.post("/mp4-to-mp3", upload.single("file"), async (req, res) => {
    if (!req.file) {
        console.error("❌ No file uploaded");
        return res.json({ success: false, error: "No file uploaded" });
    }

    const { bitrate = "192k", volume = "100", normalize = "false" } = req.body;
    const uploadedFile = req.file.path;
    const originalFileName = path.parse(req.file.originalname).name;
    
    // ✅ Sanitize output filename
    const safeFileName = originalFileName
        .split('')
        .filter(char => /^[a-zA-Z0-9_\-\s]$/.test(char))
        .join('')
        .replace(/\s+/g, '_')
        .substring(0, 40)
        .trim() || 'output';
    
    // ✅ Use safe path without special chars or hyphens
    const outputFile = path.join(converterDir, `out_${Date.now()}_${Math.random().toString(36).substring(7)}`);
    const finalOutputFile = `${outputFile}.mp3`;

    try {
        console.log(`\n🎵 MP3 Conversion Started`);
        console.log("   📥 Input file:", uploadedFile);
        console.log("   ✅ File exists:", fs.existsSync(uploadedFile));
        
        if (!fs.existsSync(uploadedFile)) {
            throw new Error("Uploaded file not found");
        }

        const inputFileSize = fs.statSync(uploadedFile).size;
        console.log("   📊 Input size:", (inputFileSize / 1024 / 1024).toFixed(2), "MB");

        const fileType = detectFileType(uploadedFile);
        console.log("   🔍 File type:", fileType);
        console.log("   📝 Original name:", originalFileName);
        console.log("   🔤 Safe name:", safeFileName);
        console.log("   📤 Output path:", finalOutputFile);
        console.log("   🎚️  Bitrate:", bitrate);

        // ✅ Build FFmpeg command - using absolute paths with quotes
        const ffmpegArgs = [
            "-i", uploadedFile,
            "-vn",
            "-acodec", "libmp3lame",
            "-q:a", "0",
            "-b:a", bitrate,
            "-hide_banner",
            "-loglevel", "error",
            "-y",
            finalOutputFile
        ];

        console.log("   🔧 Command: ffmpeg " + ffmpegArgs.map(arg => `"${arg}"`).join(" "));
        console.log("   ⏳ Converting...\n");

        const ffmpeg = spawn("ffmpeg", ffmpegArgs);

        let errorOutput = "";

        ffmpeg.stderr.on("data", (data) => {
            errorOutput += data.toString();
            if (data.toString().includes("time=")) {
                const match = data.toString().match(/time=[\d:.]+/);
                if (match) {
                    process.stdout.write("\r   ⏱️  " + match[0]);
                }
            }
        });

        const result = await new Promise((resolve) => {
            const timeout = setTimeout(() => {
                ffmpeg.kill("SIGKILL");
                resolve({ code: -1, error: "Timeout" });
            }, 15 * 60 * 1000);

            ffmpeg.on("exit", (code) => {
                clearTimeout(timeout);
                resolve({ code, error: errorOutput });
            });

            ffmpeg.on("error", (err) => {
                clearTimeout(timeout);
                resolve({ code: -1, error: err.message });
            });
        });

        console.log(`\n   Exit code: ${result.code}`);

        if (result.code !== 0 && result.code !== null) {
            console.error("   ❌ FFmpeg error:");
            console.error(result.error.slice(-500));
            throw new Error(result.error.slice(-200));
        }

        // ✅ Wait for file to be written
        await new Promise(resolve => setTimeout(resolve, 500));

        if (!fs.existsSync(finalOutputFile)) {
            console.error("   ❌ Output file not created");
            throw new Error("Output MP3 file not created");
        }

        const outputSize = fs.statSync(finalOutputFile).size;
        console.log(`   📊 Output size: ${(outputSize / 1024 / 1024).toFixed(2)} MB`);

        if (outputSize < 50000) {
            throw new Error(`File too small: ${outputSize} bytes`);
        }

        const downloadFilename = path.basename(finalOutputFile);
        const encodedFilename = encodeURIComponent(downloadFilename);

        console.log("   ✅ Conversion successful!");

        res.json({
            success: true,
            download_url: `/converter/download/${encodedFilename}`,
            fileName: `${safeFileName}.mp3`,
            fileSize: outputSize
        });

        setTimeout(() => {
            try {
                if (fs.existsSync(uploadedFile)) {
                    fs.unlinkSync(uploadedFile);
                    console.log("   🗑️  Cleaned up\n");
                }
            } catch (e) {}
        }, 500);

    } catch (err) {
        console.error(`\n❌ Error: ${err.message}`);
        
        for (const file of [uploadedFile, finalOutputFile]) {
            try {
                if (fs.existsSync(file)) fs.unlinkSync(file);
            } catch (e) {}
        }

        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

// ✅ DOWNLOAD ENDPOINT
router.get("/download/:filename", (req, res) => {
    let filename = req.params.filename;
    
    console.log(`\n📥 Download request`);
    
    try {
        filename = decodeURIComponent(filename);
    } catch (e) {
        return res.status(400).json({ success: false, error: "Invalid filename" });
    }

    const filePath = path.join(converterDir, filename);

    if (!path.normalize(filePath).startsWith(path.normalize(path.resolve(converterDir)))) {
        return res.status(400).json({ success: false, error: "Invalid path" });
    }

    if (!fs.existsSync(filePath)) {
        console.error("   ❌ File not found");
        return res.status(404).json({ success: false, error: "File not found" });
    }

    const fileSize = fs.statSync(filePath).size;
    console.log(`   📊 Size: ${(fileSize / 1024 / 1024).toFixed(2)} MB`);

    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', fileSize);

    const stream = fs.createReadStream(filePath);
    
    stream.on('error', (err) => {
        console.error("   ❌ Stream error");
        if (!res.headersSent) {
            res.status(500).json({ success: false, error: "Stream error" });
        }
    });

    stream.pipe(res);

    res.on('finish', () => {
        console.log("   ✅ Download complete");
        setTimeout(() => {
            try {
                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            } catch (e) {}
        }, 2000);
    });
});

router.get("/health", (req, res) => {
    res.json({ success: true, message: "MP3 converter ready" });
});

export default router;