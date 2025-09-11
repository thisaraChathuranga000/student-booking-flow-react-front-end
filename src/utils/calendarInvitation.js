// Only keep the function to call backend API for sending calendar invitation

export async function sendCalendarInvitation(bookingData) {
  try {
    const response = await fetch('/api/send-calendar-invitation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
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
