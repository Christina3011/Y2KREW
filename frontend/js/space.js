if (getToken()) {
  loadMySpace();
}

async function loadMySpace() {
  try {
    const data = await apiRequest("/profile/me");
    const user = data.user;
    document.querySelector("#homeUsername").textContent = user.displayName || user.username;
    document.querySelector("#homeBio").textContent = user.bio || "living in my own little world";
    document.querySelector("#homeMusic").textContent = user.favouriteMusic || "Add your favourite music ✧";
    const authLink = document.querySelector("#homeAuthLink");
    authLink.href = "/pages/profile.html";
    authLink.textContent = "My profile";

    const avatar = document.querySelector("#homeAvatar");
    const avatarUrl = user.profilePicture || user.avatarUrl;
    if (avatarUrl) {
      avatar.textContent = "";
      avatar.style.backgroundImage = `url("${avatarUrl}")`;
      avatar.style.backgroundSize = "cover";
      avatar.style.backgroundPosition = "center";
      avatar.setAttribute("aria-label", `${user.username}'s profile picture`);
    }
  } catch (error) {
    if (error.message.includes("session") || error.message.includes("log in")) {
      localStorage.removeItem("y2krew_token");
    } else {
      console.error("Could not load your profile on the home page:", error);
    }
  }
}
