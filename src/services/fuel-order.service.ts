import { api, handleApiError, API_ENDPOINTS } from '@/lib/api';
import { 
  FuelOrder, 
  CreateFuelOrder, 
  UpdateOrderStatus, 
  OrderFilters, 
  Pagination, 
  PaginatedResponse 
} from '@/types';

export class FuelOrderService {
  static async createOrder(orderData: CreateFuelOrder): Promise<FuelOrder> {
    try {
      const response = await api.post<FuelOrder>(API_ENDPOINTS.FUEL_ORDERS.BASE, orderData);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to create fuel order');
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  static async getOrders(
    filters?: OrderFilters,
    pagination?: Pagination
  ): Promise<PaginatedResponse<FuelOrder>> {
    try {
      const params = new URLSearchParams();
      
      // Add filters
      if (filters) {
        if (filters.airportIcaoCode) {
          params.append('airportIcaoCode', filters.airportIcaoCode);
        }
        if (filters.status) {
          params.append('status', filters.status);
        }
        if (filters.tailNumber) {
          params.append('tailNumber', filters.tailNumber);
        }
        if (filters.dateFrom) {
          params.append('startDate', filters.dateFrom.toISOString());
        }
        if (filters.dateTo) {
          params.append('endDate', filters.dateTo.toISOString());
        }
      }
      
      // Add pagination
      if (pagination) {
        params.append('page', String(pagination.page - 1)); // Spring Boot uses 0-based pagination
        params.append('limit', String(pagination.limit));
        if (pagination.sortBy) {
          params.append('sortBy', pagination.sortBy);
        }
        if (pagination.sortOrder) {
          params.append('sortOrder', pagination.sortOrder);
        }
      }
      
      const queryString = params.toString();
      const url = queryString ? `${API_ENDPOINTS.FUEL_ORDERS.BASE}?${queryString}` : API_ENDPOINTS.FUEL_ORDERS.BASE;
      
      const response = await api.get<any>(url);
      console.log('getorders response === ',response);
      if (response.success && response.data) {
        // Handle Spring Boot Page response
        const pageData = response.data;
        const orders = pageData.content || pageData; // Fallback to direct array
        
        return {
          data: Array.isArray(orders) ? orders : [],
          pagination: {
            page: (pageData.number || 0) + 1, // Convert 0-based to 1-based
            limit: pageData.size || 10,
            total: pageData.totalElements || orders.length,
            totalPages: pageData.totalPages || 1,
          },
        };
      }
      
      throw new Error(response.message || 'Failed to fetch fuel orders');
    } catch (error) {
      console.log('Failed to fetch fuel orders:', error);
      throw new Error(handleApiError(error));
    }
  }

  static async getOrderById(orderId: string): Promise<FuelOrder> {
    try {
      const response = await api.get<FuelOrder>(API_ENDPOINTS.FUEL_ORDERS.BY_ID(orderId));
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to fetch fuel order');
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  static async updateOrderStatus(
    orderId: string, 
    statusData: UpdateOrderStatus
  ): Promise<FuelOrder> {
    try {
      const response = await api.patch<FuelOrder>(
        API_ENDPOINTS.FUEL_ORDERS.STATUS(orderId), 
        { newStatus: statusData.newStatus }
      );
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to update order status');
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  static async getOrdersByUser(userId: string): Promise<FuelOrder[]> {
    try {
      const response = await api.get<FuelOrder[]>(API_ENDPOINTS.FUEL_ORDERS.BY_USER(userId));
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to fetch user orders');
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  static async getOrdersByAirport(airportCode: string): Promise<FuelOrder[]> {
    try {
      const response = await api.get<FuelOrder[]>(API_ENDPOINTS.FUEL_ORDERS.BY_AIRPORT(airportCode));
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to fetch airport orders');
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  static async getOrderStatistics(): Promise<{
    totalOrders: number;
    pendingOrders: number;
    confirmedOrders: number;
    completedOrders: number;
  }> {
    try {
      const response = await api.get<{
        totalOrders: number;
        pendingOrders: number;
        confirmedOrders: number;
        completedOrders: number;
      }>(API_ENDPOINTS.FUEL_ORDERS.STATISTICS);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to fetch order statistics');
    } catch (error) {
      console.log('Failed to fetch order statistics:', error);
      throw new Error(handleApiError(error));
    }
  }
}