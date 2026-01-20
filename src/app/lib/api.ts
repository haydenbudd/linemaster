import { projectId, publicAnonKey } from '/utils/supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-a6e7a38d`;

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  console.log('🔵 API Request:', API_BASE_URL + endpoint);
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);

    console.log('🟢 API Response Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('🔴 API Error Response:', errorText);
      let error;
      try {
        error = JSON.parse(errorText);
      } catch {
        error = { error: errorText || 'Unknown error' };
      }
      throw new Error(error.error || `HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ API Success:', data);
    return data;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.error('🔴 API Timeout after 30 seconds');
        throw new Error('Request timeout - backend server may be starting up or unavailable');
      }
      console.error('🔴 API Error:', error.message);
      throw error;
    }
    throw new Error('Unknown error occurred');
  }
}

export interface Product {
  id: string;
  series: string;
  technology: string;
  duty: 'heavy' | 'medium' | 'light';
  ip: string;
  actions: string[];
  material: string;
  description: string;
  applications: string[];
  features?: string[]; // Available features like 'shield', 'multi_stage', 'twin'
  recommended_for?: string[]; // Array of application IDs where this product shines
  connector_type?: string; // Connector type: 'hardwired', 'plug-in', 'terminal-block', etc.
  flagship: boolean;
  image: string;
  link: string;
  created_at?: string;
  updated_at?: string;
}

export interface Option {
  id: string;
  category: string;
  label: string;
  icon?: string;
  description: string;
  isMedical?: boolean;
  availableFor?: string[];
  hideFor?: string[];
  sortOrder?: number;
}

// Product API calls
export async function fetchProducts(): Promise<Product[]> {
  const data = await fetchAPI('/products');
  const products = data.products || [];
  
  // Normalize products to ensure features is always an array
  return products.map((product: any) => ({
    ...product,
    features: Array.isArray(product.features) ? product.features : [],
    recommended_for: Array.isArray(product.recommended_for) ? product.recommended_for : [],
    actions: Array.isArray(product.actions) ? product.actions : [],
    applications: Array.isArray(product.applications) ? product.applications : [],
  }));
}

export async function fetchProduct(id: string): Promise<Product> {
  const data = await fetchAPI(`/products/${id}`);
  return data.product;
}

export async function createOrUpdateProduct(product: Partial<Product>): Promise<Product> {
  const data = await fetchAPI('/products', {
    method: 'POST',
    body: JSON.stringify(product),
  });
  return data.product;
}

export async function deleteProduct(id: string): Promise<void> {
  await fetchAPI(`/products/${id}`, {
    method: 'DELETE',
  });
}

// Options API calls
export async function fetchOptions(): Promise<Option[]> {
  const data = await fetchAPI('/options');
  return data.options || [];
}

export async function fetchOptionsByCategory(category: string): Promise<Option[]> {
  const data = await fetchAPI(`/options/${category}`);
  return data.options || [];
}

export async function createOrUpdateOption(option: Partial<Option>): Promise<Option> {
  const data = await fetchAPI('/options', {
    method: 'POST',
    body: JSON.stringify(option),
  });
  return data.option;
}

export async function deleteOption(id: string): Promise<void> {
  await fetchAPI(`/options/${id}`, {
    method: 'DELETE',
  });
}