import React from "react";
import { Container, Box, Typography, Button, Grid, Card, CardContent } from "@mui/material";
import { motion } from "framer-motion";
import { Users, Leaf, Zap, Globe } from "lucide-react";

const MotionBox = motion(Box);
const MotionCard = motion(Card);

export default function AboutUs() {
  const features = [
    {
      icon: <Users size={40} />,
      title: "Complete Independence 2 u",
      description: "Save content independently without relying on third-party apps or subscriptions",
      color: "#FF6B6B",
    },
    {
      icon: <Leaf size={40} />,
      title: "Eco-Friendly",
      description: "Reduce digital pollution by downloading once instead of streaming repeatedly",
      color: "#4CAF50",
    },
    {
      icon: <Zap size={40} />,
      title: "Energy Efficient",
      description: "Lower bandwidth usage = reduced carbon footprint for our planet",
      color: "#FFE66D",
    },
    {
      icon: <Globe size={40} />,
      title: "Worldwide Access",
      description: "Access your favorite content offline, anywhere, anytime",
      color: "#4ECDC4",
    },
  ];

  const missions = [
    {
      icon: "🎯",
      title: "Independence First",
      points: [
        "No subscriptions needed",
        "No tracking or data collection",
        "Own your content",
        "Full control over your downloads",
      ],
    },
    {
      icon: "🌍",
      title: "Save Our Planet",
      points: [
        "Reduce streaming energy consumption",
        "Lower carbon emissions",
        "Sustainable digital practices",
        "Eco-conscious technology",
      ],
    },
  ];

  const stats = [
    { number: "1M+", label: "Users Empowered" },
    { number: "50+", label: "Supported Platforms" },
    { number: "500GB+", label: "Content Saved" },
    { number: "40%", label: "Energy Reduction" },
  ];

  return (
    <Box sx={{ overflow: "hidden", backgroundColor: "#fff", display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #2d5016 0%, #1e3a0f 100%)",
          color: "white",
          py: { xs: 6, md: 12 },
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Container maxWidth="md">
          <MotionBox
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
          >
            <Typography
              variant="h2"
              sx={{
                fontWeight: "bold",
                mb: 2,
                fontSize: { xs: "2rem", sm: "2.5rem", md: "3.5rem" },
                textAlign: "center",
              }}
            >
              🌿 SaveFrom.in
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontSize: { xs: "1rem", md: "1.3rem" },
                mb: 1,
                opacity: 0.95,
                fontWeight: 500,
                textAlign: "center",
                maxWidth: "90%",
                mx: "auto",
              }}
            >
              Independence. Sustainability. Freedom.
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: "0.95rem", md: "1.1rem" },
                mb: 4,
                opacity: 0.85,
                textAlign: "center",
                maxWidth: "90%",
                mx: "auto",
              }}
            >
              Download videos freely, save the environment, and gain complete independence
            </Typography>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#4CAF50",
                color: "white",
                fontWeight: "bold",
                px: { xs: 3, md: 4 },
                py: { xs: 1, md: 1.5 },
                fontSize: { xs: "0.9rem", md: "1rem" },
                "&:hover": {
                  backgroundColor: "#45a049",
                  transform: "scale(1.05)",
                  transition: "all 0.3s ease",
                },
              }}
            >
              Start Your Journey
            </Button>
          </MotionBox>
        </Container>
      </Box>

      {/* Mission Statement */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 }, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <MotionBox
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          sx={{ textAlign: "center", mb: { xs: 4, md: 8 }, maxWidth: "800px", width: "100%" }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: "bold",
              mb: 3,
              color: "#1e3a0f",
              fontSize: { xs: "1.8rem", md: "2.5rem" },
              textAlign: "center",
            }}
          >
            Our Mission & Vision
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "#4CAF50",
              fontSize: { xs: "1rem", md: "1.3rem" },
              fontWeight: 500,
              mb: 3,
              lineHeight: 1.8,
              textAlign: "center",
              px: { xs: 2, md: 0 },
            }}
          >
            To empower people with complete independence in managing their digital content while actively contributing to environmental sustainability through energy-efficient solutions.
          </Typography>
        </MotionBox>

        {/* Two Pillar Section */}
        <Grid 
          container 
          spacing={3} 
          sx={{ 
            mb: { xs: 4, md: 6 }, 
            justifyContent: "center",
            maxWidth: "1200px",
            width: "100%",
            mx: "auto"
          }}
        >
          {missions.map((mission, index) => (
            <Grid item xs={12} sm={10} md={6} lg={5} key={index}>
              <MotionCard
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                sx={{
                  height: "100%",
                  p: { xs: 3, md: 4 },
                  borderRadius: "12px",
                  border: "2px solid #4CAF50",
                  backgroundColor: index === 0 ? "#f0f7f0" : "#f9f9f9",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  mx: "auto",
                  maxWidth: "500px",
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: "bold",
                    mb: 3,
                    fontSize: { xs: "1.5rem", md: "2rem" },
                    textAlign: "center",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2,
                  }}
                >
                  <span>{mission.icon}</span>
                  <span>{mission.title}</span>
                </Typography>
                <Box component="ul" sx={{ 
                  pl: 0, 
                  textAlign: "left",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "100%",
                  maxWidth: "400px"
                }}>
                  {mission.points.map((point, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        mb: 2,
                        width: "100%",
                        maxWidth: "350px",
                      }}
                    >
                      <Box sx={{ mr: 2, flexShrink: 0, mt: 0.5 }}>✅</Box>
                      <Typography
                        component="span"
                        sx={{
                          color: "#333",
                          fontSize: { xs: "0.95rem", md: "1.05rem" },
                          textAlign: "left",
                          flex: 1,
                        }}
                      >
                        {point}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </MotionCard>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Stats Section */}
      <Box sx={{ 
        backgroundColor: "#e8f5e9", 
        py: { xs: 6, md: 8 },
        width: "100%",
        display: "flex",
        justifyContent: "center"
      }}>
        <Container maxWidth="lg" sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <MotionBox
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            sx={{ textAlign: "center", mb: { xs: 4, md: 6 }, width: "100%" }}
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: "bold",
                color: "#1e3a0f",
                fontSize: { xs: "1.8rem", md: "2.5rem" },
                textAlign: "center",
              }}
            >
              Our Impact
            </Typography>
          </MotionBox>

          <Grid container spacing={2} justifyContent="center" sx={{ maxWidth: "900px", width: "100%" }}>
            {stats.map((stat, index) => (
              <Grid item xs={6} sm={3} key={index} sx={{ display: "flex", justifyContent: "center" }}>
                <MotionBox
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  sx={{
                    textAlign: "center",
                    p: { xs: 2, md: 3 },
                    backgroundColor: "white",
                    borderRadius: "10px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                    width: "100%",
                    maxWidth: "200px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: "bold",
                      color: "#4CAF50",
                      mb: 1,
                      fontSize: { xs: "1.5rem", md: "2rem" },
                    }}
                  >
                    {stat.number}
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    color: "#666", 
                    fontSize: { xs: "0.85rem", md: "1rem" },
                    textAlign: "center"
                  }}>
                    {stat.label}
                  </Typography>
                </MotionBox>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ 
        py: { xs: 6, md: 10 }, 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center" 
      }}>
        <MotionBox
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          sx={{ 
            textAlign: "center", 
            mb: { xs: 4, md: 6 },
            maxWidth: "800px",
            width: "100%"
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: "bold",
              mb: 2,
              color: "#333",
              fontSize: { xs: "1.8rem", md: "2.5rem" },
              textAlign: "center",
            }}
          >
            Why Choose SaveFrom.in?
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#666",
              fontSize: { xs: "0.95rem", md: "1.1rem" },
              textAlign: "center",
              maxWidth: "600px",
              mx: "auto",
            }}
          >
            Independence, sustainability, and freedom combined
          </Typography>
        </MotionBox>

        <Grid container spacing={3} justifyContent="center" sx={{ maxWidth: "1200px", width: "100%" }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index} sx={{ display: "flex", justifyContent: "center" }}>
              <MotionCard
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                viewport={{ once: true }}
                sx={{
                  height: "100%",
                  textAlign: "center",
                  p: { xs: 2, md: 3 },
                  border: "none",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  borderRadius: "12px",
                  transition: "all 0.3s ease",
                  backgroundColor: "#fff",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "100%",
                  maxWidth: "280px",
                  "&:hover": {
                    transform: "translateY(-10px)",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                    borderTop: `4px solid ${feature.color}`,
                  },
                }}
              >
                <CardContent sx={{ 
                  p: { xs: 1, md: 2 },
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "100%"
                }}>
                  <Box
                    sx={{
                      color: feature.color,
                      mb: 2,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      mb: 1,
                      color: "#333",
                      fontSize: { xs: "1rem", md: "1.1rem" },
                      textAlign: "center",
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    color: "#666", 
                    fontSize: { xs: "0.85rem", md: "0.95rem" },
                    textAlign: "center",
                    maxWidth: "240px"
                  }}>
                    {feature.description}
                  </Typography>
                </CardContent>
              </MotionCard>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Environmental Impact */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #4CAF50 0%, #2d5016 100%)",
          py: { xs: 6, md: 10 },
          color: "white",
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Container maxWidth="md" sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <MotionBox
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            sx={{ textAlign: "center", maxWidth: "800px", width: "100%" }}
          >
            <Typography variant="h3" sx={{ 
              fontWeight: "bold", 
              mb: 3, 
              fontSize: { xs: "1.8rem", md: "2.5rem" },
              textAlign: "center"
            }}>
              🌍 Saving the Environment
            </Typography>
            <Typography variant="body1" sx={{ 
              fontSize: { xs: "0.95rem", md: "1.1rem" }, 
              lineHeight: 1.8, 
              mb: 3,
              textAlign: "center",
              px: { xs: 2, md: 0 }
            }}>
              Every download through SaveFrom.in reduces streaming energy consumption. 
              Streaming video repeatedly consumes 10x more energy than downloading once. 
              By promoting offline content consumption, we're actively reducing our digital carbon footprint.
            </Typography>
            <Typography variant="h6" sx={{ 
              opacity: 0.9, 
              fontSize: { xs: "0.9rem", md: "1rem" },
              textAlign: "center"
            }}>
              Join thousands of users making a difference for our planet ✅
            </Typography>
          </MotionBox>
        </Container>
      </Box>

      {/* Values Section */}
      <Container maxWidth="lg" sx={{ 
        py: { xs: 6, md: 10 },
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>
        <Grid container spacing={3} justifyContent="center" sx={{ maxWidth: "1000px", width: "100%" }}>
          {[
            { title: "🎯 Independent", desc: "No corporate control, user-first approach" },
            { title: "♻️ Sustainable", desc: "Eco-conscious technology & practices" },
            { title: "🔒 Secure", desc: "Your data is private, no tracking" },
            { title: "⚡ Fast", desc: "Lightning-quick downloads" },
            { title: "🆓 Free", desc: "100% free, forever" },
            { title: "🌐 Global", desc: "Supporting 50+ platforms worldwide" },
          ].map((value, index) => (
            <Grid item xs={12} sm={6} md={4} key={index} sx={{ display: "flex", justifyContent: "center" }}>
              <MotionBox
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                sx={{
                  p: { xs: 2, md: 3 },
                  textAlign: "center",
                  backgroundColor: "#f9f9f9",
                  borderRadius: "10px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                  width: "100%",
                  maxWidth: "300px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <Typography variant="h6" sx={{ 
                  fontWeight: "bold", 
                  mb: 1, 
                  fontSize: { xs: "1rem", md: "1.1rem" },
                  textAlign: "center"
                }}>
                  {value.title}
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: "#666", 
                  fontSize: { xs: "0.85rem", md: "0.95rem" },
                  textAlign: "center"
                }}>
                  {value.desc}
                </Typography>
              </MotionBox>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)",
          py: { xs: 6, md: 8 },
          textAlign: "center",
          color: "white",
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Container maxWidth="md">
          <MotionBox
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: "bold",
                mb: 3,
                fontSize: { xs: "1.8rem", md: "2.5rem" },
                textAlign: "center",
              }}
            >
              Ready to Be Independent?
            </Typography>
            <Typography variant="body1" sx={{ 
              mb: 3, 
              fontSize: { xs: "0.95rem", md: "1.1rem" },
              textAlign: "center",
              maxWidth: "600px",
              mx: "auto"
            }}>
              Download your content, support sustainability, and join the movement
            </Typography>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "white",
                color: "#4CAF50",
                fontWeight: "bold",
                px: { xs: 3, md: 5 },
                py: { xs: 1, md: 2 },
                fontSize: { xs: "0.9rem", md: "1.1rem" },
                "&:hover": {
                  transform: "scale(1.05)",
                  transition: "all 0.3s ease",
                },
              }}
            >
              Start Downloading Now
            </Button>
          </MotionBox>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ 
        backgroundColor: "#1e3a0f", 
        color: "white", 
        py: { xs: 4, md: 4 }, 
        textAlign: "center",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>
        <Typography variant="body2" sx={{ 
          fontSize: { xs: "0.85rem", md: "1rem" },
          textAlign: "center",
          maxWidth: "800px",
          px: 2
        }}>
          © 2025 SaveFrom.in - Independence. Sustainability. Freedom. | All Rights Reserved
        </Typography>
        <Typography variant="caption" sx={{ 
          display: "block", 
          mt: 1, 
          opacity: 0.8, 
          fontSize: { xs: "0.75rem", md: "0.9rem" },
          textAlign: "center"
        }}>
          Making the web independent, one download at a time 🌍
        </Typography>
      </Box>
    </Box>
  );
}