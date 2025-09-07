import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  username: '',
  password: '',
  error: '',
  isLoading: false
};

const adminLoginSlice = createSlice({
  name: 'adminLogin',
  initialState,
  reducers: {
    setUsername: (state, action) => {
      state.username = action.payload;
    },
    setPassword: (state, action) => {
      state.password = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    clearError: (state) => {
      state.error = '';
    },
    resetLoginForm: (state) => {
      return initialState;
    },
    loginStart: (state) => {
      state.isLoading = true;
      state.error = '';
    },
    loginSuccess: (state) => {
      state.isLoading = false;
      state.error = '';
      state.username = '';
      state.password = '';
    },
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    }
  }
});

export const {
  setUsername,
  setPassword,
  setError,
  setIsLoading,
  clearError,
  resetLoginForm,
  loginStart,
  loginSuccess,
  loginFailure
} = adminLoginSlice.actions;

// Selectors
export const selectAdminLoginState = (state) => state.adminLogin;
export const selectUsername = (state) => state.adminLogin.username;
export const selectPassword = (state) => state.adminLogin.password;
export const selectLoginError = (state) => state.adminLogin.error;
export const selectIsLoginLoading = (state) => state.adminLogin.isLoading;

export default adminLoginSlice.reducer;
