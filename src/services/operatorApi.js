const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
const OPERATOR_AUTH_URL = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:3001';

// Helper function to make API calls
const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('operatorToken');
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  // Don't set Content-Type for FormData (browser will set it with boundary)
  if (options.body instanceof FormData) {
    delete defaultHeaders['Content-Type'];
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: 'include',
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    // Handle unauthorized
    if (response.status === 401) {
      localStorage.removeItem('operatorToken');
      localStorage.removeItem('operatorUser');
      window.location.href = '/operator/login';
      throw new Error('Unauthorized');
    }

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.message || 'API request failed');
      error.response = {
        data,
        status: response.status,
      };
      throw error;
    }

    return { data };
  } catch (error) {
    throw error;
  }
};

// Auth APIs
export const operatorAuthAPI = {
  login: async (email, password) => {
    try {
      const response = await fetch(`${OPERATOR_AUTH_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        const error = new Error(data.message || 'Login failed');
        error.response = { data, status: response.status };
        throw error;
      }

      // Check if user is an operator
      if (data.user.role !== 'OPERATOR') {
        const error = new Error('Access denied. Operators only.');
        error.response = { data: { message: 'Access denied. Operators only.' }, status: 403 };
        throw error;
      }

      return { data: { ...data, token: data.accessToken } };
    } catch (error) {
      throw error;
    }
  },

  register: async (name, email, password, contactInfo) => {
    try {
      const response = await fetch(`${OPERATOR_AUTH_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ 
          name, 
          email, 
          password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const error = new Error(data.message || 'Registration failed');
        error.response = { data, status: response.status };
        throw error;
      }

      return { data };
    } catch (error) {
      throw error;
    }
  },
};

// Bus Management APIs
export const operatorBusAPI = {
  getBuses: () => apiRequest('/buses'),
  
  addBus: (busData) => 
    apiRequest('/buses/add', {
      method: 'POST',
      body: JSON.stringify(busData),
    }),

  removeBus: (id) => 
    apiRequest(`/buses/remove/${id}`, {
      method: 'POST',
    }),
};

// Bus Routes APIs
export const operatorRouteAPI = {
  getRoutes: () => apiRequest('/routes'),
  
  addRoute: (routeData) => 
    apiRequest('/routes/add', {
      method: 'POST',
      body: JSON.stringify(routeData),
    }),

  searchRoutes: (query) => 
    apiRequest(`/routes/search?${query}`),
};

// Bus Schedule APIs
export const operatorScheduleAPI = {
  getSchedules: () => apiRequest('/bus-schedules'),
  
  getSchedulesByBus: (busId) =>
    apiRequest(`/bus-schedules/bus/${busId}`),
  
  addSchedule: (scheduleData) => 
    apiRequest('/bus-schedules/add', {
      method: 'POST',
      body: JSON.stringify(scheduleData),
    }),

  searchSchedules: (query) =>
    apiRequest(`/bus-schedules/search?${query}`),
};

// City Management APIs
export const operatorCityAPI = {
  getCities: (query = '') => apiRequest(`/cities?q=${query}`),
  
  getStates: () => apiRequest('/cities/states'),
  
  addState: (name) => 
    apiRequest('/cities/states/add', {
      method: 'POST',
      body: JSON.stringify({ name }),
    }),
  
  addCity: (formData) => 
    apiRequest('/cities/add', {
      method: 'POST',
      body: formData,
    }),

  removeCity: (id) => 
    apiRequest(`/cities/remove/${id}`, {
      method: 'DELETE',
    }),
};

const operatorApi = { 
  operatorAuthAPI, 
  operatorBusAPI,
  operatorRouteAPI,
  operatorScheduleAPI,
  operatorCityAPI,
};

export default operatorApi;
