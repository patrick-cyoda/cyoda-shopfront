import { getCyodaClient } from './cyoda';
import { Product, SearchParams, ProductFilters } from '../types/entities';
import { getMockProducts, getMockCategories } from '../data/mockProducts';

export class ProductService {
  private client = getCyodaClient();

  async searchProducts(params?: SearchParams): Promise<Product[]> {
    try {
      // Try to use real API first, fallback to mock data
      const queryParams: Record<string, any> = {};

      if (params?.query) {
        queryParams.search = params.query;
      }

      if (params?.filters) {
        const { category, minPrice, maxPrice, inStock } = params.filters;
        
        if (category) queryParams.category = category;
        if (minPrice !== undefined) queryParams.minPrice = minPrice;
        if (maxPrice !== undefined) queryParams.maxPrice = maxPrice;
        if (inStock !== undefined) queryParams.inStock = inStock;
      }

      if (params?.limit) queryParams.limit = params.limit;
      if (params?.offset) queryParams.offset = params.offset;

      return await this.client.searchEntities<Product>('Product', params?.query, queryParams);
    } catch (error) {
      console.warn('API unavailable, using mock data:', error);
      // Fallback to mock data for development
      return await getMockProducts();
    }
  }

  async getProductBySku(sku: string): Promise<Product | null> {
    try {
      const products = await this.client.searchEntities<Product>('Product', undefined, { sku });
      return products.length > 0 ? products[0] : null;
    } catch (error) {
      console.warn('API unavailable, using mock data:', error);
      const mockProducts = await getMockProducts();
      return mockProducts.find(p => p.sku === sku) || null;
    }
  }

  async getAllProducts(): Promise<Product[]> {
    try {
      console.log('🚀 Attempting to fetch products from Cyoda API...');
      const products = await this.client.getEntity<Product[]>('Product');
      console.log('✅ Successfully fetched', products.length, 'products from API');
      return products;
    } catch (error) {
      console.warn('❌ API call failed, using mock data instead:', error);
      console.log('📋 Mock data contains', (await getMockProducts()).length, 'products');
      return await getMockProducts();
    }
  }

  async getProductCategories(): Promise<string[]> {
    try {
      const products = await this.getAllProducts();
      const categories = [...new Set(products
        .map(p => p.category)
        .filter(Boolean))];
      return categories as string[];
    } catch (error) {
      console.warn('API unavailable, using mock data:', error);
      return await getMockCategories();
    }
  }
}

export const productService = new ProductService();