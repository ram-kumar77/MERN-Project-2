const express = require("express");
const router = express.Router();
const User = require("../models/userModel");

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const user = await User.findOne({ username, password });
    
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: "Login failed", error: error.message });
  }
});

module.exports = router;