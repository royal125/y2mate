// src/components/Footer.jsx
import React from "react";
import { Box, Container, Typography } from "@mui/material";
import { FaFacebookF, FaInstagram, FaTiktok, FaYoutube, FaXTwitter } from "react-icons/fa6";

const Footer = () => (
  <Box className="footer">
    <Container maxWidth="md">
      <Box className="footer-brand">
        <Typography variant="h6">Y2Mate Studio</Typography>
        <Typography variant="body2">
          Fast downloads for YouTube, Instagram, Facebook, and MP3 conversion.
        </Typography>
      </Box>

      <Box className="footer-links">
        <a href="/">Video</a>
        <a href="/instagram">Instagram</a>
        <a href="/mp3">MP3</a>
        <a href="/facebook">Facebook</a>
        <a href="/about">About</a>
        <a href="/privacy">Privacy</a>
      </Box>

      <Box className="footer-social">
        <a href="/instagram" aria-label="Instagram" className="social insta">
          <FaInstagram />
        </a>
        <a href="/facebook" aria-label="Facebook" className="social fb">
          <FaFacebookF />
        </a>
        <a href="/" aria-label="YouTube" className="social yt">
          <FaYoutube />
        </a>
        <a href="/" aria-label="X" className="social x">
          <FaXTwitter />
        </a>
        <a href="/" aria-label="TikTok" className="social tt">
          <FaTiktok />
        </a>
      </Box>

      <Typography variant="body2" className="footer-copy">
        © 2025 Y2Mate Studio. All rights reserved.
      </Typography>
    </Container>
  </Box>
);

export default Footer;
