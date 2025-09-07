import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectSelectedDate,
  selectSelectedCourse,
  selectSearchTerm,
  selectIsLoading,
  selectFilteredBookings,
  setSelectedDate,
  setSelectedCourse,
  setSearchTerm,
  setIsLoading,
  setFilteredBookings,
  clearFilters,
  clearSelectedDate,
  clearSelectedCourse,
  clearSearchTerm
} from '../store/slices/adminDashboardSlice';
import { bookingAPI } from '../services/api';
import { COURSE_OPTIONS } from '../constants/courseOptions';
import { exportBookingsToCSV, formatDate } from '../utils/exportUtils';
import './AdminDashboard.css';

const AdminDashboard = ({ onLogout }) => {
  const [bookings, setBookings] = useState([]);
  const [apiError, setApiError] = useState(null);
  const selectedDate = useSelector(selectSelectedDate);
  const selectedCourse = useSelector(selectSelectedCourse);
  const searchTerm = useSelector(selectSearchTerm);
  const isLoading = useSelector(selectIsLoading);
  const filteredBookings = useSelector(selectFilteredBookings);
  const dispatch = useDispatch();

  // Fetch bookings from API
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        dispatch(setIsLoading(true));
        const data = await bookingAPI.getBookings();
        // Transform API data to match expected format
        const transformedBookings = data.map(booking => ({
          id: booking._id,
          date: booking.date,
          name: booking.name,
          email: booking.email,
          lesson: booking.lesson,
          course: booking.course
        }));
        setBookings(transformedBookings);
        setApiError(null);
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
        setApiError('Failed to load bookings. Please try again.');
        setBookings([]);
      } finally {
        dispatch(setIsLoading(false));
      }
    };

    fetchBookings();
  }, [dispatch]);

  useEffect(() => {
    let filtered = bookings;
    if (selectedDate) {
      // Format selected date to YYYY-MM-DD to match API format
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const selectedDateString = `${year}-${month}-${day}`;
      
      filtered = filtered.filter(booking => booking.date === selectedDateString);
    }

    // Filter by course if selected
    if (selectedCourse) {
      filtered = filtered.filter(booking => booking.course === selectedCourse);
    }

    // Filter by search term (name or email)
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(booking => 
        booking.name.toLowerCase().includes(searchLower) ||
        booking.email.toLowerCase().includes(searchLower)
      );
    }

    dispatch(setFilteredBookings(filtered));
  }, [selectedDate, selectedCourse, searchTerm, bookings, dispatch]);

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  const handleExportBookings = () => {
    exportBookingsToCSV(filteredBookings, {
      selectedDate,
      selectedCourse,
      searchTerm
    });
  };

  // Handle delete booking
  const handleDeleteBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await bookingAPI.deleteBooking(bookingId);
        // Remove the booking from local state
        setBookings(prevBookings => prevBookings.filter(booking => booking.id !== bookingId));
      } catch (error) {
        console.error('Failed to delete booking:', error);
        alert('Failed to delete booking. Please try again.');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="admin-dashboard">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading booking data...</p>
        </div>
      </div>
    );
  }

  if (apiError) {
    return (
      <div className="admin-dashboard">
        <div className="error-container">
          <p className="error-message">{apiError}</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="admin-header-content">
          <h1>Admin Dashboard</h1>
          <p>International Sugar Studio and Campus</p>
        </div>
        <button onClick={onLogout} className="logout-button">
          Logout
        </button>
      </header>

      <div className="dashboard-content">
        <div className="dashboard-controls">
          <div className="filters-section">
            <div className="filter-group">
              <label htmlFor="search-input">Search Students:</label>
              <div className="search-container">
                <input
                  id="search-input"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                  placeholder="Search by name or email..."
                  className="search-input"
                />
                <span className="search-icon">🔍</span>
              </div>
            </div>
            
            <div className="filter-group">
              <label htmlFor="date-picker">Filter by Date:</label>
              <DatePicker
                id="date-picker"
                selected={selectedDate}
                onChange={(date) => dispatch(setSelectedDate(date))}
                placeholderText="Select a date..."
                className="date-picker-input"
                dateFormat="MMMM d, yyyy"
                isClearable
              />
            </div>

            <div className="filter-group">
              <label htmlFor="course-filter">Filter by Course:</label>
              <select
                id="course-filter"
                value={selectedCourse}
                onChange={(e) => dispatch(setSelectedCourse(e.target.value))}
                className="course-filter-select"
              >
                <option value="">All Courses</option>
                {COURSE_OPTIONS.map((course) => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="filter-actions">
              <button onClick={handleClearFilters} className="clear-filters-btn">
                Clear Filters
              </button>
              <button onClick={handleExportBookings} className="export-button">
                Export to CSV
              </button>
            </div>
          </div>
        </div>

        {(selectedDate || selectedCourse || searchTerm) && (
          <div className="active-filters">
            <h4>Active Filters:</h4>
            <div className="filter-tags">
              {selectedDate && (
                <span className="filter-tag">
                  Date: {selectedDate.toLocaleDateString()}
                  <button onClick={() => dispatch(clearSelectedDate())} className="remove-filter">×</button>
                </span>
              )}
              {selectedCourse && (
                <span className="filter-tag">
                  Course: {selectedCourse}
                  <button onClick={() => dispatch(clearSelectedCourse())} className="remove-filter">×</button>
                </span>
              )}
              {searchTerm && (
                <span className="filter-tag">
                  Search: "{searchTerm}"
                  <button onClick={() => dispatch(clearSearchTerm())} className="remove-filter">×</button>
                </span>
              )}
            </div>
          </div>
        )}


        <div className="bookings-table-container">
          <h2>
            Total Bookings: {filteredBookings.length}
          </h2>
          
          {filteredBookings.length === 0 ? (
            <div className="no-bookings">
              <p>No bookings found 
                {selectedDate ? ' for the selected date' : ''}
                {selectedCourse ? ' for the selected course' : ''}
                {searchTerm ? ' matching the search term' : ''}
                .
              </p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="bookings-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Student Name</th>
                    <th>Email</th>
                    <th>Course</th>
                    <th>Lesson</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map(booking => (
                    <tr key={booking.id}>
                      <td>{booking.date}</td>
                      <td>{booking.name}</td>
                      <td>{booking.email}</td>
                      <td>{booking.course}</td>
                      <td>{booking.lesson}</td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            onClick={() => handleDeleteBooking(booking.id)}
                            className="action-btn delete-btn"
                            title="Delete booking"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
