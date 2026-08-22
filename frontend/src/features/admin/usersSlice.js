import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchUsers, updateUserRole, setUserDisabled } from "../../api/usersApi";

function toErrorMessage(err) {
  if (err instanceof TypeError) {
    return "Could not reach the server. Make sure `npm run server` is running on port 4000.";
  }
  return err.message;
}

export const loadUsers = createAsyncThunk("adminUsers/load", async (_, { rejectWithValue }) => {
  try {
    return await fetchUsers();
  } catch (err) {
    return rejectWithValue(toErrorMessage(err));
  }
});

export const changeUserRole = createAsyncThunk(
  "adminUsers/changeRole",
  async ({ id, role }, { rejectWithValue }) => {
    try {
      return await updateUserRole(id, role);
    } catch (err) {
      return rejectWithValue(toErrorMessage(err));
    }
  }
);

export const toggleUserDisabled = createAsyncThunk(
  "adminUsers/toggleDisabled",
  async ({ id, disabled }, { rejectWithValue }) => {
    try {
      return await setUserDisabled(id, disabled);
    } catch (err) {
      return rejectWithValue(toErrorMessage(err));
    }
  }
);

const usersSlice = createSlice({
  name: "adminUsers",
  initialState: { list: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadUsers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loadUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(loadUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(changeUserRole.fulfilled, (state, action) => {
        const idx = state.list.findIndex((u) => u.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(changeUserRole.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(toggleUserDisabled.fulfilled, (state, action) => {
        const idx = state.list.findIndex((u) => u.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(toggleUserDisabled.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default usersSlice.reducer;
export const selectUsers = (state) => state.adminUsers.list;
export const selectUsersStatus = (state) => state.adminUsers.status;
export const selectUsersError = (state) => state.adminUsers.error;
