# Linemaster Product Finder - Database Setup Instructions

This application now uses Supabase to store products and options data, making it fully updatable through the Supabase dashboard.

## Database Schema

You need to create two tables in your Supabase project:

### 1. Products Table

Create a table called `products` with the following structure:

```sql
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  series TEXT NOT NULL,
  technology TEXT NOT NULL,
  duty TEXT NOT NULL CHECK (duty IN ('heavy', 'medium', 'light')),
  ip TEXT NOT NULL,
  actions TEXT[] NOT NULL,
  material TEXT NOT NULL,
  description TEXT NOT NULL,
  applications TEXT[] NOT NULL,
  flagship BOOLEAN NOT NULL DEFAULT false,
  image TEXT NOT NULL,
  link TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON products
  FOR SELECT USING (true);

-- Create policy to allow authenticated users to insert/update/delete
CREATE POLICY "Allow authenticated users to modify" ON products
  FOR ALL USING (auth.role() = 'authenticated');
```

### 2. Options Table

Create a table called `options` with the following structure:

```sql
CREATE TABLE options (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  value TEXT,
  label TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  is_medical BOOLEAN DEFAULT false,
  available_for TEXT[],
  hide_for TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE options ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON options
  FOR SELECT USING (true);

-- Create policy to allow authenticated users to insert/update/delete
CREATE POLICY "Allow authenticated users to modify" ON options
  FOR ALL USING (auth.role() = 'authenticated');

-- Create index for faster category lookups
CREATE INDEX idx_options_category ON options(category);
```

## Initial Data Setup

### Option 1: Using Supabase SQL Editor

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run the CREATE TABLE statements above
4. Then insert the seed data using the queries below

### Option 2: Using Supabase Table Editor

1. Go to your Supabase project dashboard
2. Navigate to "Table Editor"
3. Click "New table" and create the `products` table with columns matching the schema
4. Click "New table" and create the `options` table with columns matching the schema
5. Manually insert rows using the UI (copy data from `/supabase/functions/server/seed-data.ts`)

## Seed Data SQL

### Insert Products

```sql
INSERT INTO products (id, series, technology, duty, ip, actions, material, description, applications, flagship, image, link) VALUES
('hercules', 'Hercules', 'electrical', 'heavy', 'IP56', ARRAY['momentary', 'maintained'], 'Cast Iron', 'The ultimate heavy-duty industrial footswitch.', ARRAY['industrial', 'automotive', 'woodworking', 'general'], true, 'https://linemaster.com/wp-content/uploads/2025/04/hercules-full-shield.png', 'https://linemaster.com/product/167/hercules-full-shield/'),
('atlas', 'Atlas', 'electrical', 'heavy', 'IP68', ARRAY['momentary'], 'Cast Aluminum', 'Fully sealed IP68 heavy-duty switch.', ARRAY['industrial', 'automotive'], false, 'https://linemaster.com/wp-content/uploads/2025/04/atlas.png', 'https://linemaster.com/product/77/atlas-full-shield/'),
('clipper', 'Clipper', 'electrical', 'medium', 'IP20', ARRAY['momentary', 'maintained'], 'Cast Iron', 'The industry standard. Classic cast iron.', ARRAY['industrial', 'woodworking', 'automotive', 'general'], true, 'https://linemaster.com/wp-content/uploads/2025/04/clipper_duo.png', 'https://linemaster.com/product/115/clipper-single-momentary/'),
('classic-iv', 'Classic IV', 'electrical', 'medium', 'IP68', ARRAY['momentary'], 'Cast Aluminum', 'Watertight cast aluminum. IP68 sealed.', ARRAY['industrial', 'automotive'], false, 'https://linemaster.com/wp-content/uploads/2025/04/classic-iv.png', 'https://linemaster.com/product/112/classic-iv/'),
('dolphin', 'Dolphin', 'electrical', 'light', 'IP20', ARRAY['momentary'], 'Polymeric', 'Omni-directional. Popular for tattoo artists.', ARRAY['general', 'tattoo', 'medical'], false, 'https://linemaster.com/wp-content/uploads/2025/04/dolphin-2.png', 'https://linemaster.com/product/129/dolphin/'),
('gem-v', 'Gem-V', 'electrical', 'light', 'IP20', ARRAY['momentary'], 'Cast Zinc', 'Round omni-directional design.', ARRAY['general', 'tattoo', 'medical'], false, 'https://linemaster.com/wp-content/uploads/2025/04/gem.png', 'https://linemaster.com/product/162/gem-v/'),
('varior', 'Varior', 'electrical', 'light', 'IP20', ARRAY['variable'], 'Formed Steel', 'Foot-operated potentiometer for variable speed.', ARRAY['industrial', 'automotive', 'woodworking', 'general'], false, 'https://linemaster.com/wp-content/uploads/2025/04/varior-potentiometer.png', 'https://linemaster.com/product/407/varior-potentiometer/'),
('wireless-hercules', 'RF Wireless Hercules', 'wireless', 'heavy', 'IP68', ARRAY['momentary'], 'Cast Iron', 'RF Wireless. Eliminates trip hazards.', ARRAY['industrial', 'automotive', 'medical', 'general'], true, 'https://linemaster.com/wp-content/uploads/2025/04/rf-hercules.png', 'https://linemaster.com/product/475/radio-frequency-wireless-hercules/'),
('air-seal', 'Air Seal', 'pneumatic', 'light', 'IP20', ARRAY['momentary', 'maintained'], 'Formed Steel', 'Air-actuated electrical switch.', ARRAY['industrial', 'general', 'medical'], false, 'https://linemaster.com/wp-content/uploads/2025/03/air_seal.png', 'https://linemaster.com/product/2/air-seal-maintained/'),
('airval-hercules', 'Airval Hercules', 'pneumatic', 'heavy', 'IP20', ARRAY['momentary', 'maintained', 'variable'], 'Cast Iron', 'Heavy-duty cast iron pneumatic control.', ARRAY['industrial', 'automotive'], false, 'https://linemaster.com/wp-content/uploads/2025/03/airval-hercules-duo_optimized.png', 'https://linemaster.com/product/17/airval-hercules-full-shield/');
```

### Insert Options

```sql
INSERT INTO options (id, category, value, label, description, icon, sort_order, is_medical, available_for, hide_for) VALUES
-- Application Options
('app-industrial', 'application', 'industrial', 'Industrial & Manufacturing', 'Heavy machinery, CNC, assembly', 'Factory', 1, false, NULL, NULL),
('app-automotive', 'application', 'automotive', 'Automotive & Repair', 'Lifts, paint booths, tire changers', 'Car', 2, false, NULL, NULL),
('app-medical', 'application', 'medical', 'Medical & Healthcare', 'Surgical, diagnostic, patient care', 'Heart', 3, true, NULL, NULL),
('app-woodworking', 'application', 'woodworking', 'Woodworking', 'Saws, lathes, routers', 'Hammer', 4, false, NULL, NULL),
('app-tattoo', 'application', 'tattoo', 'Tattoo & Body Art', 'Precision control for artists', 'Palette', 5, false, NULL, NULL),
('app-general', 'application', 'general', 'General / Other', 'Office, consumer, specialty', 'Coffee', 6, false, NULL, NULL),

-- Technology Options
('tech-electrical', 'technology', 'electrical', 'Electrical', 'Standard wired connection.', 'Zap', 1, false, ARRAY['industrial', 'automotive', 'woodworking', 'tattoo', 'general'], NULL),
('tech-pneumatic', 'technology', 'pneumatic', 'Pneumatic (Air)', 'Uses compressed air.', 'Wind', 2, false, ARRAY['industrial', 'automotive', 'woodworking', 'general'], NULL),
('tech-wireless', 'technology', 'wireless', 'RF Wireless', 'Cord-free operation.', 'Radio', 3, false, ARRAY['industrial', 'automotive', 'general'], NULL),

-- Action Type Options
('action-momentary', 'action', 'momentary', 'Momentary', 'Active while pressed.', 'CircleDot', 1, false, ARRAY['electrical', 'pneumatic', 'wireless'], NULL),
('action-maintained', 'action', 'maintained', 'Maintained', 'Press ON, press again OFF.', 'ToggleLeft', 2, false, ARRAY['electrical', 'pneumatic'], NULL),
('action-variable', 'action', 'variable', 'Variable Speed', 'Speed varies with pressure.', 'Gauge', 3, false, ARRAY['electrical', 'pneumatic'], NULL),

-- Environment Options
('env-dry', 'environment', 'dry', 'Dry / Indoor', 'IP20 sufficient.', 'Home', 1, false, NULL, NULL),
('env-damp', 'environment', 'damp', 'Damp / Splash', 'IP56 recommended.', 'CloudRain', 2, false, NULL, NULL),
('env-wet', 'environment', 'wet', 'Wet / Washdown', 'IP68 required.', 'Droplets', 3, false, NULL, NULL),

-- Feature Options
('feature-shield', 'feature', 'shield', 'Safety Guard/Shield', 'Prevents accidental activation.', 'Shield', 1, false, NULL, NULL),
('feature-multi-stage', 'feature', 'multi_stage', 'Multi-Stage', '2 or 3 actuation points.', 'Layers', 2, false, NULL, NULL),
('feature-twin', 'feature', 'twin', 'Twin Pedal', 'Two independent pedals.', 'Copy', 3, false, NULL, NULL),
('feature-custom-cable', 'feature', 'custom_cable', 'Custom Cable Length', 'Non-standard cord length.', 'Cable', 4, false, NULL, ARRAY['wireless', 'pneumatic']),
('feature-custom-connector', 'feature', 'custom_connector', 'Custom Connector', 'Specific plug type.', 'Plug', 5, false, NULL, NULL),

-- Console Style Options (Medical Flow)
('console-aero', 'console_style', 'aero', 'Aero Channel', 'Low-profile, streamlined design.', 'Boxes', 1, false, NULL, NULL),
('console-custom', 'console_style', 'custom', 'Custom Design', 'Unique housing tailored to your needs.', 'Settings', 2, false, NULL, NULL),

-- Pedal Count Options (Medical Flow)
('pedal-1', 'pedal_count', '1', 'Single', 'One function', 'Circle', 1, false, NULL, NULL),
('pedal-2', 'pedal_count', '2', 'Dual', 'Two functions', 'CircleDot', 2, false, NULL, NULL),
('pedal-3', 'pedal_count', '3', 'Triple', 'Three functions', 'Target', 3, false, NULL, NULL),
('pedal-4plus', 'pedal_count', '4+', 'Multi', '4+ controls', 'Grid3x3', 4, false, NULL, NULL),

-- Medical Technical Features
('med-feature-wireless', 'medical_feature', 'wireless', 'RF Wireless', 'No cords in the OR.', 'Radio', 1, false, NULL, NULL),
('med-feature-linear', 'medical_feature', 'linear', 'Variable Speed', 'Proportional control.', 'Gauge', 2, false, NULL, NULL),
('med-feature-sealed', 'medical_feature', 'sealed', 'Sealed / Washdown', 'IP68 for sterilization.', 'Droplets', 3, false, NULL, NULL),

-- Accessory Options (Medical Flow)
('acc-toe-loops', 'accessory', 'toe_loops', 'Toe Loops', 'Secure foot positioning.', 'Circle', 1, false, NULL, NULL),
('acc-guards', 'accessory', 'guards', 'Pedal Guards', 'Prevent accidental activation.', 'Shield', 2, false, NULL, NULL),
('acc-labels', 'accessory', 'labels', 'Custom Labels/Marking', 'Branding or identification.', 'Tag', 3, false, NULL, NULL),
('acc-color', 'accessory', 'color', 'Custom Color', 'Match your device.', 'Palette', 4, false, NULL, NULL);
```

## Managing Data

### Updating Products

To update products after the initial setup:

1. Go to Supabase Dashboard → Table Editor → products
2. Click on any row to edit it
3. Modify fields as needed
4. Changes will immediately be reflected in the application

### Updating Options

To update wizard options:

1. Go to Supabase Dashboard → Table Editor → options
2. Click on any row to edit it
3. Key fields:
   - `category`: The step/category (application, technology, action, duty, feature)
   - `value`: The internal value used for filtering
   - `label`: Display text shown to users
   - `description`: Subtitle text
   - `icon`: Lucide icon name
   - `sort_order`: Display order (lower numbers appear first)

### Adding New Products

1. Go to Table Editor → products → Insert → Insert row
2. Fill in all required fields:
   - `id`: Unique identifier (lowercase-with-hyphens)
   - `series`: Product name
   - `technology`: electrical, pneumatic, or wireless
   - `duty`: heavy, medium, or light
   - `ip`: IP rating (e.g., IP20, IP56, IP68)
   - `actions`: Array of action types (e.g., ['momentary', 'maintained'])
   - `material`: Material description
   - `description`: Product description
   - `applications`: Array of application types
   - `flagship`: true or false
   - `image`: Full URL to product image
   - `link`: Full URL to product page
3. Click Save

### Adding New Options

1. Go to Table Editor → options → Insert → Insert row
2. Fill in required fields as described above
3. Click Save

## Verification

After setting up the database:

1. Check that both tables exist in your Supabase project
2. Verify that Row Level Security policies are enabled
3. Confirm that the seed data has been inserted
4. Test the application - it should now load products and options from Supabase
5. Try editing a product in Supabase and refresh the app to see the changes

## Troubleshooting

If data doesn't load:
1. Check browser console for API errors
2. Verify Supabase URL and Anon Key are correct in your project settings
3. Ensure RLS policies allow public SELECT access
4. Check that the edge function is deployed and running
5. Test the API endpoint directly: `https://[your-project-id].supabase.co/functions/v1/make-server-a6e7a38d/health`

## Notes

- The application automatically fetches fresh data on page load
- All changes made in Supabase are immediately available (after page refresh)
- You can add new products, options, or modify existing ones without touching code
- Arrays in PostgreSQL use the format: `ARRAY['value1', 'value2']` in SQL or `["value1", "value2"]` in the UI