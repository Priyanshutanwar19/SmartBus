const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Helper function to make API calls
const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('adminToken');
  
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
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      window.location.href = '/admin/login';
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
export const adminAuthAPI = {
  login: (email, password) => 
    apiRequest('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
};

// User Management APIs
export const adminUserAPI = {
  getAllUsers: () => apiRequest('/admin/users'),
  deleteUser: (id) => 
    apiRequest(`/admin/users/${id}`, {
      method: 'DELETE',
    }),
  changeUserRole: (id, role) => 
    apiRequest(`/admin/users/${id}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    }),
};

// Operator Management APIs
export const adminOperatorAPI = {
  addOperator: (formData) => 
    apiRequest('/admin/operators/add', {
      method: 'POST',
      body: formData,
    }),
  deleteOperator: (id) => 
    apiRequest(`/admin/operators/delete/${id}`, {
      method: 'DELETE',
    }),
  uploadLogo: (id, formData) => 
    apiRequest(`/admin/operators/${id}/logo`, {
      method: 'PATCH',
      body: formData,
    }),
};

const adminApi = { adminAuthAPI, adminUserAPI, adminOperatorAPI };
export default adminApi;
