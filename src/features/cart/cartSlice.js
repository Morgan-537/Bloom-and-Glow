import { createSlice } from "@reduxjs/toolkit";

// Owned by Timothy (feature/cart-checkout-timothy) — minimal stub.
const initialState = {
  items: [], // { productId, name, price, quantity }
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action) {
      const existing = state.items.find((i) => i.productId === action.payload.productId);
      if (existing) existing.quantity += action.payload.quantity ?? 1;
      else state.items.push({ ...action.payload, quantity: action.payload.quantity ?? 1 });
    },
    removeItem(state, action) {
      state.items = state.items.filter((i) => i.productId !== action.payload);
    },
    updateQuantity(state, action) {
      const item = state.items.find((i) => i.productId === action.payload.productId);
      if (item) item.quantity = action.payload.quantity;
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addItem, removeItem, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
