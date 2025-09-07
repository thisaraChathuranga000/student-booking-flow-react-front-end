export const exportBookingsToCSV = (bookings, filters = {}) => {
  const { selectedDate, selectedCourse, searchTerm } = filters;
  
  const csvContent = [
    ['Date', 'Time', 'Name', 'Email', 'Course', 'Lesson', 'Status'],
    ...bookings.map(booking => [
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

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
