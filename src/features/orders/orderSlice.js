import { createSlice } from "@reduxjs/toolkit";
import { mockOrders } from "../../data/mockProducts";

// Owned by Morgan (feature/admin-orderhistory-morgan) for the demo;
// Timothy's checkout flow will later dispatch real orders in here too.
const initialState = {
  history: mockOrders,
  status: "idle",
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    addOrder(state, action) {
      state.history.unshift(action.payload);
    },
  },
});

export const { addOrder } = orderSlice.actions;
export default orderSlice.reducer;
