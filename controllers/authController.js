const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// In-memory storage for demo purposes (bypass MongoDB for lab testing)
let users = [];

async function register(req, res) {
  try {
    const { username, password, role } = req.body;

    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      id: Date.now().toString(),
      username,
      password: hashedPassword,
      role: role || "user"
    };
    
    // For lab testing: make username containing "admin" an admin
    if (username.toLowerCase().includes("admin")) {
      user.role = "admin";
    }
    
    users.push(user);

    res.status(201).json({
      id: user.id,
      username: user.username,
      role: user.role
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function login(req, res) {
  try {
    const { username, password } = req.body;

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

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  register,
  login
};
