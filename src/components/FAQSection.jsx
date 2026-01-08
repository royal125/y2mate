import React from "react";
import { Box, Container, Typography } from "@mui/material";

const faqs = [
  {
    q: "Where do my downloads go?",
    a: "On desktop, files land in your default Downloads folder. On mobile, check your browser downloads or Files app.",
  },
  {
    q: "Is my link history stored?",
    a: "No. Links are processed in real time and cleared from cache after the download link is generated.",
  },
  {
    q: "Why is the download slow?",
    a: "Network congestion, ISP throttling, or platform rate limits can slow downloads. Try another Wi‑Fi or browser.",
  },
  {
    q: "Can I download in MP3 too?",
    a: "Yes. Use the MP3 tab or MP4 → MP3 converter for audio‑only downloads.",
  },
  {
    q: "Do I need to sign up?",
    a: "No signup required. Paste a link and download instantly.",
  },
];

const FAQSection = () => {
  return (
    <Box className="faq-section">
      <Container maxWidth="md">
        <Typography variant="h4" className="section-title" textAlign="center" mb={4}>
          Frequently Asked Questions
        </Typography>
        <Box className="faq-list">
          {faqs.map((item) => (
            <Box key={item.q} className="faq-item">
              <Typography variant="h6">{item.q}</Typography>
              <Typography className="faq-answer">{item.a}</Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default FAQSection;
