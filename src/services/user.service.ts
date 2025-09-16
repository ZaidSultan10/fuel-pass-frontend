import { api, handleApiError, API_ENDPOINTS } from '@/lib/api';
import { User, UserRole } from '@/types';

export interface CreateUserRequest {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

export interface UpdateUserRequest {
  email?: string;
  name?: string;
  role?: UserRole;
  isActive?: boolean;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UserStatistics {
  totalUsers: number;
  activeUsers: number;
  aircraftOperators: number;
  operationsManagers: number;
}

export class UserService {
  static async getAllUsers(): Promise<User[]> {
    try {
      const response = await api.get<User[]>(API_ENDPOINTS.USERS.BASE);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to fetch users');
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  static async getUserById(userId: string): Promise<User> {
    try {
      const response = await api.get<User>(API_ENDPOINTS.USERS.BY_ID(userId));
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to fetch user');
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  static async getCurrentUser(): Promise<User> {
    try {
      const response = await api.get<User>(API_ENDPOINTS.USERS.ME);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to fetch current user');
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  static async createUser(userData: CreateUserRequest): Promise<User> {
    try {
      const response = await api.post<User>(API_ENDPOINTS.USERS.BASE, userData);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to create user');
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  static async updateUser(userId: string, userData: UpdateUserRequest): Promise<User> {
    try {
      const response = await api.put<User>(API_ENDPOINTS.USERS.BY_ID(userId), userData);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to update user');
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  static async updateCurrentUser(userData: UpdateUserRequest): Promise<User> {
    try {
      const response = await api.put<User>(API_ENDPOINTS.USERS.ME, userData);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to update current user');
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  static async changePassword(passwordData: ChangePasswordRequest): Promise<void> {
    try {
      const response = await api.patch(API_ENDPOINTS.USERS.CHANGE_PASSWORD, passwordData);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to change password');
      }
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  static async deleteUser(userId: string): Promise<void> {
    try {
      const response = await api.delete(API_ENDPOINTS.USERS.BY_ID(userId));
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to delete user');
      }
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  static async deactivateUser(userId: string): Promise<User> {
    try {
      const response = await api.patch<User>(API_ENDPOINTS.USERS.DEACTIVATE(userId));
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to deactivate user');
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  static async activateUser(userId: string): Promise<User> {
    try {
      const response = await api.patch<User>(API_ENDPOINTS.USERS.ACTIVATE(userId));
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to activate user');
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  static async getUserStatistics(): Promise<UserStatistics> {
    try {
      const response = await api.get<UserStatistics>(API_ENDPOINTS.USERS.STATISTICS);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to fetch user statistics');
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  static async searchUsers(query: string): Promise<User[]> {
    try {
      const response = await api.get<User[]>(`${API_ENDPOINTS.USERS.SEARCH}?q=${encodeURIComponent(query)}`);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to search users');
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  static async getUsersByRole(role: UserRole): Promise<User[]> {
    try {
      const response = await api.get<User[]>(API_ENDPOINTS.USERS.BY_ROLE(role));
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to fetch users by role');
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}
