<<<<<<< HEAD
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
=======
import React, { useState, useEffect } from "react";
import {
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
  LinearProgress,
  Alert,
>>>>>>> 0035b5a58621603643ba2ef4cd93b52418e875c0
} from "@mui/material";
import axios from "axios";
import Lottie from "lottie-react";
import loaderAnim from "./assets/loader.json";
import spinnerAnim from "./assets/spinner.json";
<<<<<<< HEAD
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
=======

// ✅ PRODUCTION: Use HTTPS backend with your domain
const API_BASE = process.env.REACT_APP_API_URL;


const YouTubeDownloader = () => {
  const [url, setUrl] = useState("");
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState(0);
  const [downloadingMap, setDownloadingMap] = useState({});
  const [error, setError] = useState("");

  // ---- helpers -------------------------------------------------------------
  const normalizeFormats = (raw) => {
    const list = Array.isArray(raw) ? raw : [];
    const withTypes = list.map((f) => {
      const hasVideo = f.type === "video" || !!f.height || !!f.vcodec;
      const hasAudio = f.type === "audio" || !!f.abr || !!f.acodec;
      return {
        ...f,
        type: hasVideo && !hasAudio ? "video" : hasAudio && !hasVideo ? "audio" : (f.type || "video")
      };
    });

    const seen = new Set();
    const keyOf = (f) =>
      f.format_id ??
      `${f.type}|${f.ext}|${f.qualityLabel || ""}|${f.abr || ""}|${f.height || ""}`;

    return withTypes.filter((f) => {
      const k = keyOf(f);
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  };

  const videoFormats = normalizeFormats(videoData?.formats).filter((f) => f.type === "video");
  const audioFormats = normalizeFormats(videoData?.formats).filter((f) => f.type === "audio");

  // ---- actions -------------------------------------------------------------
  const handleFetch = async () => {
    if (!url.trim()) return;

    setLoading(true);
    setVideoData(null);
    setError("");

    try {
      // ✅ PRODUCTION: Use POST with proper error handling
      const res = await axios.post(`${API_BASE}/api/info`, { url }, {
        timeout: 30000, // 30 second timeout
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (res.data && res.data.formats) {
        setVideoData(res.data);
      } else if (res.data.error) {
        throw new Error(res.data.error);
      } else {
        throw new Error("No video data received from server");
      }
    } catch (err) {
      console.error("❌ Failed to fetch video info:", err);

      let errorMessage = "Failed to fetch video info. ";
      if (err.code === 'ECONNABORTED') {
        errorMessage += "Request timeout. Please try again.";
      } else if (err.response?.data?.error) {
        errorMessage += err.response.data.error;
      } else if (err.message.includes("Network Error")) {
        errorMessage += "Cannot connect to server. Check your internet connection.";
      } else {
        errorMessage += "Please check the URL and try again.";
      }

      setError(errorMessage);
      setVideoData({});
    } finally {
      setLoading(false);
    }
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") handleFetch();
  };

  // ---------------------------- handleDownload ------------------------------//
  const handleDownload = async (format) => {
    const id = format.format_id || `${format.type}-${format.ext}-${format.qualityLabel || ""}`;

    setDownloadingMap((prev) => ({ ...prev, [id]: true }));
    setError("");

    try {
      // Build download URL
      const downloadUrl = `${API_BASE}/api/download?url=${encodeURIComponent(url)}&format_id=${
        format.format_id ?? ""
      }&title=${encodeURIComponent(videoData?.title || "video")}&type=${encodeURIComponent(format.type)}`;

      console.log("🎬 Download URL:", downloadUrl);

      // Request the file from backend with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 minute timeout

      const response = await fetch(downloadUrl, {
        signal: controller.signal,
        credentials: 'include' // Important for CORS with credentials
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }

      // Turn into blob (file)
      const blob = await response.blob();

      // Check if blob is valid
      if (blob.size === 0) {
        throw new Error("Received empty file from server");
      }

      const ext = format.type === "audio" ? "mp3" : "mp4";
      const filename = `${videoData?.title || "video"}.${ext}`;

      // Create invisible link to trigger download
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.style.display = "none";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Cleanup
      setTimeout(() => URL.revokeObjectURL(link.href), 100);

    } catch (err) {
      console.error("❌ Download failed:", err);
      if (err.name === 'AbortError') {
        setError("Download timeout. The video might be too large.");
      } else {
        setError(`Download failed: ${err.message}`);
      }
    } finally {
      setDownloadingMap((prev) => ({ ...prev, [id]: false }));
    }
  };

  // Simple DownloadCell component
  const DownloadCell = ({ format, downloadingMap, handleDownload }) => {
    const id = format.format_id || `${format.type}-${format.ext}-${format.qualityLabel || ""}`;
    const isDownloading = downloadingMap[id];

    return (
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        {isDownloading ? (
          <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: 40, width: 120 }}>
            <Lottie animationData={spinnerAnim} loop autoplay style={{ height: 40, width: 40 }} />
          </Box>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleDownload(format)}
            sx={{ minWidth: 120 }}
            disabled={!videoData}
          >
            Download
          </Button>
        )}
      </Box>
    );
  };

  // ---- render --------------------------------------------------------------
  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom textAlign="center">
        🎬 YouTube Video Downloader
      </Typography>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box display="flex" gap={2} mb={1} justifyContent="center" alignItems="center" flexWrap="wrap">
        <TextField
          label="Paste YouTube URL"
          variant="outlined"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={handleEnter}
          sx={{ minWidth: "300px", flexGrow: 1, backgroundColor: "white", borderRadius: 1 }}
          placeholder="Put YouTube link here"
        />
        <Button className="bt-fetch" variant="contained" color="secondary" onClick={handleFetch} disabled={loading || !url.trim()}>
          {loading ? "Fetching..." : "Fetch"}
        </Button>
      </Box>

      {loading && (
        <Box display="flex" justifyContent="center" mt={2} mb={3}>
          <Lottie animationData={loaderAnim} loop autoplay style={{ height: 120, width: 120 }} />
        </Box>
      )}

      {videoData && videoData.title && (
        <>
          {(videoData.thumbnail || videoData.title) && (
            <Box textAlign="center" mb={3}>
              {videoData.thumbnail && (
                <img
                  src={videoData.thumbnail}
                  alt="Thumbnail"
                  style={{ maxWidth: "320px", borderRadius: "12px", marginBottom: "10px" }}
                />
              )}
              {videoData.title && <Typography variant="h6">{videoData.title}</Typography>}
            </Box>
          )}

          <Tabs value={tab} onChange={(_, v) => setTab(v)} centered sx={{ mb: 2 }}>
            <Tab label={`Video (${videoFormats.length})`} />
            <Tab label={`Audio (${audioFormats.length})`} />
          </Tabs>

          {tab === 0 && (
            <>
              {videoFormats.length === 0 ? (
                <Paper sx={{ p: 2, textAlign: "center" }}>
                  <Typography>No video formats found.</Typography>
                </Paper>
              ) : (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Quality</strong></TableCell>
                        <TableCell><strong>Format</strong></TableCell>
                        <TableCell><strong>Size (MB)</strong></TableCell>
                        <TableCell><strong>Action</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {videoFormats.map((format, index) => (
                        <TableRow key={index}>
                          <TableCell>{format.qualityLabel || `${format.height || ""}p`}</TableCell>
                          <TableCell>{format.ext || "—"}</TableCell>
                          <TableCell>{format.size ?? "—"}</TableCell>
                          <TableCell>
                            <DownloadCell
                              format={format}
                              downloadingMap={downloadingMap}
                              handleDownload={handleDownload}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </>
          )}

          {tab === 1 && (
            <>
              {audioFormats.length === 0 ? (
                <Paper sx={{ p: 2, textAlign: "center" }}>
                  <Typography>No audio formats found.</Typography>
                </Paper>
              ) : (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Bitrate</strong></TableCell>
                        <TableCell><strong>Format</strong></TableCell>
                        <TableCell><strong>Size (MB)</strong></TableCell>
                        <TableCell><strong>Action</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {audioFormats.map((format, index) => (
                        <TableRow key={index}>
                          <TableCell>{format.qualityLabel || `${format.abr || ""}kbps`}</TableCell>
                          <TableCell>{format.ext || "—"}</TableCell>
                          <TableCell>{format.size ?? "—"}</TableCell>
                          <TableCell>
                            <DownloadCell
                              format={format}
                              downloadingMap={downloadingMap}
                              handleDownload={handleDownload}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </>
          )}
        </>
      )}
    </Container>
  );
};

export default YouTubeDownloader;
>>>>>>> 0035b5a58621603643ba2ef4cd93b52418e875c0
