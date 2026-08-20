import { createSlice } from "@reduxjs/toolkit";
import { mockProducts } from "../../data/mockProducts";

const initialState = {
  products: mockProducts,
  stats: {
    totalSales: 18420,
    orders: 312,
    products: 148,
    activeCustomers: 1204,
  },
  salesTrend: [40, 70, 55, 100, 65, 130, 90, 60, 110, 80, 150, 95], // last 12 days, mock
  topProducts: [
    { name: "Rose Facial Serum", views: 120 },
    { name: "Argan Hair Oil", views: 102 },
    { name: "Matte Lipstick", views: 84 },
    { name: "Vitamin C Cleanser", views: 66 },
  ],
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    addProduct(state, action) {
      state.products.unshift(action.payload);
    },
    updateProduct(state, action) {
      const idx = state.products.findIndex((p) => p.id === action.payload.id);
      if (idx !== -1) state.products[idx] = { ...state.products[idx], ...action.payload };
    },
    deleteProduct(state, action) {
      state.products = state.products.filter((p) => p.id !== action.payload);
    },
  },
});

export const { addProduct, updateProduct, deleteProduct } = adminSlice.actions;
export default adminSlice.reducer;
