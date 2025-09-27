// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8081/api',
  WEBSOCKET_URL: process.env.REACT_APP_WS_URL || 'http://localhost:8081/ws',
  TIMEOUT: 10000, // 10 seconds
};

// CORS configuration for development
export const CORS_CONFIG = {
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
};