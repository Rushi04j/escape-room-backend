const express = require('express');
const User = require('../models/user');
const generateGuestId = require('../utils/guestIdGenerator');
const router = express.Router();

// Guest Signup Route
router.post('/guest/signup', async (req, res) => {
    try {
        // Generate a unique guest ID
        const guestId = generateGuestId();

        // Check if a guest user with the same ID already exists (unlikely but possible)
        const existingGuest = await User.findOne({ guestId });
        if (existingGuest) {
            return res.status(409).json({ error: 'Guest ID already exists. Please try again.' });
        }

        // Create a new guest user
        const guestUser = new User({
            guestId,
            role: 'guest',
        });

        // Save the guest user to the database
        await guestUser.save();

        // Return the guest ID to the client
        res.status(201).json({ 
            message: 'Guest user created successfully',
            guestId,
        });
    } catch (err) {
        console.error('Error creating guest user:', err);
        res.status(500).json({ error: 'An error occurred while creating the guest user.' });
    }
});

module.exports = router;