import React from "react";
import logo from "../components/assets/logo.png";
import { AppBar, Toolbar, Tabs, Tab, Typography, Box } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Map routes to tab index
  const getTabFromPath = (path) => {
    if (path === "/") return 0;
    if (path.startsWith("/Mp3Page")) return 1;
    if (path.startsWith("/instagram")) return 2;
    if (path.startsWith("/facebook")) return 3;
    if (path.startsWith("/about")) return 4;
    return 0;
  };

  const currentTab = getTabFromPath(location.pathname);

  const handleChange = (_, newValue) => {
    switch (newValue) {
      case 0:
        navigate("/");
        break;
      case 1:
        navigate("/Mp3Page");
        break;
      case 2:
        navigate("/instagram");
        break;
      case 3:
        navigate("/facebook");
        break;
      case 4:
        navigate("/about");
        break;
      default:
        navigate("/");
    }
  };

  return (
    <AppBar
      position="static"
      sx={{
        background: "linear-gradient(90deg, #0f172a, #1e293b, #3b82f6)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
      }}
    >
      <Toolbar>
        {/* LOGO */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexGrow: 1,
            cursor: "pointer",
          }}
          onClick={() => navigate("/")}
        >
          <img
            src={logo}
            alt="Logo"
            style={{
              height: 40,
              width: 40,
              marginRight: 10,
              borderRadius: "8px",
              transition: "transform 0.2s ease",
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", letterSpacing: 0.5 }}
          >
            Video Downloader
          </Typography>
        </Box>

        {/* NAV TABS */}
        <Tabs
          value={currentTab}
          onChange={handleChange}
          textColor="inherit"
          indicatorColor="secondary"
          sx={{
            "& .MuiTab-root": {
              fontWeight: "bold",
              textTransform: "capitalize",
              minWidth: 110,
            },
            "& .MuiTab-root:hover": {
              color: "#93c5fd",
            },
            "& .MuiTabs-indicator": {
              height: "3px",
              borderRadius: "2px",
              backgroundColor: "#ff1744", // 🔴 Red underline fixed
            },
          }}
        >
          <Tab label="YouTube" />
          <Tab label="MP3 Converter" />
          <Tab label="Instagram" />
          <Tab label="Facebook" />
          <Tab label="About" />
        </Tabs>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
