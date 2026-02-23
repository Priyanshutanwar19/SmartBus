import apiRequest from './api';

// Bus Routes API endpoints
export const routesAPI = {
  // Get all routes
  getAllRoutes: async () => {
    return await apiRequest('/routes');
  },

  // Search for routes between two cities
  searchRoutes: async (cityAId, cityBId) => {
    return await apiRequest(`/routes/search?cityAId=${cityAId}&cityBId=${cityBId}`);
  },

  // Add new route (OPERATOR/ADMIN only)
  addRoute: async (routeData) => {
    return await apiRequest('/routes/add', {
      method: 'POST',
      data: routeData,
    });
  },
};

// Buses API endpoints
export const busesAPI = {
  // Get all buses (OPERATOR/ADMIN only)
  getAllBuses: async () => {
    return await apiRequest('/buses');
  },

  // Add new bus (OPERATOR/ADMIN only)
  addBus: async (busData) => {
    return await apiRequest('/buses/add', {
      method: 'POST',
      data: busData,
    });
  },

  // Remove bus (OPERATOR/ADMIN only)
  removeBus: async (busId) => {
    return await apiRequest(`/buses/remove/${busId}`, {
      method: 'POST',
    });
  },
};

export { routesAPI as default };
