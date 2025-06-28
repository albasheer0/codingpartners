import axios from 'axios';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('authToken');
          window.location.href = '/login';
          break;
        case 403:
          // Forbidden
          console.error('Access forbidden:', data.message);
          break;
        case 404:
          // Not found
          console.error('Resource not found:', data.message);
          break;
        case 500:
          // Server error
          console.error('Server error:', data.message);
          break;
        default:
          console.error('API error:', data.message);
      }
      
      return Promise.reject({
        status,
        message: data.message || 'An error occurred',
        error: data.error || 'Unknown error'
      });
    } else if (error.request) {
      // Network error
      console.error('Network error:', error.message);
      return Promise.reject({
        status: 0,
        message: 'Network error - please check your connection',
        error: 'Network error'
      });
    } else {
      // Other error
      console.error('Request error:', error.message);
      return Promise.reject({
        status: 0,
        message: 'Request failed',
        error: error.message
      });
    }
  }
);

// Habit API methods
export const habitAPI = {
  // Get all habits
  getAll: async (limit, offset) => {
    let url = '/habits';
    const params = [];
    if (typeof limit === 'number') params.push(`limit=${limit}`);
    if (typeof offset === 'number') params.push(`offset=${offset}`);
    if (params.length) url += '?' + params.join('&');
    return await api.get(url);
  },

  // Get a habit by ID
  getById: async (id) => {
    return await api.get(`/habits/${id}`);
  },

  // Create a new habit
  create: async (habitData) => {
    return await api.post('/habits', habitData);
  },

  // Update a habit
  update: async (id, habitData) => {
    return await api.put(`/habits/${id}`, habitData);
  },

  // Delete a habit
  delete: async (id) => {
    return await api.delete(`/habits/${id}`);
  },

  // Toggle habit completion for today
  toggleForToday: async (id) => {
    return await api.patch(`/habits/${id}/toggle`);
  },

  // Mark habit as completed for today
  markCompletedForToday: async (id) => {
    return await api.patch(`/habits/${id}/complete`);
  },

  // Mark habit as not completed for today
  markNotCompletedForToday: async (id) => {
    return await api.patch(`/habits/${id}/uncomplete`);
  },

  // Get habit statistics
  getStatistics: async () => {
    return await api.get('/habits/stats/statistics');
  },

  // Get habits with completion history
  getHistory: async (days = 7, limit, offset) => {
    let url = `/habits/history?days=${days}`;
    if (typeof limit === 'number') url += `&limit=${limit}`;
    if (typeof offset === 'number') url += `&offset=${offset}`;
    return await api.get(url);
  },

  // Get summary of all habits
  getSummary: async () => {
    return await api.get('/habits/summary');
  },

  // Get all habits (id and name only)
  getAllIdName: async () => {
    return await api.get('/habits/list');
  }
};

// Auth API methods (for mock authentication)
export const authAPI = {
  // Mock login
  login: async (credentials) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock validation
    if (credentials.username === 'demo' && credentials.password === 'password') {
      const token = 'mock-jwt-token-' + Date.now();
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify({
        id: 1,
        username: credentials.username,
        name: 'Demo User'
      }));
      
      return {
        success: true,
        data: {
          token,
          user: {
            id: 1,
            username: credentials.username,
            name: 'Demo User'
          }
        },
        message: 'Login successful'
      };
    } else {
      throw new Error('Authentication required');
    }
  },

  // Mock logout
  logout: async () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    
    return {
      success: true,
      message: 'Logout successful'
    };
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    return !!(token && user);
  },

  // Get current user
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};

// Health check API
export const healthAPI = {
  check: async () => {
    return await axios.get(process.env.REACT_APP_API_URL || 'http://localhost:5000/health');
  }
};

export default api; 