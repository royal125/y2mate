import React, { useState } from "react";
import { Tabs, Tab, Box, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import DownloadCell from "./DownloadCell";

const API_BASE =
  process.env.REACT_APP_API_URL || "https://api.savefrom.in";


const FormatsSection = ({ videoData }) => {
  const [tab, setTab] = useState("video");
  const [downloadingMap, setDownloadingMap] = useState({});

  if (!videoData || !videoData.formats) return null;

  const handleDownload = async (format) => {
    setDownloadingMap((prev) => ({ ...prev, [format.format_id]: true }));

    try {
      const res = await fetch(`${API_BASE}/download`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: videoData.url, format_id: format.format_id }),
      });

      if (!res.ok) throw new Error("Download failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${videoData.title}.${format.ext}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Download failed.");
    } finally {
      setDownloadingMap((prev) => ({ ...prev, [format.format_id]: false }));
    }
  };

  return (
    <Box mt={4}>
      <Tabs value={tab} onChange={(e, val) => setTab(val)} centered>
        <Tab value="video" label="Video" />
        <Tab value="audio" label="Audio" />
      </Tabs>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Quality</TableCell>
            <TableCell>Format</TableCell>
            <TableCell>Size (MB)</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {videoData.formats
            .filter((f) => f.type === tab)
            .map((format, idx) => (
              <TableRow key={idx}>
                <TableCell>{format.qualityLabel}</TableCell>
                <TableCell>{format.ext}</TableCell>
                <TableCell>{format.size}</TableCell>
                <TableCell>
                  <DownloadCell
                    format={format}
                    videoData={videoData}
                    downloadingMap={downloadingMap}
                    handleDownload={handleDownload}
                  />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default FormatsSection;
