const profileForm = document.querySelector("#profileForm");
const profileMessage = document.querySelector("#profileMessage");
const preview = document.querySelector("#profilePreview");
const wallpaperNames = ["leopard-beige", "leopard-glitter", "leopard-pink", "pixel-hearts", "chrome-stars", "purple-stars", "pink-waves"];
const stickerIcons = { star: "✦", heart: "♡", butterfly: "୨୧" };
let savedProfile;

if (profileForm) {
  if (!getToken()) {
    window.location.href = "/pages/login.html";
  } else {
    setEditorEnabled(false);
    loadProfile();
  }

  document.querySelectorAll(".wallpaper-option").forEach((option) => {
    option.addEventListener("click", () => {
      selectWallpaper(option.dataset.wallpaper);
      updateDraftFromForm();
    });
  });

  document.querySelectorAll(".accent-swatch").forEach((swatch) => {
    swatch.addEventListener("click", () => setAccent(swatch.dataset.color));
  });

  document.querySelector("#accentColor").addEventListener("input", (event) => {
    setAccent(event.target.value);
  });

  profileForm.querySelectorAll("input:not([type=file]):not([type=checkbox]), textarea").forEach((field) => {
    field.addEventListener("input", updateDraftFromForm);
  });

  profileForm.querySelectorAll('input[name="stickers"]').forEach((field) => {
    field.addEventListener("change", updateDraftFromForm);
  });

  document.querySelector("#profilePicture").addEventListener("change", (event) => handleImageUpload(event, "profilePicture"));
  document.querySelector("#coverImage").addEventListener("change", (event) => handleImageUpload(event, "coverImage"));
  document.querySelector("#removeProfilePicture").addEventListener("click", () => removeImage("profilePicture"));
  document.querySelector("#removeCoverImage").addEventListener("click", () => removeImage("coverImage"));

  document.querySelector("#resetProfile").addEventListener("click", () => {
    if (savedProfile) {
      applyProfile(savedProfile);
      profileMessage.textContent = "Your unsaved edits were reset. ♡";
    }
  });

  profileForm.addEventListener("submit", saveProfile);
}

async function loadProfile() {
  profileMessage.textContent = "Loading your space…";
  try {
    const data = await apiRequest("/profile/me");
    savedProfile = data.user;
    applyProfile(savedProfile);
    setEditorEnabled(true);
    profileMessage.textContent = "";
  } catch (error) {
    profileMessage.textContent = error.message;
    if (error.message.includes("session") || error.message.includes("log in")) {
      localStorage.removeItem("y2krew_token");
      window.location.href = "/pages/login.html";
    }
  }
}

function applyProfile(user) {
  const picture = user.profilePicture || user.avatarUrl || "";
  profilePreviewPicture = user.profilePicture || "";
  profilePreviewCover = user.coverImage || "";
  document.querySelector("#username").value = user.username || "";
  document.querySelector("#displayName").value = user.displayName || "";
  document.querySelector("#bio").value = user.bio || "";
  document.querySelector("#favouriteMusic").value = user.favouriteMusic || "";
  document.querySelector("#interests").value = (user.interests || []).join(", ");
  document.querySelector("#profilePicture").value = "";
  document.querySelector("#coverImage").value = "";
  profileForm.querySelectorAll('input[name="stickers"]').forEach((field) => {
    field.checked = (user.stickers || []).includes(field.value);
  });
  selectWallpaper(user.wallpaper || "leopard-beige");
  setAccent(user.accentColor || "#ff3ea5");
  updatePreview({
    ...user,
    profilePicture: picture,
    interests: user.interests || [],
    stickers: user.stickers || []
  });
}

function updateDraftFromForm() {
  const user = {
    username: document.querySelector("#username").value.trim(),
    displayName: document.querySelector("#displayName").value.trim(),
    bio: document.querySelector("#bio").value,
    favouriteMusic: document.querySelector("#favouriteMusic").value,
    interests: parseInterests(),
    wallpaper: document.querySelector(".wallpaper-option.is-selected")?.dataset.wallpaper || "leopard-beige",
    accentColor: document.querySelector("#accentColor").value,
    profilePicture: profilePreviewPicture,
    coverImage: profilePreviewCover,
    stickers: Array.from(profileForm.querySelectorAll('input[name="stickers"]:checked'), (field) => field.value)
  };
  updatePreview(user);
}

let profilePreviewPicture = null;
let profilePreviewCover = null;

function updatePreview(user) {
  const savedPicture = user.profilePicture || user.avatarUrl || "";
  const picture = profilePreviewPicture === null ? savedPicture : profilePreviewPicture;
  const cover = profilePreviewCover === null ? user.coverImage || "" : profilePreviewCover;
  const classes = wallpaperNames.map((name) => `wallpaper--${name}`);
  preview.classList.remove(...classes);
  preview.classList.add(`wallpaper--${user.wallpaper || "leopard-beige"}`);
  preview.style.setProperty("--accent", user.accentColor || "#ff3ea5");
  document.querySelector("#previewDisplayName").textContent = user.displayName || user.username || "Your display name";
  document.querySelector("#previewUsername").textContent = `@${user.username || "your_username"}`;
  document.querySelector("#previewBio").textContent = user.bio || "Your bio will live right here ✧";
  document.querySelector("#previewMusic").textContent = user.favouriteMusic || "Your favourite music";
  document.querySelector("#previewInterests").textContent = (user.interests || []).join(" · ") || "Your interests";

  const avatar = document.querySelector("#previewAvatar");
  const fallback = document.querySelector("#previewAvatarFallback");
  if (picture) avatar.src = picture;
  else avatar.removeAttribute("src");
  avatar.style.display = picture ? "block" : "none";
  fallback.style.display = picture ? "none" : "block";

  const coverImage = document.querySelector("#previewCover");
  if (cover) coverImage.src = cover;
  else coverImage.removeAttribute("src");
  coverImage.style.display = cover ? "block" : "none";
  document.querySelector("#previewStickers").textContent = (user.stickers || []).map((sticker) => stickerIcons[sticker]).filter(Boolean).join(" ");
}

function selectWallpaper(wallpaper) {
  document.querySelectorAll(".wallpaper-option").forEach((option) => {
    const selected = option.dataset.wallpaper === wallpaper;
    option.classList.toggle("is-selected", selected);
    option.setAttribute("aria-pressed", String(selected));
  });
}

function setAccent(color) {
  document.querySelector("#accentColor").value = color;
  document.querySelectorAll(".accent-swatch").forEach((swatch) => {
    const selected = swatch.dataset.color.toLowerCase() === color.toLowerCase();
    swatch.classList.toggle("is-selected", selected);
    swatch.setAttribute("aria-pressed", String(selected));
  });
  updateDraftFromForm();
}

async function handleImageUpload(event, field) {
  const fileInput = event.currentTarget;
  const file = fileInput.files[0];
  if (!file) return;
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowedTypes.includes(file.type) || file.size > 1_000_000) {
    fileInput.value = "";
    profileMessage.textContent = "Choose a JPEG, PNG, GIF or WEBP image under 1 MB.";
    return;
  }

  try {
    const dataUrl = await readImage(file);
    if (field === "profilePicture") profilePreviewPicture = dataUrl;
    else profilePreviewCover = dataUrl;
    updateDraftFromForm();
    profileMessage.textContent = "Image preview updated — save to keep it. ✧";
  } catch (error) {
    profileMessage.textContent = error.message;
  }
}

function removeImage(field) {
  const isProfilePicture = field === "profilePicture";
  if (isProfilePicture) {
    profilePreviewPicture = "";
    document.querySelector("#profilePicture").value = "";
  } else {
    profilePreviewCover = "";
    document.querySelector("#coverImage").value = "";
  }
  updateDraftFromForm();
  profileMessage.textContent = "Image removed from the preview — save to keep this change. ✧";
}

function parseInterests() {
  return document.querySelector("#interests").value.split(",").map((interest) => interest.trim()).filter(Boolean);
}

function setEditorEnabled(enabled) {
  profileForm.querySelectorAll("input, textarea, button").forEach((control) => {
    control.disabled = !enabled;
  });
}

function readImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      if (typeof reader.result === "string") resolve(reader.result);
      else reject(new Error("Could not preview this image."));
    });
    reader.addEventListener("error", () => reject(new Error("Could not read this image.")));
    reader.readAsDataURL(file);
  });
}

async function saveProfile(event) {
  event.preventDefault();
  if (!savedProfile) {
    profileMessage.textContent = "Your saved profile hasn't loaded yet. Please wait or reload the page.";
    return;
  }
  const interests = parseInterests();
  if (interests.length > 10) {
    profileMessage.textContent = "Choose up to 10 interests, separated by commas.";
    return;
  }
  const saveButton = profileForm.querySelector('button[type="submit"]');
  saveButton.disabled = true;
  profileMessage.textContent = "Saving your space…";
  const user = {
    username: document.querySelector("#username").value.trim(),
    displayName: document.querySelector("#displayName").value.trim(),
    bio: document.querySelector("#bio").value.trim(),
    favouriteMusic: document.querySelector("#favouriteMusic").value.trim(),
    interests,
    wallpaper: document.querySelector(".wallpaper-option.is-selected")?.dataset.wallpaper || "leopard-beige",
    accentColor: document.querySelector("#accentColor").value,
    profilePicture: profilePreviewPicture === null ? savedProfile.profilePicture || "" : profilePreviewPicture,
    coverImage: profilePreviewCover === null ? savedProfile.coverImage || "" : profilePreviewCover,
    stickers: Array.from(profileForm.querySelectorAll('input[name="stickers"]:checked'), (field) => field.value)
  };

  try {
    const data = await apiRequest("/profile/me", { method: "PATCH", body: JSON.stringify(user) });
    savedProfile = data.user;
    applyProfile(savedProfile);
    profileMessage.textContent = "Your space is saved — looking cute! ♡";
  } catch (error) {
    profileMessage.textContent = error.message;
  } finally {
    saveButton.disabled = false;
  }
}
