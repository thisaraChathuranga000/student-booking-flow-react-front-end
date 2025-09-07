import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  step: 1,
  tz: 'Asia/Colombo',
  date: null,
  time: '',
  name: '',
  email: '',
  lesson: '',
  course: '',
  scheduled: null,
  calendarMonth: {
    year: new Date().getFullYear(),
    month: new Date().getMonth()
  },
  bookingCount: 0,
  isLoadingCount: false
};

const bookingFlowSlice = createSlice({
  name: 'bookingFlow',
  initialState,
  reducers: {
    setStep: (state, action) => {
      state.step = action.payload;
    },
    setTimezone: (state, action) => {
      state.tz = action.payload;
    },
    setDate: (state, action) => {
      state.date = action.payload;
      // Clear time when date changes
      if (action.payload) {
        state.time = '';
      }
      // Reset booking count when date changes
      state.bookingCount = 0;
      console.log('Selected date:', action.payload);
    },
    setTime: (state, action) => {
      state.time = action.payload;
    },
    setName: (state, action) => {
      state.name = action.payload;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setLesson: (state, action) => {
      state.lesson = action.payload;
    },
    setCourse: (state, action) => {
      state.course = action.payload;
    },
    setScheduled: (state, action) => {
      state.scheduled = action.payload;
    },
    setBookingCount: (state, action) => {
      state.bookingCount = action.payload;
    },
    setIsLoadingCount: (state, action) => {
      state.isLoadingCount = action.payload;
    },
    setCalendarMonth: (state, action) => {
      state.calendarMonth = action.payload;
    },
    goToPrevMonth: (state) => {
      const newMonth = state.calendarMonth.month - 1;
      if (newMonth < 0) {
        state.calendarMonth = { year: state.calendarMonth.year - 1, month: 11 };
      } else {
        state.calendarMonth = { ...state.calendarMonth, month: newMonth };
      }
    },
    goToNextMonth: (state) => {
      const newMonth = state.calendarMonth.month + 1;
      if (newMonth > 11) {
        state.calendarMonth = { year: state.calendarMonth.year + 1, month: 0 };
      } else {
        state.calendarMonth = { ...state.calendarMonth, month: newMonth };
      }
    },
    resetBookingFlow: (state) => {
      return initialState;
    }
  }
});

export const {
  setStep,
  setTimezone,
  setDate,
  setTime,
  setName,
  setEmail,
  setLesson,
  setCourse,
  setScheduled,
  setBookingCount,
  setIsLoadingCount,
  setCalendarMonth,
  goToPrevMonth,
  goToNextMonth,
  resetBookingFlow
} = bookingFlowSlice.actions;

// Selectors
export const selectBookingFlowState = (state) => state.bookingFlow;
export const selectStep = (state) => state.bookingFlow.step;
export const selectTimezone = (state) => state.bookingFlow.tz;
export const selectDate = (state) => state.bookingFlow.date;
export const selectTime = (state) => state.bookingFlow.time;
export const selectFormData = (state) => ({
  name: state.bookingFlow.name,
  email: state.bookingFlow.email,
  lesson: state.bookingFlow.lesson,
  course: state.bookingFlow.course
});
export const selectScheduled = (state) => state.bookingFlow.scheduled;
export const selectCalendarMonth = (state) => state.bookingFlow.calendarMonth;
export const selectBookingCount = (state) => state.bookingFlow.bookingCount;
export const selectIsLoadingCount = (state) => state.bookingFlow.isLoadingCount;

export default bookingFlowSlice.reducer;
