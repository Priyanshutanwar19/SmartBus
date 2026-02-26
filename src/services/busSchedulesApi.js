import apiRequest from './api';

// Bus Schedules API endpoints
export const busSchedulesAPI = {
  // Search for bus schedules between two cities on a specific date
  searchSchedules: async (fromCityId, toCityId, date) => {
    const params = new URLSearchParams({
      fromCityId: fromCityId.toString(),
      toCityId: toCityId.toString(),
      date: date, // Format: YYYY-MM-DD
    });

    return await apiRequest(`/bus-schedules/search?${params.toString()}`);
  },

  // Get all schedules for a specific bus
  getBusSchedules: async (busId) => {
    return await apiRequest(`/bus-schedules/bus/${busId}`);
  },

  // Get all schedules (for operators)
  getAllSchedules: async () => {
    return await apiRequest('/bus-schedules');
  },
};

export default busSchedulesAPI;
