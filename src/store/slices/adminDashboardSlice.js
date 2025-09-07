import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedDate: null,
  selectedCourse: '',
  searchTerm: '',
  isLoading: true,
  filteredBookings: []
};

const adminDashboardSlice = createSlice({
  name: 'adminDashboard',
  initialState,
  reducers: {
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload;
    },
    setSelectedCourse: (state, action) => {
      state.selectedCourse = action.payload;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setFilteredBookings: (state, action) => {
      state.filteredBookings = action.payload;
    },
    clearFilters: (state) => {
      state.selectedDate = null;
      state.selectedCourse = '';
      state.searchTerm = '';
    },
    clearSelectedDate: (state) => {
      state.selectedDate = null;
    },
    clearSelectedCourse: (state) => {
      state.selectedCourse = '';
    },
    clearSearchTerm: (state) => {
      state.searchTerm = '';
    }
  }
});

export const {
  setSelectedDate,
  setSelectedCourse,
  setSearchTerm,
  setIsLoading,
  setFilteredBookings,
  clearFilters,
  clearSelectedDate,
  clearSelectedCourse,
  clearSearchTerm
} = adminDashboardSlice.actions;

// Selectors
export const selectAdminDashboardState = (state) => state.adminDashboard;
export const selectSelectedDate = (state) => state.adminDashboard.selectedDate;
export const selectSelectedCourse = (state) => state.adminDashboard.selectedCourse;
export const selectSearchTerm = (state) => state.adminDashboard.searchTerm;
export const selectIsLoading = (state) => state.adminDashboard.isLoading;
export const selectFilteredBookings = (state) => state.adminDashboard.filteredBookings;

export default adminDashboardSlice.reducer;
