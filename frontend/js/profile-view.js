const profileContent = document.querySelector("#profileContent");
const profileLoading = document.querySelector("#profileLoading");
const loginNeeded = document.querySelector("#loginNeeded");
const wallpaperNames = ["leopard-beige", "leopard-glitter", "leopard-pink", "pixel-hearts", "chrome-stars", "purple-stars", "pink-waves"];
const stickerIcons = { star: "✦", heart: "♡", butterfly: "୨୧" };

if (!getToken()) {
  showLoginMessage();
} else {
  loadMyProfile();
}

async function loadMyProfile() {
  try {
    const data = await apiRequest("/profile/me");
    renderProfile(data.user);
    profileLoading.hidden = true;
    profileContent.hidden = false;
  } catch (error) {
    profileLoading.textContent = error.message;
    if (error.message.includes("session") || error.message.includes("log in")) {
      localStorage.removeItem("y2krew_token");
      showLoginMessage();
    }
  }
}

function showLoginMessage() {
  profileLoading.hidden = true;
  loginNeeded.hidden = false;
}

function renderProfile(user) {
  const profile = document.querySelector("#publicProfile");
  wallpaperNames.forEach((name) => profile.classList.remove(`wallpaper--${name}`));
  profile.classList.add(`wallpaper--${user.wallpaper || "leopard-beige"}`);
  profile.style.setProperty("--accent", user.accentColor || "#ff3ea5");
  document.querySelector("#profileDisplayName").textContent = user.displayName || user.username;
  document.querySelector("#profileUsername").textContent = `@${user.username}`;
  document.querySelector("#profileBio").textContent = user.bio || "A little mystery, a lot of sparkle ✧";
  document.querySelector("#profileMusic").textContent = user.favouriteMusic || "Add your favourite soundtrack ✧";

  const avatarSrc = user.profilePicture || user.avatarUrl || "";
  const avatar = document.querySelector("#profileAvatar");
  if (avatarSrc) avatar.src = avatarSrc;
  else avatar.removeAttribute("src");
  avatar.style.display = avatarSrc ? "block" : "none";
  document.querySelector("#profileAvatarFallback").style.display = avatarSrc ? "none" : "block";

  const cover = document.querySelector("#profileCover");
  if (user.coverImage) cover.src = user.coverImage;
  else cover.removeAttribute("src");
  cover.style.display = user.coverImage ? "block" : "none";
  document.querySelector("#profileStickers").textContent = (user.stickers || []).map((sticker) => stickerIcons[sticker]).filter(Boolean).join(" ");

  const interests = document.querySelector("#profileInterests");
  interests.replaceChildren();
  (user.interests || []).forEach((interest) => {
    const chip = document.createElement("span");
    chip.textContent = interest;
    interests.append(chip);
  });
  if (!interests.childElementCount) {
    const empty = document.createElement("p");
    empty.textContent = "Add a few things you love ✧";
    interests.append(empty);
  }
}
