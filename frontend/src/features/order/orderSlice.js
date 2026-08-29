import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  placeOrderRequest,
  fetchOrders,
  fetchOrderById,
  updateOrderStatusRequest,
} from "../../api/ordersApi";

const initialState = {
  deliveryAddress: {
    fullName: '',
    streetAddress: '',
    city: '',
    postalCode: '',
  },
  billingInfo: {
    nameOnCard: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  },
  orders: [],         // order history, loaded from the real backend
  currentOrder: null, // the order just placed, shown on the confirmation page
  status: "idle",      // idle | loading | succeeded | failed — for `orders`
  error: null,
  placeStatus: "idle", // separate status for submitting an order, so Checkout's
  placeError: null,    // button state doesn't get confused with History's loading state
};

// Submits a real order to POST /api/orders. The response shape already
// matches what this slice used to build client-side (see Order.to_dict()
// in the backend), so OrderConfirmationPage/OrderHistory/AdminOrders need
// no changes to how they read an order.
export const placeOrder = createAsyncThunk(
  "order/place",
  async ({ items, subtotal, deliveryFee, total, deliveryAddress, billingInfo }, { rejectWithValue }) => {
    try {
      return await placeOrderRequest({ items, subtotal, deliveryFee, total, deliveryAddress, billingInfo });
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Loads order history — the backend automatically scopes this to the
// logged-in user's own orders, or to every order if they're admin/order_manager.
export const loadOrders = createAsyncThunk("order/load", async (_, { rejectWithValue }) => {
  try {
    return await fetchOrders();
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

// Fetches a single order directly — used when landing on /orders/:id
// without the full history already loaded (e.g. a page refresh).
export const loadOrderById = createAsyncThunk("order/loadById", async (id, { rejectWithValue }) => {
  try {
    return await fetchOrderById(id);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const updateOrderStatus = createAsyncThunk(
  "order/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      return await updateOrderStatusRequest(id, status);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setDeliveryAddress: (state, action) => {
      state.deliveryAddress = { ...state.deliveryAddress, ...action.payload }
    },
    setBillingInfo: (state, action) => {
      state.billingInfo = { ...state.billingInfo, ...action.payload }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.placeStatus = "loading";
        state.placeError = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.placeStatus = "succeeded";
        state.currentOrder = action.payload;
        state.orders.unshift(action.payload);
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.placeStatus = "failed";
        state.placeError = action.payload || action.error.message;
      })
      .addCase(loadOrders.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loadOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.orders = action.payload;
      })
      .addCase(loadOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(loadOrderById.fulfilled, (state, action) => {
        const idx = state.orders.findIndex((o) => o.id === action.payload.id);
        if (idx !== -1) {
          state.orders[idx] = action.payload;
        } else {
          state.orders.push(action.payload);
        }
        if (state.currentOrder?.id === action.payload.id) {
          state.currentOrder = action.payload;
        }
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const idx = state.orders.findIndex((o) => o.id === action.payload.id);
        if (idx !== -1) state.orders[idx] = action.payload;
        if (state.currentOrder?.id === action.payload.id) state.currentOrder = action.payload;
      });
  },
})

export const { setDeliveryAddress, setBillingInfo } = orderSlice.actions
export const selectDeliveryAddress = (state) => state.order.deliveryAddress
export const selectBillingInfo = (state) => state.order.billingInfo
export const selectCurrentOrder = (state) => state.order.currentOrder
export const selectOrderHistory = (state) => state.order.orders
export const selectOrdersStatus = (state) => state.order.status
export const selectOrdersError = (state) => state.order.error
export const selectPlaceOrderStatus = (state) => state.order.placeStatus
export const selectPlaceOrderError = (state) => state.order.placeError
export default orderSlice.reducer
