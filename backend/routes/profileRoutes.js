const router = require("express").Router();
const User = require("../models/User");
const auth = require("../middleware/auth");

const WALLPAPERS = new Set([
  "leopard-beige",
  "leopard-glitter",
  "leopard-pink",
  "pixel-hearts",
  "chrome-stars",
  "purple-stars",
  "pink-waves"
]);
const STICKERS = new Set(["star", "heart", "butterfly"]);
const IMAGE_DATA_URL = /^data:image\/(?:jpeg|png|webp|gif);base64,[A-Za-z0-9+/]+={0,2}$/;
const IMAGE_MAX_LENGTH = 1_500_000;

function isValidImage(value) {
  return value === "" || (
    typeof value === "string" &&
    value.length <= IMAGE_MAX_LENGTH &&
    IMAGE_DATA_URL.test(value)
  );
}

router.get("/me", auth, (req, res) => {
  res.json({ user: req.user });
});

router.patch("/me", auth, async (req, res) => {
  if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
    return res.status(400).json({ message: "Profile details must be sent as an object." });
  }
  const {
    username, displayName, bio, favouriteMusic, interests, wallpaper,
    accentColor, profilePicture, coverImage, stickers
  } = req.body;

  if (username !== undefined && (typeof username !== "string" || username.trim().length < 3 || username.trim().length > 24)) {
    return res.status(400).json({ message: "Username must be between 3 and 24 characters." });
  }
  if (displayName !== undefined && (typeof displayName !== "string" || displayName.trim().length > 32)) {
    return res.status(400).json({ message: "Display name must be 32 characters or fewer." });
  }
  if (bio !== undefined && (typeof bio !== "string" || bio.length > 180)) {
    return res.status(400).json({ message: "Bio must be 180 characters or fewer." });
  }
  if (favouriteMusic !== undefined && (typeof favouriteMusic !== "string" || favouriteMusic.length > 80)) {
    return res.status(400).json({ message: "Favourite music must be 80 characters or fewer." });
  }
  if (interests !== undefined && (
    !Array.isArray(interests) ||
    interests.length > 10 ||
    interests.some((interest) => typeof interest !== "string" || interest.trim().length > 30)
  )) {
    return res.status(400).json({ message: "Add up to 10 interests, each 30 characters or fewer." });
  }
  if (wallpaper !== undefined && !WALLPAPERS.has(wallpaper)) {
    return res.status(400).json({ message: "Choose one of the available wallpapers." });
  }
  if (accentColor !== undefined && (typeof accentColor !== "string" || !/^#[0-9a-fA-F]{6}$/.test(accentColor))) {
    return res.status(400).json({ message: "Choose a valid accent colour." });
  }
  if (profilePicture !== undefined && !isValidImage(profilePicture)) {
    return res.status(400).json({ message: "Profile pictures must be JPEG, PNG, GIF or WEBP images under 1 MB." });
  }
  if (coverImage !== undefined && !isValidImage(coverImage)) {
    return res.status(400).json({ message: "Cover images must be JPEG, PNG, GIF or WEBP images under 1 MB." });
  }
  if (profilePicture && coverImage && profilePicture.length + coverImage.length > 2_500_000) {
    return res.status(400).json({ message: "The combined image uploads are too large. Try smaller images." });
  }
  if (stickers !== undefined && (
    !Array.isArray(stickers) ||
    stickers.length > STICKERS.size ||
    stickers.some((sticker) => !STICKERS.has(sticker))
  )) {
    return res.status(400).json({ message: "Choose from the available star, heart and butterfly stickers." });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "Account not found." });

    if (username !== undefined) user.username = username.trim();
    if (displayName !== undefined) user.displayName = displayName.trim();
    if (bio !== undefined) user.bio = bio.trim();
    if (favouriteMusic !== undefined) user.favouriteMusic = favouriteMusic.trim();
    if (interests !== undefined) user.interests = interests.map((interest) => interest.trim()).filter(Boolean);
    if (wallpaper !== undefined) user.wallpaper = wallpaper;
    if (accentColor !== undefined) user.accentColor = accentColor;
    if (profilePicture !== undefined) user.profilePicture = profilePicture;
    if (coverImage !== undefined) user.coverImage = coverImage;
    if (stickers !== undefined) user.stickers = stickers;

    await user.save();
    const savedUser = user.toObject();
    delete savedUser.passwordHash;
    res.json({ user: savedUser });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: "That username is already in use." });
    res.status(500).json({ message: "Could not save your profile.", detail: error.message });
  }
});

module.exports = router;
