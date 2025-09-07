import axios from 'axios';
import { BASE_URL } from '../constants/url';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const bookingAPI = {
  createBooking: async (bookingData) => {
    try {
      const response = await api.post('/bookings', {
        course: bookingData.course,
        date: bookingData.date,
        email: bookingData.email,
        lesson: bookingData.lesson,
        name: bookingData.name,
      });
      return response.data;
    } catch (error) {
      console.error('API Error:', error.response?.data || error.message);
      throw error;
    }
  },

  getBookings: async () => {
    try {
      const response = await api.get('/bookings');
      return response.data;
    } catch (error) {
      console.error('API Error:', error.response?.data || error.message);
      throw error;
    }
  },

  getBookingCount: async (date) => {
    try {
      const response = await api.get(`/bookings/count/${date}`);
      return response.data;
    } catch (error) {
      console.error('API Error:', error.response?.data || error.message);
      throw error;
    }
  },

  deleteBooking: async (bookingId) => {
    try {
      const response = await api.delete(`/bookings/${bookingId}`);
      return response.data;
    } catch (error) {
      console.error('API Error:', error.response?.data || error.message);
      throw error;
    }
  },

  sendCalendarInvitation: async (invitationData) => {
    try {
      const response = await api.post('/bookings/send-invitation', invitationData);
      return response.data;
    } catch (error) {
      console.error('API Error:', error.response?.data || error.message);
      throw error;
    }
  },
};

export const userAPI = {
  login: async (credentials) => {
    try {
      const response = await api.post('/users/login', {
        username: credentials.username,
        password: credentials.password,
      });
      return response.data;
    } catch (error) {
      console.error('API Error:', error.response?.data || error.message);
      throw error;
    }
  },
};

export default api;
