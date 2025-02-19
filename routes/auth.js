const express = require('express');
const bcrypt = require('bcryptjs'); // For password hashing
const User = require('../models/user'); // Ensure this model exists
const router = express.Router();

// ✅ SIGNUP Route (New User Registration)
router.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // 🔹 Check if the user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ error: "User already exists. Please log in." });
        }

        // 🔹 Hash the password before saving it
        const hashedPassword = await bcrypt.hash(password, 10);

        // 🔹 Create a new user and save it in MongoDB
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully! Please log in." });
    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
// ✅ LOGIN Route (Existing User Login)
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 🔹 Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: "User not found. Please sign up first." });
        }

        // 🔹 Compare entered password with stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        res.json({ message: "Login successful!" });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
