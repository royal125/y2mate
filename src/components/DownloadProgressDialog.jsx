import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, Box, Typography, LinearProgress } from '@mui/material';
import { CheckCircle, Error } from '@mui/icons-material';
import { motion } from 'framer-motion';

const DownloadProgressDialog = ({ open, fileName, progress, speed, timeRemaining, status, onClose }) => {
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayProgress(progress);
    }, 50);
    return () => clearTimeout(timer);
  }, [progress]);
  const formatSpeed = (bytesPerSecond) => {
    if (bytesPerSecond < 1024) return `${bytesPerSecond.toFixed(0)} B/s`;
    if (bytesPerSecond < 1024 * 1024) return `${(bytesPerSecond / 1024).toFixed(2)} KB/s`;
    return `${(bytesPerSecond / (1024 * 1024)).toFixed(2)} MB/s`;
  };

  const formatTime = (seconds) => {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    const minutes = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${minutes}m ${secs}s`;
  };

  return (
    <Dialog open={open} onClose={status === 'completed' ? onClose : undefined} maxWidth="sm" fullWidth>
      <DialogContent sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center' }}>
          {status === 'downloading' && (
            <>
              <Typography variant="h6" sx={{ mb: 2 }}>📥 Downloading</Typography>
              <Typography variant="body2" sx={{ mb: 3, color: '#666', wordBreak: 'break-word' }}>
                {fileName}
              </Typography>
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 1.2 }}
              >
                <LinearProgress 
                  variant="determinate" 
                  value={progress} 
                  sx={{ 
                    mb: 2, 
                    height: 8, 
                    borderRadius: 4,
                    '& .MuiLinearProgress-bar': {
                      transition: 'transform 0.5s ease-out',
                    }
                  }}
                />
              </motion.div>
              <motion.div
                key={displayProgress}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#ff0000', mb: 2 }}>
                  {displayProgress}%
                </Typography>
              </motion.div>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 2 }}>
                <Typography variant="caption" sx={{ color: '#999' }}>
                  Speed: {formatSpeed(speed)}
                </Typography>
                <Typography variant="caption" sx={{ color: '#999' }}>
                  Time left: {formatTime(timeRemaining)}
                </Typography>
              </Box>
            </>
          )}

          {status === 'completed' && (
            <>
              <CheckCircle sx={{ fontSize: 60, color: '#4caf50', mb: 2 }} />
              <Typography variant="h6" sx={{ mb: 1 }}>Download Complete!</Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                {fileName}
              </Typography>
            </>
          )}

          {status === 'error' && (
            <>
              <Error sx={{ fontSize: 60, color: '#f44336', mb: 2 }} />
              <Typography variant="h6" sx={{ mb: 1 }}>Download Failed</Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                Please try again
              </Typography>
            </>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default DownloadProgressDialog;
