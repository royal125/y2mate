// src/App.js
import React, { useState } from "react";
import { Box } from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CookieConsent from "./components/CookieConsent";

import YouTubeDownloader from "./components/YouTubeDownloader";
import InstagramDownloader from "./components/InstagramDownloader";
import Mp3Page from "./components/pages/Mp3Page";
import ReelsPage from "./components/pages/ReelsPage";
import FacebookPage from "./components/pages/FacebookPage";
import MaintenancePage from "./components/pages/MaintenancePage";
import About from "./components/About";
import Privacy from "./components/Privacy";

function App() {
  const [currentTab, setCurrentTab] = useState(0);

  return (
    <Router>
      <Box
        sx={{
          background: "linear-gradient(135deg, #0f172a, #1e293b)",
          minHeight: "100vh",
          color: "white",
        }}
      >
        <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />

        <Routes>
          <Route path="/" element={<YouTubeDownloader />} />
          <Route path="/instagram" element={<InstagramDownloader />} />
          <Route path="/mp3" element={<Mp3Page />} />
          <Route path="/reels" element={<ReelsPage />} />
          <Route path="/fb" element={<FacebookPage />} />
          <Route path="/facebook" element={<MaintenancePage />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
        </Routes>

        <Footer />
        <CookieConsent />
      </Box>
    </Router>
  );
}

export default App;
