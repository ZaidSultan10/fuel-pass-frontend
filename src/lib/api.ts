import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ApiResponse } from '@/types';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    REGISTER: '/auth/register',
  },
  
  // Users
  USERS: {
    BASE: '/users',
    ME: '/users/me',
    BY_ID: (id: string) => `/users/${id}`,
    STATISTICS: '/users/statistics',
    SEARCH: '/users/search',
    BY_ROLE: (role: string) => `/users/role/${role}`,
    CHANGE_PASSWORD: '/users/me/password',
    ACTIVATE: (id: string) => `/users/${id}/activate`,
    DEACTIVATE: (id: string) => `/users/${id}/deactivate`,
  },
  
  // Fuel Orders
  FUEL_ORDERS: {
    BASE: '/fuel-orders',
    BY_ID: (id: string) => `/fuel-orders/${id}`,
    STATUS: (id: string) => `/fuel-orders/${id}/status`,
    STATISTICS: '/fuel-orders/statistics',
    BY_USER: (userId: string) => `/fuel-orders/user/${userId}`,
    BY_AIRPORT: (airportCode: string) => `/fuel-orders/airport/${airportCode}`,
  },
  
  // Airports
  AIRPORTS: {
    BASE: '/airports',
    BY_ID: (id: string) => `/airports/${id}`,
    BY_ICAO: (icaoCode: string) => `/airports/icao/${icaoCode}`,
    SEARCH: '/airports/search',
    ACTIVE: '/airports/active',
  },
} as const;

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management - using HTTP-only cookies
const getToken = (): string | null => {
  // Tokens are now handled by HTTP-only cookies
  // The browser will automatically include them in requests
  return null;
};

const getRefreshToken = (): string | null => {
  // Refresh tokens are also handled by HTTP-only cookies
  return null;
};

const setTokens = (token: string, refreshToken: string): void => {
  // Tokens are now set by the server as HTTP-only cookies
  // No client-side storage needed
};

const clearTokens = (): void => {
  // Tokens are cleared by server via HTTP-only cookies
  // User data is managed by Zustand store
};

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // With HTTP-only cookies, we don't need to manually add Authorization header
    // The browser automatically includes cookies in requests
    // Just ensure credentials are included
    config.withCredentials = true;
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh token using HTTP-only cookies
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, {
          withCredentials: true,
        });

        // If refresh successful, retry original request
        if (response.status === 200) {
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        clearTokens();
        // Use Next.js router for navigation instead of window.location
        // This will be handled by the auth store
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    if (error.response?.status === 403) {
      // Forbidden - user doesn't have permission
      throw new Error('You do not have permission to perform this action');
    }

    if (error.response?.status && error.response.status >= 500) {
      // Server error
      throw new Error('Server error. Please try again later.');
    }

    return Promise.reject(error);
  }
);

// Generic API methods
export const api = {
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    const response = await apiClient.get(url, config);
    return response.data;
  },

  post: async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    const response = await apiClient.post(url, data, config);
    return response.data;
  },

  put: async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    const response = await apiClient.put(url, data, config);
    return response.data;
  },

  patch: async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    const response = await apiClient.patch(url, data, config);
    return response.data;
  },

  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    const response = await apiClient.delete(url, config);
    return response.data;
  },
};

// Error handling utility
export const handleApiError = (error: unknown): string => {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as { response?: { data?: { message?: string; errors?: string[] } } };
    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message;
    }
    
    if (axiosError.response?.data?.errors && Array.isArray(axiosError.response.data.errors)) {
      return axiosError.response.data.errors.join(', ');
    }
  }
  
  if (error && typeof error === 'object' && 'message' in error) {
    return (error as { message: string }).message;
  }
  
  return 'An unexpected error occurred';
};

export default apiClient;
