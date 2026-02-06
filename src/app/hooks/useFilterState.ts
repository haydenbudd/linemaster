import { useState, useCallback, useMemo } from 'react';
import { Product } from '@/app/lib/api';

export interface Filters {
  application: string;
  technology: string;
  action: string;
  environment: string;
  duty: string;
  material: string;
  connection: string;
  guard: string;
  features: string[];
  search: string;
  sortBy: 'relevance' | 'duty' | 'ip';
}

const INITIAL_FILTERS: Filters = {
  application: '',
  technology: '',
  action: '',
  environment: '',
  duty: '',
  material: '',
  connection: '',
  guard: '',
  features: [],
  search: '',
  sortBy: 'relevance',
};

export function useFilterState(products: Product[]) {
  const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS);

  const setFilter = useCallback(<K extends keyof Filters>(key: K, value: Filters[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const toggleFeature = useCallback((featureId: string) => {
    setFilters(prev => ({
      ...prev,
      features: prev.features.includes(featureId)
        ? prev.features.filter(f => f !== featureId)
        : [...prev.features, featureId],
    }));
  }, []);

  const clearFilter = useCallback((key: keyof Filters) => {
    setFilters(prev => ({
      ...prev,
      [key]: key === 'features' ? [] : key === 'sortBy' ? 'relevance' : '',
    }));
  }, []);

  const clearAll = useCallback(() => {
    setFilters(INITIAL_FILTERS);
  }, []);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.application) count++;
    if (filters.technology) count++;
    if (filters.action) count++;
    if (filters.environment) count++;
    if (filters.duty) count++;
    if (filters.material) count++;
    if (filters.connection) count++;
    if (filters.guard) count++;
    count += filters.features.length;
    return count;
  }, [filters]);

  // Apply all filters to product list
  const filteredProducts = useMemo(() => {
    let result = products;

    // Text search
    if (filters.search.trim()) {
      const term = filters.search.toLowerCase();
      result = result.filter(p =>
        p.series.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.material.toLowerCase().includes(term) ||
        p.ip.toLowerCase().includes(term) ||
        p.part_number?.toLowerCase().includes(term) ||
        p.id.toLowerCase().includes(term) ||
        (p.features && p.features.some(f => f.toLowerCase().includes(term)))
      );
    }

    // Application
    if (filters.application) {
      result = result.filter(p => p.applications.includes(filters.application));
    }

    // Technology
    if (filters.technology) {
      result = result.filter(p => p.technology === filters.technology);
    }

    // Action
    if (filters.action) {
      result = result.filter(p => p.actions.includes(filters.action));
    }

    // Environment / IP rating
    if (filters.environment) {
      if (filters.environment === 'wet') {
        result = result.filter(p => p.ip === 'IP68');
      } else if (filters.environment === 'damp') {
        result = result.filter(p => ['IP56', 'IP68'].includes(p.ip));
      }
      // 'dry' and 'any' don't filter
    }

    // Duty
    if (filters.duty) {
      result = result.filter(p => p.duty === filters.duty);
    }

    // Material
    if (filters.material) {
      result = result.filter(p => p.material === filters.material);
    }

    // Connection
    if (filters.connection) {
      result = result.filter(p => p.connector_type === filters.connection);
    }

    // Guard
    if (filters.guard === 'yes') {
      result = result.filter(p => (p.features || []).includes('shield'));
    } else if (filters.guard === 'no') {
      result = result.filter(p => !(p.features || []).includes('shield'));
    }

    // Features
    const hardwareFeatures = filters.features.filter(
      f => f !== 'custom_cable' && f !== 'custom_connector'
    );
    if (hardwareFeatures.length > 0) {
      result = result.filter(p => {
        const pf = p.features || [];
        return hardwareFeatures.every(f => pf.includes(f));
      });
    }

    // Sort
    const sorted = [...result];
    if (filters.sortBy === 'duty') {
      const dutyOrder: Record<string, number> = { heavy: 0, medium: 1, light: 2 };
      sorted.sort((a, b) => (dutyOrder[a.duty] ?? 3) - (dutyOrder[b.duty] ?? 3));
    } else if (filters.sortBy === 'ip') {
      sorted.sort((a, b) => {
        const ipA = parseInt(a.ip.replace(/\D/g, '')) || 0;
        const ipB = parseInt(b.ip.replace(/\D/g, '')) || 0;
        return ipB - ipA;
      });
    } else {
      // Relevance: flagship first
      sorted.sort((a, b) => {
        if (a.flagship && !b.flagship) return -1;
        if (!a.flagship && b.flagship) return 1;
        return 0;
      });
    }

    return sorted;
  }, [products, filters]);

  // Calculate available counts for each filter option given current OTHER filters
  const getOptionCount = useCallback((filterKey: keyof Filters, value: string) => {
    // Apply all filters EXCEPT the one we're counting for
    let result = products;

    if (filters.search.trim()) {
      const term = filters.search.toLowerCase();
      result = result.filter(p =>
        p.series.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.material.toLowerCase().includes(term) ||
        p.ip.toLowerCase().includes(term) ||
        p.part_number?.toLowerCase().includes(term) ||
        p.id.toLowerCase().includes(term) ||
        (p.features && p.features.some(f => f.toLowerCase().includes(term)))
      );
    }

    if (filterKey !== 'application' && filters.application) {
      result = result.filter(p => p.applications.includes(filters.application));
    }
    if (filterKey !== 'technology' && filters.technology) {
      result = result.filter(p => p.technology === filters.technology);
    }
    if (filterKey !== 'action' && filters.action) {
      result = result.filter(p => p.actions.includes(filters.action));
    }
    if (filterKey !== 'environment' && filters.environment) {
      if (filters.environment === 'wet') result = result.filter(p => p.ip === 'IP68');
      else if (filters.environment === 'damp') result = result.filter(p => ['IP56', 'IP68'].includes(p.ip));
    }
    if (filterKey !== 'duty' && filters.duty) {
      result = result.filter(p => p.duty === filters.duty);
    }
    if (filterKey !== 'material' && filters.material) {
      result = result.filter(p => p.material === filters.material);
    }
    if (filterKey !== 'connection' && filters.connection) {
      result = result.filter(p => p.connector_type === filters.connection);
    }
    if (filterKey !== 'guard' && filters.guard) {
      if (filters.guard === 'yes') result = result.filter(p => (p.features || []).includes('shield'));
      else if (filters.guard === 'no') result = result.filter(p => !(p.features || []).includes('shield'));
    }
    if (filterKey !== 'features') {
      const hw = filters.features.filter(f => f !== 'custom_cable' && f !== 'custom_connector');
      if (hw.length > 0) {
        result = result.filter(p => {
          const pf = p.features || [];
          return hw.every(f => pf.includes(f));
        });
      }
    }

    // Now count how many match this specific value
    switch (filterKey) {
      case 'application':
        return result.filter(p => p.applications.includes(value)).length;
      case 'technology':
        return result.filter(p => p.technology === value).length;
      case 'action':
        return result.filter(p => p.actions.includes(value)).length;
      case 'environment':
        if (value === 'wet') return result.filter(p => p.ip === 'IP68').length;
        if (value === 'damp') return result.filter(p => ['IP56', 'IP68'].includes(p.ip)).length;
        if (value === 'dry' || value === 'any') return result.length;
        return 0;
      case 'duty':
        return result.filter(p => p.duty === value).length;
      case 'material':
        return result.filter(p => p.material === value).length;
      case 'connection':
        return result.filter(p => p.connector_type === value).length;
      case 'guard':
        if (value === 'yes') return result.filter(p => (p.features || []).includes('shield')).length;
        if (value === 'no') return result.filter(p => !(p.features || []).includes('shield')).length;
        return result.length;
      case 'features':
        return result.filter(p => (p.features || []).includes(value)).length;
      default:
        return 0;
    }
  }, [products, filters]);

  return {
    filters,
    setFilter,
    toggleFeature,
    clearFilter,
    clearAll,
    activeFilterCount,
    filteredProducts,
    getOptionCount,
  };
}
