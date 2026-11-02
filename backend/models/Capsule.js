const mongoose = require("mongoose");
const capsuleSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true, trim: true, maxlength: 100 },
  content: { type: String, required: true, maxlength: 10000 },
  unlockAt: { type: Date, required: true },
  openedAt: { type: Date, default: null }
}, { timestamps: true });
module.exports = mongoose.model("Capsule", capsuleSchema);
