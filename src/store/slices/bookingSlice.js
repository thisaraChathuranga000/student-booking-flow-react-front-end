import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  bookings: [
    {
      id: 1,
      date: '2025-09-10',
      time: '09:00',
      name: 'John Doe',
      email: 'john.doe@email.com',
      course: 'Diploma 1250h -2025',
      lesson: 'Basic Techniques',
      status: 'confirmed',
      createdAt: new Date('2025-09-05').toISOString()
    },
    {
      id: 2,
      date: '2025-09-10',
      time: '11:00',
      name: 'Jane Smith',
      email: 'jane.smith@email.com',
      course: 'Diploma 1800h -2025',
      lesson: 'Advanced Methods',
      status: 'confirmed',
      createdAt: new Date('2025-09-06').toISOString()
    },
    {
      id: 3,
      date: '2025-09-11',
      time: '09:00',
      name: 'Bob Johnson',
      email: 'bob.johnson@email.com',
      course: 'Diploma 3000h -2025',
      lesson: 'Professional Techniques',
      status: 'pending',
      createdAt: new Date('2025-09-07').toISOString()
    },
    {
      id: 4,
      date: '2025-09-11',
      time: '14:00',
      name: 'Alice Brown',
      email: 'alice.brown@email.com',
      course: 'Diploma 1250h -2025',
      lesson: 'Introduction',
      status: 'confirmed',
      createdAt: new Date('2025-09-08').toISOString()
    },
    {
      id: 5,
      date: '2025-09-12',
      time: '10:00',
      name: 'Charlie Wilson',
      email: 'charlie.wilson@email.com',
      course: 'Diploma 1800h -2025',
      lesson: 'Skill Building',
      status: 'confirmed',
      createdAt: new Date('2025-09-09').toISOString()
    },
    {
      id: 6,
      date: '2025-09-12',
      time: '15:00',
      name: 'Emma Davis',
      email: 'emma.davis@email.com',
      course: 'Diploma 3000h -2025',
      lesson: 'Master Class',
      status: 'pending',
      createdAt: new Date('2025-09-10').toISOString()
    },
    {
      id: 7,
      date: '2025-09-13',
      time: '09:00',
      name: 'Michael Brown',
      email: 'michael.brown@email.com',
      course: 'Nvq',
      lesson: 'Fundamentals',
      status: 'confirmed',
      createdAt: new Date('2025-09-11').toISOString()
    },
    {
      id: 8,
      date: '2025-09-13',
      time: '16:00',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      course: 'Diploma 1800h -2025',
      lesson: 'Creative Techniques',
      status: 'confirmed',
      createdAt: new Date('2025-09-12').toISOString()
    }
  ]
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    addBooking: (state, action) => {
      const booking = {
        ...action.payload,
        id: Date.now(),
        status: 'confirmed',
        createdAt: new Date().toISOString()
      };
      state.bookings.push(booking);
    },
    updateBookingStatus: (state, action) => {
      const { id, status } = action.payload;
      const booking = state.bookings.find(booking => booking.id === id);
      if (booking) {
        booking.status = status;
      }
    },
    deleteBooking: (state, action) => {
      state.bookings = state.bookings.filter(booking => booking.id !== action.payload);
    }
  }
});

export const { addBooking, updateBookingStatus, deleteBooking } = bookingSlice.actions;

// Selectors
export const selectAllBookings = (state) => state.booking.bookings;
export const selectBookingsByDate = (state, date) => 
  state.booking.bookings.filter(booking => booking.date === date);

export default bookingSlice.reducer;
