import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginRequest, registerRequest, meRequest } from "../../api/authApi";
import { getToken, setToken } from "../../api/client";

// Talks to the real Flask backend (see api/authApi.js). The backend's
// User.to_dict() returns "name", not "fullName" — the rest of the app
// (NavBar, etc.) expects "fullName", so normalize here rather than
// touching every consumer.
function normalizeUser(user) {
  return {
    id: user.id,
    fullName: user.name,
    email: user.email,
    role: user.role,
  };
}

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { user, token } = await loginRequest(email, password);
      return { user: normalizeUser(user), token };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const { user, token } = await registerRequest({ name, email, password });
      return { user: normalizeUser(user), token };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Rehydrates the logged-in user from a token already saved in
// localStorage — dispatched once on app boot (see App.jsx) so a page
// refresh doesn't silently log the user out even though their token is
// still valid.
export const restoreSession = createAsyncThunk(
  "auth/restoreSession",
  async (_, { rejectWithValue }) => {
    const token = getToken();
    if (!token) return rejectWithValue(null);
    try {
      const user = await meRequest();
      return { user: normalizeUser(user), token };
    } catch (err) {
      setToken(null); // stored token is invalid/expired — clear it
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  user: null,
  token: null,
  status: "idle", // idle | loading | succeeded | failed
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.status = "idle";
      state.error = null;
      setToken(null);
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
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(restoreSession.rejected, (state) => {
        // No valid session to restore — stay logged out, not an error the
        // user needs to see.
        state.status = "idle";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
