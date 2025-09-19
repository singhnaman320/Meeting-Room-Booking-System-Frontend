// API Configuration - matches backend endpoints exactly
const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  
  // API Endpoints - must match server/config/config.js
  ENDPOINTS: {
    // Authentication endpoints
    AUTH: {
      BASE: '/api/auth',
      REGISTER: '/api/auth/register',
      LOGIN: '/api/auth/login',
      ME: '/api/auth/me'
    },
    
    // Room endpoints
    ROOMS: {
      BASE: '/api/rooms',
      BY_ID: (id) => `/api/rooms/${id}`,
      AVAILABILITY: (id) => `/api/rooms/${id}/availability`
    },
    
    // Booking endpoints
    BOOKINGS: {
      BASE: '/api/bookings',
      MY_BOOKINGS: '/api/bookings/my-bookings',
      BY_ID: (id) => `/api/bookings/${id}`,
      CANCEL: (id) => `/api/bookings/${id}/cancel`
    },
    
    // User endpoints
    USERS: {
      PROFILE: '/api/users/profile',
    },
    
    // Health check
    HEALTH: '/api/health'
  }
};

export default API_CONFIG;
