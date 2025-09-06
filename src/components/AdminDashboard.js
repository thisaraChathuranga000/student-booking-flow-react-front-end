import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useBookings } from '../context/BookingContext';
import { COURSE_OPTIONS } from '../constants/courseOptions';
import './AdminDashboard.css';

const AdminDashboard = ({ onLogout }) => {
  const { bookings, updateBookingStatus, deleteBooking } = useBookings();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = bookings;

    // Filter by date if selected
    if (selectedDate) {
      const selectedDateString = selectedDate.toISOString().split('T')[0];
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

    setFilteredBookings(filtered);
  }, [selectedDate, selectedCourse, searchTerm, bookings]);

  const getStatusBadge = (status) => {
    const statusClass = status === 'confirmed' ? 'status-confirmed' : 'status-pending';
    return <span className={`status-badge ${statusClass}`}>{status}</span>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const clearFilters = () => {
    setSelectedDate(null);
    setSelectedCourse('');
    setSearchTerm('');
  };

  const exportBookings = () => {
    const dataToExport = filteredBookings;
    const csvContent = [
      ['Date', 'Time', 'Name', 'Email', 'Course', 'Lesson', 'Status'],
      ...dataToExport.map(booking => [
        booking.date,
        booking.time,
        booking.name,
        booking.email,
        booking.course,
        booking.lesson,
        booking.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    
    // Generate filename based on filters
    let filename = 'bookings';
    if (selectedDate) {
      filename += `-${selectedDate.toISOString().split('T')[0]}`;
    }
    if (selectedCourse) {
      filename += `-${selectedCourse.replace(/\s+/g, '-')}`;
    }
    if (searchTerm) {
      filename += `-search-${searchTerm.replace(/\s+/g, '-')}`;
    }
    filename += '.csv';
    
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
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
                  onChange={(e) => setSearchTerm(e.target.value)}
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
                onChange={(date) => setSelectedDate(date)}
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
                onChange={(e) => setSelectedCourse(e.target.value)}
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
              <button onClick={clearFilters} className="clear-filters-btn">
                Clear Filters
              </button>
              <button onClick={exportBookings} className="export-button">
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
                  <button onClick={() => setSelectedDate(null)} className="remove-filter">×</button>
                </span>
              )}
              {selectedCourse && (
                <span className="filter-tag">
                  Course: {selectedCourse}
                  <button onClick={() => setSelectedCourse('')} className="remove-filter">×</button>
                </span>
              )}
              {searchTerm && (
                <span className="filter-tag">
                  Search: "{searchTerm}"
                  <button onClick={() => setSearchTerm('')} className="remove-filter">×</button>
                </span>
              )}
            </div>
          </div>
        )}

        <div className="bookings-summary">
          <div className="summary-card">
            <h3>Total Bookings</h3>
            <p className="summary-number">{filteredBookings.length}</p>
          </div>
          <div className="summary-card">
            <h3>Confirmed</h3>
            <p className="summary-number confirmed">
              {filteredBookings.filter(b => b.status === 'confirmed').length}
            </p>
          </div>
          <div className="summary-card">
            <h3>Pending</h3>
            <p className="summary-number pending">
              {filteredBookings.filter(b => b.status === 'pending').length}
            </p>
          </div>
        </div>

        <div className="bookings-table-container">
          <h2>
            Booking Details
            {selectedDate && (
              <span className="selected-date"> for {formatDate(selectedDate.toISOString().split('T')[0])}</span>
            )}
            {selectedCourse && (
              <span className="selected-course"> - {selectedCourse}</span>
            )}
            {searchTerm && (
              <span className="search-term"> matching "{searchTerm}"</span>
            )}
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
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map(booking => (
                    <tr key={booking.id}>
                      <td>{formatDate(booking.date)}</td>
                      <td>{booking.name}</td>
                      <td>{booking.email}</td>
                      <td>{booking.course}</td>
                      <td>{booking.lesson}</td>
                      <td>{getStatusBadge(booking.status)}</td>
                      <td>
                        <div className="action-buttons">
                          {booking.status === 'pending' && (
                            <button 
                              onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                              className="action-btn confirm-btn"
                              title="Confirm booking"
                            >
                              ✓
                            </button>
                          )}
                          {booking.status === 'confirmed' && (
                            <button 
                              onClick={() => updateBookingStatus(booking.id, 'pending')}
                              className="action-btn pending-btn"
                              title="Mark as pending"
                            >
                              ⏳
                            </button>
                          )}
                          <button 
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete this booking?')) {
                                deleteBooking(booking.id);
                              }
                            }}
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
