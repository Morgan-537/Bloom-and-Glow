const BASE_URL = "http://localhost:4000";

export async function loginRequest(email, password) {
  const res = await fetch(`${BASE_URL}/users?email=${email}&password=${password}`);
  const users = await res.json();
  if (users.length === 0) {
    throw new Error("Invalid email or password");
  }
  const user = users[0];
  const fakeToken = btoa(`${user.id}:${user.role}:${Date.now()}`);
  return { user, token: fakeToken };
}

export async function registerRequest({ name, email, password }) {
  const res = await fetch(`${BASE_URL}/users`);
  const existing = await res.json();
  if (existing.some((u) => u.email === email)) {
    throw new Error("Email already registered");
  }
  const newUserRes = await fetch(`${BASE_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, role: "customer" }),
  });
  const user = await newUserRes.json();
  const fakeToken = btoa(`${user.id}:${user.role}:${Date.now()}`);
  return { user, token: fakeToken };
}
