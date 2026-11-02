const mongoose = require("mongoose");
const boardSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true, trim: true, maxlength: 80 },
  description: { type: String, default: "" },
  visibility: { type: String, enum: ["private", "public"], default: "private" },
  items: [{ title: String, imageUrl: String, sourceUrl: String, note: String }]
}, { timestamps: true });
module.exports = mongoose.model("Board", boardSchema);
