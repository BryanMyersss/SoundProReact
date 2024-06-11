import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { currentUser, getCurrentUser, authSetUser } from "../../api/auth.api";

interface userState {
  loading: boolean;
  currentUser: any;
  error: any;
}

const initialState: userState = {
  loading: false,
  currentUser: currentUser(),
  error: null
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      authSetUser(action.payload);
      state.currentUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      state.loading = false;
      state.currentUser = action.payload;
    });
    builder.addCase(fetchUser.rejected, (state, action) => {
      state.loading = false;
      // state.error = action.error;
    });
  }
});

export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async () => {
    const response = await getCurrentUser();
    return response
  }
)

export const {
  setUser
} = userSlice.actions;

export default userSlice.reducer;

