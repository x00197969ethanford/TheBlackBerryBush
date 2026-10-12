// Fetches Google reviews via the Places API (New) and writes reviews.json
const fs = require("fs");

const { GOOGLE_API_KEY, PLACE_ID } = process.env;
if (!GOOGLE_API_KEY || !PLACE_ID) {
  console.error("Missing GOOGLE_API_KEY or PLACE_ID secret");
  process.exit(1);
}

async function main() {
  const res = await fetch(`https://places.googleapis.com/v1/places/${PLACE_ID}`, {
    headers: {
      "X-Goog-Api-Key": GOOGLE_API_KEY,
      "X-Goog-FieldMask": "rating,userRatingCount,reviews,googleMapsUri",
    },
  });

  if (!res.ok) {
    console.error(`API error ${res.status}: ${await res.text()}`);
    process.exit(1);
  }

  const place = await res.json();

  const data = {
    rating: place.rating ?? null,
    total: place.userRatingCount ?? 0,
    url: place.googleMapsUri ?? null,
    reviews: (place.reviews ?? []).map((r) => ({
      author: r.authorAttribution?.displayName ?? "Google user",
      rating: r.rating,
      text: r.originalText?.text ?? r.text?.text ?? "",
      time: r.publishTime ?? null,
    })),
  };

  fs.writeFileSync("reviews.json", JSON.stringify(data, null, 2) + "\n");
  console.log(`Saved ${data.reviews.length} review(s)`);
}

main();
