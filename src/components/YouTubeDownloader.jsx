import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  Tabs,
  Tab,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  IconButton,
} from "@mui/material";
import { PlayArrow, YouTube } from "@mui/icons-material";
import axios from "axios";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import loaderAnim from "./assets/loader.json";

/* ===== HOMEPAGE SECTIONS ===== */
import CategoryButtons from "../components/CategoryButtons";
import FeaturesSection from "../components/FeaturesSection";
import CarouselSection from "../components/CarouselSection";
import FAQSection from "../components/FAQSection";

const API_BASE = process.env.REACT_APP_API_BASE;
console.log('API_BASE:', API_BASE);


const generateId = () =>
  window.crypto?.randomUUID?.() ||
  Math.random().toString(36).slice(2);

export default function YouTubeDownloader() {
  const [url, setUrl] = useState("");
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState(0);
  const [error, setError] = useState("");
  

  /* ===== DOWNLOAD BAR ===== */
  const [showBar, setShowBar] = useState(false);
  const [label, setLabel] = useState("");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (progress === 100) {
      setLabel("Download complete");
      setTimeout(() => setShowBar(false), 1500);
    }
  }, [progress]);
    

  /* ===================== FETCH INFO ===================== */
  const handleFetchInfo = async () => {
    setLoading(true);
    try {
      setError("");
      setVideoData(null);

      if (!url || !url.trim()) {
        setError("Please enter a YouTube URL");
        return;
      }

      const cleanUrl = url.trim();

      const res = await axios.post(
        `${API_BASE}/api/info`,
        { url: cleanUrl },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 60000,
        }
      );

      setVideoData(res.data);

    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error ||
        "Failed to fetch video info"
      );
    } finally {
      setLoading(false);
    }
  };
  /* ===================== DOWNLOAD ===================== */
 const startDownload = (format) => {
  if (showBar) return;

  const downloadId = generateId();

  setShowBar(true);
  setLabel("Starting download…");
  setProgress(0);

  const evtSource = new EventSource(
    `${API_BASE}/api/progress/${downloadId}`
  );

  evtSource.onmessage = (e) => {
    const value = Math.floor(Number(e.data));
    setProgress(value);
    setLabel("Downloading…");

    if (value >= 100) {
      evtSource.close();
    }
  };

  const safeTitle = videoData.title
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "_")
    .substring(0, 50);

  window.location.href =
    `${API_BASE}/api/download` +
    `?url=${encodeURIComponent(url)}` +
    `&itag=${format.itag}` +
    `&title=${encodeURIComponent(safeTitle)}` +
    `&id=${downloadId}`;
};

    const downloadAudio = () => {
  if (showBar || !videoData) return;

  const downloadId = generateId();

  setShowBar(true);
  setLabel("Starting audio download…");
  setProgress(0);

  const evtSource = new EventSource(
    `${API_BASE}/api/progress/${downloadId}`
  );

  evtSource.onmessage = (e) => {
    const value = Math.floor(Number(e.data));
    setProgress(value);
    setLabel("Downloading audio…");

    if (value >= 100) {
      evtSource.close();
    }
  };

  const safeTitle = videoData.title
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "_")
    .substring(0, 50);

  window.location.href =
    `${API_BASE}/api/download` +
    `?url=${encodeURIComponent(url)}` +
    `&itag=bestaudio` +
    `&title=${encodeURIComponent(safeTitle)}` +
    `&id=${downloadId}`;
};


  return (
    <Container maxWidth="lg" className="page-wrap">
      <Box className="yt-hero">
        <Typography variant="h3" className="yt-title">
          Y2Mate Studio
        </Typography>
        <Typography className="yt-subtitle">
          Download videos or audio in seconds. Clean, fast, and tuned for every
          device with smart quality detection.
        </Typography>
        <Box className="yt-input-row">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste YouTube URL"
            style={{
              flex: 1,
              padding: "12px 16px",
              borderRadius: "8px",
              border: "none",
              fontSize: "1rem",
              outline: "none"
            }}
          />
          <Box className="yt-orb">
            <YouTube />
          </Box>
          <Button
            variant="contained"
            type="button"
            onClick={handleFetchInfo}
            disabled={loading}
            className="yt-fetch"
          >
            {loading ? "Loading…" : "Fetch video"}
          </Button>
        </Box>
        <Box className="yt-chips">
          <span className="yt-chip">4K ready</span>
          <span className="yt-chip">MP4 + MP3</span>
          <span className="yt-chip">No signup</span>
          <span className="yt-chip">Instant preview</span>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading && (
        <Box display="flex" justifyContent="center" mb={3}>
          <Lottie
            animationData={loaderAnim}
            style={{ width: 180, height: 180 }}
            loop
          />
        </Box>
      )}

      {videoData && (
        <>
          <Paper className="video-card" sx={{ mb: 3 }}>
            <Box position="relative">
              <img
                src={videoData.thumbnail}
                alt="thumb"
                style={{ width: 140, borderRadius: 14 }}
              />
              <IconButton
                onClick={() => {
                  if (url.includes('youtube.com') || url.includes('youtu.be')) {
                    window.open(url, "_blank");
                  }
                }}
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  background: "rgba(0,0,0,0.6)",
                  color: "#fff"
                }}
              >
                <PlayArrow />
              </IconButton>
            </Box>
            <Box>
              <Typography fontWeight={600} className="section-title">
                {videoData.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Duration: {videoData.duration}
              </Typography>
            </Box>
          </Paper>

          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            centered
            className="yt-tabs"
            sx={{ mb: 2 }}
          >
            <Tab label="Video" />
            <Tab label="Audio" />
          </Tabs>

          {tab === 0 && (
            <TableContainer component={Paper} className="glass-table">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Quality</TableCell>
                    <TableCell>Size</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.isArray(videoData?.formats) &&
                    videoData.formats.map((f) => (
                      <TableRow key={f.itag}>
                        <TableCell>{f.quality}</TableCell>
                        <TableCell>{f.size}</TableCell>
                        <TableCell align="center">
                          <Button
                            variant="contained"
                            size="small"
                            className="yt-primary"
                            onClick={() => startDownload(f)}
                          >
                            Download
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {tab === 1 && (
            <Box textAlign="center" mt={3}>
              <Button
                variant="contained"
                size="small"
                className="yt-primary"
                onClick={downloadAudio}
              >
                Download MP3
              </Button>
            </Box>
          )}
        </>
      )}

      {showBar && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            position: "fixed",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(10px)",
            padding: "16px 24px",
            borderRadius: "14px",
            zIndex: 9999,
            width: "320px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
          }}
        >
          <Typography
            variant="body2"
            color="#fff"
            mb={1}
            textAlign="center"
          >
            {label}
          </Typography>

          <Box
            sx={{
              height: 8,
              background: "rgba(255,255,255,0.2)",
              borderRadius: 4,
              overflow: "hidden"
            }}
          >
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ ease: "easeOut", duration: 0.4 }}
              style={{
                height: "100%",
                background: "linear-gradient(90deg, #ff416c, #ff4b2b)"
              }}
            />
          </Box>

          <Typography
            variant="caption"
            color="rgba(255,255,255,0.7)"
            display="block"
            textAlign="center"
            mt={0.5}
          >
            {progress}%
          </Typography>
        </motion.div>
      )}

      <CategoryButtons />
      <FeaturesSection />
      <CarouselSection />
      <FAQSection />
    </Container>
  );
}
