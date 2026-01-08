import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Container,
  Grid,
  Paper,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";

const FacebookPage = () => {
  const [url, setUrl] = useState("");
  const [info, setInfo] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloading, setDownloading] = useState(false);

  const API_BASE =
    process.env.REACT_APP_API_BASE || "http://localhost:5000";

  const generateId = () =>
    window.crypto?.randomUUID?.() ||
    Math.random().toString(36).slice(2);

  const fetchInfo = async () => {
    if (!url.trim()) return;

    setLoading(true);
    setError("");
    setInfo(null);

    try {
      const res = await axios.post(`${API_BASE}/api/facebook/info`, { url });
      if (res.data?.success) {
        setInfo(res.data);
      } else {
        setError(res.data?.error || "Failed to fetch Facebook video");
      }
    } catch (err) {
      setError("Backend not reachable");
    } finally {
      setLoading(false);
    }
  };

  const startDownload = (format) => {
    if (!info || downloading) return;

    const id = generateId();
    setDownloading(true);
    setProgress(0);

    const evtSource = new EventSource(
      `${API_BASE}/api/progress/${id}`
    );

    evtSource.onmessage = (e) => {
      const value = Math.floor(Number(e.data));
      setProgress(value);
      if (value >= 100) {
        evtSource.close();
        setDownloading(false);
      }
    };

    const safeTitle = (info.title || "facebook_video")
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "_")
      .substring(0, 50);

    window.location.href =
      `${API_BASE}/api/facebook/download` +
      `?url=${encodeURIComponent(url)}` +
      `&itag=${format.itag}` +
      `&title=${encodeURIComponent(safeTitle)}` +
      `&id=${id}`;
  };

  return (
    <Container maxWidth="lg" className="page-wrap">
      <Box className="fb-hero glass-panel">
        <Box>
          <Typography variant="h3" className="section-title fb-title">
            Facebook Video Downloader
          </Typography>
          <Typography className="fb-subtitle">
            Save public videos in HD with smart format detection and fast links.
            Built for speed, tuned for clarity.
          </Typography>
          <Box className="fb-stats">
            <div>
              <span>HD Ready</span>
              <strong>1080p</strong>
            </div>
            <div>
              <span>Avg speed</span>
              <strong>120 ms</strong>
            </div>
            <div>
              <span>Formats</span>
              <strong>MP4</strong>
            </div>
          </Box>
        </Box>
        <Box className="fb-glow" />
      </Box>

      <Paper className="glass-panel fb-form">
        <Typography className="fb-form-title">
          Paste a Facebook video link
        </Typography>
        <Box className="fb-input-row">
          <TextField
            fullWidth
            placeholder="https://www.facebook.com/..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && fetchInfo()}
          />
          <Button
            variant="contained"
            className="fb-primary"
            onClick={fetchInfo}
            disabled={loading}
          >
            {loading ? <CircularProgress size={22} color="inherit" /> : "Fetch Video"}
          </Button>
        </Box>
        {loading && (
          <Box className="fb-loading">
            <CircularProgress size={22} />
            <Typography variant="body2">
              Fetching video details...
            </Typography>
          </Box>
        )}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Paper>

      {info && (
        <Paper className="fb-preview">
          <img src={info.thumbnail} alt="Facebook thumbnail" />
          <Box>
            <Typography variant="h6">{info.title}</Typography>
            <Typography className="fb-card-copy">
              Choose a quality to download your video.
            </Typography>
            <Box className="fb-actions">
              {(info.formats || []).map((format) => (
                <Button
                  key={format.itag}
                  variant="contained"
                  className="fb-primary"
                  onClick={() => startDownload(format)}
                >
                  {format.quality || "Best"} MP4
                </Button>
              ))}
            </Box>
            {downloading && (
              <Box className="fb-progress">
                <Typography variant="body2">
                  Downloading... {progress}%
                </Typography>
                <Box className="fb-progress-bar">
                  <Box style={{ width: `${progress}%` }} />
                </Box>
              </Box>
            )}
          </Box>
        </Paper>
      )}

      <Grid container spacing={3} className="fb-cards">
        {[
          {
            title: "Clean HD output",
            body: "Instant quality detection and direct MP4 downloads.",
          },
          {
            title: "No login",
            body: "Paste a public link and download in seconds.",
          },
          {
            title: "Stable performance",
            body: "Optimized pipeline for large files and long videos.",
          },
        ].map((card) => (
          <Grid item xs={12} md={4} key={card.title}>
            <Paper className="fb-card">
              <Typography variant="h6">{card.title}</Typography>
              <Typography className="fb-card-copy">{card.body}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Box className="fb-steps">
        <Typography variant="h5" className="section-title" mb={3}>
          How it works
        </Typography>
        <div className="fb-step-grid">
          {[
            "Copy the Facebook video link",
            "Paste the link and fetch the video",
            "Download MP4 in your chosen quality",
          ].map((step, index) => (
            <div key={step} className="fb-step">
              <span>{index + 1}</span>
              <p>{step}</p>
            </div>
          ))}
        </div>
      </Box>
    </Container>
  );
};

export default FacebookPage;
