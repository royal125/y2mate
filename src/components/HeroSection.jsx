// src/components/HeroSection.jsx
import React from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
<<<<<<< HEAD
import CategoryButtons from "./CategoryButtons";
import FeaturesSection from "./FeaturesSection";
import CarouselSection from "./CarouselSection";
=======
>>>>>>> 0035b5a58621603643ba2ef4cd93b52418e875c0

const HeroSection = ({ url, setUrl, onFetch, loading, title, placeholder }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        py: 6,
        background: "transparent",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: "100%",
          maxWidth: "1000px",
          p: 6,
          borderRadius: 3,
          background: "linear-gradient(180deg, #4a67d3 0%, #cb3c3c 100%)",
          boxShadow: "0 10px 25px rgba(255, 60, 60, 0.25)",
          backdropFilter: "blur(4px)",
          color: "white",
          textAlign: "center",
        }}
      >
        {/* ✅ Use title prop */}
        <Typography
          variant="h4"
          sx={{
            mb: 3,
            fontWeight: 900,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {title || "🎬 Downloader"}
        </Typography>

        {/* Input + Button */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
<<<<<<< HEAD
            placeholder={placeholder || "Paste video link here....."}
=======
            placeholder={placeholder || "Paste video link here..."}
>>>>>>> 0035b5a58621603643ba2ef4cd93b52418e875c0
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            sx={{
              backgroundColor: "white",
              borderRadius: "30px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "30px",
                pl: 2,
              },
              "& input": {
                py: 1.5,
              },
              "& input:-webkit-autofill": {
                WebkitBoxShadow: "0 0 0 100px white inset",
                WebkitTextFillColor: "#311111",
                caretColor: "#311111",
                borderRadius: "inherit",
              },
            }}
          />

          <Button
            variant="contained"
            onClick={onFetch}
            disabled={loading}
            sx={{
              borderRadius: "30px",
              px: 4,
              py: 1.5,
              backgroundColor: "#fff",
              color: "#cc0000",
              fontWeight: "bold",
              textTransform: "none",
              "&:hover": { backgroundColor: "#f5f5f5" },
            }}
<<<<<<< HEAD
                  >
                      
=======
          >
>>>>>>> 0035b5a58621603643ba2ef4cd93b52418e875c0
            {loading ? "Fetching…" : "Fetch"}
          </Button>
        </Box>
      </Paper>
<<<<<<< HEAD
      
     
=======
>>>>>>> 0035b5a58621603643ba2ef4cd93b52418e875c0
    </Box>
  );
};

<<<<<<< HEAD
export default HeroSection;
=======
export default HeroSection;
>>>>>>> 0035b5a58621603643ba2ef4cd93b52418e875c0
