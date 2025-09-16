import axios from 'axios';
import API_CONFIG from '../config/api';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
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

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('API Error:', error.response?.data);
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API Service functions
const apiService = {
  // Authentication
  auth: {
    register: (userData) => apiClient.post(API_CONFIG.ENDPOINTS.AUTH.REGISTER, userData),
    login: (credentials) => apiClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, credentials),
    getMe: () => apiClient.get(API_CONFIG.ENDPOINTS.AUTH.ME),
    testUsers: () => apiClient.get('/api/auth/test-users'),
  },

  // Rooms
  rooms: {
    getAll: (params) => apiClient.get(API_CONFIG.ENDPOINTS.ROOMS.BASE, { params }),
    getById: (id) => apiClient.get(API_CONFIG.ENDPOINTS.ROOMS.BY_ID(id)),
    getAvailability: (id, params) => apiClient.get(API_CONFIG.ENDPOINTS.ROOMS.AVAILABILITY(id), { params }),
    create: (roomData) => apiClient.post(API_CONFIG.ENDPOINTS.ROOMS.BASE, roomData),
    update: (id, roomData) => apiClient.put(API_CONFIG.ENDPOINTS.ROOMS.BY_ID(id), roomData),
    delete: (id) => apiClient.delete(API_CONFIG.ENDPOINTS.ROOMS.BY_ID(id)),
  },

  // Bookings
  bookings: {
    getAll: (params) => apiClient.get(API_CONFIG.ENDPOINTS.BOOKINGS.BASE, { params }),
    getMyBookings: (params) => apiClient.get(API_CONFIG.ENDPOINTS.BOOKINGS.MY_BOOKINGS, { params }),
    getById: (id) => apiClient.get(API_CONFIG.ENDPOINTS.BOOKINGS.BY_ID(id)),
    create: (bookingData) => apiClient.post(API_CONFIG.ENDPOINTS.BOOKINGS.BASE, bookingData),
    update: (id, bookingData) => apiClient.put(API_CONFIG.ENDPOINTS.BOOKINGS.BY_ID(id), bookingData),
    cancel: (id, data) => apiClient.patch(API_CONFIG.ENDPOINTS.BOOKINGS.CANCEL(id), data),
    delete: (id) => apiClient.delete(API_CONFIG.ENDPOINTS.BOOKINGS.BY_ID(id)),
  },

  // Users
  users: {
    getAll: () => apiClient.get(API_CONFIG.ENDPOINTS.USERS.BASE),
    getById: (id) => apiClient.get(API_CONFIG.ENDPOINTS.USERS.BY_ID(id)),
    updateProfile: (userData) => apiClient.put(API_CONFIG.ENDPOINTS.USERS.PROFILE, userData),
    updateRole: (id, roleData) => apiClient.patch(API_CONFIG.ENDPOINTS.USERS.ROLE(id), roleData),
  },

  // Health check
  health: () => apiClient.get(API_CONFIG.ENDPOINTS.HEALTH),

  // Test endpoints for debugging
  test: {
    checkConnection: () => apiClient.get('/api/health'),
    getUsers: () => apiClient.get('/api/auth/test-users'),
  },
};

export default apiService;
