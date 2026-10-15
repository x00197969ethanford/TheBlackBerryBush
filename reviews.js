// Renders reviews.json into the #reviews section
(async function () {
  const list = document.getElementById("review-list");
  const summary = document.getElementById("review-summary");
  const link = document.getElementById("review-link");
  if (!list) return;

  try {
    const res = await fetch("reviews.json", { cache: "no-store" });
    const data = await res.json();

    if (data.rating) {
      summary.textContent = `${data.rating.toFixed(1)} ★ from ${data.total} Google review${data.total === 1 ? "" : "s"}`;
    }
    if (data.url) link.href = data.url;

    data.reviews.forEach((r) => {
      const card = document.createElement("div");
      card.className = "review-card";

      const stars = document.createElement("div");
      stars.className = "stars";
      stars.textContent = "★".repeat(r.rating) + "☆".repeat(5 - r.rating);

      const text = document.createElement("p");
      text.className = "review-text";
      text.textContent = `"${r.text}"`;

      const author = document.createElement("p");
      author.className = "review-author";
      const date = r.time
        ? " · " + new Date(r.time).toLocaleDateString("en-IE", { month: "long", year: "numeric" })
        : "";
      author.textContent = `${r.author}, via Google${date}`;

      card.append(stars, text, author);
      list.appendChild(card);
    });
  } catch (e) {
    document.getElementById("reviews").style.display = "none";
  }
})();
