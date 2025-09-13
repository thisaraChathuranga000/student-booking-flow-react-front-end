import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Trash2, Search } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectIsAdminLoggedIn, loginAdmin, logoutAdmin, clearAdminState } from "../store/slices/adminSlice";
import {
  selectSelectedDate,
  selectSelectedCourse,
  selectSelectedBranch,
  selectSearchTerm,
  selectIsLoading,
  selectFilteredBookings,
  setSelectedDate,
  setSelectedCourse,
  setSelectedBranch,
  setSearchTerm,
  setIsLoading,
  setFilteredBookings,
  clearFilters,
} from '../store/slices/adminDashboardSlice';
import { bookingAPI } from '../services/api';
import { COURSE_OPTIONS } from '../constants/courseOptions';
import { BRANCH } from '../constants/instituteData';
import { exportBookingsToCSV, formatDate } from '../utils/exportUtils';
import './AdminDashboard.css';

const AdminDashboard = ({ onLogout }) => {
  const [bookings, setBookings] = useState([]);
  const [apiError, setApiError] = useState(null);
  const selectedDate = useSelector(selectSelectedDate);
  const selectedCourse = useSelector(selectSelectedCourse);
  const selectedBranch = useSelector(selectSelectedBranch);
  const searchTerm = useSelector(selectSearchTerm);
  const isLoading = useSelector(selectIsLoading);
  const filteredBookings = useSelector(selectFilteredBookings);
  const isAdminLoggedIn = useSelector(selectIsAdminLoggedIn);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        dispatch(setIsLoading(true));
        const data = await bookingAPI.getBookings();
        const transformedBookings = data.map(booking => ({
          id: booking._id,
          date: booking.date,
          name: booking.name,
          email: booking.email,
          lesson: booking.lesson,
          course: booking.course,
          branch: booking.branch
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
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const selectedDateString = `${year}-${month}-${day}`;
      
      filtered = filtered.filter(booking => booking.date === selectedDateString);
    }

    if (selectedCourse) {
      filtered = filtered.filter(booking => booking.course === selectedCourse);
    }

    if (selectedBranch) {
      filtered = filtered.filter(booking => booking.branch === selectedBranch);
    }

    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(booking => 
        booking.name.toLowerCase().includes(searchLower) ||
        booking.email.toLowerCase().includes(searchLower)
      );
    }

    dispatch(setFilteredBookings(filtered));
  }, [selectedDate, selectedCourse, selectedBranch, searchTerm, bookings, dispatch]);

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  const handleExportBookings = () => {
    exportBookingsToCSV(filteredBookings, {
      selectedDate,
      selectedCourse,
      selectedBranch,
      searchTerm
    });
  };
  const onLogoutControl = () => {
    // onLogout();
    dispatch(logoutAdmin());
    dispatch(clearAdminState())
  }

  useEffect(() => {
    if (!isAdminLoggedIn) {
      // If admin is not logged in, navigate to admin login page
      navigate('/admin');
    }
  }, [isAdminLoggedIn, navigate]);

  const handleDeleteBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await bookingAPI.deleteBooking(bookingId);
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
        <button onClick={onLogoutControl} className="logout-button">
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
                <span className="search-icon">
                  <Search size={18} />
                </span>
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

            <div className="filter-group">
              <label htmlFor="branch-filter">Filter by Branch:</label>
              <select
                id="branch-filter"
                value={selectedBranch}
                onChange={(e) => dispatch(setSelectedBranch(e.target.value))}
                className="branch-filter-select"
              >
                <option value="">All Branches</option>
                {BRANCH.map((branch) => (
                  <option key={branch} value={branch}>
                    {branch}
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


        <div className="bookings-table-container">
          <h2>
            Total Bookings: {filteredBookings.length}
          </h2>
          
          {filteredBookings.length === 0 ? (
            <div className="no-bookings">
              <p>No bookings found 
                {selectedDate ? ' for the selected date' : ''}
                {selectedCourse ? ' for the selected course' : ''}
                {selectedBranch ? ' for the selected branch' : ''}
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
                    <th>Branch</th>
                    <th>Lesson</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map(booking => (
                    <tr key={booking.id}>
                      <td data-label="Date">{booking.date}</td>
                      <td data-label="Student Name">{booking.name}</td>
                      <td data-label="Email">{booking.email}</td>
                      <td data-label="Course">{booking.course}</td>
                      <td data-label="Branch">{booking.branch}</td>
                      <td data-label="Lesson">{booking.lesson}</td>
                      <td data-label="Actions">
                        <div className="action-buttons">
                          <button 
                            onClick={() => handleDeleteBooking(booking.id)}
                            className="action-btn delete-btn"
                            title="Delete booking"
                          >
                            <Trash2 size={16} />
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