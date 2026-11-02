const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async function auth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: "Please log in first." });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select("-passwordHash");
    if (!req.user) return res.status(401).json({ message: "Account not found." });
    next();
  } catch (_error) {
    return res.status(401).json({ message: "Your session is invalid or has expired." });
  }
};
