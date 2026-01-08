# Add this to your backend server.py or main backend file

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS configuration for Netlify frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-netlify-app.netlify.app",  # Replace with your Netlify URL
        "https://savefrom.in",  # Your domain
        "http://localhost:3000"  # For local development
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Your existing routes...