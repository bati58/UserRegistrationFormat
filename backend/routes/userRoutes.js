const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST /register - Register a new user with validation
router.post('/register', async (req, res) => {
  console.log("📥 Received user:", req.body);
  try {
    const {
      name,
      age,
      email,
      phone,
      password,
      address,
      isActive,
      roles
    } = req.body;

    // Manual validation
    if (typeof name !== 'string') {
      return res.status(400).json({ error: 'Name must be a string' });
    }

    if (!Number.isInteger(age)) {
      return res.status(400).json({ error: 'Age must be an integer' });
    }

    const emailRegex = /^[\w.-]+@[\w.-]+\.\w{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Email format is invalid' });
    }

    const phoneRegex = /^\d+$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ error: 'Phone must contain only digits' });
    }

    if (
      !address ||
      typeof address.city !== 'string' ||
      typeof address.region !== 'string' ||
      typeof address.country !== 'string'
    ) {
      return res.status(400).json({ error: 'City, region, and country must be strings' });
    }

    if (!Array.isArray(roles) || roles.length === 0 || !roles.every(role => typeof role === 'string')) {
      return res.status(400).json({ error: 'Roles must be a non-empty array of strings' });
    }

    // Create and save user
    const user = new User({
      name,
      age,
      email,
      phone,
      password,
      address,
      isActive: !!isActive,
      roles
    });

    await user.save();
    console.log('✅ User registered:', user);
    res.status(201).json({ message: 'User registered', user });

  } catch (error) {
    console.error('❌ Registration error:', error.message);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// GET /users - Retrieve all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    console.log('✅ Users retrieved:', users.length);
    res.json(users);
  } catch (error) {
    console.error('❌ Fetch error:', error.message);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});


module.exports = router;
