const boardForm = document.querySelector("#boardForm");
if (boardForm) {
  boardForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const message = document.querySelector("#boardMessage");
    try {
      const data = await apiRequest("/boards", {
        method: "POST",
        body: JSON.stringify({ title: document.querySelector("#boardTitle").value.trim() })
      });
      const card = document.createElement("div");
      card.textContent = `♡ ${data.board.title}`;
      document.querySelector("#boardList").prepend(card);
      message.textContent = "Your new board is ready! ✧";
      boardForm.reset();
    } catch (error) { message.textContent = getToken() ? error.message : "Log in to create and save boards."; }
  });
}
