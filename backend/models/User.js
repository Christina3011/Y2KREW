const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true, minlength: 3 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  bio: { type: String, default: "living in my own little world" },
  avatarUrl: { type: String, default: "" },
  profilePicture: { type: String, default: "" },
  coverImage: { type: String, default: "" },
  displayName: { type: String, default: "" },
  wallpaper: {
    type: String,
    enum: ["leopard-beige", "leopard-glitter", "leopard-pink", "pixel-hearts", "chrome-stars", "purple-stars", "pink-waves"],
    default: "leopard-beige"
  },
  accentColor: { type: String, default: "#ff3ea5" },
  favouriteMusic: { type: String, default: "" },
  interests: [{ type: String, trim: true, maxlength: 30 }],
  stickers: [{ type: String, enum: ["star", "heart", "butterfly"] }],
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
}, { timestamps: true });
module.exports = mongoose.model("User", userSchema);
