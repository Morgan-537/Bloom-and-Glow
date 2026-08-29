import { apiFetch, setToken } from "./client";

export async function loginRequest(email, password) {
  const data = await apiFetch("/api/auth/login", {
    method: "POST",
    body: { email, password },
    auth: false,
  });
  setToken(data.token);
  return data; // { user, token }
}

export async function registerRequest({ name, email, password }) {
  const data = await apiFetch("/api/auth/register", {
    method: "POST",
    body: { name, email, password },
    auth: false,
  });
  setToken(data.token);
  return data; // { user, token }
}

export async function meRequest() {
  const data = await apiFetch("/api/auth/me");
  return data.user;
}
