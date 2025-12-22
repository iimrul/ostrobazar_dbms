import { Product } from '../types';

// Use relative path - Vite Proxy will forward this to http://localhost:3000/api
const API_BASE_URL = '/api';

// Helper for fetching
const get = async <T>(endpoint: string): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 404) {
         throw new Error('404 Not Found'); 
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error: any) {
    console.error(`API Call Failed: ${endpoint}`, error);
    
    // Check for network errors (Backend offline)
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      console.error("CRITICAL: Backend unreachable. Ensure 'node server.js' is running.");
      throw new Error('System Offline: Could not connect to the database server.');
    }
    
    throw error;
  }
};

export const fetchProducts = async (): Promise<Product[]> => {
  return get<Product[]>('/products');
};

export const fetchProductById = async (id: string): Promise<Product | undefined> => {
  try {
    return await get<Product>(`/products/${id}`);
  } catch (error) {
    console.warn(`Product ${id} not found or API error.`);
    return undefined;
  }
};

export const fetchProductsByCategory = async (category: string): Promise<Product[]> => {
  if (category.toLowerCase() === 'all') {
    return fetchProducts();
  }
  // Use server-side filtering
  return get<Product[]>(`/products?category=${encodeURIComponent(category)}`);
};

export const getProductImage = (product: Product) => {
  if (!product.thumbnail) return 'https://placehold.co/400x300?text=No+Image';
  
  if (product.thumbnail.startsWith('http')) {
      return product.thumbnail;
  }
  
  // Clean the path to ensure it maps correctly to the proxy
  // If path is '/public/img.jpg', it becomes '/public/img.jpg' (proxied to backend)
  // If path is 'public/img.jpg', we add slash
  const cleanPath = product.thumbnail.startsWith('/') ? product.thumbnail : `/${product.thumbnail}`;
  return cleanPath;
};