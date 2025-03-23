import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    
    // Default error message
    let errorMessage = 'Something went wrong. Please try again later.';
    
    if (response) {
      // Server responded with an error status code
      const { status, data } = response;
      
      if (status === 401) {
        // Unauthorized: Token expired or invalid
        if (localStorage.getItem('token')) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          errorMessage = 'Your session has expired. Please log in again.';
        } else {
          errorMessage = 'Authentication required. Please log in.';
        }
      } else if (status === 403) {
        // Forbidden: Not enough permissions
        errorMessage = 'You do not have permission to perform this action.';
      } else if (status === 404) {
        // Not found
        errorMessage = 'The requested resource was not found.';
      } else if (status === 429) {
        // Too many requests
        errorMessage = 'Too many requests. Please try again later.';
      } else if (status >= 500) {
        // Server error
        errorMessage = 'Server error. Please try again later.';
      }
      
      // Use the error message from the API if available
      if (data && data.message) {
        errorMessage = data.message;
      }
    } else if (error.request) {
      // Request made but no response received (network error)
      errorMessage = 'Network error. Please check your connection.';
    }
    
    // Show error toast
    toast.error(errorMessage);
    
    return Promise.reject(error);
  }
);

export default api;