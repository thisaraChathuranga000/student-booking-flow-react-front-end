export function generateICSContent(bookingData) {
  const { name, email, course, lesson, date, time, duration = 6, center } = bookingData;
  const bookingDate = new Date(date);
  const [hours, minutes] = time.split(':').map(Number);
  const startTime = new Date(bookingDate);
  startTime.setHours(hours, minutes || 0, 0, 0);
  const endTime = new Date(startTime);
  endTime.setHours(startTime.getHours() + duration);
  
  const formatICSDate = (date) => {
    return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  };
  
  const startICS = formatICSDate(startTime);
  const endICS = formatICSDate(endTime);
  const nowICS = formatICSDate(new Date());
  
  const uid = `booking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}@sugar-studio.com`;
  
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Sugar Studio//Booking System//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${nowICS}`,
    `DTSTART:${startICS}`,
    `DTEND:${endICS}`,
    `SUMMARY:${course} - ${center.title}`,
    `DESCRIPTION:Learning Session\\n\\nStudent: ${name}\\nCourse: ${course}\\nLesson: ${lesson}\\nDuration: ${duration} hours\\n\\nLocation: ${center.address}`,
    `LOCATION:${center.address}`,
    `ORGANIZER;CN=${center.org}:MAILTO:${process.env.EMAIL_USER}`,
    `ATTENDEE;CN=${name};RSVP=TRUE:MAILTO:${email}`,
    'STATUS:CONFIRMED',
    'TRANSP:OPAQUE',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
  
  return icsContent;
}

export function downloadICSFile(bookingData, filename = 'booking-invitation.ics') {
  const icsContent = generateICSContent(bookingData);
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

export async function sendCalendarInvitation(bookingData) {
  const icsContent = generateICSContent(bookingData);
  
  try {
    const response = await fetch('/api/send-calendar-invitation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: bookingData.email,
        subject: `Calendar Invitation: ${bookingData.course} - ${bookingData.center.title}`,
        icsContent,
        bookingData
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to send calendar invitation');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error sending calendar invitation:', error);
    throw error;
  }
}

export function generateGoogleCalendarURL(bookingData) {
  const { name, course, lesson, date, time, duration = 6, center } = bookingData;
  const bookingDate = new Date(date);
  const [hours, minutes] = time.split(':').map(Number);
  const startTime = new Date(bookingDate);
  startTime.setHours(hours, minutes || 0, 0, 0);
  const endTime = new Date(startTime);
  endTime.setHours(startTime.getHours() + duration);
  
  const formatGoogleDate = (date) => {
    return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  };
  
  const startFormatted = formatGoogleDate(startTime);
  const endFormatted = formatGoogleDate(endTime);
  
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `${course} - ${center.title}`,
    dates: `${startFormatted}/${endFormatted}`,
    details: `Learning Session\n\nStudent: ${name}\nCourse: ${course}\nLesson: ${lesson}\nDuration: ${duration} hours\n\nLocation: ${center.address}`,
    location: center.address,
    trp: 'false'
  });
  
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function generateOutlookCalendarURL(bookingData) {
  const { name, course, lesson, date, time, duration = 6, center } = bookingData;
  const bookingDate = new Date(date);
  const [hours, minutes] = time.split(':').map(Number);
  const startTime = new Date(bookingDate);
  startTime.setHours(hours, minutes || 0, 0, 0);
  const endTime = new Date(startTime);
  endTime.setHours(startTime.getHours() + duration);
  
  const params = new URLSearchParams({
    subject: `${course} - ${center.title}`,
    startdt: startTime.toISOString(),
    enddt: endTime.toISOString(),
    body: `Learning Session\n\nStudent: ${name}\nCourse: ${course}\nLesson: ${lesson}\nDuration: ${duration} hours\n\nLocation: ${center.address}`,
    location: center.address
  });
  
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

export function generateCalendarLinks(bookingData) {
  return {
    google: generateGoogleCalendarURL(bookingData),
    outlook: generateOutlookCalendarURL(bookingData),
    downloadICS: () => downloadICSFile(bookingData)
  };
}
