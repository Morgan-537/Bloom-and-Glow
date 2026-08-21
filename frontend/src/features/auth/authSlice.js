import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Owned by Damaris (feature/auth-damaris) — this is a minimal stub so the
// store compiles for everyone else. Replace with real JWT auth logic.

// TODO(Damaris): replace this mock thunk with a real API call, e.g.
//   const res = await fetch("/api/auth/login", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ email, password }),
//   })
//   if (!res.ok) throw new Error((await res.json()).message || "Login failed")
//   return await res.json() // { user, token }
export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    // Simulated network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (!email || !password) {
      return rejectWithValue("Email and password are required.");
    }

    // Fake role assignment so both redirect paths in LoginPage are testable:
    // log in as admin@example.com to hit /admin/dashboard, anything else -> /shop
    const isAdmin = email.toLowerCase() === "admin@example.com";

    return {
      user: {
        id: "mock-user-1",
        fullName: isAdmin ? "Admin User" : "Test Customer",
        email,
        role: isAdmin ? "admin" : "customer",
      },
      token: "mock-jwt-token",
    };
  }
);

// TODO(Damaris): replace this mock thunk with a real API call, e.g.
//   const res = await fetch("/api/auth/register", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ name, email, password }),
//   })
//   if (!res.ok) throw new Error((await res.json()).message || "Registration failed")
//   return await res.json() // { user, token }
export const register = createAsyncThunk(
  "auth/register",
  async ({ name, email, password }, { rejectWithValue }) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (!name || !email || !password) {
      return rejectWithValue("Full name, email, and password are required.");
    }

    // Mock "already registered" case so the error path is testable too
    if (email.toLowerCase() === "taken@example.com") {
      return rejectWithValue("An account with this email already exists.");
    }

    return {
      user: {
        id: "mock-user-new",
        fullName: name,
        email,
        role: "customer",
      },
      token: "mock-jwt-token",
    };
  }
);

const initialState = {
  user: null, // { id, fullName, email, roleId }
  token: null,
  status: "idle", // idle | loading | succeeded | failed
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.status = "succeeded";
      state.error = null;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.status = "idle";
      state.error = null;
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
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(register.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;