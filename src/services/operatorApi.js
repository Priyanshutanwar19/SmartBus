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
      const response = await fetch(`${OPERATOR_AUTH_URL}/auth/login`, {
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

      return { data };
    } catch (error) {
      throw error;
    }
  },

  register: async (name, email, password, contactInfo) => {
    try {
      const response = await fetch(`${OPERATOR_AUTH_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ 
          name, 
          email, 
          password, 
          contactInfo,
          role: 'OPERATOR'
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
  getRoutes: () => apiRequest('/bus-routes'),
  
  addRoute: (routeData) => 
    apiRequest('/bus-routes/add', {
      method: 'POST',
      body: JSON.stringify(routeData),
    }),

  searchRoutes: (query) => 
    apiRequest(`/bus-routes/search?${query}`),
};

// Bus Schedule APIs
export const operatorScheduleAPI = {
  getSchedules: () => apiRequest('/bus-schedule'),
  
  getSchedulesByBus: (busId) =>
    apiRequest(`/bus-schedule/bus/${busId}`),
  
  addSchedule: (scheduleData) => 
    apiRequest('/bus-schedule/add', {
      method: 'POST',
      body: JSON.stringify(scheduleData),
    }),

  searchSchedules: (query) =>
    apiRequest(`/bus-schedule/search?${query}`),
};

const operatorApi = { 
  operatorAuthAPI, 
  operatorBusAPI,
  operatorRouteAPI,
  operatorScheduleAPI,
};

export default operatorApi;
