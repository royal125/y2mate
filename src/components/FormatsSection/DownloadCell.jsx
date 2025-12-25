import React from "react";
import { Button, Box, LinearProgress, Typography } from "@mui/material";

const DownloadCell = ({ format, downloadingMap, progressMap, handleDownload }) => {
  const isDownloading = downloadingMap[format.format_id];
  const progress = progressMap?.[format.format_id] || 0;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minWidth: 120,
        gap: 1,
      }}
    >
      {isDownloading ? (
        <>
          <Box sx={{ width: "100%", px: 2 }}>
            <LinearProgress
              variant={progress > 0 ? "determinate" : "indeterminate"}
              value={progress}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: "rgba(38, 165, 137, 0.2)",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "#26a589ff",
                },
              }}
            />
          </Box>
          <Typography variant="caption" sx={{ fontWeight: 600, color: "#26a589ff" }}>
            {progress > 0 ? `${progress.toFixed(1)}%` : "Starting..."}
          </Typography>
        </>
      ) : (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleDownload(format)}
          sx={{
            textTransform: "none",
            fontWeight: "bold",
            px: 3,
            py: 1,
            backgroundColor: "#26a589ff !important",
            "&:hover": { backgroundColor: "#1d7c69ff !important" },
          }}
        >
          Download
        </Button>
      )}
    </Box>
  );
};

export default DownloadCell;
