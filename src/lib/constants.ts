// Application Constants
export const APP_NAME = 'FuelPass';
export const APP_DESCRIPTION = 'Professional Fuel Order Management System';

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
  },
  FUEL_ORDERS: {
    BASE: '/fuel-orders',
    BY_ID: (id: string) => `/fuel-orders/${id}`,
    BY_USER: (userId: string) => `/fuel-orders/user/${userId}`,
    BY_AIRPORT: (airportCode: string) => `/fuel-orders/airport/${airportCode}`,
    STATUS_UPDATE: (id: string) => `/fuel-orders/${id}/status`,
    STATISTICS: '/fuel-orders/statistics',
  },
} as const;

// Order Status Options
export const ORDER_STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Pending', color: 'yellow' },
  { value: 'CONFIRMED', label: 'Confirmed', color: 'blue' },
  { value: 'COMPLETED', label: 'Completed', color: 'green' },
  { value: 'CANCELLED', label: 'Cancelled', color: 'red' },
] as const;

// User Roles
export const USER_ROLES = {
  AIRCRAFT_OPERATOR: 'AIRCRAFT_OPERATOR',
  OPERATIONS_MANAGER: 'OPERATIONS_MANAGER',
} as const;

// Validation Constants
export const VALIDATION_LIMITS = {
  TAIL_NUMBER: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 10,
  },
  ICAO_CODE: {
    LENGTH: 4,
  },
  FUEL_VOLUME: {
    MIN: 1,
    MAX: 100000,
  },
  DELIVERY_WINDOW: {
    MAX_HOURS: 24,
  },
  NOTES: {
    MAX_LENGTH: 500,
  },
} as const;

// Pagination Defaults
export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  DISPLAY_WITH_TIME: 'MMM dd, yyyy HH:mm',
  TIME_ONLY: 'HH:mm',
  API: "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
} as const;

// Common Airport ICAO Codes (for reference)
export const COMMON_AIRPORTS = [
  'KJFK', // John F. Kennedy International Airport
  'KLAX', // Los Angeles International Airport
  'KORD', // Chicago O'Hare International Airport
  'KDFW', // Dallas/Fort Worth International Airport
  'KATL', // Hartsfield-Jackson Atlanta International Airport
  'KLAS', // Harry Reid International Airport
  'KSEA', // Seattle-Tacoma International Airport
  'KMIA', // Miami International Airport
  'KBOS', // Logan International Airport
  'KIAH', // George Bush Intercontinental Airport
] as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied. You do not have permission to access this resource.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  ORDER_CREATED: 'Fuel order created successfully!',
  ORDER_UPDATED: 'Order status updated successfully!',
  LOGIN_SUCCESS: 'Login successful!',
  LOGOUT_SUCCESS: 'Logged out successfully!',
} as const;
