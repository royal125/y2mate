import React, { useState } from "react";
import {
     Dialog,
    DialogContent,
    LinearProgress,
    Box,
    Button,
    Container,
    Paper,
    Tabs,
    Tab,
    TextField,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    Alert,
} from "@mui/material";
import axios from "axios";
import Lottie from "lottie-react";
import loaderAnim from "./assets/loader.json";
import spinnerAnim from "./assets/spinner.json";
import CategoryButtons from "../components/CategoryButtons";
import FeaturesSection from "../components/FeaturesSection";
import CarouselSection from "../components/CarouselSection";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

const YouTubeDownloader = () => {
    const [url, setUrl] = useState("");
    const [videoData, setVideoData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [tab, setTab] = useState(0);
    const [downloadingMap, setDownloadingMap] = useState({});
    const [error, setError] = useState("");
    
    // ✅ NEW: Progress bar states
    const [downloadProgress, setDownloadProgress] = useState({});
    const [showProgressDialog, setShowProgressDialog] = useState(false);
    const [currentDownloadTitle, setCurrentDownloadTitle] = useState("");

    // === Fetch video info ===
    const handleFetch = async () => {
        if (!url.trim()) {
            setError("Please enter a YouTube URL");
            return;
        }

        setLoading(true);
        setVideoData(null);
        setError("");

        try {
            const res = await axios.post(`${API_BASE}/api/info`, { url });
            
            if (res.data.success) {
                setVideoData(res.data);
            } else {
                setError(res.data.error || "Failed to fetch video info");
            }
        } catch (err) {
            console.error("❌ Error fetching info:", err);
            setError("Failed to fetch video info. Check the URL.");
        } finally {
            setLoading(false);
        }
    };
// === Handle Video Download with Progress ===
const handleVideoDownload = async (format) => {
  const fileName = `${videoData.title}.mp4`;
  setCurrentDownloadTitle(fileName);
  setDownloadProgress(0);
  setShowProgressDialog(true);
  setDownloadingMap((prev) => ({ ...prev, [format.itag]: true }));

  try {
    // ✅ FIX: Sanitize title BEFORE URL construction
    const safeTitle = videoData.title
      .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, "") // Remove emojis
      .replace(/[^\w\s\-]/g, "") // Remove special chars
      .replace(/\s+/g, "_")
      .substring(0, 50);

    const downloadUrl = `${API_BASE}/api/download?url=${encodeURIComponent(url)}&itag=${format.itag}&title=${encodeURIComponent(safeTitle)}&type=video`;

    console.log("📥 Starting video download from:", downloadUrl);

    const response = await fetch(downloadUrl);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const contentLength = response.headers.get("content-length");
    if (!contentLength) {
      throw new Error("No content-length header");
    }

    const total = parseInt(contentLength, 10);
    console.log("📊 Total size:", (total / 1024 / 1024).toFixed(2), "MB");

    const reader = response.body.getReader();
    const chunks = [];
    let receivedLength = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      chunks.push(value);
      receivedLength += value.length;

      const progress = Math.round((receivedLength / total) * 100);
      setDownloadProgress(progress);
      console.log(`📥 Video: ${progress}%`);
    }

    // Create blob and download
    const blob = new Blob(chunks, { type: "video/mp4" });
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);

    console.log("✅ Video download complete!");

    setDownloadProgress(100);
    setTimeout(() => {
      setShowProgressDialog(false);
      setDownloadProgress(0);
      setDownloadingMap((prev) => ({ ...prev, [format.itag]: false }));
    }, 1500);
  } catch (err) {
    console.error("❌ Video download error:", err);
    setError(`Download failed: ${err.message}`);
    setTimeout(() => {
      setShowProgressDialog(false);
      setDownloadProgress(0);
      setDownloadingMap((prev) => ({ ...prev, [format.itag]: false }));
    }, 1500);
  }
};

// === Handle Audio Download with Progress ===
const handleAudioDownload = async (format) => {
  const fileName = `${videoData.title}.mp3`;
  setCurrentDownloadTitle(fileName);
  setDownloadProgress(0);
  setShowProgressDialog(true);
  setDownloadingMap((prev) => ({ ...prev, [format.itag]: true }));

  try {
    // ✅ FIX: Sanitize title BEFORE URL construction
    const safeTitle = videoData.title
      .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, "") // Remove emojis
      .replace(/[^\w\s\-]/g, "") // Remove special chars
      .replace(/\s+/g, "_")
      .substring(0, 50);

    const downloadUrl = `${API_BASE}/api/download?url=${encodeURIComponent(url)}&itag=${format.itag}&title=${encodeURIComponent(safeTitle)}&type=audio`;

    console.log("📥 Starting audio download from:", downloadUrl);

    const response = await fetch(downloadUrl);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const contentLength = response.headers.get("content-length");
    if (!contentLength) {
      throw new Error("No content-length header");
    }

    const total = parseInt(contentLength, 10);
    console.log("📊 Total size:", (total / 1024 / 1024).toFixed(2), "MB");

    const reader = response.body.getReader();
    const chunks = [];
    let receivedLength = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      chunks.push(value);
      receivedLength += value.length;

      const progress = Math.round((receivedLength / total) * 100);
      setDownloadProgress(progress);
      console.log(`📥 Audio: ${progress}%`);
    }

    // Create blob and download
    const blob = new Blob(chunks, { type: "audio/mpeg" });
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);

    console.log("✅ Audio download complete!");

    setDownloadProgress(100);
    setTimeout(() => {
      setShowProgressDialog(false);
      setDownloadProgress(0);
      setDownloadingMap((prev) => ({ ...prev, [format.itag]: false }));
    }, 1500);
  } catch (err) {
    console.error("❌ Audio download error:", err);
    setError(`Download failed: ${err.message}`);
    setTimeout(() => {
      setShowProgressDialog(false);
      setDownloadProgress(0);
      setDownloadingMap((prev) => ({ ...prev, [format.itag]: false }));
    }, 1500);
  }
};


    // ✅ Progress bar value
    const progress = downloadProgress[Object.keys(downloadProgress)[0]] || 0;
    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            {/* Title */}
            <Typography variant="h3" sx={{ mb: 3, textAlign: "center", fontWeight: "bold" }}>
                🎬 YouTube Video Downloader
            </Typography>

            {/* Error Alert */}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {/* Input & Fetch */}
            <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                <TextField
                    fullWidth
                    placeholder="Paste YouTube URL here..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleFetch()}
                    sx={{ 
                        backgroundColor: "white", 
                        borderRadius: 1,
                        "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                                borderColor: "#ddd",
                            },
                            "&:hover fieldset": {
                                borderColor: "#ff0000",
                            },
                        }
                    }}
                />
                <Button
                    variant="contained"
                    onClick={handleFetch}
                    disabled={loading}
                    sx={{ 
                        background: "linear-gradient(135deg, #ff0000, #ff6b6b)",
                        px: 3,
                        textTransform: "none",
                        fontSize: "1rem"
                    }}
                >
                    {loading ? <CircularProgress size={24} /> : "Get Formats"}
                </Button>
            </Box>

            {/* Loader */}
            {loading && (
                <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                    <Lottie animationData={loaderAnim} loop style={{ width: 100, height: 100 }} />
                </Box>
            )}

            {/* Preview + Formats */}
            {videoData && (
                <>
                    {/* Video Info */}
                    <Paper sx={{ p: 2, mb: 3, background: "rgba(0,0,0,0.05)" }}>
                        <Box sx={{ display: "flex", gap: 2 }}>
                            <img 
                                src={videoData.thumbnail} 
                                alt="thumbnail" 
                                style={{ width: 120, height: 80, borderRadius: 8 }}
                            />
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                    {videoData.title}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {videoData.formats?.length || 0} video formats available
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>

                    {/* Tabs */}
                    <Tabs 
                        value={tab} 
                        onChange={(_, newVal) => setTab(newVal)}
                        centered
                        sx={{ mb: 3 }}
                    >
                        <Tab label={`Video (${videoData.formats?.length || 0})`} />
                        <Tab label={`Audio (${videoData.audio ? 1 : 0})`} />
                    </Tabs>

                    {/* Video Table */}
                    {tab === 0 && (
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                                    <TableRow>
                                        <TableCell><strong>Quality</strong></TableCell>
                                        <TableCell><strong>Format</strong></TableCell>
                                        <TableCell align="center"><strong>Action</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {videoData.formats?.map((format) => (
                                        <TableRow key={format.itag} hover>
                                            <TableCell>{format.quality}</TableCell>
                                            <TableCell>{format.ext.toUpperCase()}</TableCell>
                                            <TableCell align="center">
                                                {downloadingMap[format.itag] ? (
                                                    <Lottie animationData={spinnerAnim} loop style={{ width: 40, height: 40 }} />
                                                ) : (
                                                    <Button
                                                        size="small"
                                                        variant="contained"
                                                        sx={{ 
                                                            background: "linear-gradient(135deg, #ff0000, #ff6b6b)",
                                                            textTransform: "none"
                                                        }}
                                                        onClick={() => handleVideoDownload(format)}
                                                    >
                                                        ⬇️ Download
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}

                    {/* Audio Table */}
                    {tab === 1 && videoData.audio && (
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                                    <TableRow>
                                        <TableCell><strong>Quality</strong></TableCell>
                                        <TableCell><strong>Format</strong></TableCell>
                                        <TableCell align="center"><strong>Action</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow hover>
                                        <TableCell>{videoData.audio.quality}</TableCell>
                                        <TableCell>{videoData.audio.ext.toUpperCase()}</TableCell>
                                        <TableCell align="center">
                                            {downloadingMap[videoData.audio.itag] ? (
                                                <Lottie animationData={spinnerAnim} loop style={{ width: 40, height: 40 }} />
                                            ) : (
                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    sx={{ 
                                                        background: "linear-gradient(135deg, #ff0000, #ff6b6b)",
                                                        textTransform: "none"
                                                    }}
                                                    onClick={() => handleAudioDownload(videoData.audio)}
                                                >
                                                    🎵 Download MP3
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </>
            )}
             {/* Download Progress Dialog */}
        <Dialog open={showProgressDialog} disableEscapeKeyDown>
            <DialogContent sx={{ minWidth: 400, py: 4 }}>
                <Box sx={{ textAlign: "center" }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        📥 Downloading
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 3, color: "#666", wordBreak: "break-word" }}>
                        {currentDownloadTitle}
                    </Typography>
                    
                    <LinearProgress 
                        variant="determinate" 
                        value={progress} 
                        sx={{ mb: 2, height: 8, borderRadius: 4 }}
                    />
                    
                    <Typography variant="h5" sx={{ fontWeight: "bold", color: "#ff0000" }}>
                        {progress}%
                    </Typography>

                    <Typography variant="caption" sx={{ color: "#999", mt: 1 }}>
                        {progress === 100 ? "Finalizing..." : "Please wait..."}
                    </Typography>
                </Box>
            </DialogContent>
        </Dialog>
        {/* 👆 END OF DIALOG 👆 */}
             {/* Homepage Sections */}
                  <CategoryButtons />
                  <FeaturesSection />
                  <CarouselSection />
        </Container>
    );
};

export default YouTubeDownloader;
