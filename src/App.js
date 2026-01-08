// src/App.js
import React, { useEffect, useMemo, useState } from "react";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CookieConsent from "./components/CookieConsent";

import YouTubeDownloader from "./components/YouTubeDownloader";
import InstagramDownloader from "./components/InstagramDownloader";
import Mp3Page from "./components/Mp3Page";
import FacebookPage from "./components/pages/FacebookPage";
import MaintenancePage from "./components/pages/MaintenancePage";
import About from "./components/About";
import Privacy from "./components/Privacy";
import getTheme from "./components/theme";

function App() {
  const [currentTab, setCurrentTab] = useState(0);
  const [mode, setMode] = useState(() => {
    const saved = localStorage.getItem("y2mate-theme");
    return saved === "light" ? "light" : "dark";
  });

  const theme = useMemo(() => getTheme(mode), [mode]);

  useEffect(() => {
    localStorage.setItem("y2mate-theme", mode);
    document.body.dataset.theme = mode;
  }, [mode]);

  const handleToggleTheme = () => {
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box className="app-shell">
          <Navbar
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            mode={mode}
            onToggleTheme={handleToggleTheme}
          />

          <Routes>
            <Route path="/" element={<YouTubeDownloader />} />
            <Route path="/instagram" element={<InstagramDownloader />} />
            <Route path="/mp3" element={<Mp3Page />} />
            <Route path="/facebook" element={<FacebookPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<Privacy />} />
          </Routes>

          <Footer />
          <CookieConsent />
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
