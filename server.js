// Import required modules
const express = require("express");
const http = require("http");
const SOCKET = require("./socket"); 
const SUPERBASE = require('./supabase'); // Import upload middleware and handler
const cors = require("cors");// Import CORS

// Initialize Express
const app = express();

// CORS middleware for Express
app.use(
  cors({
    origin: "*", // Allow all origins
    methods: ["GET", "POST"],
    credentials: false, // Set to false if you don't need credentials
  })
);

// Create an HTTP server
const server = http.createServer(app);


// Initialize Socket.io on the server
SOCKET.setupSocket(server);

SUPERBASE.deleteAllFilesFromSupabase()

// Start the server on port 3001
server.listen(3001, () => {
  console.log("Server is running on http://localhost:3001");
});
