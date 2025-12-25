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
  CircularProgress
} from "@mui/material";

import axios from "axios";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import spinnerAnim from "./assets/spinner.json";
import loaderAnim from "./assets/loader.json";

// ===== HOMEPAGE SECTIONS =====
import CategoryButtons from "../components/CategoryButtons";
import FeaturesSection from "../components/FeaturesSection";
import CarouselSection from "../components/CarouselSection";

// ===== API BASE URL =====
const API_BASE = process.env.REACT_APP_API_URL || "https://api.savefrom.in";

export default function YouTubeDownloader() {
  // ===== STATE VARIABLES =====
  const [url, setUrl] = useState("");
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState(0);
  const [error, setError] = useState("");
  const [downloadingMap, setDownloadingMap] = useState({});

  // ===== DOWNLOAD BAR STATE =====
  const [showBar, setShowBar] = useState(false);
  const [label, setLabel] = useState("");
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState("idle");
  // Phases: idle | preparing | downloading | done

  // ===== FAKE PREPARING PROGRESS (animates from 0-92%) =====
  useEffect(() => {
    if (phase !== "preparing") return;

    let value = 0;
    const timer = setInterval(() => {
      value += Math.random() * 2.5;
      if (value >= 92) value = 92;
      setProgress(Math.floor(value));
    }, 300);

    return () => clearInterval(timer);
  }, [phase]);

  // ===== FETCH VIDEO INFO FROM BACKEND =====
  const handleFetch = async () => {
    // Validate URL input
    if (!url.trim()) {
      setError("Please enter a YouTube URL");
      return;
    }

    // Reset state and prepare loading
    setLoading(true);
    setVideoData(null);
    setError("");

    try {
      // Call backend /api/info endpoint with POST
      const res = await axios.post(`${API_BASE}/api/info`, { url });

      // Check if request was successful
      if (res.data.success) {
        setVideoData(res.data);
        console.log("✅ Video info fetched:", res.data);
      } else {
        setError(res.data.error || "Failed to fetch video info");
        console.error("❌ Error:", res.data.error);
      }
    } catch (err) {
      console.error("❌ Fetch error:", err.message);
      setError(`Failed to fetch video info: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ===== COMMON DOWNLOAD HANDLER FOR BOTH VIDEO & AUDIO =====
  const startDownload = async (params, filename, itag) => {
    try {
      // Show download bar
      setShowBar(true);
      setPhase("preparing");
      setLabel("Preparing download…");
      setProgress(0);

      // Make GET request to /api/download with query params
      // IMPORTANT: responseType "blob" tells axios to return binary data
      const response = await axios.get(
        `${API_BASE}/api/download?${params.toString()}`,
        {
          // Configuration object MUST be inside curly braces
          responseType: "blob",
          onDownloadProgress: (e) => {
            // Only update if we know total file size
            if (!e.total) return;

            // Switch to downloading phase
            setPhase("downloading");

            // Calculate percentage: (bytes downloaded / total bytes) * 100
            const percent = Math.round((e.loaded * 100) / e.total);
            setProgress(percent);
            setLabel(`Downloading… ${percent}%`);
          }
        }
      );

      // File download successful - create blob and trigger download
      const blob = new Blob([response.data]);
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();

      // Show completion
      setPhase("done");
      setProgress(100);
      setLabel("Download complete ✅");

      // Auto-hide progress bar after 1.8 seconds
      setTimeout(() => {
        setShowBar(false);
        setPhase("idle");
        setProgress(0);
        setDownloadingMap((prev) => ({ ...prev, [itag]: false }));
      }, 1800);

      console.log("✅ Download complete:", filename);
    } catch (err) {
      console.error("❌ Download error:", err.message);
      
      // Hide progress bar on error
      setShowBar(false);
      setPhase("idle");
      setProgress(0);
      setDownloadingMap((prev) => ({ ...prev, [itag]: false }));
      
      // Show error message
      setError(`Download failed: ${err.message}`);
    }
  };

  // ===== HANDLE VIDEO DOWNLOAD =====
  const handleVideoDownload = (format) => {
    // Sanitize video title (remove special characters, emojis)
    const safeTitle = videoData.title
      .replace(/[^\w\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "_") // Replace spaces with underscores
      .substring(0, 50); // Limit to 50 characters

    // Build query parameters for the download endpoint
    const params = new URLSearchParams({
      url: url, // YouTube URL
      title: safeTitle, // Sanitized title
      itag: format.itag, // Format ID
      type: "video" // Type of download
    });

    // Start download with .mp4 extension
    startDownload(params, `${safeTitle}.mp4`, format.itag);
  };

  // ===== HANDLE AUDIO (MP3) DOWNLOAD =====
  const handleAudioDownload = () => {
    // Sanitize audio title
    const safeTitle = videoData.title
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "_")
      .substring(0, 50);

    // Build query parameters
    const params = new URLSearchParams({
      url: url,
      title: safeTitle,
      itag: videoData.audio.itag, // Use audio format ID
      type: "audio" // Type of download
    });

    // Start download with .mp3 extension
    startDownload(params, `${safeTitle}.mp3`, videoData.audio.itag);
  };

  // ===== RENDER UI =====
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* HEADER */}
      <Typography 
        variant="h3" 
        align="center" 
        sx={{ mb: 3, fontWeight: "bold", color: "#ff0000" }}
      >
        🎬 YouTube Video Downloader
      </Typography>

      {/* ERROR MESSAGE */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* SEARCH BOX */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Paste YouTube URL here..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={loading}
          variant="outlined"
        />
        <Button
          fullWidth
          variant="contained"
          color="error"
          sx={{ mt: 2, py: 1.5, fontSize: "16px" }}
          onClick={handleFetch}
          disabled={loading}
        >
          {loading ? "⚙️ Fetching..." : "🔍 Fetch Formats"}
        </Button>
      </Paper>

      {/* LOADING SPINNER */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <CircularProgress />
        </Box>
      )}

      {/* VIDEO INFO & DOWNLOAD OPTIONS */}
      {videoData && (
        <>
          {/* VIDEO TITLE & INFO */}
          <Paper sx={{ p: 2, mb: 3, backgroundColor: "#f5f5f5" }}>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              {videoData.title}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              📊 {videoData.formats?.length || 0} video formats available
            </Typography>
            {videoData.audio && (
              <Typography variant="body2" color="textSecondary">
                🎵 Audio available: {videoData.audio.quality}
              </Typography>
            )}
          </Paper>

          {/* TABS FOR VIDEO / AUDIO */}
          <Paper>
            <Tabs 
              value={tab} 
              onChange={(_, newValue) => setTab(newValue)} 
              centered
            >
              <Tab label="📹 Video Formats" />
              <Tab label="🎵 Audio (MP3)" />
            </Tabs>

            {/* TAB 0: VIDEO FORMATS */}
            {tab === 0 && (
              <TableContainer>
                <Table>
                  <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>Quality</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Size</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Format</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }} align="center">
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {videoData.formats && videoData.formats.map((format) => (
                      <TableRow key={format.itag} hover>
                        <TableCell>{format.quality}</TableCell>
                        <TableCell>{format.size || "Unknown"}</TableCell>
                        <TableCell>{format.ext.toUpperCase()}</TableCell>
                        <TableCell align="center">
                          {downloadingMap[format.itag] ? (
                            <Typography variant="body2" sx={{ color: "#ff0000" }}>
                              Downloading…
                            </Typography>
                          ) : (
                            <Button
                              size="small"
                              variant="contained"
                              color="error"
                              onClick={() => {
                                // Mark this format as downloading
                                setDownloadingMap((prev) => ({
                                  ...prev,
                                  [format.itag]: true
                                }));
                                // Start download
                                handleVideoDownload(format);
                              }}
                            >
                              Download
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {/* TAB 1: AUDIO DOWNLOAD */}
            {tab === 1 && (
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  🎵 Download as MP3
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  Quality: {videoData.audio?.quality || "Best available"}
                </Typography>
                {downloadingMap[videoData.audio?.itag] ? (
                  <Typography sx={{ color: "#ff0000" }}>
                    Downloading MP3…
                  </Typography>
                ) : (
                  <Button
                    fullWidth
                    variant="contained"
                    color="error"
                    size="large"
                    onClick={() => {
                      // Mark audio as downloading
                      setDownloadingMap((prev) => ({
                        ...prev,
                        [videoData.audio.itag]: true
                      }));
                      // Start download
                      handleAudioDownload();
                    }}
                  >
                    📥 Download Best Audio as MP3
                  </Button>
                )}
              </Box>
            )}
          </Paper>
        </>
      )}

      {/* DOWNLOAD PROGRESS BAR */}
      {showBar && (
        <Paper sx={{ p: 2, mt: 3, backgroundColor: "#f5f5f5" }}>
          <Box sx={{ mb: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
              {label}
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ mb: 1, height: 8, borderRadius: 4 }}
          />
          <Typography variant="caption" sx={{ color: "textSecondary" }}>
            {progress}%
          </Typography>
        </Paper>
      )}

      {/* HOMEPAGE SECTIONS (SHOWN WHEN NO VIDEO SELECTED) */}
      {!videoData && !loading && (
        <>
          <Box sx={{ mt: 6 }}>
            <CategoryButtons />
            <FeaturesSection />
            <CarouselSection />
          </Box>
        </>
      )}
    </Container>
  );
}