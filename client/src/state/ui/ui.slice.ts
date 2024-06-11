import { createSlice } from "@reduxjs/toolkit";

interface uiState {
  isNavbarMenuOpen: boolean;
}

const initialState: uiState = {
  isNavbarMenuOpen: false
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setNavbarMenuOpen(state, action) {
      state.isNavbarMenuOpen = action.payload;
    },
  }
});

export const { 
  setNavbarMenuOpen
 } = uiSlice.actions;

export default uiSlice.reducer;

