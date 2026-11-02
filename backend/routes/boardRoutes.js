const router = require("express").Router();
const Board = require("../models/Board");
const auth = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
  try { res.json({ boards: await Board.find({ owner: req.user._id }).sort({ createdAt: -1 }) }); }
  catch (error) { res.status(500).json({ message: "Could not load boards.", detail: error.message }); }
});
router.post("/", auth, async (req, res) => {
  try {
    const title = (req.body.title || "").trim();
    if (!title) return res.status(400).json({ message: "Board title is required." });
    const board = await Board.create({ owner: req.user._id, title, description: req.body.description || "" });
    res.status(201).json({ board });
  } catch (error) { res.status(500).json({ message: "Could not create board.", detail: error.message }); }
});
module.exports = router;
