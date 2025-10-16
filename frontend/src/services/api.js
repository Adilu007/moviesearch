// API service for backend communication
import axios from 'axios';

// Base URL for your backend
const BASE_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  // Register new user
  register: async (email, password) => {
    try {
      console.log('🔄 Attempting registration...', { email });
      const response = await api.post('/auth/register', {
        email,
        password
      });
      console.log('✅ Registration successful:', response.data);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('❌ Registration failed:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Registration failed'
      };
    }
  },

  // Login user
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', {
        email,
        password
      });
      
      // Store token and user data
      const { token, user } = response.data.data;
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return {
        success: true,
        data: { token, user },
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }
};

// Movies API functions
export const moviesAPI = {
  // Search movies via backend (which uses OMDb API)
  search: async (title) => {
    try {
      const response = await api.get(`/movies/search?title=${encodeURIComponent(title)}`);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Movie search failed'
      };
    }
  },

  // Save movie to user's collection
  save: async (movie) => {
    try {
      const response = await api.post('/movies/save', {
        title: movie.Title || movie.title,
        year: movie.Year || movie.year,
        poster: movie.Poster || movie.poster,
        imdbID: movie.imdbID
      });
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to save movie'
      };
    }
  },

  // Get user's saved movies
  getSaved: async () => {
    try {
      const response = await api.get('/movies/list');
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch saved movies'
      };
    }
  },

  // Remove movie from user's collection
  remove: async (imdbID) => {
    try {
      const response = await api.delete(`/movies/remove/${imdbID}`);
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to remove movie'
      };
    }
  }
};

// Utility function to check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('authToken');
  const user = localStorage.getItem('user');
  return !!(token && user);
};

// Get current user from localStorage
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export default api;