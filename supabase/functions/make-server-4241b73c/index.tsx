import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";

const app = new Hono();

// Middleware
app.use('*', logger(console.log));
app.use('*', cors());

// Supabase client factory
const supabase = () => createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

// ============================================
// Data transformation functions
// ============================================

// Map Stock Switches row to wizard-friendly technology value
function mapTechnology(row: any): 'electrical' | 'pneumatic' | 'wireless' {
  if (row.Wireless === 'Yes') return 'wireless';
  if (row['Pneumatic Flow Control'] === 'Yes' ||
      row.Type?.toLowerCase().includes('pneumatic') ||
      row['Type W/o Electrical']?.toLowerCase().includes('pneumatic')) {
    return 'pneumatic';
  }
  return 'electrical';
}

// Map Stock Switches row to wizard-friendly action value
function mapAction(row: any): 'momentary' | 'maintained' | 'variable' {
  if (row.Linear === 'Yes') return 'variable';
  if (row['On/Off'] === 'Main') return 'maintained';
  return 'momentary';
}

// Map Stock Switches row to array of actions (some products support multiple)
function mapActions(row: any): string[] {
  const actions: string[] = [];

  // Check On/Off field
  if (row['On/Off'] === 'Mom') actions.push('momentary');
  if (row['On/Off'] === 'Main') actions.push('maintained');

  // Check for variable/linear
  if (row.Linear === 'Yes') actions.push('variable');

  // If no actions detected, default to momentary
  if (actions.length === 0) actions.push('momentary');

  return actions;
}

// Map Stock Switches row to features array
function mapFeatures(row: any): string[] {
  const features: string[] = [];

  // Check for guard/shield
  if (row.Guard && row.Guard.trim() !== '') {
    features.push('shield');
  }

  // Check for twin pedal
  if (row['Number of Pedals'] && row['Number of Pedals'] >= 2) {
    features.push('twin');
  }

  // Check for multi-stage
  if (row.Stages && row.Stages.toLowerCase().includes('stage')) {
    features.push('multi_stage');
  }

  return features;
}

// Transform Stock Switches row to wizard Product format
function transformProductFromDB(row: any): any {
  return {
    id: row.id,
    part: row.Part,
    series: row.series,
    technology: mapTechnology(row),
    action: mapAction(row),
    actions: mapActions(row),
    ip: row['IP Rating'] || 'IPXX',
    material: row.Material || '',
    color: row.Color || '',
    guard: row.Guard || null,
    numberOfPedals: row['Number of Pedals'] || 1,
    stages: row.Stages || null,
    configuration: row.Configuration || null,
    connection: row.Connection || null,
    link: row.Link || '',
    // New wizard-friendly columns (from migration)
    applications: row.applications || ['industrial', 'general'],
    duty: row.duty || 'medium',
    description: row.description || `${row.series} - ${row.Part}`,
    image: row.image_url || '',
    // Computed features
    features: mapFeatures(row),
    // Additional data for display
    sytelineStatus: row['Syteline Status'],
    gated: row.Gated === 'Yes',
    wireless: row.Wireless === 'Yes',
    linear: row.Linear === 'Yes',
  };
}

// Transform wizard_options row to API format
function transformOptionFromDB(row: any): any {
  return {
    id: row.id,
    category: row.category,
    label: row.label,
    icon: row.icon || '',
    description: row.description || '',
    isMedical: row.is_medical || false,
    availableFor: row.available_for || [],
    hideFor: row.hide_for || [],
    sortOrder: row.sort_order || 0,
  };
}

// Transform API product to DB format for upsert
function transformProductToDB(product: any): any {
  return {
    series: product.series,
    Part: product.part,
    'On/Off': product.action === 'maintained' ? 'Main' : 'Mom',
    Wireless: product.technology === 'wireless' ? 'Yes' : null,
    Linear: product.action === 'variable' ? 'Yes' : null,
    Type: product.technology === 'pneumatic' ? 'Pneumatic Flow Control' : 'Electrical',
    'IP Rating': product.ip,
    Material: product.material,
    Color: product.color,
    Guard: product.guard,
    'Number of Pedals': product.numberOfPedals,
    Stages: product.stages,
    Configuration: product.configuration,
    Connection: product.connection,
    Link: product.link,
    applications: product.applications,
    duty: product.duty,
    description: product.description,
    image_url: product.image,
  };
}

// Transform API option to DB format for upsert
function transformOptionToDB(option: any): any {
  return {
    id: option.id,
    category: option.category,
    label: option.label,
    icon: option.icon,
    description: option.description,
    is_medical: option.isMedical || false,
    available_for: option.availableFor || [],
    hide_for: option.hideFor || [],
    sort_order: option.sortOrder || 0,
  };
}

// ============================================
// Product API endpoints
// ============================================

// GET all products from Stock Switches table
app.get('/make-server-4241b73c/products', async (c) => {
  try {
    console.log('Fetching products from Stock Switches table...');

    const { data, error } = await supabase()
      .from('Stock Switches')
      .select('*')
      .not('Syteline Status', 'eq', 'Obsolete')
      .order('series');

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    const products = (data || []).map(transformProductFromDB);
    console.log(`Successfully fetched ${products.length} products from Stock Switches`);

    return c.json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return c.json({
      error: 'Failed to fetch products',
      details: error instanceof Error ? error.message : String(error)
    }, 500);
  }
});

// GET single product by ID
app.get('/make-server-4241b73c/products/:id', async (c) => {
  try {
    const id = c.req.param('id');

    const { data, error } = await supabase()
      .from('Stock Switches')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return c.json({ error: 'Product not found' }, 404);
      }
      throw error;
    }

    const product = transformProductFromDB(data);
    return c.json({ product });
  } catch (error) {
    console.error('Error fetching product:', error);
    return c.json({ error: 'Failed to fetch product' }, 500);
  }
});

// POST create or update product
app.post('/make-server-4241b73c/products', async (c) => {
  try {
    const body = await c.req.json();
    const dbProduct = transformProductToDB(body);

    // If id is provided, update; otherwise insert
    if (body.id) {
      const { data, error } = await supabase()
        .from('Stock Switches')
        .update(dbProduct)
        .eq('id', body.id)
        .select()
        .single();

      if (error) throw error;
      return c.json({ product: transformProductFromDB(data) });
    } else {
      const { data, error } = await supabase()
        .from('Stock Switches')
        .insert(dbProduct)
        .select()
        .single();

      if (error) throw error;
      return c.json({ product: transformProductFromDB(data) });
    }
  } catch (error) {
    console.error('Error upserting product:', error);
    return c.json({ error: 'Failed to save product' }, 500);
  }
});

// DELETE product
app.delete('/make-server-4241b73c/products/:id', async (c) => {
  try {
    const id = c.req.param('id');

    const { error } = await supabase()
      .from('Stock Switches')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return c.json({ error: 'Failed to delete product' }, 500);
  }
});

// ============================================
// Options API endpoints
// ============================================

// GET all options from wizard_options table
app.get('/make-server-4241b73c/options', async (c) => {
  try {
    console.log('Fetching options from wizard_options table...');

    const { data, error } = await supabase()
      .from('wizard_options')
      .select('*')
      .order('sort_order');

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    const options = (data || []).map(transformOptionFromDB);
    console.log(`Successfully fetched ${options.length} options`);

    return c.json({ options });
  } catch (error) {
    console.error('Error fetching options:', error);
    return c.json({ error: 'Failed to fetch options' }, 500);
  }
});

// GET options by category
app.get('/make-server-4241b73c/options/:category', async (c) => {
  try {
    const category = c.req.param('category');

    const { data, error } = await supabase()
      .from('wizard_options')
      .select('*')
      .eq('category', category)
      .order('sort_order');

    if (error) throw error;

    const options = (data || []).map(transformOptionFromDB);
    return c.json({ options });
  } catch (error) {
    console.error('Error fetching options:', error);
    return c.json({ error: 'Failed to fetch options' }, 500);
  }
});

// POST create or update option
app.post('/make-server-4241b73c/options', async (c) => {
  try {
    const body = await c.req.json();
    const dbOption = transformOptionToDB(body);

    const { data, error } = await supabase()
      .from('wizard_options')
      .upsert(dbOption, { onConflict: 'id' })
      .select()
      .single();

    if (error) throw error;
    return c.json({ option: transformOptionFromDB(data) });
  } catch (error) {
    console.error('Error upserting option:', error);
    return c.json({ error: 'Failed to save option' }, 500);
  }
});

// DELETE option
app.delete('/make-server-4241b73c/options/:id', async (c) => {
  try {
    const id = c.req.param('id');

    const { error } = await supabase()
      .from('wizard_options')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting option:', error);
    return c.json({ error: 'Failed to delete option' }, 500);
  }
});

// ============================================
// Health check
// ============================================

app.get('/make-server-4241b73c/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

Deno.serve(app.fetch);
