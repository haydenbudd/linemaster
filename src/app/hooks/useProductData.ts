import { useState, useEffect } from 'react';
import { fetchProducts, fetchOptions, Product, Option } from '@/app/lib/api';

interface OptionWithIcon extends Option {
  icon?: string;
  isMedical?: boolean;
  availableFor?: string[];
  hideFor?: string[];
}

interface ProductData {
  products: Product[];
  applications: OptionWithIcon[];
  technologies: OptionWithIcon[];
  actions: OptionWithIcon[];
  environments: OptionWithIcon[];
  features: OptionWithIcon[];
  consoleStyles: OptionWithIcon[];
  pedalCounts: OptionWithIcon[];
  medicalTechnicalFeatures: OptionWithIcon[];
  accessories: OptionWithIcon[];
  materials: OptionWithIcon[];
  connections: OptionWithIcon[];
  duties: OptionWithIcon[];
  loading: boolean;
  error: string | null;
}

export function useProductData(): ProductData {
  const [products, setProducts] = useState<Product[]>([]);
  const [options, setOptions] = useState<OptionWithIcon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        const [productsData, optionsData] = await Promise.all([
          fetchProducts(),
          fetchOptions(),
        ]);

        if (cancelled) return;

        setProducts(productsData);

        // Map options from Supabase, using the 'value' field as 'id' for backward compatibility
        const mapped: OptionWithIcon[] = optionsData.map((opt: any) => ({
          id: opt.value || opt.id,
          category: opt.category,
          label: opt.label,
          description: opt.description,
          icon: opt.icon || undefined,
          isMedical: opt.is_medical || false,
          availableFor: opt.available_for || undefined,
          hideFor: opt.hide_for || undefined,
          sortOrder: opt.sort_order || 0,
        }));

        setOptions(mapped);
      } catch (err) {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : 'Failed to load data';
        setError(message);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  // Helper to filter and sort options by category
  const getByCategory = (category: string): OptionWithIcon[] => {
    return options
      .filter(o => o.category === category)
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  };

  // Derive unique materials from product data
  const materials: OptionWithIcon[] = (() => {
    const seen = new Set<string>();
    return products
      .filter(p => {
        if (seen.has(p.material)) return false;
        seen.add(p.material);
        return true;
      })
      .map(p => ({
        id: p.material,
        category: 'material',
        label: p.material,
        description: '',
      }));
  })();

  // Derive unique connection types from product data
  const connections: OptionWithIcon[] = (() => {
    const seen = new Set<string>();
    return products
      .filter(p => p.connector_type && p.connector_type !== 'undefined')
      .filter(p => {
        if (seen.has(p.connector_type!)) return false;
        seen.add(p.connector_type!);
        return true;
      })
      .map(p => ({
        id: p.connector_type!,
        category: 'connection',
        label: p.connector_type!.replace(/-/g, ' '),
        description: '',
      }));
  })();

  // Derive unique duty ratings
  const duties: OptionWithIcon[] = (() => {
    const order: Record<string, number> = { heavy: 0, medium: 1, light: 2 };
    const seen = new Set<string>();
    return products
      .filter(p => {
        if (seen.has(p.duty)) return false;
        seen.add(p.duty);
        return true;
      })
      .map(p => ({
        id: p.duty,
        category: 'duty',
        label: p.duty.charAt(0).toUpperCase() + p.duty.slice(1),
        description: '',
      }))
      .sort((a, b) => (order[a.id] ?? 99) - (order[b.id] ?? 99));
  })();

  return {
    products,
    applications: getByCategory('application'),
    technologies: getByCategory('technology'),
    actions: getByCategory('action'),
    environments: getByCategory('environment'),
    features: getByCategory('feature'),
    consoleStyles: getByCategory('console_style'),
    pedalCounts: getByCategory('pedal_count'),
    medicalTechnicalFeatures: getByCategory('medical_feature'),
    accessories: getByCategory('accessory'),
    materials,
    connections,
    duties,
    loading,
    error,
  };
}
