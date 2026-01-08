import React, { useState } from "react";
import logo from "../components/assets/logo.png";
import { AppBar, Box, IconButton, Tab, Tabs, Toolbar, Typography, Drawer, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { DarkMode, LightMode, Menu, Close } from "@mui/icons-material";

function Navbar({ mode, onToggleTheme }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const getTabFromPath = (path) => {
    if (path === "/") return 0;
    if (path.startsWith("/mp3")) return 1;
    if (path.startsWith("/instagram")) return 2;
    if (path.startsWith("/facebook")) return 3;
    if (path.startsWith("/about")) return 4;
    return 0;
  };

  const currentTab = getTabFromPath(location.pathname);

  const handleChange = (_, newValue) => {
    const routes = ["/", "/mp3", "/instagram", "/facebook", "/about"];
    navigate(routes[newValue]);
    setMobileOpen(false);
  };

  const navItems = ["YouTube", "MP3 Converter", "Instagram", "Facebook", "About"];

  const drawer = (
    <Box sx={{ width: 250 }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
        <IconButton onClick={() => setMobileOpen(false)}>
          <Close />
        </IconButton>
      </Box>
      <List>
        {navItems.map((item, index) => (
          <ListItem key={item} disablePadding>
            <ListItemButton
              selected={currentTab === index}
              onClick={() => handleChange(null, index)}
              sx={{
                "&.Mui-selected": {
                  background: "rgba(34, 211, 238, 0.1)",
                  borderLeft: "3px solid #22d3ee",
                },
              }}
            >
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar
      position="static"
      sx={{
        background: "rgba(10, 16, 32, 0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(148, 163, 184, 0.18)",
        boxShadow: "0 12px 30px rgba(7, 11, 22, 0.45)",
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
            sx={{ fontWeight: "bold", letterSpacing: 0.5, display: { xs: "block", sm: "block" } }}
          >
            SaveFrom
          </Typography>
        </Box>

        {/* NAV TABS - Desktop */}
        <Tabs
          value={currentTab}
          onChange={handleChange}
          textColor="inherit"
          indicatorColor="secondary"
          sx={{
            display: { xs: "none", md: "flex" },
            "& .MuiTab-root": {
              fontWeight: "bold",
              textTransform: "capitalize",
              minWidth: 110,
            },
            "& .MuiTab-root:hover": {
              color: "#22d3ee",
            },
            "& .MuiTabs-indicator": {
              height: "3px",
              borderRadius: "2px",
              background: "linear-gradient(90deg, #ff7a18, #22d3ee)",
            },
          }}
        >
          <Tab label="YouTube" />
          <Tab label="MP3 Converter" />
          <Tab label="Instagram" />
          <Tab label="Facebook" />
          <Tab label="About" />
        </Tabs>

        {/* HAMBURGER - Mobile */}
        <IconButton
          onClick={() => setMobileOpen(!mobileOpen)}
          sx={{
            display: { xs: "flex", md: "none" },
            mr: 1,
            color: "inherit",
          }}
        >
          <Menu />
        </IconButton>

        {/* THEME TOGGLE */}
        <IconButton
          onClick={onToggleTheme}
          sx={{
            color: "inherit",
            border: "1px solid rgba(148, 163, 184, 0.3)",
            borderRadius: "12px",
          }}
          aria-label="Toggle theme"
        >
          {mode === "light" ? <DarkMode /> : <LightMode />}
        </IconButton>
      </Toolbar>

      {/* MOBILE DRAWER */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            background: "rgba(10, 16, 32, 0.95)",
            backdropFilter: "blur(12px)",
            borderLeft: "1px solid rgba(148, 163, 184, 0.18)",
          },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
}

export default Navbar;
