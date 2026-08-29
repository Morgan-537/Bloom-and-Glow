import { apiFetch } from "./client";

export async function placeOrderRequest(order) {
  return apiFetch("/api/orders", { method: "POST", body: order });
}

export async function fetchOrders() {
  return apiFetch("/api/orders");
}

export async function fetchOrderById(id) {
  return apiFetch(`/api/orders/${id}`);
}

export async function updateOrderStatusRequest(id, status) {
  return apiFetch(`/api/orders/${id}/status`, { method: "PATCH", body: { status } });
}
