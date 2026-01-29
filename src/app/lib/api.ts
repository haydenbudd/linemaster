import { projectId, publicAnonKey } from '/utils/supabase/info';

// UPDATED: Point to the 'server' function directly
const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/server`;

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  console.log('🔵 API Request:', API_BASE_URL + endpoint);
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000); // 120 second timeout
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      cache: 'no-store',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
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
        console.error('🔴 API Timeout after 120 seconds');
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
  features?: string[];
  recommended_for?: string[];
  
  // Custom fields
  part_number?: string;
  pfc_config?: string;
  pedal_count?: number;
  circuitry?: string;
  stages?: string;
  configuration?: string;
  interior_sub?: string;
  microswitch?: string;
  microswitch_qty?: number;
  potentiometer?: string;
  color?: string;

  connector_type?: string;
  certifications?: string;
  voltage?: string;
  amperage?: string;
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
  const data = await fetchAPI(`/products?t=${Date.now()}`);
  const products = data.products || [];
  
  return products.map((product: any) => ({
    ...product,
    part_number: product.part_number || product.Part,
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

export async function createOrUpdateProducts(products: Partial<Product>[]): Promise<void> {
  const BATCH_SIZE = 10;
  const totalBatches = Math.ceil(products.length / BATCH_SIZE);
  
  console.log(`Starting bulk upload of ${products.length} products in ${totalBatches} batches...`);
  
  for (let i = 0; i < products.length; i += BATCH_SIZE) {
    const batch = products.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    
    console.log(`Uploading batch ${batchNum}/${totalBatches} (${batch.length} items)...`);
    
    if (i > 0) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    try {
      await fetchAPI('/products', {
        method: 'POST',
        body: JSON.stringify(batch),
      });
    } catch (error) {
      console.error(`Error uploading batch ${batchNum}:`, error);
      throw new Error(`Failed to upload batch ${batchNum}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  console.log('✅ Bulk upload completed successfully');
}

export async function deleteProduct(id: string): Promise<void> {
  await fetchAPI(`/products/${id}`, {
    method: 'DELETE',
  });
}

export async function deleteAllProducts(): Promise<void> {
  await fetchAPI(`/products?t=${Date.now()}`, {
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
