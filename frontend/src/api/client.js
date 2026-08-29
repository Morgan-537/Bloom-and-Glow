// Shared fetch helper for talking to the real Flask backend. Centralizes
// the base URL, JSON headers, JWT bearer auth, and error handling so every
// api/*.js file doesn't have to reimplement the same boilerplate.

export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

const TOKEN_KEY = "bng_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export async function apiFetch(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let res;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    // fetch() throws a bare TypeError when it can't reach the server at all
    // (backend down, wrong URL, CORS misconfigured, etc).
    throw new Error(`Could not reach the server at ${API_BASE_URL}. Is the backend running?`);
  }

  if (res.status === 204) return null; // e.g. DELETE /api/products/:id

  let data = null;
  try {
    data = await res.json();
  } catch {
    // No JSON body — shouldn't normally happen, but don't crash on it.
  }

  if (!res.ok) {
    throw new Error((data && data.error) || `Request failed with status ${res.status}`);
  }

  return data;
}
