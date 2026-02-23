import apiRequest from './api';

// Cities API endpoints
export const citiesAPI = {
  // Get all cities
  getAllCities: async () => {
    return await apiRequest('/cities');
  },

  // Get all states
  getAllStates: async () => {
    return await apiRequest('/cities/states');
  },

  // Add new city (ADMIN only)
  addCity: async (cityData) => {
    const formData = new FormData();
    Object.keys(cityData).forEach(key => {
      formData.append(key, cityData[key]);
    });

    return await apiRequest('/cities/add', {
      method: 'POST',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // Add new state (ADMIN only)
  addState: async (stateName) => {
    return await apiRequest('/cities/states/add', {
      method: 'POST',
      data: { name: stateName },
    });
  },

  // Remove city (ADMIN only)
  removeCity: async (cityId) => {
    return await apiRequest(`/cities/remove/${cityId}`, {
      method: 'DELETE',
    });
  },

  // Upload city image (ADMIN only)
  uploadCityImage: async (cityId, imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    return await apiRequest(`/cities/${cityId}/image`, {
      method: 'PATCH',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export default citiesAPI;
