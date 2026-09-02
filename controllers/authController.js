const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// In-memory storage for demo purposes (fallback when DB is unavailable)
let users = [];

async function register(req, res) {
  try {
    const { username, password } = req.body;

    // Try MongoDB first
    try {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        username,
        password: hashedPassword
      });

      return res.status(201).json({
        id: user._id,
        username: user.username,
        role: user.role
      });
    } catch (dbError) {
      // Fallback to in-memory storage if DB fails
      console.warn("MongoDB unavailable, using in-memory storage:", dbError.message);
      
      const existingUser = users.find(u => u.username === username);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = {
        id: Date.now().toString(),
        username,
        password: hashedPassword,
        role: "user"
      };
      users.push(user);

      return res.status(201).json({
        id: user.id,
        username: user.username,
        role: user.role
      });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function login(req, res) {
  try {
    const { username, password } = req.body;

    // Try MongoDB first
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials." });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials." });
      }

      const token = jwt.sign(
        { id: user._id, username: user.username, role: user.role },
        process.env.JWT_SECRET || "fallback_secret",
        { expiresIn: "1h" }
      );

      return res.status(200).json({ token });
    } catch (dbError) {
      // Fallback to in-memory storage if DB fails
      console.warn("MongoDB unavailable, using in-memory storage:", dbError.message);
      
      const user = users.find(u => u.username === username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials." });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials." });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET || "fallback_secret",
        { expiresIn: "1h" }
      );

      return res.status(200).json({ token });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  register,
  login
};
