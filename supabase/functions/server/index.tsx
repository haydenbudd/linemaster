import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Middleware
app.use('*', logger(console.log));
app.use('*', cors());

// Version tracking to prevent re-initialization on redeploys
const DB_VERSION = 'v1.7.0'; // Increment this if you want to force a re-seed

// Initialize data on first run ONLY
// This checks for both the existence of data AND a version flag
// If data exists, it will NEVER be overwritten, even on redeploy
async function initializeData() {
  try {
    console.log('Checking if data initialization is needed...');
    
    // Check if we've already initialized (version flag prevents re-init on redeploy)
    const dbVersion = await kv.get('db_version');
    if (dbVersion === DB_VERSION) {
      console.log(`Database already initialized (version ${dbVersion}). Skipping initialization.`);
      return;
    }
    
    // Check if data exists - explicitly checking for NULL or UNDEFINED, not just falsy (which would include empty arrays)
    const existingProducts = await kv.get('products');
    if (existingProducts === null || existingProducts === undefined) {
      console.log('No existing products found (null/undefined), initializing...');
      // Initialize with default products
      const defaultProducts = [
        {
          id: 'hercules',
          series: 'Hercules',
          technology: 'electrical',
          duty: 'heavy',
          ip: 'IP56',
          actions: ['momentary', 'maintained'],
          material: 'Cast Iron',
          description: 'The ultimate heavy-duty industrial footswitch.',
          applications: ['industrial', 'automotive', 'woodworking', 'general'],
          features: ['shield'],
          connection: '3-prong',
          flagship: true,
          image: 'https://linemaster.com/wp-content/uploads/2025/04/hercules-full-shield.png',
          link: 'https://linemaster.com/product/167/hercules-full-shield/',
        },
        {
          id: 'atlas',
          series: 'Atlas',
          technology: 'electrical',
          duty: 'heavy',
          ip: 'IP68',
          actions: ['momentary'],
          material: 'Cast Aluminum',
          description: 'Fully sealed IP68 heavy-duty switch.',
          applications: ['industrial', 'automotive'],
          features: ['shield'],
          connection: 'flying-leads',
          flagship: false,
          image: 'https://linemaster.com/wp-content/uploads/2025/04/atlas.png',
          link: 'https://linemaster.com/product/77/atlas-full-shield/',
        },
        {
          id: 'clipper',
          series: 'Clipper',
          technology: 'electrical',
          duty: 'medium',
          ip: 'IP20',
          actions: ['momentary', 'maintained'],
          material: 'Cast Iron',
          description: 'The industry standard. Classic cast iron.',
          applications: ['industrial', 'woodworking', 'automotive', 'general'],
          features: ['twin'],
          connection: '3-prong',
          flagship: true,
          image: 'https://linemaster.com/wp-content/uploads/2025/04/clipper_duo.png',
          link: 'https://linemaster.com/product/115/clipper-single-momentary/',
        },
        {
          id: 'classic-iv',
          series: 'Classic IV',
          technology: 'electrical',
          duty: 'medium',
          ip: 'IP68',
          actions: ['momentary', 'variable'],
          material: 'Cast Aluminum',
          description: 'Watertight cast aluminum. IP68 sealed.',
          applications: ['industrial', 'automotive'],
          features: ['shield', 'twin'],
          connection: 'flying-leads',
          flagship: false,
          image: 'https://linemaster.com/wp-content/uploads/2025/04/classic-iv.png',
          link: 'https://linemaster.com/product/112/classic-iv/',
        },
        {
          id: 'dolphin',
          series: 'Dolphin',
          technology: 'electrical',
          duty: 'light',
          ip: 'IP68',
          actions: ['momentary'],
          material: 'Polymeric',
          description: 'Omni-directional. Popular for tattoo artists.',
          applications: ['general', 'tattoo', 'medical'],
          features: [],
          connection: 'flying-leads',
          flagship: false,
          image: 'https://linemaster.com/wp-content/uploads/2025/04/dolphin-2.png',
          link: 'https://linemaster.com/product/129/dolphin/',
        },
        {
          id: 'gem-v',
          series: 'Gem-V',
          technology: 'electrical',
          duty: 'light',
          ip: 'IP20',
          actions: ['momentary'],
          material: 'Cast Zinc',
          description: 'Round omni-directional design.',
          applications: ['general', 'tattoo', 'medical'],
          features: [],
          connection: 'phone-plug',
          flagship: false,
          image: 'https://linemaster.com/wp-content/uploads/2025/04/gem.png',
          link: 'https://linemaster.com/product/162/gem-v/',
        },
        {
          id: 'varior',
          series: 'Varior',
          technology: 'electrical',
          duty: 'medium',
          ip: 'IP20',
          actions: ['variable'],
          material: 'Formed Steel',
          description: 'Foot-operated potentiometer for variable speed.',
          applications: ['industrial', 'automotive', 'woodworking', 'general'],
          features: [],
          connection: '3-prong',
          flagship: false,
          image: 'https://linemaster.com/wp-content/uploads/2025/04/varior-potentiometer.png',
          link: 'https://linemaster.com/product/407/varior-potentiometer/',
        },
        {
          id: 'wireless-hercules',
          series: 'RF Wireless Hercules',
          technology: 'wireless',
          duty: 'heavy',
          ip: 'IP68',
          actions: ['momentary'],
          material: 'Cast Iron',
          description: 'RF Wireless. Eliminates trip hazards.',
          applications: ['industrial', 'automotive', 'medical', 'general'],
          features: ['shield'],
          flagship: true,
          image: 'https://linemaster.com/wp-content/uploads/2025/04/rf-hercules.png',
          link: 'https://linemaster.com/product/475/radio-frequency-wireless-hercules/',
        },
        {
          id: 'air-seal',
          series: 'Air Seal',
          technology: 'electrical', // Electrical switch activated by air pressure
          duty: 'light',
          ip: 'IP20',
          actions: ['momentary', 'maintained'],
          material: 'Formed Steel',
          description: 'Air-actuated electrical switch.',
          applications: ['industrial', 'general', 'medical'],
          features: [],
          flagship: false,
          image: 'https://linemaster.com/wp-content/uploads/2025/03/air_seal.png',
          link: 'https://linemaster.com/product/2/air-seal-maintained/',
        },
        {
          id: 'airval-hercules',
          series: 'Airval Hercules',
          technology: 'pneumatic',
          duty: 'heavy',
          ip: 'IP20',
          actions: ['momentary', 'maintained'],
          material: 'Cast Iron',
          description: 'Heavy-duty cast iron pneumatic control.',
          applications: ['industrial', 'automotive'],
          features: ['shield', 'twin'],
          flagship: false,
          image: 'https://linemaster.com/wp-content/uploads/2025/03/airval-hercules-duo_optimized.png',
          link: 'https://linemaster.com/product/17/airval-hercules-full-shield/',
        },
      ];
      
      await kv.set('products', defaultProducts);
      console.log('Initialized products data');
    } else {
      console.log(`Found ${existingProducts.length} existing products. Preserving user data.`);
      
      // Migration: Add connection field to existing electrical products if they don't have it
      const needsConnectionMigration = existingProducts.some((p: any) => 
        p.technology === 'electrical' && !p.connection
      );
      
      if (needsConnectionMigration) {
        console.log('Adding connection field to electrical products...');
        const connectionMap: Record<string, string> = {
          'hercules': '3-prong',
          'atlas': 'flying-leads',
          'clipper': '3-prong',
          'classic-iv': 'phone-plug',
          'dolphin': 'flying-leads',
          'gem-v': 'phone-plug',
          'varior': '3-prong',
        };
        
        const updatedProducts = existingProducts.map((p: any) => {
          if (p.technology === 'electrical' && !p.connection && connectionMap[p.id]) {
            return { ...p, connection: connectionMap[p.id] };
          }
          return p;
        });
        
        await kv.set('products', updatedProducts);
        console.log('Successfully added connection field to electrical products');
      }
    }

    const existingOptions = await kv.get('options');
    if (!existingOptions) {
      console.log('No existing options found, initializing...');
      // Initialize with default options
      const defaultOptions = [
        // Applications
        { id: 'industrial', category: 'application', label: 'Industrial & Manufacturing', icon: 'Factory', description: 'Heavy machinery, CNC, assembly', sortOrder: 1 },
        { id: 'medical', category: 'application', label: 'Medical & Healthcare', icon: 'Heart', description: 'Surgical, diagnostic, patient care', isMedical: true, sortOrder: 2 },
        { id: 'automotive', category: 'application', label: 'Automotive & Repair', icon: 'Car', description: 'Lifts, paint booths, tire changers', sortOrder: 3 },
        { id: 'woodworking', category: 'application', label: 'Woodworking', icon: 'Hammer', description: 'Saws, lathes, routers', sortOrder: 4 },
        { id: 'tattoo', category: 'application', label: 'Tattoo & Body Art', icon: 'Palette', description: 'Precision control for artists', sortOrder: 5 },
        { id: 'general', category: 'application', label: 'General / Other', icon: 'Coffee', description: 'Office, consumer, specialty', sortOrder: 6 },
        
        // Technologies
        { id: 'electrical', category: 'technology', label: 'Electrical', icon: 'Zap', description: 'Standard wired connection.', availableFor: ['industrial', 'automotive', 'woodworking', 'tattoo', 'general'], sortOrder: 1 },
        { id: 'pneumatic', category: 'technology', label: 'Pneumatic (Air)', icon: 'Wind', description: 'Uses compressed air.', availableFor: ['industrial', 'automotive', 'woodworking', 'general'], sortOrder: 2 },
        { id: 'wireless', category: 'technology', label: 'RF Wireless', icon: 'Radio', description: 'Cord-free operation.', availableFor: ['industrial', 'automotive', 'general'], sortOrder: 3 },
        
        // Actions
        { id: 'momentary', category: 'action', label: 'Momentary', icon: 'CircleDot', description: 'Active while pressed.', availableFor: ['electrical', 'pneumatic', 'wireless'], sortOrder: 1 },
        { id: 'maintained', category: 'action', label: 'Maintained', icon: 'ToggleLeft', description: 'Press ON, press again OFF.', availableFor: ['electrical', 'pneumatic'], sortOrder: 2 },
        { id: 'variable', category: 'action', label: 'Variable Speed', icon: 'Gauge', description: 'Speed varies with pressure.', availableFor: ['electrical', 'pneumatic'], sortOrder: 3 },
        
        // Environments
        { id: 'dry', category: 'environment', label: 'Dry / Indoor', description: 'IP20 sufficient.', icon: 'Home', sortOrder: 1 },
        { id: 'damp', category: 'environment', label: 'Damp / Splash', description: 'IP56 recommended.', icon: 'CloudRain', sortOrder: 2 },
        { id: 'wet', category: 'environment', label: 'Wet / Washdown', description: 'IP68 required.', icon: 'Droplets', sortOrder: 3 },
        
        // Connector Types (Electrical only)
        { id: '3-prong', category: 'connector', label: '3-Prong Plug', description: 'Standard household plug.', icon: 'Plug', availableFor: ['electrical'], sortOrder: 1 },
        { id: 'flying-leads', category: 'connector', label: 'Flying Leads', description: 'Bare wire ends for custom wiring.', icon: 'Cable', availableFor: ['electrical'], sortOrder: 2 },
        { id: 'phone-plug', category: 'connector', label: 'Phone Plug (1/4\")', description: '1/4 inch phone jack.', icon: 'Phone', availableFor: ['electrical'], sortOrder: 3 },
        
        // Features
        { id: 'feature-shield', category: 'feature', label: 'Safety Guard/Shield', description: 'Prevents accidental activation.', sortOrder: 1 },
        { id: 'feature-multi_stage', category: 'feature', label: 'Multi-Stage', description: '2 or 3 actuation points.', sortOrder: 2 },
        { id: 'feature-twin', category: 'feature', label: 'Twin Pedal', description: 'Two independent pedals.', sortOrder: 3 },
        { id: 'feature-custom-cable', category: 'feature', label: 'Custom Cable Length', description: 'Non-standard cord length.', hideFor: ['wireless', 'pneumatic'], sortOrder: 4 },
        { id: 'feature-custom-connector', category: 'feature', label: 'Custom Connector', description: 'Specific plug type.', sortOrder: 5 },
        
        // Console Styles (Medical)
        { id: 'aero', category: 'console_style', label: 'Aero Channel', description: 'Low-profile, streamlined design.', sortOrder: 1 },
        { id: 'custom', category: 'console_style', label: 'Custom Design', description: 'Unique housing tailored to your needs.', sortOrder: 2 },
        
        // Pedal Counts (Medical)
        { id: '1', category: 'pedal_count', label: 'Single', description: 'One function', sortOrder: 1 },
        { id: '2', category: 'pedal_count', label: 'Dual', description: 'Two functions', sortOrder: 2 },
        { id: '3', category: 'pedal_count', label: 'Triple', description: 'Three functions', sortOrder: 3 },
        { id: '4+', category: 'pedal_count', label: 'Multi', description: '4+ controls', sortOrder: 4 },
        
        // Medical Technical Features
        { id: 'wireless_medical', category: 'medical_feature', label: 'RF Wireless', description: 'No cords in the OR.', sortOrder: 1 },
        { id: 'linear', category: 'medical_feature', label: 'Variable Speed', description: 'Proportional control.', sortOrder: 2 },
        { id: 'sealed', category: 'medical_feature', label: 'Sealed / Washdown', description: 'IP68 for sterilization.', sortOrder: 3 },
        
        // Accessories (Medical)
        { id: 'toe_loops', category: 'accessory', label: 'Toe Loops', description: 'Secure foot positioning.', sortOrder: 1 },
        { id: 'guards', category: 'accessory', label: 'Pedal Guards', description: 'Prevent accidental activation.', sortOrder: 2 },
        { id: 'labels', category: 'accessory', label: 'Custom Labels/Marking', description: 'Branding or identification.', sortOrder: 3 },
        { id: 'color', category: 'accessory', label: 'Custom Color', description: 'Match your device.', sortOrder: 4 },
      ];
      
      await kv.set('options', defaultOptions);
      console.log('Initialized options data');
    } else {
      console.log(`Found ${existingOptions.length} existing options. Preserving user data.`);
      
      // Migration: Add connector options if they don't exist
      const hasConnectorOptions = existingOptions.some((opt: any) => opt.category === 'connector');
      if (!hasConnectorOptions) {
        console.log('Adding missing connector options...');
        const connectorOptions = [
          { id: '3-prong', category: 'connector', label: '3-Prong Plug', description: 'Standard household plug.', icon: 'Plug', availableFor: ['electrical'], sortOrder: 1 },
          { id: 'flying-leads', category: 'connector', label: 'Flying Leads', description: 'Bare wire ends for custom wiring.', icon: 'Cable', availableFor: ['electrical'], sortOrder: 2 },
          { id: 'phone-plug', category: 'connector', label: 'Phone Plug (1/4\")', description: '1/4 inch phone jack.', icon: 'Phone', availableFor: ['electrical'], sortOrder: 3 },
        ];
        const updatedOptions = [...existingOptions, ...connectorOptions];
        await kv.set('options', updatedOptions);
        console.log(`Added ${connectorOptions.length} connector options. Total options: ${updatedOptions.length}`);
      }
    }

    // Set the version flag to prevent re-initialization on redeploy
    await kv.set('db_version', DB_VERSION);
    console.log(`Set database version to ${DB_VERSION}`);
  } catch (error) {
    console.error('Error initializing data:', error);
  }
}

// Initialize data on startup
initializeData().catch(console.error);

// Force server update log
console.log('Server starting... v1.5.2 - consolidated routes');

// GET all products
app.get('/make-server-a6e7a38d/products', async (c) => {
  try {
    console.log('Fetching products from KV store...');
    const products = await kv.get('products') || [];
    console.log(`Successfully fetched ${products.length} products`);
    return c.json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return c.json({ error: 'Failed to fetch products', details: error instanceof Error ? error.message : String(error) }, 500);
  }
});

// GET single product by ID
app.get('/make-server-a6e7a38d/products/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const products = await kv.get('products') || [];
    const product = products.find((p: any) => p.id === id);
    
    if (!product) {
      return c.json({ error: 'Product not found' }, 404);
    }
    
    return c.json({ product });
  } catch (error) {
    console.error('Error fetching product:', error);
    return c.json({ error: 'Failed to fetch product' }, 500);
  }
});

// POST create or update product (single or bulk)
app.post('/make-server-a6e7a38d/products', async (c) => {
  try {
    const body = await c.req.json();
    // Handle special "delete_all" action
    if (!Array.isArray(body) && body.action === 'delete_all') {
      console.log('⚠️ PROCESSING DELETE ALL REQUEST...');
      await kv.set('products', []);
      console.log('✅ All products deleted via POST endpoint');
      return c.json({ success: true, message: 'All products have been deleted' });
    }

    const products = await kv.get('products') || [];
    const productMap = new Map(products.map((p: any) => [p.id, p]));

    // Handle array (bulk)
    if (Array.isArray(body)) {
      console.log(`Processing bulk import for ${body.length} products via POST /products...`);
      for (const product of body) {
        if (!product.id) continue;
        productMap.set(product.id, { ...productMap.get(product.id), ...product });
      }
      
      const updatedProducts = Array.from(productMap.values());
      await kv.set('products', updatedProducts);
      
      console.log(`Bulk import complete. Total products: ${updatedProducts.length}`);
      return c.json({ success: true, count: updatedProducts.length });
    } 
    
    // Handle single object
    else {
      productMap.set(body.id, { ...productMap.get(body.id), ...body });
      const updatedProducts = Array.from(productMap.values());
      await kv.set('products', updatedProducts);
      const product = productMap.get(body.id);
      return c.json({ product });
    }
  } catch (error) {
    console.error('Error upserting product(s):', error);
    return c.json({ error: 'Failed to save product(s)' }, 500);
  }
});

// DELETE ALL products (Collection)
app.delete('/make-server-a6e7a38d/products', async (c) => {
  try {
    console.log('⚠️ DELETING ALL PRODUCTS via DELETE /products...');
    await kv.set('products', []);
    console.log('✅ All products deleted');
    return c.json({ success: true, message: 'All products have been deleted' });
  } catch (error) {
    console.error('Error deleting all products:', error);
    return c.json({ error: 'Failed to delete all products' }, 500);
  }
});

// DELETE product
app.delete('/make-server-a6e7a38d/products/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const products = await kv.get('products') || [];
    const filtered = products.filter((p: any) => p.id !== id);
    
    await kv.set('products', filtered);
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return c.json({ error: 'Failed to delete product' }, 500);
  }
});

// RESET/DELETE ALL products (Action) - Deprecated, use DELETE /products
app.post('/make-server-a6e7a38d/reset-products', async (c) => {
  try {
    console.log('⚠️ DELETING ALL PRODUCTS (RESET)...');
    await kv.set('products', []);
    return c.json({ success: true, message: 'All products have been deleted' });
  } catch (error) {
    return c.json({ error: 'Failed' }, 500);
  }
});

// FORCE DELETE ALL (GET) - Emergency fallback
app.get('/make-server-a6e7a38d/nuke-everything', async (c) => {
  try {
    console.log('☢️ NUKING ALL DATA...');
    await kv.set('products', []);
    return c.json({ success: true, message: 'Nuked successfully' });
  } catch (error) {
    return c.json({ error: String(error) }, 500);
  }
});

// GET all options
app.get('/make-server-a6e7a38d/options', async (c) => {
  try {
    const options = await kv.get('options') || [];
    return c.json({ options });
  } catch (error) {
    console.error('Error fetching options:', error);
    return c.json({ error: 'Failed to fetch options' }, 500);
  }
});

// GET options by category
app.get('/make-server-a6e7a38d/options/:category', async (c) => {
  try {
    const category = c.req.param('category');
    const allOptions = await kv.get('options') || [];
    const options = allOptions.filter((o: any) => o.category === category);
    
    return c.json({ options });
  } catch (error) {
    console.error('Error fetching options:', error);
    return c.json({ error: 'Failed to fetch options' }, 500);
  }
});

// POST create or update option
app.post('/make-server-a6e7a38d/options', async (c) => {
  try {
    const body = await c.req.json();
    const options = await kv.get('options') || [];
    
    const existingIndex = options.findIndex((o: any) => o.id === body.id);
    if (existingIndex >= 0) {
      options[existingIndex] = { ...options[existingIndex], ...body };
    } else {
      options.push(body);
    }
    
    await kv.set('options', options);
    const option = existingIndex >= 0 ? options[existingIndex] : body;
    
    return c.json({ option });
  } catch (error) {
    console.error('Error upserting option:', error);
    return c.json({ error: 'Failed to save option' }, 500);
  }
});

// DELETE option
app.delete('/make-server-a6e7a38d/options/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const options = await kv.get('options') || [];
    const filtered = options.filter((o: any) => o.id !== id);
    
    await kv.set('options', filtered);
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting option:', error);
    return c.json({ error: 'Failed to delete option' }, 500);
  }
});

// Health check
app.get('/make-server-a6e7a38d/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// One-time migration endpoint to add connector options
app.get('/make-server-a6e7a38d/migrate-connectors', async (c) => {
  try {
    console.log('Running connector migration...');
    const options = await kv.get('options') || [];
    
    // Check if connector options already exist
    const hasConnectorOptions = options.some((opt: any) => opt.category === 'connector');
    
    if (hasConnectorOptions) {
      return c.json({ 
        success: true, 
        message: 'Connector options already exist. No migration needed.',
        totalOptions: options.length,
        connectorCount: options.filter((o: any) => o.category === 'connector').length
      });
    }
    
    // Add the 3 connector options
    const connectorOptions = [
      { id: '3-prong', category: 'connector', label: '3-Prong Plug', description: 'Standard household plug.', icon: 'Plug', availableFor: ['electrical'], sortOrder: 1 },
      { id: 'flying-leads', category: 'connector', label: 'Flying Leads', description: 'Bare wire ends for custom wiring.', icon: 'Cable', availableFor: ['electrical'], sortOrder: 2 },
      { id: 'phone-plug', category: 'connector', label: 'Phone Plug (1/4")', description: '1/4 inch phone jack.', icon: 'Phone', availableFor: ['electrical'], sortOrder: 3 },
    ];
    
    const updatedOptions = [...options, ...connectorOptions];
    await kv.set('options', updatedOptions);
    
    return c.json({ 
      success: true, 
      message: 'Successfully added connector options!',
      addedCount: connectorOptions.length,
      totalOptions: updatedOptions.length
    });
  } catch (error) {
    console.error('Error running connector migration:', error);
    return c.json({ 
      success: false, 
      error: 'Failed to run migration', 
      details: error instanceof Error ? error.message : String(error) 
    }, 500);
  }
});

Deno.serve(app.fetch);