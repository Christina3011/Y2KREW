const shareButton = document.querySelector("#sharePost");
if (shareButton) {
  shareButton.addEventListener("click", async () => {
    const input = document.querySelector("#postText");
    const message = document.querySelector("#postMessage");
    const content = input.value.trim();
    if (!content) { message.textContent = "Write a little something first ♡"; return; }
    try {
      const result = await apiRequest("/posts", {
        method: "POST", body: JSON.stringify({ content })
      });
      addPostToFeed(result.post);
      input.value = "";
      message.textContent = "Your post is out in the world! ✧";
    } catch (error) {
      message.textContent = getToken() ? error.message : "Log in first to publish a post. This starter feed includes demo posts.";
    }
  });
}

function addPostToFeed(post) {
  const feed = document.querySelector("#postFeed");
  const article = document.createElement("article");
  article.className = "post panel";
  const author = document.createElement("strong");
  author.textContent = post.author?.username || "you";
  const content = document.createElement("p");
  content.textContent = post.content;
  const header = document.createElement("div");
  header.className = "post-author";
  header.append(author);
  article.append(header, content);
  feed.prepend(article);
}
