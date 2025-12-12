import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Container } from "@mui/material";

export default function CookieConsent() {
  const [showCookies, setShowCookies] = useState(false);

  useEffect(() => {
    // Check if user already accepted cookies
    const cookieConsent = localStorage.getItem("cookieConsent");
    if (!cookieConsent) {
      setShowCookies(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setShowCookies(false);
  };

  const handleReject = () => {
    localStorage.setItem("cookieConsent", "rejected");
    setShowCookies(false);
  };

  if (!showCookies) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "rgba(0, 0, 0, 0.95)",
        padding: "20px",
        zIndex: 9999,
        boxShadow: "0 -2px 10px rgba(0,0,0,0.3)",
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 3,
            flexWrap: "wrap",
          }}
        >
          {/* Cookie Message */}
          <Typography
            sx={{
              color: "white",
              flex: 1,
              minWidth: "250px",
              fontSize: "14px",
              lineHeight: "1.6",
            }}
          >
            🍪 <strong>Cookie Policy:</strong> We use cookies to improve your experience on our website. By continuing to use our site, you accept our use of cookies. <a href="/privacy" style={{ color: "#4CAF50", textDecoration: "none" }}>Learn more</a>
          </Typography>

          {/* Buttons */}
          <Box sx={{ display: "flex", gap: 2, minWidth: "200px" }}>
            <Button
              variant="outlined"
              sx={{
                color: "white",
                borderColor: "white",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
              }}
              onClick={handleReject}
            >
              Reject
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#4CAF50",
                "&:hover": { backgroundColor: "#45a049" },
              }}
              onClick={handleAccept}
            >
              Accept
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
