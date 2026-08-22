import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginRequest, registerRequest } from "../../api/authApi";

// Backed by db.json via json-server (see authApi.js) — run `npm run server`
// (from frontend/) alongside `npm run dev` or these will fail to reach the
// mock backend. Real JWT auth against the Flask API comes later.

// db.json stores each user's display name as "name"; the rest of the app
// (NavBar, etc.) expects "fullName" on the auth user object, so normalize
// here rather than touching every consumer.
function normalizeUser(user) {
  return {
    id: user.id,
    fullName: user.name,
    email: user.email,
    role: user.role,
  };
}

function toErrorMessage(err) {
  if (err instanceof TypeError) {
    // fetch() throws a bare TypeError when it can't reach the server at all.
    return "Could not reach the server. Make sure `npm run server` is running on port 4000.";
  }
  return err.message;
}

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { user, token } = await loginRequest(email, password);
      return { user: normalizeUser(user), token };
    } catch (err) {
      return rejectWithValue(toErrorMessage(err));
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
      return rejectWithValue(toErrorMessage(err));
    }
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
