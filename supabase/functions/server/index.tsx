import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';

const app = new Hono();

// Middleware
app.use('*', logger(console.log));
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'x-client-info', 'apikey'],
  exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
  maxAge: 600,
}));

// Supabase Client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// --- HELPER: Map Stock Switches Row to Product Interface ---
function mapRowToProduct(row: any) {
  // Determine Technology
  let technology = 'electrical';
  if (row['Wireless'] === 'Yes' || (row['Description'] && row['Description'].toLowerCase().includes('wireless'))) {
    technology = 'wireless';
  } else if (row['Type'] === 'Pneumatic' || (row['Description'] && row['Description'].toLowerCase().includes('air'))) {
    technology = 'air';
  }

  // Determine Actions
  const actions = [];
  if (row['Momentary'] === 'Yes' || row['Action'] === 'Momentary') actions.push('momentary');
  if (row['Maintained'] === 'Yes' || row['Action'] === 'Maintained') actions.push('maintained');
  if (row['Linear'] === 'Yes' || row['Action'] === 'Variable') actions.push('variable');
  
  // Fallback action if none found
  if (actions.length === 0) actions.push('momentary');

  // Determine Features
  const features = [];
  if (row['Guard'] === 'Yes') features.push('shield');
  if (row['Shielded'] === 'Yes') features.push('shield');
  if (row['Number of Pedals'] && parseInt(row['Number of Pedals']) > 1) features.push('twin');
  if (row['Stages'] && row['Stages'] !== 'Single') features.push('multi_stage');

  return {
    id: row['Part Number'] || row['id']?.toString(), // Use Part Number as primary ID
    part_number: row['Part Number'],
    series: row['Series'],
    technology,
    duty: row['duty'] || 'medium', // Default to medium if not set
    ip: row['IP Rating'] || 'IP20',
    actions,
    material: row['Material'] || 'Formed Steel',
    description: row['description'] || row['Description'] || `${row['Series']} Footswitch`,
    applications: row['applications'] || ['industrial'], // Default app
    features,
    // Pass through other fields
    connector_type: row['connector_type'] || row['Wiring'] || row['Cable'] || 'undefined',
    certifications: row['certifications'] || row['Agency Approvals'],
    voltage: row['voltage'] || row['Electrical Rating'],
    amperage: row['amperage'],
    flagship: row['flagship'] || false,
    image: row['image_url'] || row['Image URL'] || '',
    link: row['Link'] || `https://linemaster.com/product/${row['Part Number']}`
  };
}

// --- ROUTES ---
// Using wildcard prefix (*/) to handle any function name (server, make-server-xxx, etc.)

// GET /products
app.get('*/products', async (c) => {
  try {
    const { data, error } = await supabase
      .from('Stock Switches')
      .select('*');

    if (error) throw error;

    const products = data.map(mapRowToProduct);
    return c.json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return c.json({ error: 'Failed to fetch products', details: error.message }, 500);
  }
});

// GET /products/:id
app.get('*/products/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const { data, error } = await supabase
      .from('Stock Switches')
      .select('*')
      .or(`"Part Number".eq.${id},id.eq.${id}`);

    if (error) throw error;
    if (!data || data.length === 0) return c.json({ error: 'Product not found' }, 404);

    return c.json({ product: mapRowToProduct(data[0]) });
  } catch (error) {
    return c.json({ error: 'Error fetching product' }, 500);
  }
});

// POST /products (Bulk Upsert)
app.post('*/products', async (c) => {
  try {
    const body = await c.req.json();
    const items = Array.isArray(body) ? body : [body];

    // Handle "Delete All" action
    if (!Array.isArray(body) && body.action === 'delete_all') {
      const { error } = await supabase.from('Stock Switches').delete().neq('id', 0); // Delete all
      if (error) throw error;
      return c.json({ success: true, message: 'All products deleted' });
    }

    const rowsToUpsert = items.map((p: any) => ({
      "Part Number": p.part_number || p.Part || p.id,
      "Series": p.series,
      "Description": p.description,
      "description": p.description,
      "Type": p.technology === 'air' ? 'Pneumatic' : (p.technology === 'wireless' ? 'Wireless' : 'Electric'),
      "Wireless": p.technology === 'wireless' ? 'Yes' : 'No',
      "Material": p.material,
      "IP Rating": p.ip,
      "Momentary": p.actions.includes('momentary') ? 'Yes' : 'No',
      "Maintained": p.actions.includes('maintained') ? 'Yes' : 'No',
      "Linear": p.actions.includes('variable') ? 'Yes' : 'No',
      "Guard": p.features.includes('shield') ? 'Yes' : 'No',
      "Number of Pedals": p.features.includes('twin') ? 2 : 1,
      "duty": p.duty,
      "applications": p.applications,
      "image_url": p.image,
      "connector_type": p.connector_type,
      "certifications": p.certifications,
      "voltage": p.voltage,
      "amperage": p.amperage,
      "flagship": p.flagship
    }));

    const { data, error } = await supabase
      .from('Stock Switches')
      .upsert(rowsToUpsert, { onConflict: 'Part Number' })
      .select();

    if (error) throw error;

    return c.json({ success: true, count: data.length });
  } catch (error) {
    console.error('Error saving products:', error);
    return c.json({ error: 'Failed to save products', details: error.message }, 500);
  }
});

// DELETE /products (Delete All)
app.delete('*/products', async (c) => {
  try {
    const { error } = await supabase.from('Stock Switches').delete().neq('id', -1);
    if (error) throw error;
    return c.json({ success: true, message: 'All products deleted' });
  } catch (error) {
    return c.json({ error: 'Failed to delete products' }, 500);
  }
});

// DELETE /products/:id
app.delete('*/products/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const { error } = await supabase
      .from('Stock Switches')
      .delete()
      .or(`"Part Number".eq.${id},id.eq.${id}`);

    if (error) throw error;
    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: 'Failed to delete product' }, 500);
  }
});

// GET /options
app.get('*/options', async (c) => {
  try {
    const { data, error } = await supabase
      .from('wizard_options')
      .select('*')
      .order('sortOrder', { ascending: true });

    if (error) throw error;
    return c.json({ options: data });
  } catch (error) {
    return c.json({ error: 'Failed to fetch options' }, 500);
  }
});

// POST /options
app.post('*/options', async (c) => {
  try {
    const body = await c.req.json();
    const { data, error } = await supabase
      .from('wizard_options')
      .upsert(body)
      .select()
      .single();

    if (error) throw error;
    return c.json({ option: data });
  } catch (error) {
    return c.json({ error: 'Failed to save option' }, 500);
  }
});

// Health check
app.get('*/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

Deno.serve(app.fetch);
