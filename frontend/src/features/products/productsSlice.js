import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchProducts,
  createProductRequest,
  updateProductRequest,
  deleteProductRequest,
} from "../../api/productsApi";

// Owned by Elvis (feature/shop-elvis). This is the single source of truth
// for the shop catalog — Home, ProductDetail, and the Admin Product
// Management / Reports pages all read (and write) here.
//
// Backed by db.json via json-server (see productsApi.js) — run `npm run
// server` alongside `npm run dev`, same requirement as auth and Users &
// Roles already have. This used to be seeded once from mockProducts.js and
// held only in memory (plus a second, disconnected copy in adminSlice), so
// anything added through the admin panel vanished on refresh and never
// showed up in the shop. Now it's fetched from — and written back to — the
// same db.json the rest of the app already treats as its mock backend.

function toErrorMessage(err) {
  if (err instanceof TypeError) {
    return "Could not reach the server. Make sure `npm run server` is running on port 4000.";
  }
  return err.message;
}

export const loadProducts = createAsyncThunk("products/load", async (_, { rejectWithValue }) => {
  try {
    return await fetchProducts();
  } catch (err) {
    return rejectWithValue(toErrorMessage(err));
  }
});

export const addProduct = createAsyncThunk("products/add", async (product, { rejectWithValue }) => {
  try {
    return await createProductRequest(product);
  } catch (err) {
    return rejectWithValue(toErrorMessage(err));
  }
});

export const updateProduct = createAsyncThunk(
  "products/update",
  async ({ id, ...changes }, { rejectWithValue }) => {
    try {
      return await updateProductRequest(id, changes);
    } catch (err) {
      return rejectWithValue(toErrorMessage(err));
    }
  }
);

export const deleteProduct = createAsyncThunk("products/delete", async (id, { rejectWithValue }) => {
  try {
    await deleteProductRequest(id);
    return id;
  } catch (err) {
    return rejectWithValue(toErrorMessage(err));
  }
});

const initialState = {
  items: [],
  searchTerm: "",
  activeCategory: "All",
  status: "idle", // idle | loading | succeeded | failed
  error: null,
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
  extraReducers: (builder) => {
    builder
      .addCase(loadProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loadProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(loadProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const idx = state.items.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p.id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { setSearchTerm, setActiveCategory } = productsSlice.actions;
export default productsSlice.reducer;
