const registerForm = document.querySelector("#registerForm");
const loginForm = document.querySelector("#loginForm");
const authMessage = document.querySelector("#authMessage");

if (registerForm) registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    const data = await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        username: document.querySelector("#username").value.trim(),
        email: document.querySelector("#email").value.trim(),
        password: document.querySelector("#password").value
      })
    });
    localStorage.setItem("y2krew_token", data.token);
    window.location.href = "/";
  } catch (error) { authMessage.textContent = error.message; }
});

if (loginForm) loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    const data = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: document.querySelector("#email").value.trim(),
        password: document.querySelector("#password").value
      })
    });
    localStorage.setItem("y2krew_token", data.token);
    window.location.href = "/";
  } catch (error) { authMessage.textContent = error.message; }
});
