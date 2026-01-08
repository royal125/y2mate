import { useState } from "react";
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
  Alert,
  IconButton,
  CircularProgress
} from "@mui/material";
import { PlayArrow } from "@mui/icons-material";
import axios from "axios";
import Lottie from "lottie-react";
import loaderAnim from "./assets/spinner.json";

/* ===== HOMEPAGE SECTIONS ===== */
import CategoryButtons from "../components/CategoryButtons";
import FeaturesSection from "../components/FeaturesSection";
import CarouselSection from "../components/CarouselSection";

const API_BASE =
  process.env.REACT_APP_API_URL || "http://localhost:3000";

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

  /* ===================== FETCH INFO ===================== */
   const handleFetch = async () => {
  if (!url.trim()) {
    setError("Please enter a YouTube URL");
    return;
  }

  setLoading(true);
  setVideoData(null);
  setError("");

  try {
    const res = await axios.post(`${API_BASE}/info`, { url });
    setVideoData(res.data);
  } catch (err) {
    console.error(err);
    setError("Failed to fetch video info");
  } finally {
    setLoading(false);
  }
};

  /* ===================== DOWNLOAD ===================== */
  const startDownload = (format) => {
    const safeTitle = videoData.title
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "_")
      .substring(0, 50);

    const downloadUrl =
      `${API_BASE}/download` +
      `?url=${encodeURIComponent(url)}` +
      `&itag=${format.itag}` +
      `&title=${encodeURIComponent(safeTitle)}`;

    setShowBar(true);
    setLabel("Preparing download…");
    setProgress(0);

    let fake = 0;
    const timer = setInterval(() => {
      fake += Math.random() * 6;
      if (fake >= 90) fake = 90;
      setProgress(Math.floor(fake));
    }, 200);

    setTimeout(() => {
      clearInterval(timer);
      window.location.href = downloadUrl;
      setProgress(100);
      setLabel("Download started");

      setTimeout(() => {
        setShowBar(false);
        setProgress(0);
 
      }, 1500);
    }, 900);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" textAlign="center" mb={3}>
        YouTube Video Downloader
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      {/* SEARCH */}
      <Box display="flex" gap={2} mb={3}>
        <TextField
          fullWidth
          placeholder="Paste YouTube URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <Button
  variant="contained"
  type="button"
  onClick={handleFetch}
  disabled={loading}
>

          {loading ? "Loading…" : "Fetch"}
        </Button>
      </Box>

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
          <Paper sx={{ p: 2, mb: 3, display: "flex", gap: 2 }}>
            <Box position="relative">
              <img
                src={videoData.thumbnail}
                alt="thumb"
                style={{ width: 120, borderRadius: 8 }}
              />
              <IconButton
                onClick={() => window.open(url, "_blank")}
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
              <Typography fontWeight={600}>{videoData.title}</Typography>
              <Typography variant="body2">
                Duration: {videoData.duration}
              </Typography>
            </Box>
          </Paper>

          <Tabs value={tab} onChange={(_, v) => setTab(v)} centered>
            <Tab label="Video" />
          </Tabs>

          <TableContainer component={Paper}>
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
        <Button onClick={() => startDownload(f)}>
          Download
        </Button>
      </TableCell>
    </TableRow>
))}

              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {showBar && (
        <Box mt={3} p={2} borderRadius={2} bgcolor="rgba(0,0,0,0.7)">
          <Box display="flex" alignItems="center" gap={2}>
            <CircularProgress variant="determinate" value={progress} />
            <Typography>{label} ({progress}%)</Typography>
          </Box>
        </Box>
      )}

      <CategoryButtons />
      <FeaturesSection />
      <CarouselSection />
    </Container>
  );
}
