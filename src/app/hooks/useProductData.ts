import { useState, useEffect, useCallback } from 'react';
import { fetchProducts, fetchOptions, Product, Option } from '@/app/lib/api';
import {
  applications as staticApplications,
  technologies as staticTechnologies,
  actions as staticActions,
  environments as staticEnvironments,
  features as staticFeatures,
  consoleStyles as staticConsoleStyles,
  pedalCounts as staticPedalCounts,
  medicalTechnicalFeatures as staticMedicalTechnicalFeatures,
  accessories as staticAccessories,
} from '@/app/data/options';
import { products as staticProducts } from '@/app/data/products';

interface OptionWithIcon extends Option {
  icon?: string;
  isMedical?: boolean;
  availableFor?: string[];
  hideFor?: string[];
}

// Convert static options (React component icons) to OptionWithIcon (string icon names)
function toOptionWithIcon(opt: any): OptionWithIcon {
  return {
    id: opt.id,
    category: opt.category || '',
    label: opt.label,
    description: opt.description,
    icon: typeof opt.icon === 'string' ? opt.icon : opt.icon?.displayName || opt.icon?.name || undefined,
    isMedical: opt.isMedical || false,
    availableFor: opt.availableFor || undefined,
    hideFor: opt.hideFor || undefined,
    sortOrder: opt.sortOrder || 0,
  };
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
  refresh: () => void;
}

export function useProductData(): ProductData {
  const [products, setProducts] = useState<Product[]>([]);
  const [options, setOptions] = useState<OptionWithIcon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [productsData, optionsData] = await Promise.all([
        fetchProducts(),
        fetchOptions(),
      ]);

      // Fall back to static products if API returns empty
      setProducts(productsData.length > 0 ? productsData : staticProducts as Product[]);

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
      console.warn('API fetch failed, using static fallback data:', err);
      // Use static product data as fallback so the wizard still works
      setProducts(staticProducts as Product[]);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Helper to filter and sort options by category
  const getByCategory = (category: string): OptionWithIcon[] => {
    return options
      .filter(o => o.category === category)
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  };

  // Derive unique materials from product data with user-friendly descriptions
  const materials: OptionWithIcon[] = (() => {
    const materialMeta: Record<string, { description: string; icon: string; order: number }> = {
      'Cast Iron': { description: 'Heaviest and most stable. Classic industrial choice.', icon: 'Anvil', order: 0 },
      'Cast Aluminum': { description: 'Lighter than iron with good corrosion resistance.', icon: 'Box', order: 1 },
      'Formed Steel': { description: 'Cost-effective metal construction.', icon: 'Layers', order: 2 },
      'Cast Zinc': { description: 'Compact metal. Smooth omnidirectional design.', icon: 'Circle', order: 3 },
      'Polymeric': { description: 'Lightweight plastic. Easy to reposition.', icon: 'Feather', order: 4 },
    };
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
        description: materialMeta[p.material]?.description || '',
        icon: materialMeta[p.material]?.icon,
      }))
      .sort((a, b) => (materialMeta[a.id]?.order ?? 99) - (materialMeta[b.id]?.order ?? 99));
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

  // Derive unique duty ratings with user-friendly descriptions
  const duties: OptionWithIcon[] = (() => {
    const dutyMeta: Record<string, { label: string; description: string; icon: string; order: number }> = {
      heavy: { label: 'Heavy Duty', description: 'Maximum stability. Cast metal construction stays firmly in place. Best for machinery and high-force applications.', icon: 'Anvil', order: 0 },
      medium: { label: 'Standard Duty', description: 'Balanced durability and weight. Reliable cast metal for everyday industrial use.', icon: 'Scale', order: 1 },
      light: { label: 'Lightweight', description: 'Compact and portable. Polymer or formed steel for lighter tasks and general use.', icon: 'Feather', order: 2 },
    };
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
        label: dutyMeta[p.duty]?.label || p.duty.charAt(0).toUpperCase() + p.duty.slice(1),
        description: dutyMeta[p.duty]?.description || '',
        icon: dutyMeta[p.duty]?.icon,
      }))
      .sort((a, b) => (dutyMeta[a.id]?.order ?? 99) - (dutyMeta[b.id]?.order ?? 99));
  })();

  // Use API data, falling back to static data when a category is empty
  const apiApplications = getByCategory('application');
  const apiTechnologies = getByCategory('technology');
  const apiActions = getByCategory('action');
  const apiEnvironments = getByCategory('environment');
  const apiFeatures = getByCategory('feature');
  const apiConsoleStyles = getByCategory('console_style');
  const apiPedalCounts = getByCategory('pedal_count');
  const apiMedicalFeatures = getByCategory('medical_feature');
  const apiAccessories = getByCategory('accessory');

  return {
    products,
    applications: apiApplications.length > 0 ? apiApplications : staticApplications.map(toOptionWithIcon),
    technologies: apiTechnologies.length > 0 ? apiTechnologies : staticTechnologies.map(toOptionWithIcon),
    actions: apiActions.length > 0 ? apiActions : staticActions.map(toOptionWithIcon),
    environments: apiEnvironments.length > 0 ? apiEnvironments : staticEnvironments.map(toOptionWithIcon),
    features: apiFeatures.length > 0 ? apiFeatures : staticFeatures.map(toOptionWithIcon),
    consoleStyles: apiConsoleStyles.length > 0 ? apiConsoleStyles : staticConsoleStyles.map(toOptionWithIcon),
    pedalCounts: apiPedalCounts.length > 0 ? apiPedalCounts : staticPedalCounts.map(toOptionWithIcon),
    medicalTechnicalFeatures: apiMedicalFeatures.length > 0 ? apiMedicalFeatures : staticMedicalTechnicalFeatures.map(toOptionWithIcon),
    accessories: apiAccessories.length > 0 ? apiAccessories : staticAccessories.map(toOptionWithIcon),
    materials,
    connections,
    duties,
    loading,
    error,
    refresh: loadData,
  };
}
