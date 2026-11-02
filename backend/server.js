require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const app = express();
app.use(cors());
app.use(express.json({ limit: "4mb" }));
app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/api/health", (_req, res) => res.json({ status: "ok", app: "Y2KREW" }));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/profile", require("./routes/profileRoutes"));
app.use("/api/posts", require("./routes/postRoutes"));
app.use("/api/boards", require("./routes/boardRoutes"));
app.use("/api/capsules", require("./routes/capsuleRoutes"));

app.get("*", (_req, res) => res.sendFile(path.join(__dirname, "../frontend/index.html")));

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Y2KREW is running at http://localhost:${PORT}`));
}).catch((error) => {
  console.error("Could not start because the database connection failed:", error.message);
  process.exit(1);
});
