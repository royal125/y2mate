import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";

const TopProgressBar = ({ active }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!active) {
      setProgress(0);
      return;
    }

    let value = 0;
    const interval = setInterval(() => {
      // simulate fake progress
      value += Math.random() * 6;
      if (value >= 95) value = 95; // pause near 100%
      setProgress(value);
    }, 200);

    return () => clearInterval(interval);
  }, [active]);

  // Animate to 100% and fade out when done
  useEffect(() => {
    if (!active && progress > 0) {
      setProgress(100);
      setTimeout(() => setProgress(0), 800);
    }
  }, [active]);

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "5px",
        width: `${progress}%`,
        background: "linear-gradient(90deg, rgba(0,255,200,0.9), rgba(0,150,255,0.9))",
        boxShadow: "0 0 10px rgba(0,200,255,0.6)",
        transition: "width 0.4s ease, opacity 0.5s ease",
        zIndex: 9999,
        opacity: active ? 1 : 0,
      }}
    />
  );
};

export default TopProgressBar;
