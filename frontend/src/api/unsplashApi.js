const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
const BASE_URL = "https://api.unsplash.com";

// Free "Demo" tier — sign up at https://unsplash.com/developers, create an
// app, and copy its Access Key into frontend/.env as
// VITE_UNSPLASH_ACCESS_KEY (see .env.example). No credit card required;
// capped at 50 requests/hour, which is plenty for admin product entry.
//
// Used by AdminProductManagement's ProductFormModal so an admin can search
// for a product photo instead of hunting down and pasting an Unsplash URL
// by hand.

export async function searchPhotos(query) {
  if (!ACCESS_KEY) {
    throw new Error(
      "Missing Unsplash API key. Add VITE_UNSPLASH_ACCESS_KEY to frontend/.env — see .env.example."
    );
  }

  const res = await fetch(
    `${BASE_URL}/search/photos?query=${encodeURIComponent(query)}&per_page=8&orientation=squarish`,
    { headers: { Authorization: `Client-ID ${ACCESS_KEY}` } }
  );

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("Unsplash rejected the API key — check VITE_UNSPLASH_ACCESS_KEY in frontend/.env.");
    }
    if (res.status === 403) {
      throw new Error("Unsplash rate limit reached (50 requests/hour on the free tier). Try again later.");
    }
    throw new Error("Failed to search Unsplash.");
  }

  const data = await res.json();
  return data.results.map((p) => ({
    id: p.id,
    thumb: p.urls.thumb,
    regular: p.urls.regular,
    alt: p.alt_description || query,
    photographer: p.user?.name || "Unknown",
    photographerUrl: p.user?.links?.html || "https://unsplash.com",
  }));
}
