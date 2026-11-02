const capsuleForm = document.querySelector("#capsuleForm");
if (capsuleForm) {
  const dateInput = document.querySelector("#unlockDate");
  dateInput.min = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  capsuleForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const message = document.querySelector("#capsuleMessage");
    try {
      const data = await apiRequest("/capsules", {
        method: "POST",
        body: JSON.stringify({
          title: document.querySelector("#capsuleTitle").value.trim(),
          content: document.querySelector("#capsuleContent").value,
          unlockAt: dateInput.value
        })
      });
      message.textContent = `Sealed! "${data.capsule.title}" is waiting for its unlock date. ♡`;
      capsuleForm.reset();
    } catch (error) { message.textContent = getToken() ? error.message : "Log in to seal a time capsule."; }
  });
}
