const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');

// Load environment variables
dotenv.config();

// Validate environment variables
if (!process.env.MONGO_URI) {
    console.error("Error: MONGO_URI is missing in .env file.");
    process.exit(1);  // Exit the process if MongoDB URI is missing
}

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB connected successfully!'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});

// Graceful shutdown on unexpected errors
process.on("uncaughtException", (err) => {
    console.error("💥 Uncaught Exception:", err);
    process.exit(1);
});

process.on("unhandledRejection", (err) => {
    console.error("🔥 Unhandled Promise Rejection:", err);
    process.exit(1);
});
app.get('/', (req, res) => {
    res.send('Server is running!');
});


