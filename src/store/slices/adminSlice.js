import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAdminLoggedIn: false
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    loginAdmin: (state) => {
      state.isAdminLoggedIn = true;
    },
    logoutAdmin: (state) => {
      state.isAdminLoggedIn = false;
    },
    clearAdminState: () => {
      return initialState;
    }
  }
});

export const { loginAdmin, logoutAdmin, clearAdminState } = adminSlice.actions;

// Selectors
export const selectIsAdminLoggedIn = (state) => state.admin.isAdminLoggedIn;

export default adminSlice.reducer;
