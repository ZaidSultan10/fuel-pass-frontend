import { api, handleApiError, API_ENDPOINTS } from '@/lib/api';

export interface Airport {
  id: string;
  icaoCode: string;
  iataCode: string;
  name: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAirportRequest {
  icaoCode: string;
  iataCode: string;
  name: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface UpdateAirportRequest {
  iataCode?: string;
  name?: string;
  city?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  isActive?: boolean;
}

export class AirportService {
  static async getAllAirports(): Promise<Airport[]> {
    try {
      const response = await api.get<Airport[]>(API_ENDPOINTS.AIRPORTS.BASE);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to fetch airports');
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  static async getAirportById(airportId: string): Promise<Airport> {
    try {
      const response = await api.get<Airport>(API_ENDPOINTS.AIRPORTS.BY_ID(airportId));
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to fetch airport');
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  static async getAirportByIcaoCode(icaoCode: string): Promise<Airport> {
    try {
      const response = await api.get<Airport>(API_ENDPOINTS.AIRPORTS.BY_ICAO(icaoCode));
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to fetch airport by ICAO code');
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  static async createAirport(airportData: CreateAirportRequest): Promise<Airport> {
    try {
      const response = await api.post<Airport>(API_ENDPOINTS.AIRPORTS.BASE, airportData);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to create airport');
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  static async updateAirport(airportId: string, airportData: UpdateAirportRequest): Promise<Airport> {
    try {
      const response = await api.put<Airport>(API_ENDPOINTS.AIRPORTS.BY_ID(airportId), airportData);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to update airport');
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  static async deleteAirport(airportId: string): Promise<void> {
    try {
      const response = await api.delete(API_ENDPOINTS.AIRPORTS.BY_ID(airportId));
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to delete airport');
      }
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  static async searchAirports(query: string): Promise<Airport[]> {
    try {
      const response = await api.get<Airport[]>(`${API_ENDPOINTS.AIRPORTS.SEARCH}?q=${encodeURIComponent(query)}`);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to search airports');
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  static async getActiveAirports(): Promise<Airport[]> {
    try {
      const response = await api.get<Airport[]>(API_ENDPOINTS.AIRPORTS.ACTIVE);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to fetch active airports');
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}
