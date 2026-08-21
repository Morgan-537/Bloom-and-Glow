import { createSlice } from "@reduxjs/toolkit";
import { mockProducts } from "../../data/mockProducts";

// Owned by Elvis (feature/shop-elvis) — seeded with mock data so Home /
// Product Detail have something to render on other branches.
const initialState = {
  items: mockProducts,
  searchTerm: "",
  activeCategory: "All",
  status: "idle",
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setSearchTerm(state, action) {
      state.searchTerm = action.payload;
    },
    setActiveCategory(state, action) {
      state.activeCategory = action.payload;
    },
  },
});

export const { setSearchTerm, setActiveCategory } = productsSlice.actions;
export default productsSlice.reducer;
