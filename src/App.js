// src/App.js
import React, { useState } from "react";
import { Box } from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import YouTubeDownloader from "./components/YouTubeDownloader";
import InstagramDownloader from "./components/InstagramDownloader";
import logo from "./components/assets/logo.png";
import CookieConsent from "./components/CookieConsent";
import Privacy from "./components/Privacy";
import About from "./components/About";
import MaintenancePage from "./components/pages/MaintenancePage";

import Lottie from "lottie-react";
import axios from "axios";

// Loader animation
import loaderAnim from "./components/assets/loader.json";

// Pages
import Mp3Page from "./components/pages/Mp3Page";
import ReelsPage from "./components/pages/ReelsPage";
import FacebookPage from "./components/pages/FacebookPage";

function App() {
  // ✅ Global states
  const [url, setUrl] = useState("");
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);

  // ✅ Fetch handler (you can integrate this later into YouTubePage)
  const handleFetch = async () => {
  if (!url.trim()) return;
  setLoading(true);
  setVideoData(null);

  try {
    // ✅ Send the URL in JSON body, not as params
    const API_BASE = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";
    const res = await axios.post(`${API_BASE}/info`, { url });

    if (res.data && res.data.formats) {
      setVideoData({ ...res.data, url });
    } else {
      alert("No video data found.");
    }
  } catch (err) {
    console.error("❌ Error fetching info:", err);
    alert("Failed to fetch video info. Please check the URL or backend.");
  } finally {
    setLoading(false);
  }
};


  return (
    <Router>
      <Box
        sx={{
          background: "linear-gradient(135deg, #0f172a, #1e293b)",
          minHeight: "100vh",
          color: "white",
        }}
      >
        {/* ✅ Navbar on top */}
        <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />

        {/* ✅ Routes */}
        <Routes>
          {/* Main working downloader page */}
          <Route path="/" element={<YouTubeDownloader />} />
          <Route path="/instagram" element={<InstagramDownloader />} />
          <Route path="/Mp3Page" element={<Mp3Page />} />
          <Route path="/facebook" element={<MaintenancePage />} />
          <Route path="/about" element={<About />} />
          <Route path="/reels" element={<ReelsPage />} />
          <Route path="/fb" element={<FacebookPage />} />
          <Route path="/privacy" element={<Privacy />} />
        </Routes>

        {/* ✅ Footer at bottom */}
        <Footer />
        <CookieConsent />
      </Box>
    </Router>
  );
}

export default App;
