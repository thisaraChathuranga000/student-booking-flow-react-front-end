import React, { createContext, useContext, useState } from 'react';

const BookingContext = createContext();

export const useBookings = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBookings must be used within a BookingProvider');
  }
  return context;
};

export const BookingProvider = ({ children }) => {
  // Initial mock data with more varied dates and names for better testing
  const [bookings, setBookings] = useState([
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
  ]);

  const addBooking = (newBooking) => {
    const booking = {
      ...newBooking,
      id: Date.now(), // Simple ID generation for demo
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };
    setBookings(prev => [...prev, booking]);
    return booking;
  };

  const updateBookingStatus = (id, status) => {
    setBookings(prev => 
      prev.map(booking => 
        booking.id === id ? { ...booking, status } : booking
      )
    );
  };

  const deleteBooking = (id) => {
    setBookings(prev => prev.filter(booking => booking.id !== id));
  };

  const getBookingsByDate = (date) => {
    return bookings.filter(booking => booking.date === date);
  };

  const value = {
    bookings,
    addBooking,
    updateBookingStatus,
    deleteBooking,
    getBookingsByDate
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};

export default BookingContext;
