import React, { useState } from "react";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Card,
  CardContent,
} from "@mui/material";
import axios from "axios";

const API_BASE =
  process.env.REACT_APP_API_BASE || "http://localhost:5000";


export default function InstagramDownloader() {
  const [url, setUrl] = useState("");
  const [info, setInfo] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloading, setDownloading] = useState(false);

  const fetchInfo = async () => {
    if (!url.trim()) return;

    setInfo(null);
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE}/instagram/info`, { url });
      if (res.data.success) {
        setInfo({
          title: res.data.title || "Instagram Reel",
          thumbnail: res.data.thumbnail || "",
          formats: res.data.formats || [{ itag: "best", quality: "Best Quality" }],
        });
      } else {
        setError(res.data.error || "Failed to fetch video");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch video. Check the URL.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (format) => {
    const id = crypto.randomUUID();
    setProgress(0);
    setDownloading(true);

    const evtSource = new EventSource(`${API_BASE}/api/progress/${id}`);

    evtSource.onmessage = (e) => {
      const value = Number(e.data);
      setProgress(value);

      if (value >= 100) {
        evtSource.close();
        setDownloading(false);
      }
    };

    window.location.href =
      `${API_BASE}/instagram/download` +
      `?url=${encodeURIComponent(url)}` +
      `&title=${encodeURIComponent(info.title)}` +
      `&itag=${encodeURIComponent(format?.itag || "best")}` +
      `&id=${id}`;
  };

  const displayFormats = React.useMemo(() => {
    if (!info?.formats?.length) return [];

    const sorted = [...info.formats].sort((a, b) => {
      const ha = a.height || Number(String(a.quality || "").replace("p", "")) || 0;
      const hb = b.height || Number(String(b.quality || "").replace("p", "")) || 0;
      return hb - ha;
    });

    const labelFor = (height) => {
      if (height >= 1080) return "Full HD";
      if (height >= 720) return "HD quality";
      if (height >= 480) return "Medium quality";
      return "Low quality";
    };

    const seen = new Set();
    const picks = [];

    for (const f of sorted) {
      const height =
        f.height || Number(String(f.quality || "").replace("p", "")) || 0;
      const label = height ? labelFor(height) : "Best Quality";
      if (!seen.has(label)) {
        seen.add(label);
        picks.push({ ...f, label });
      }
      if (picks.length >= 3) break;
    }

    return picks;
  }, [info]);

  return (
    <Container maxWidth="md" className="page-wrap">
      <Box className="ig-hero glass-panel">
        <Box>
          <Typography variant="h4" className="section-title ig-title">
            Instagram Reels Downloader
          </Typography>
          <Typography className="ig-subtitle">
            Grab reels in full quality with a single link. Fast, clean, and no
            sign-up required.
          </Typography>
          <Box className="ig-badges">
            <span>HD Quality</span>
            <span>No Watermark</span>
            <span>Unlimited</span>
          </Box>
        </Box>
        <Box className="ig-orb" />
      </Box>

      <Box className="glass-panel ig-form" sx={{ p: 3, mb: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Typography className="ig-form-title">
          Paste your Instagram reel URL
        </Typography>

        <Box className="ig-input-row">
          <TextField
            fullWidth
            placeholder="https://www.instagram.com/reel/..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && fetchInfo()}
          />
          <Button
            variant="contained"
            className="ig-primary"
            onClick={fetchInfo}
            disabled={loading}
          >
            {loading ? <CircularProgress size={22} color="inherit" /> : "Fetch"}
          </Button>
        </Box>

        {loading && (
          <Box className="ig-loading">
            <CircularProgress size={24} />
            <Typography variant="body2">Fetching reel details...</Typography>
          </Box>
        )}
      </Box>

      {info && (
        <Card className="glass-panel ig-result">
          <CardContent>
            <Typography variant="h6" className="section-title" sx={{ mb: 2 }}>
              Your reel is ready
            </Typography>

            {info.thumbnail && (
              <Box className="ig-preview">
                <img src={info.thumbnail} alt="Instagram thumbnail" />
              </Box>
            )}

            <Box className="ig-actions">
              {(displayFormats.length ? displayFormats : info.formats || []).slice(0, 3).map((f) => (
                <Button
                  key={`${f.itag}-${f.quality || f.label}`}
                  variant="contained"
                  className="ig-primary"
                  onClick={() => handleDownload(f)}
                >
                  {f.label || f.quality || "Best Quality"}
                </Button>
              ))}
            </Box>

            {downloading && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Downloading... {progress}%
                </Typography>
                <Box
                  sx={{
                    height: 8,
                    borderRadius: 5,
                    background: "rgba(255,255,255,0.15)",
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      height: "100%",
                      width: `${progress}%`,
                      background: "linear-gradient(90deg, #ff7a18, #ff4d2d)",
                      transition: "width 0.3s",
                    }}
                  />
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>
      )}
    </Container>
  );
}
