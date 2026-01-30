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
  certifications: OptionWithIcon[];
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

  // Derive unique certifications from product data
  const certifications: OptionWithIcon[] = (() => {
    const certMeta: Record<string, { label: string; description: string; icon: string }> = {
      ul: { label: 'UL Listed', description: 'Underwriters Laboratories certification for North America.', icon: 'ShieldCheck' },
      csa: { label: 'CSA Certified', description: 'Canadian Standards Association approval.', icon: 'ShieldCheck' },
      ce: { label: 'CE Marked', description: 'European conformity marking.', icon: 'ShieldCheck' },
      iec: { label: 'IEC Compliant', description: 'International Electrotechnical Commission standards.', icon: 'ShieldCheck' },
    };
    const seen = new Set<string>();
    products.forEach(p => {
      if (p.certifications) {
        p.certifications.split(',').forEach(c => {
          const key = c.trim().toLowerCase();
          if (key && !seen.has(key)) seen.add(key);
        });
      }
    });
    const result: OptionWithIcon[] = Array.from(seen).map(key => ({
      id: key,
      category: 'certification',
      label: certMeta[key]?.label || key.toUpperCase(),
      description: certMeta[key]?.description || '',
      icon: certMeta[key]?.icon,
    }));
    // Add a "No Preference" option
    result.push({
      id: 'any',
      category: 'certification',
      label: 'No Preference',
      description: 'Skip — I don\'t have a specific certification requirement.',
      icon: 'CircleSlash',
    });
    return result;
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
    certifications,
    loading,
    error,
  };
}
