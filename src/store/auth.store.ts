import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useMemo, useEffect } from 'react';
import { User, LoginRequest } from '@/types';
import { AuthService } from '@/services/auth.service';
import toast from 'react-hot-toast';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  checkAuth: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (credentials: LoginRequest) => {
        set({ isLoading: true, error: null });
        
        try {
          const authResponse = await AuthService.login(credentials);
          console.log('Auth response:', authResponse);
          set({
            user: {
              id: authResponse.userId,
              email: authResponse.email,
              name: authResponse.name,
              role: authResponse.role,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          
          toast.success(`Welcome back, ${authResponse.email}!`);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Login failed';
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: errorMessage,
          });
          toast.error(errorMessage);
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        
        try {
          await AuthService.logout();
          toast.success('Logged out successfully');
        } catch (error) {
          console.error('Logout error:', error);
          toast.error('Error during logout');
        } finally {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },

      refreshToken: async () => {
        try {
          const authResponse = await AuthService.refreshToken();
          
          set({
            user: {
              id: authResponse.userId,
              email: authResponse.email,
              name: authResponse.name,
              role: authResponse.role,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            isAuthenticated: true,
            error: null,
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Token refresh failed';
          set({
            user: null,
            isAuthenticated: false,
            error: errorMessage,
          });
          toast.error('Session expired. Please log in again.');
          throw error;
        }
      },

      setUser: (user: User | null) => {
        set({
          user,
          isAuthenticated: !!user,
        });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      },

      checkAuth: () => {
        // Check if user exists in store (persisted by Zustand)
        const currentUser = get().user;
        set({
          isAuthenticated: !!currentUser,
        });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      // Add SSR support
      skipHydration: true,
    }
  )
);

// Selectors for easier access
export const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  
  return useMemo(() => ({
    user,
    isAuthenticated,
    isLoading,
    error,
  }), [user, isAuthenticated, isLoading, error]);
};

export const useAuthActions = () => {
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const setUser = useAuthStore((state) => state.setUser);
  const setLoading = useAuthStore((state) => state.setLoading);
  const setError = useAuthStore((state) => state.setError);
  const clearError = useAuthStore((state) => state.clearError);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  
  return useMemo(() => ({
    login,
    logout,
    refreshToken,
    setUser,
    setLoading,
    setError,
    clearError,
    checkAuth,
  }), [login, logout, refreshToken, setUser, setLoading, setError, clearError, checkAuth]);
};

// Role-based selectors
export const useUserRole = () => useAuthStore((state) => state.user?.role);

export const useIsAircraftOperator = () => useAuthStore((state) => 
  state.user?.role === 'AIRCRAFT_OPERATOR'
);

export const useIsOperationsManager = () => useAuthStore((state) => 
  state.user?.role === 'OPERATIONS_MANAGER'
);

// Utility functions that work with the store
export const getCurrentUser = (): User | null => {
  return useAuthStore.getState().user;
};

export const isAuthenticated = (): boolean => {
  return useAuthStore.getState().isAuthenticated;
};

export const hasRole = (role: string): boolean => {
  const user = getCurrentUser();
  return user?.role === role;
};

export const isAircraftOperator = (): boolean => {
  return hasRole('AIRCRAFT_OPERATOR');
};

export const isOperationsManager = (): boolean => {
  return hasRole('OPERATIONS_MANAGER');
};

// Hydration hook to handle SSR
export const useHydrateAuth = () => {
  useEffect(() => {
    useAuthStore.persist.rehydrate();
  }, []);
};
