import { apiFetch } from "./client";

export async function fetchProducts() {
  return apiFetch("/api/products", { auth: false });
}

export async function createProductRequest(product) {
  return apiFetch("/api/products", { method: "POST", body: product });
}

export async function updateProductRequest(id, changes) {
  return apiFetch(`/api/products/${id}`, { method: "PATCH", body: changes });
}

export async function deleteProductRequest(id) {
  await apiFetch(`/api/products/${id}`, { method: "DELETE" });
}
