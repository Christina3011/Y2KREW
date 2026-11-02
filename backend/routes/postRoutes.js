const router = require("express").Router();
const Post = require("../models/Post");
const auth = require("../middleware/auth");

router.get("/", async (_req, res) => {
  try {
    const posts = await Post.find().populate("author", "username avatarUrl").sort({ createdAt: -1 }).limit(30);
    res.json({ posts });
  } catch (error) { res.status(500).json({ message: "Could not load posts.", detail: error.message }); }
});

router.post("/", auth, async (req, res) => {
  try {
    const content = (req.body.content || "").trim();
    if (!content) return res.status(400).json({ message: "Post content cannot be empty." });
    const post = await Post.create({ author: req.user._id, content });
    await post.populate("author", "username avatarUrl");
    res.status(201).json({ post });
  } catch (error) { res.status(500).json({ message: "Could not create post.", detail: error.message }); }
});
module.exports = router;
