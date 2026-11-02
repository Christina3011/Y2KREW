const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

function makeToken(userId) {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not configured.");
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).json({ message: "All fields are required." });
    if (password.length < 8) return res.status(400).json({ message: "Password must be at least 8 characters." });
    const exists = await User.findOne({ $or: [{ email: email.toLowerCase() }, { username }] });
    if (exists) return res.status(409).json({ message: "Email or username is already in use." });
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ username, email, passwordHash });
    res.status(201).json({ token: makeToken(user._id), user: { id: user._id, username: user.username, email: user.email } });
  } catch (error) { res.status(500).json({ message: "Could not create account.", detail: error.message }); }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: (email || "").toLowerCase() });
    if (!user || !(await bcrypt.compare(password || "", user.passwordHash))) {
      return res.status(401).json({ message: "Email or password is incorrect." });
    }
    res.json({ token: makeToken(user._id), user: { id: user._id, username: user.username, email: user.email } });
  } catch (error) { res.status(500).json({ message: "Could not log in.", detail: error.message }); }
});
module.exports = router;
