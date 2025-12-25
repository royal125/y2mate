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
  process.env.REACT_APP_API_URL || "https://api.savefrom.in";


export default function InstagramDownloader() {
  const [url, setUrl] = useState("");
  const [info, setInfo] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch video info from backend
  const fetchInfo = async () => {
    if (!url.trim()) return;

    setInfo(null);
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE}/instagram/info`, { url });
      if (res.data.success) {
        setInfo(res.data);
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

  // Download handler - like YouTube
 // Download handler - like YouTube
const handleDownload = (format) => {
  const downloadUrl = `${API_BASE}/instagram/download?url=${encodeURIComponent(url)}&itag=${format.itag}&title=${encodeURIComponent(info.title)}`;
  window.location.href = downloadUrl;
};

  return (
    <Container
      maxWidth="sm"
      sx={{
        py: 5,
        minHeight: "100vh",
      }}
    >
      <Typography
        variant="h4"
        textAlign="center"
        fontWeight="bold"
        mb={4}
        sx={{ letterSpacing: "0.5px" }}
      >
        📷 Instagram Reels Downloader
      </Typography>

      {/* Input Section */}
      <Box
        sx={{
          p: 3,
          borderRadius: 4,
          background: "rgba(255, 255, 255, 0.6)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          mb: 3,
        }}
      >
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          fullWidth
          label="Paste Instagram Reel URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && fetchInfo()}
          placeholder="https://www.instagram.com/reel/..."
        />

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2, py: 1.2, fontSize: "1rem" }}
          onClick={fetchInfo}
          disabled={loading}
        >
          {loading ? <CircularProgress size={26} color="inherit" /> : "Fetch Video"}
        </Button>
      </Box>

      {/* Video Section */}
      {info && (
        <Card
          sx={{
            mt: 4,
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
          }}
        >
          <Box
            sx={{
              position: "relative",
              height: 200,
              backgroundImage: `url(${info.thumbnail})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(15px)",
            }}
          />

          {/* Thumbnail Section */}
          <CardContent
            sx={{
              textAlign: "center",
              mt: "-100px",
            }}
          >
            {info?.thumbnail ? (
              <img
                src={info.thumbnail}
                alt="Thumbnail"
                style={{
                  width: "230px",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                }}
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            ) : (
              <div
                style={{
                  width: "230px",
                  height: "230px",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                  backgroundColor: "#e0e0e0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                  color: "#999",
                  margin: "0 auto",
                }}
              >
                📷 No thumbnail
              </div>
            )}
          </CardContent>

          {/* Title */}
          <Typography
            variant="h6"
            mt={2}
            sx={{ fontWeight: 600, px: 3, textAlign: "center" }}
          >
            {info.title}
          </Typography>

          {/* Video Quality Buttons - SAME AS YOUTUBE */}
          <Box sx={{ p: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: "600" }}>
              📹 Video Quality
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {info.formats && info.formats.length > 0 ? (
                info.formats.map((f, i) => (
                  <Button
                    key={i}
                    variant="contained"
                    fullWidth
                    sx={{
                      py: 1.3,
                      fontSize: "1rem",
                      background: "#e91e63",
                      "&:hover": { background: "#c2185b" },
                    }}
                    onClick={() => handleDownload(f)}
                  >
                    ⬇ Download {f.quality}
                  </Button>
                ))
              ) : (
                <Typography color="error">No formats available</Typography>
              )}
            </Box>

            {/* Audio Download Button - LIKE YOUTUBE */}
            {info.audioFormats && info.audioFormats.length > 0 && (
              <>
                <Typography
                  variant="subtitle2"
                  sx={{ mt: 3, mb: 2, fontWeight: "600" }}
                >
                  🎵 Audio Only
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    py: 1.3,
                    fontSize: "1rem",
                    background: "#3498db",
                    "&:hover": { background: "#2980b9" },
                  }}
                  onClick={() => handleDownload(info.audioFormats[0])}
                >
                  🎵 Download Best Audio
                </Button>
              </>
            )}
          </Box>
        </Card>
      )}
    </Container>
  );
}
