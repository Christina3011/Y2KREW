const router = require("express").Router();
const Capsule = require("../models/Capsule");
const auth = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
  try {
    const capsules = await Capsule.find({ owner: req.user._id }).sort({ unlockAt: 1 });
    const now = new Date();
    const safeCapsules = capsules.map((capsule) => {
      const item = capsule.toObject();
      if (new Date(item.unlockAt) > now) delete item.content;
      return item;
    });
    res.json({ capsules: safeCapsules });
  } catch (error) { res.status(500).json({ message: "Could not load capsules.", detail: error.message }); }
});

router.post("/", auth, async (req, res) => {
  try {
    const { title, content, unlockAt } = req.body;
    const date = new Date(unlockAt);
    if (!title || !content || !unlockAt || Number.isNaN(date.getTime())) {
      return res.status(400).json({ message: "Title, content and a valid unlock date are required." });
    }
    if (date <= new Date()) return res.status(400).json({ message: "Choose a future unlock date." });
    const capsule = await Capsule.create({ owner: req.user._id, title, content, unlockAt: date });
    const safeCapsule = capsule.toObject();
    delete safeCapsule.content;
    res.status(201).json({ capsule: safeCapsule });
  } catch (error) { res.status(500).json({ message: "Could not seal capsule.", detail: error.message }); }
});
module.exports = router;
