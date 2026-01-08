// src/theme.js
import { createTheme } from "@mui/material/styles";

const getTheme = (mode = "dark") =>
  createTheme({
    palette: {
      mode,
      primary: { main: mode === "dark" ? "#ff7a18" : "#ff5a1f" },
      secondary: { main: mode === "dark" ? "#22d3ee" : "#2563eb" },
      background: {
        default: mode === "dark" ? "#0b1020" : "#f7f8fc",
        paper: mode === "dark" ? "rgba(16, 23, 42, 0.72)" : "#ffffff",
      },
      text: {
        primary: mode === "dark" ? "#f8fafc" : "#0f172a",
        secondary: mode === "dark" ? "#94a3b8" : "#475569",
      },
    },
    typography: {
      fontFamily: "'Sora', sans-serif",
      h3: { fontFamily: "'Syne', sans-serif", fontWeight: 700 },
      h4: { fontFamily: "'Syne', sans-serif", fontWeight: 700 },
      h5: { fontFamily: "'Syne', sans-serif", fontWeight: 600 },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: "20px",
            backdropFilter: "blur(12px)",
            background: mode === "dark" ? "rgba(16, 23, 42, 0.72)" : "#ffffff",
            border:
              mode === "dark"
                ? "1px solid rgba(148, 163, 184, 0.2)"
                : "1px solid rgba(148, 163, 184, 0.3)",
            boxShadow:
              mode === "dark"
                ? "0 20px 45px rgba(7, 11, 22, 0.45)"
                : "0 16px 30px rgba(15, 23, 42, 0.12)",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: 600,
            padding: "8px 20px",
            transition: "all 0.2s ease",
            "&:hover": {
              transform: "translateY(-1px)",
              boxShadow: "0 10px 20px rgba(0,0,0,0.35)",
            },
          },
        },
      },
    },
  });

export default getTheme;
