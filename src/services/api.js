import axios from 'axios';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Handle 401 Unauthorized - token expired
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    const errorMessage = error.response?.data?.message || error.message || 'API request failed';
    console.error('API Error:', errorMessage);
    return Promise.reject(new Error(errorMessage));
  }
);

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const { method = 'GET', data, headers, ...restOptions } = options;
  
  try {
    return await axiosInstance({
      url: endpoint,
      method,
      data,
      headers,
      ...restOptions,
    });
  } catch (error) {
    throw error;
  }
};

// API configuration export
export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  request: apiRequest,
  axios: axiosInstance,
};

export default apiRequest;
