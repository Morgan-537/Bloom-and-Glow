import { apiFetch } from "./client";

export async function fetchUsers() {
  return apiFetch("/api/users");
}

export async function updateUserRole(id, role) {
  return apiFetch(`/api/users/${id}`, { method: "PATCH", body: { role } });
}

export async function setUserDisabled(id, disabled) {
  return apiFetch(`/api/users/${id}`, { method: "PATCH", body: { disabled } });
}
