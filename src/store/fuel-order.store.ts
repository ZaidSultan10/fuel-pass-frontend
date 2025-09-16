import { create } from 'zustand';
import { useMemo } from 'react';
import { FuelOrder, CreateFuelOrder, UpdateOrderStatus, OrderFilters, Pagination, PaginatedResponse } from '@/types';
import { FuelOrderService } from '@/services/fuel-order.service';
import toast from 'react-hot-toast';

interface FuelOrderState {
  orders: FuelOrder[];
  currentOrder: FuelOrder | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: OrderFilters;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  statistics: {
    totalOrders: number;
    pendingOrders: number;
    confirmedOrders: number;
    completedOrders: number;
  } | null;
}

interface FuelOrderActions {
  // Order CRUD operations
  createOrder: (orderData: CreateFuelOrder) => Promise<FuelOrder>;
  fetchOrders: (filters?: OrderFilters, pagination?: Pagination) => Promise<void>;
  fetchOrderById: (orderId: string) => Promise<void>;
  updateOrderStatus: (orderId: string, statusData: UpdateOrderStatus) => Promise<void>;
  
  // Filter and pagination
  setFilters: (filters: OrderFilters) => void;
  setPagination: (pagination: Partial<Pagination>) => void;
  clearFilters: () => void;
  
  // State management
  setLoading: (loading: boolean) => void;
  setSubmitting: (submitting: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  setCurrentOrder: (order: FuelOrder | null) => void;
  
  // Statistics
  fetchStatistics: () => Promise<void>;
  
  // Utility actions
  refreshOrders: () => Promise<void>;
  reset: () => void;
}

type FuelOrderStore = FuelOrderState & FuelOrderActions;

const initialState: FuelOrderState = {
  orders: [],
  currentOrder: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  filters: {},
  isLoading: false,
  isSubmitting: false,
  error: null,
  statistics: null,
};

export const useFuelOrderStore = create<FuelOrderStore>((set, get) => ({
  ...initialState,

  // Order CRUD operations
  createOrder: async (orderData: CreateFuelOrder) => {
    set({ isSubmitting: true, error: null });
    
    try {
      const newOrder = await FuelOrderService.createOrder(orderData);
      
      set((state) => ({
        orders: [newOrder, ...state.orders],
        isSubmitting: false,
        error: null,
      }));
      
      toast.success(`Fuel order for ${newOrder.tailNumber} created successfully!`);
      return newOrder;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create order';
      set({
        isSubmitting: false,
        error: errorMessage,
      });
      toast.error(errorMessage);
      throw error;
    }
  },

  fetchOrders: async (filters?: OrderFilters, pagination?: Pagination) => {
    set({ isLoading: true, error: null });
    
    try {
      const currentFilters = filters || get().filters;
      const currentPagination = pagination || {
        page: get().pagination.page,
        limit: get().pagination.limit,
        sortBy: 'createdAt',
        sortOrder: 'desc' as const,
      };
      
      const response = await FuelOrderService.getOrders(currentFilters, currentPagination);
      console.log('fetchorder response === ',response);
      set({
        orders: response.data,
        pagination: response.pagination,
        filters: currentFilters,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch orders';
      set({
        isLoading: false,
        error: errorMessage,
      });
      toast.error(errorMessage);
      throw error;
    }
  },

  fetchOrderById: async (orderId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const order = await FuelOrderService.getOrderById(orderId);
      
      set({
        currentOrder: order,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch order';
      set({
        isLoading: false,
        error: errorMessage,
      });
      toast.error(errorMessage);
      throw error;
    }
  },

  updateOrderStatus: async (orderId: string, statusData: UpdateOrderStatus) => {
    set({ isSubmitting: true, error: null });
    
    try {
      const updatedOrder = await FuelOrderService.updateOrderStatus(orderId, statusData);
      
      set((state) => ({
        orders: state.orders.map((order) =>
          order.id === orderId ? updatedOrder : order
        ),
        currentOrder: state.currentOrder?.id === orderId ? updatedOrder : state.currentOrder,
        isSubmitting: false,
        error: null,
      }));
      
      toast.success(`Order status updated to ${statusData.newStatus}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update order status';
      set({
        isSubmitting: false,
        error: errorMessage,
      });
      toast.error(errorMessage);
      throw error;
    }
  },

  // Filter and pagination
  setFilters: (filters: OrderFilters) => {
    set({ filters });
  },

  setPagination: (pagination: Partial<Pagination>) => {
    set((state) => ({
      pagination: { ...state.pagination, ...pagination },
    }));
  },

  clearFilters: () => {
    set({ filters: {} });
  },

  // State management
  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setSubmitting: (submitting: boolean) => {
    set({ isSubmitting: submitting });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  clearError: () => {
    set({ error: null });
  },

  setCurrentOrder: (order: FuelOrder | null) => {
    set({ currentOrder: order });
  },

  // Statistics
  fetchStatistics: async () => {
    try {
      const stats = await FuelOrderService.getOrderStatistics();
      set({ statistics: stats });
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
      toast.error('Failed to load statistics');
    }
  },

  // Utility actions
  refreshOrders: async () => {
    const { filters, pagination } = get();
    await get().fetchOrders(filters, {
      page: pagination.page,
      limit: pagination.limit,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  },

  reset: () => {
    set(initialState);
  },
}));

// Selectors for easier access - using separate selectors to avoid infinite loops
export const useFuelOrders = () => useFuelOrderStore((state) => state.orders);
export const useFuelOrdersLoading = () => useFuelOrderStore((state) => state.isLoading);
export const useFuelOrdersError = () => useFuelOrderStore((state) => state.error);

export const useFuelOrderActions = () => {
  const createOrder = useFuelOrderStore((state) => state.createOrder);
  const fetchOrders = useFuelOrderStore((state) => state.fetchOrders);
  const fetchOrderById = useFuelOrderStore((state) => state.fetchOrderById);
  const updateOrderStatus = useFuelOrderStore((state) => state.updateOrderStatus);
  const refreshOrders = useFuelOrderStore((state) => state.refreshOrders);
  
  return useMemo(() => ({
    createOrder,
    fetchOrders,
    fetchOrderById,
    updateOrderStatus,
    refreshOrders,
  }), [createOrder, fetchOrders, fetchOrderById, updateOrderStatus, refreshOrders]);
};

export const useFuelOrderFilters = () => useFuelOrderStore((state) => state.filters);
export const useFuelOrderPagination = () => useFuelOrderStore((state) => state.pagination);

export const useFuelOrderFilterActions = () => {
  const setFilters = useFuelOrderStore((state) => state.setFilters);
  const setPagination = useFuelOrderStore((state) => state.setPagination);
  const clearFilters = useFuelOrderStore((state) => state.clearFilters);
  
  return useMemo(() => ({
    setFilters,
    setPagination,
    clearFilters,
  }), [setFilters, setPagination, clearFilters]);
};

export const useFuelOrderStatistics = () => useFuelOrderStore((state) => state.statistics);

export const useFuelOrderStatisticsActions = () => {
  const fetchStatistics = useFuelOrderStore((state) => state.fetchStatistics);
  
  return useMemo(() => ({
    fetchStatistics,
  }), [fetchStatistics]);
};

export const useCurrentOrder = () => useFuelOrderStore((state) => state.currentOrder);

export const useCurrentOrderActions = () => {
  const setCurrentOrder = useFuelOrderStore((state) => state.setCurrentOrder);
  
  return useMemo(() => ({
    setCurrentOrder,
  }), [setCurrentOrder]);
};

export const useFuelOrderUI = () => {
  const isLoading = useFuelOrderStore((state) => state.isLoading);
  const isSubmitting = useFuelOrderStore((state) => state.isSubmitting);
  const error = useFuelOrderStore((state) => state.error);
  const setError = useFuelOrderStore((state) => state.setError);
  const clearError = useFuelOrderStore((state) => state.clearError);
  
  return useMemo(() => ({
    isLoading,
    isSubmitting,
    error,
    setError,
    clearError,
  }), [isLoading, isSubmitting, error, setError, clearError]);
};
