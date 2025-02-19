const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Validate environment variables
if (!process.env.MONGO_URI) {
    console.error("❌ Error: MONGO_URI is missing in .env file.");
    process.exit(1);
}

// ✅ Initialize Express app
const app = express();

// ✅ Proper CORS setup (Move it here before routes)
app.use(cors({
    origin: ["https://escape-room-frontend-iota.vercel.app", "https://landingpage-hazel-mu.vercel.app"], // Allow both
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true
}));


// ✅ Middleware
app.use(express.json());

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB connected successfully!"))
    .catch(err => console.error("❌ MongoDB connection error:", err));

// ✅ Define Routes
app.use("/api/auth", require("./routes/auth"));

// ✅ Default route for testing
app.get("/", (req, res) => {
    res.send("🚀 Server is running!");
});

// ✅ Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});

// ✅ Graceful shutdown for errors
process.on("uncaughtException", (err) => {
    console.error("💥 Uncaught Exception:", err);
    process.exit(1);
});

process.on("unhandledRejection", (err) => {
    console.error("🔥 Unhandled Promise Rejection:", err);
    process.exit(1);
});
