import { Container, Typography, Box } from "@mui/material";

export default function Privacy() {
  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
        Privacy & Cookie Policy
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
          📋 Cookies Used
        </Typography>
        <Typography>
          We use cookies to:
        </Typography>
        <ul>
          <li>Track user consent preferences</li>
          <li>Improve website experience</li>
          <li>Remember user settings</li>
        </ul>
      </Box>

      <Box>
        <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
          📞 Contact
        </Typography>
        <Typography>
          Questions? Email us at support@savefrom.in
        </Typography>
      </Box>
    </Container>
  );
}
