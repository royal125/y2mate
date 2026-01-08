import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Container,
  Typography,
  LinearProgress,
  Paper,
  Slider,
  Switch,
  FormControlLabel,
} from "@mui/material";
import Lottie from "lottie-react";
import waveformAnim from "./assets/waveform.json"; // 🎵 waveform animation



const API_BASE =
  process.env.REACT_APP_API_BASE || "http://localhost:5000";

const Mp3Page = () => {
  /* ===== COMMON ===== */
  const [progress, setProgress] = useState(0);
  const [showBar, setShowBar] = useState(false);
  const [label, setLabel] = useState("");

  /* ===== UPLOAD ===== */
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [fileInfo, setFileInfo] = useState({});
  const [settings, setSettings] = useState({
    bitrate: "192k",
    volume: 100,
    normalize: false,
  });

  useEffect(() => {
    if (progress === 100) {
      setLabel("Completed");
      setTimeout(() => setShowBar(false), 1500);
    }
  }, [progress]);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setFileInfo({
      name: f.name,
      size: (f.size / (1024 * 1024)).toFixed(2) + " MB",
      type: f.type,
    });
  };

  const startUploadMp3 = async () => {
    if (!file) {
      alert("Select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("bitrate", settings.bitrate);
    formData.append("volume", settings.volume);
    formData.append("normalize", settings.normalize);

    setUploading(true);
    setShowBar(true);
    setProgress(0);
    setLabel("Uploading & converting…");

    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    }, 300);

    try {
      const res = await axios.post(
        `${API_BASE}/converter/mp4-to-mp3`,
        formData,
        {
          responseType: "blob",
          onUploadProgress: (e) => {
            if (e.total) {
              const percent = Math.round(
                (e.loaded * 100) / e.total
              );
              setProgress(percent);
            }
          }
        }
      );

      const blob = new Blob([res.data], { type: "audio/mpeg" });
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = file.name.replace(/\.[^/.]+$/, ".mp3");
      a.click();
      URL.revokeObjectURL(downloadUrl);
    } catch {
      alert("Conversion failed");
    } finally {
      setUploading(false);
      setProgress(100);
    }
  };

  return (
    <Container className="page-wrap">
      <Paper
        elevation={6}
        className="glass-panel mp3-hero"
        sx={{ p: 5, textAlign: "center" }}
      >
        <Typography variant="h4" fontWeight={800} mb={3} className="section-title">
          MP4 to MP3 Converter
        </Typography>

        {/* File Upload */}
        <Box sx={{ mb: 3 }}>
          <label
            htmlFor="file-upload"
            className="yt-secondary file-pill"
          >
            Choose File
          </label>
          <input
            id="file-upload"
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </Box>

        {/* Show file info */}
        {file && (
          <Box
            sx={{
              mb: 3,
              mt: 1,
              background: "rgba(15, 23, 42, 0.35)",
              p: 2,
              borderRadius: "15px",
              display: "inline-block",
              width: "80%",
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold">
              {fileInfo.name}
            </Typography>
            <Typography variant="body2" color="lightgray">
              {fileInfo.type} • {fileInfo.size}
            </Typography>
          </Box>
        )}

        {/* Settings */}
        <Box
          sx={{
            mb: 3,
            p: 3,
            borderRadius: "20px",
            background: "rgba(15, 23, 42, 0.35)",
          }}
        >
          <Typography variant="h6" mb={2} className="section-title">
            Conversion Settings
          </Typography>

          {/* Bitrate */}
          <Box mb={3}>
            <Typography mb={1}>Bitrate:</Typography>
            <select
              value={settings.bitrate}
              onChange={(e) =>
                setSettings({ ...settings, bitrate: e.target.value })
              }
              style={{
                padding: "10px 15px",
                borderRadius: "10px",
                border: "none",
                backgroundColor: "#fff",
                color: "#0b1020",
                fontWeight: "bold",
                outline: "none",
                width: "50%",
              }}
            >
              <option value="128k">128 kbps (Standard)</option>
              <option value="192k">192 kbps (High)</option>
              <option value="320k">320 kbps (Very High)</option>
            </select>
          </Box>

          {/* Volume */}
          <Box mb={3}>
            <Typography mb={1}>Volume: {settings.volume}%</Typography>
            <Slider
              value={settings.volume}
              onChange={(_, val) => setSettings({ ...settings, volume: val })}
              step={10}
              min={50}
              max={150}
              sx={{
                color: "#22d3ee",
                width: "80%",
                mx: "auto",
              }}
            />
          </Box>

          {/* Normalize */}
          <FormControlLabel
            control={
              <Switch
                checked={settings.normalize}
                onChange={(e) =>
                  setSettings({ ...settings, normalize: e.target.checked })
                }
                color="success"
              />
            }
            label="Normalize Audio"
          />
        </Box>

        {/* Convert Button */}
        {file && (
          <Button
            variant="contained"
            onClick={startUploadMp3}
            disabled={uploading}
            className="yt-primary"
            sx={{ px: 4, py: 1.5 }}
          >
            {uploading ? "Converting..." : "Convert to MP3"}
          </Button>
        )}

        {/* Loader and waveform */}
        {uploading && (
          <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
            <Lottie
              animationData={waveformAnim}
              loop
              autoplay
              style={{ height: 100, width: 200 }}
            />
          </Box>
        )}

        {/* Progress Bar */}
        {showBar && (
          <Box sx={{ width: "80%", mx: "auto", mt: 2 }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 10,
                borderRadius: 5,
                backgroundColor: "rgba(255,255,255,0.2)",
                "& .MuiLinearProgress-bar": { backgroundColor: "#ff7a18" },
              }}
            />
            <Typography variant="body2" mt={1}>
              {label || `${progress}% completed`}
            </Typography>
          </Box>
        )}


      </Paper>
    </Container>
  );
};

export default Mp3Page;
