// src/App.js
import React, { useState } from "react";
import { Box } from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
<<<<<<< HEAD

import YouTubeDownloader from "./components/YouTubeDownloader";
import InstagramDownloader from "./components/InstagramDownloader";
import logo from "./components/assets/logo.png";
import CookieConsent from "./components/CookieConsent";
import Privacy from "./components/Privacy";
import About from "./components/About";
=======
import AboutPage from "./components/pages/AboutPage";
import YouTubeDownloader from "./components/YouTubeDownloader";
import logo from "./components/assets/logo.png";
>>>>>>> 0035b5a58621603643ba2ef4cd93b52418e875c0


import MaintenancePage from "./components/pages/MaintenancePage";

import Lottie from "lottie-react";
import axios from "axios";

// Loader animation
import loaderAnim from "./components/assets/loader.json";

// Pages

import Mp3Page from "./components/pages/Mp3Page";
<<<<<<< HEAD
  
=======
import InstagramPage from "./components/pages/InstagramPage";
>>>>>>> 0035b5a58621603643ba2ef4cd93b52418e875c0
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
<<<<<<< HEAD
      const API_BASE = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";
      const res = await axios.post(`${API_BASE}/info`, { url });
=======
    const res = await axios.post("https://api.savefrom.in/api/info", { url });
>>>>>>> 0035b5a58621603643ba2ef4cd93b52418e875c0

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
<<<<<<< HEAD
          <Route path="/instagram" element={<InstagramDownloader />} />
=======
>>>>>>> 0035b5a58621603643ba2ef4cd93b52418e875c0

          {/* Maintenance pages (stylish spinner) */}
          <Route path="/Mp3Page" element={<Mp3Page />} />
                  <Route path="/instagram" element={<MaintenancePage />} />
            <Route path="/facebook" element={<MaintenancePage />} />
<<<<<<< HEAD
          <Route path="/about" element={<About />} />
=======
          <Route path="/about" element={<MaintenancePage />} />
>>>>>>> 0035b5a58621603643ba2ef4cd93b52418e875c0

          {/* Optional pages (if you want separate ones later) */}
          <Route path="/Mp3Page" element={<Mp3Page />} />
          <Route path="/reels" element={<ReelsPage />} />
          <Route path="/fb" element={<FacebookPage />} />
<<<<<<< HEAD
          <Route path="/privacy" element={<Privacy />} />
=======
>>>>>>> 0035b5a58621603643ba2ef4cd93b52418e875c0
        </Routes>

        {/* ✅ Footer at bottom */}
        <Footer />
      </Box>
<<<<<<< HEAD
      <CookieConsent />
=======
>>>>>>> 0035b5a58621603643ba2ef4cd93b52418e875c0
    </Router>
  );
}

export default App;
