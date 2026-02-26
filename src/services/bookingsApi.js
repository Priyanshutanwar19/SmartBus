import apiRequest from './api';

// Bookings API endpoints
export const bookingsAPI = {
    // Lock seats for a schedule
    lockSeats: async ({ scheduleId, seatNumbers }) => {
      return await apiRequest('/bookings/lock-seats', {
        method: 'POST',
        data: { scheduleId, seatNumbers },
      });
    },
  // Get seat plan for a schedule
  getSeatPlan: async (scheduleId) => {
    return await apiRequest(`/bookings/seat-plan/${scheduleId}`);
  },

  // Create a new booking
  createBooking: async (bookingData) => {
    return await apiRequest('/bookings/create', {
      method: 'POST',
      data: bookingData,
    });
  },

  // Get user's bookings
  getMyBookings: async () => {
    return await apiRequest('/bookings/');
  },

  // Get booking by ID
  getBookingById: async (bookingId) => {
    return await apiRequest(`/bookings/${bookingId}`);
  },

  // Cancel booking
  cancelBooking: async (bookingId) => {
    return await apiRequest(`/bookings/${bookingId}/cancel`, {
      method: 'POST',
    });
  },
};

export default bookingsAPI;
