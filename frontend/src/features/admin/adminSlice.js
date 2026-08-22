import { createSlice } from "@reduxjs/toolkit";

// NOTE: this used to also hold its own `products` array (seeded from the
// same mockProducts, but a totally separate copy) with addProduct/
// updateProduct/deleteProduct reducers. Admin Product Management and
// Reports both read from it, which meant a product added via the admin
// panel never actually showed up in the shop — Home/ProductDetail read
// from productsSlice's `items`, a different array entirely. That's been
// removed; the real catalog now lives only in productsSlice.js, and admin
// pages read/write it via that slice's addProduct/updateProduct/
// deleteProduct instead.
const initialState = {
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
  reducers: {},
});

export default adminSlice.reducer;
