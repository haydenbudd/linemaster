import { useState, useEffect, useCallback } from 'react';
import { fetchProducts, Product, Option } from '@/app/lib/api';
import {
  categories as staticCategories,
  applications as staticApplications,
  technologies as staticTechnologies,
  actions as staticActions,
  environments as staticEnvironments,
  features as staticFeatures,
  consoleStyles as staticConsoleStyles,
  pedalCounts as staticPedalCounts,
  medicalTechnicalFeatures as staticMedicalTechnicalFeatures,
  accessories as staticAccessories,
  guards as staticGuards,
} from '@/app/data/options';
import { products as staticProducts } from '@/app/data/products';

interface OptionWithIcon extends Option {
  icon?: string;
  isMedical?: boolean;
  availableFor?: string[];
  hideFor?: string[];
  parentCategory?: string;
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
    parentCategory: opt.parentCategory || undefined,
    sortOrder: opt.sortOrder || 0,
  };
}

interface ProductData {
  products: Product[];
  categories: OptionWithIcon[];
  applications: OptionWithIcon[];
  technologies: OptionWithIcon[];
  actions: OptionWithIcon[];
  environments: OptionWithIcon[];
  features: OptionWithIcon[];
  consoleStyles: OptionWithIcon[];
  pedalCounts: OptionWithIcon[];
  guards: OptionWithIcon[];
  medicalTechnicalFeatures: OptionWithIcon[];
  accessories: OptionWithIcon[];
  materials: OptionWithIcon[];
  connections: OptionWithIcon[];
  duties: OptionWithIcon[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

// Pre-compute static option data so the wizard renders instantly
const staticOptionData = {
  categories: staticCategories.map(toOptionWithIcon),
  applications: staticApplications.map(toOptionWithIcon),
  technologies: staticTechnologies.map(toOptionWithIcon),
  actions: staticActions.map(toOptionWithIcon),
  environments: staticEnvironments.map(toOptionWithIcon),
  features: staticFeatures.map(toOptionWithIcon),
  consoleStyles: staticConsoleStyles.map(toOptionWithIcon),
  pedalCounts: staticPedalCounts.map(toOptionWithIcon),
  medicalTechnicalFeatures: staticMedicalTechnicalFeatures.map(toOptionWithIcon),
  accessories: staticAccessories.map(toOptionWithIcon),
  guards: staticGuards.map(toOptionWithIcon),
};

export function useProductData(): ProductData {
  // Initialize with static data so the wizard is usable immediately
  const [products, setProducts] = useState<Product[]>(staticProducts as Product[]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const productsData = await fetchProducts();

      // Use API products if available, otherwise keep static fallback
      setProducts(productsData.length > 0 ? productsData : staticProducts as Product[]);
    } catch (err) {
      console.warn('API fetch failed, using static fallback data:', err);
      setProducts(staticProducts as Product[]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

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

  // Always use static data for wizard options — these define the UX flow and must always be available.
  // API options could supplement in the future but should never be the sole source.
  return {
    products,
    categories: staticOptionData.categories,
    applications: staticOptionData.applications,
    technologies: staticOptionData.technologies,
    actions: staticOptionData.actions,
    environments: staticOptionData.environments,
    features: staticOptionData.features,
    consoleStyles: staticOptionData.consoleStyles,
    pedalCounts: staticOptionData.pedalCounts,
    guards: staticOptionData.guards,
    medicalTechnicalFeatures: staticOptionData.medicalTechnicalFeatures,
    accessories: staticOptionData.accessories,
    materials,
    connections,
    duties,
    loading,
    error,
    refresh: loadData,
  };
}
