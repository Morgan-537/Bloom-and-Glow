import { createSlice } from "@reduxjs/toolkit";

// Owned by Damaris (feature/auth-damaris) — this is a minimal stub so the
// store compiles for everyone else. Replace with real JWT auth logic.
const initialState = {
  user: null, // { id, fullName, email, roleId }
  token: null,
  status: "idle", // idle | loading | succeeded | failed
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
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
export default authSlice.reducer;
