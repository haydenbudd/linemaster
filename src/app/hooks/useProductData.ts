import { useState, useEffect, useMemo } from 'react';
import { fetchProducts, fetchOptions, Product, Option } from '@/app/lib/api';

export function useProductData() {
  const [products, setProducts] = useState<Product[]>([]);
  const [allOptions, setAllOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        console.log('🚀 Starting to load data...');
        setLoading(true);
        setError(null);
        
        const [productsData, optionsData] = await Promise.all([
          fetchProducts(),
          fetchOptions(),
        ]);
        
        if (!mounted) return;
        
        console.log('📦 Loaded products:', productsData.length);
        console.log('⚙️ Loaded options:', optionsData.length);
        
        setProducts(productsData);
        setAllOptions(optionsData);
        setError(null);
      } catch (err) {
        if (!mounted) return;
        console.error('❌ Error loading data:', err);
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(`Failed to connect to backend: ${errorMessage}`);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }
    
    loadData();

    return () => {
      mounted = false;
    };
  }, []);

  // Memoize categorized options
  const categorizedOptions = useMemo(() => {
    const getOptionsByCategory = (category: string) => 
      allOptions.filter((opt) => opt.category === category);

    // Derive dynamic options from products
    const getUniqueValues = (field: keyof Product, category: string) => {
      const values = new Set<string>();
      products.forEach(p => {
        const val = p[field];
        if (typeof val === 'string' && val) values.add(val);
      });
      
      const definedOptions = allOptions.filter(opt => opt.category === category);

      return Array.from(values).sort().map(val => {
        // Try to find a matching option from the database (wizard_options)
        // Check both ID and Label for matches (case-insensitive)
        const match = definedOptions.find(
          opt => opt.id.toLowerCase() === val.toLowerCase() || 
                 opt.label.toLowerCase() === val.toLowerCase()
        );

        if (match) {
          return match;
        }

        // FALLBACK: Generate option if not in database
        let label = val.charAt(0).toUpperCase() + val.slice(1);
        let description = '';

        if (field === 'material') {
           const lower = val.toLowerCase();
           if (lower.includes('cast') || lower.includes('iron') || lower.includes('zinc') || lower.includes('aluminum')) {
             label = 'Heavy Metal (High Stability)';
             description = 'Heavy-weight construction ensures the switch stays in place. Best for stationary industrial workstations.';
           } else if (lower.includes('poly') || lower.includes('plastic')) {
             label = 'Polymer (Lightweight & Value)';
             description = 'Cost-effective, corrosion-proof, and easy to move. Ideal for portable equipment and general use.';
           } else if (lower.includes('stainless')) {
             label = 'Stainless Steel (Sanitary)';
             description = 'Maximum corrosion resistance and easy to clean. Essential for medical and food grade environments.';
           } else if (lower.includes('steel')) {
             label = 'Formed Steel (Durable)';
             description = 'Strong protective housing with a moderate weight profile. A balance of durability and portability.';
           }
        }

        if (field === 'connector_type') {
          const lower = val.toLowerCase();
          
          if (lower.includes('3-prong') || lower.includes('plug') || lower.includes('cordset')) {
             label = 'Plug-In (Pre-Wired)';
             description = 'Comes with a cord and plug. Ready to use immediately.';
          } else if (lower.includes('npt') || lower.includes('conduit')) {
             label = 'NPT Conduit Entry';
             description = 'Threaded entry for attaching conduit or custom fittings.';
          } else if (lower.includes('lead') || lower.includes('wire') || lower.includes('cable')) {
             label = 'Flying Leads (Pre-Wired)';
             description = 'Pre-wired with loose leads for hardwiring into equipment.';
          } else if (lower.includes('terminal') || lower.includes('screw')) {
             label = 'Terminals Only';
             description = 'Screw terminals inside housing. User supplies the cord.';
          }
        }

        return {
          id: val,
          label,
          value: val,
          category: category,
          description,
        } as Option;
      });
    };

    return {
      applications: getOptionsByCategory('application'),
      technologies: getOptionsByCategory('technology'),
      actions: getOptionsByCategory('action'),
      environments: getOptionsByCategory('environment'),
      features: getOptionsByCategory('feature'),
      consoleStyles: getOptionsByCategory('console_style'),
      pedalCounts: getOptionsByCategory('pedal_count'),
      medicalTechnicalFeatures: getOptionsByCategory('medical_feature'),
      accessories: getOptionsByCategory('accessory'),
      // Derived options with DB enrichment
      materials: getUniqueValues('material', 'material'),
      connections: getUniqueValues('connector_type', 'connector'),
      duties: getUniqueValues('duty', 'duty'),
    };
  }, [allOptions, products]);

  return {
    products,
    ...categorizedOptions,
    loading,
    error,
  };
}
