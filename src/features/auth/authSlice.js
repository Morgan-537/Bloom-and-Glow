<<<<<<< HEAD
import { createSlice } from "@reduxjs/toolkit";

// Owned by Damaris (feature/auth-damaris) — this is a minimal stub so the
// store compiles for everyone else. Replace with real JWT auth logic.
const initialState = {
  user: null, // { id, fullName, email, roleId }
  token: null,
  status: "idle", // idle | loading | succeeded | failed
=======
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginRequest, registerRequest } from "../../api/authApi";

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      return await loginRequest(email, password);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (formData, { rejectWithValue }) => {
    try {
      return await registerRequest(formData);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const storedUser = localStorage.getItem("user");
const storedToken = localStorage.getItem("token");

const initialState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken || null,
  status: "idle",
  error: null,
>>>>>>> 4712cefc5c1ccfe1c802806163d32a199f5901ab
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
<<<<<<< HEAD
    loginSuccess(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.status = "succeeded";
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.status = "idle";
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
=======
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(register.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
>>>>>>> 4712cefc5c1ccfe1c802806163d32a199f5901ab
export default authSlice.reducer;
