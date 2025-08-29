import axios, { AxiosInstance, AxiosResponse } from 'axios';

export interface CyodaConfig {
  baseURL: string;
  token: string;
}

export interface ApiError {
  message: string;
  status: number;
  details?: any;
}

export class CyodaClient {
  private client: AxiosInstance;

  constructor(config: CyodaConfig) {
    this.client = axios.create({
      baseURL: config.baseURL,
      headers: {
        'Authorization': `Bearer ${config.token}`,
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        const apiError: ApiError = {
          message: error.response?.data?.message || error.message || 'An error occurred',
          status: error.response?.status || 500,
          details: error.response?.data,
        };
        return Promise.reject(apiError);
      }
    );
  }

  // Generic entity operations
  async getEntity<T>(entityName: string, id?: string, params?: Record<string, any>): Promise<T> {
    const url = id ? `/entity/${entityName}/${id}` : `/entity/${entityName}`;
    const response = await this.client.get<T>(url, { params });
    return response.data;
  }

  async createEntity<T>(entityName: string, data: Partial<T>): Promise<T> {
    const response = await this.client.post<T>(`/entity/${entityName}`, data);
    return response.data;
  }

  async updateEntity<T>(entityName: string, id: string, data: Partial<T>): Promise<T> {
    const response = await this.client.patch<T>(`/entity/${entityName}/${id}`, data);
    return response.data;
  }

  async deleteEntity(entityName: string, id: string): Promise<void> {
    await this.client.delete(`/entity/${entityName}/${id}`);
  }

  // Search with SQL helper for complex queries
  async searchEntities<T>(entityName: string, query?: string, filters?: Record<string, any>): Promise<T[]> {
    const params: Record<string, any> = {};
    
    if (query) {
      params.q = query;
    }
    
    if (filters) {
      Object.assign(params, filters);
    }

    const response = await this.client.get<T[]>(`/entity/${entityName}`, { params });
    return response.data;
  }
}

// Singleton instance
let cyodaClient: CyodaClient | null = null;

export const getCyodaClient = (): CyodaClient => {
  if (!cyodaClient) {
    const baseURL = import.meta.env.VITE_CYODA_API_BASE;
    const token = import.meta.env.VITE_CYODA_TOKEN;

    if (!baseURL) {
      throw new Error('VITE_CYODA_API_BASE must be set in environment variables');
    }

    if (!token) {
      console.warn('VITE_CYODA_TOKEN not set - API calls may fail. Check your .env file.');
      // Create client anyway for development with mock data
    }

    cyodaClient = new CyodaClient({ 
      baseURL, 
      token: token || 'development-token' 
    });
  }

  return cyodaClient;
};