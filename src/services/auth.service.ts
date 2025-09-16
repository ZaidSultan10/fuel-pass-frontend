import { api, handleApiError, API_ENDPOINTS } from '@/lib/api';
import { LoginRequest, AuthResponse, User } from '@/types';

export class AuthService {
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Login failed');
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  static async logout(): Promise<void> {
    try {
      await api.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    }
    // Zustand store will handle clearing user data
  }

  static async refreshToken(): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.REFRESH, {});

      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Token refresh failed');
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // These methods are now handled by Zustand store
  // Remove them as they're no longer needed
}

