-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  series TEXT NOT NULL,
  technology TEXT NOT NULL,
  duty TEXT NOT NULL CHECK (duty IN ('heavy', 'medium', 'light')),
  ip TEXT NOT NULL,
  actions JSONB NOT NULL DEFAULT '[]'::jsonb,
  material TEXT NOT NULL,
  description TEXT NOT NULL,
  applications JSONB NOT NULL DEFAULT '[]'::jsonb,
  flagship BOOLEAN DEFAULT false,
  image TEXT NOT NULL,
  link TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create options table
CREATE TABLE IF NOT EXISTS options (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL CHECK (category IN (
    'application', 'technology', 'action', 'environment', 'feature', 
    'console_style', 'pedal_count', 'medical_feature', 'accessory'
  )),
  label TEXT NOT NULL,
  icon TEXT,
  description TEXT NOT NULL,
  is_medical BOOLEAN DEFAULT false,
  available_for JSONB DEFAULT '[]'::jsonb,
  hide_for JSONB DEFAULT '[]'::jsonb,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_products_technology ON products(technology);
CREATE INDEX IF NOT EXISTS idx_products_duty ON products(duty);
CREATE INDEX IF NOT EXISTS idx_options_category ON options(category);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE options ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public read access
CREATE POLICY "Allow public read access on products"
  ON products FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access on options"
  ON options FOR SELECT
  TO public
  USING (true);

-- Insert initial products data
INSERT INTO products (id, series, technology, duty, ip, actions, material, description, applications, flagship, image, link) VALUES
  ('hercules', 'Hercules', 'electrical', 'heavy', 'IP56', '["momentary", "maintained"]'::jsonb, 'Cast Iron', 'The ultimate heavy-duty industrial footswitch.', '["industrial", "automotive", "woodworking", "general"]'::jsonb, true, 'https://linemaster.com/wp-content/uploads/2025/04/hercules-full-shield.png', 'https://linemaster.com/product/167/hercules-full-shield/'),
  ('atlas', 'Atlas', 'electrical', 'heavy', 'IP68', '["momentary"]'::jsonb, 'Cast Aluminum', 'Fully sealed IP68 heavy-duty switch.', '["industrial", "automotive"]'::jsonb, false, 'https://linemaster.com/wp-content/uploads/2025/04/atlas.png', 'https://linemaster.com/product/77/atlas-full-shield/'),
  ('clipper', 'Clipper', 'electrical', 'medium', 'IP20', '["momentary", "maintained"]'::jsonb, 'Cast Iron', 'The industry standard. Classic cast iron.', '["industrial", "woodworking", "automotive", "general"]'::jsonb, true, 'https://linemaster.com/wp-content/uploads/2025/04/clipper_duo.png', 'https://linemaster.com/product/115/clipper-single-momentary/'),
  ('classic-iv', 'Classic IV', 'electrical', 'medium', 'IP68', '["momentary"]'::jsonb, 'Cast Aluminum', 'Watertight cast aluminum. IP68 sealed.', '["industrial", "automotive"]'::jsonb, false, 'https://linemaster.com/wp-content/uploads/2025/04/classic-iv.png', 'https://linemaster.com/product/112/classic-iv/'),
  ('dolphin', 'Dolphin', 'electrical', 'light', 'IP20', '["momentary"]'::jsonb, 'Polymeric', 'Omni-directional. Popular for tattoo artists.', '["general", "tattoo", "medical"]'::jsonb, false, 'https://linemaster.com/wp-content/uploads/2025/04/dolphin-2.png', 'https://linemaster.com/product/129/dolphin/'),
  ('gem-v', 'Gem-V', 'electrical', 'light', 'IP20', '["momentary"]'::jsonb, 'Cast Zinc', 'Round omni-directional design.', '["general", "tattoo", "medical"]'::jsonb, false, 'https://linemaster.com/wp-content/uploads/2025/04/gem.png', 'https://linemaster.com/product/162/gem-v/'),
  ('varior', 'Varior', 'electrical', 'light', 'IP20', '["variable"]'::jsonb, 'Formed Steel', 'Foot-operated potentiometer for variable speed.', '["industrial", "automotive", "woodworking", "general"]'::jsonb, false, 'https://linemaster.com/wp-content/uploads/2025/04/varior-potentiometer.png', 'https://linemaster.com/product/407/varior-potentiometer/'),
  ('wireless-hercules', 'RF Wireless Hercules', 'wireless', 'heavy', 'IP68', '["momentary"]'::jsonb, 'Cast Iron', 'RF Wireless. Eliminates trip hazards.', '["industrial", "automotive", "medical", "general"]'::jsonb, true, 'https://linemaster.com/wp-content/uploads/2025/04/rf-hercules.png', 'https://linemaster.com/product/475/radio-frequency-wireless-hercules/'),
  ('air-seal', 'Air Seal', 'pneumatic', 'light', 'IP20', '["momentary", "maintained"]'::jsonb, 'Formed Steel', 'Air-actuated electrical switch.', '["industrial", "general", "medical"]'::jsonb, false, 'https://linemaster.com/wp-content/uploads/2025/03/air_seal.png', 'https://linemaster.com/product/2/air-seal-maintained/'),
  ('airval-hercules', 'Airval Hercules', 'pneumatic', 'heavy', 'IP20', '["momentary", "maintained", "variable"]'::jsonb, 'Cast Iron', 'Heavy-duty cast iron pneumatic control.', '["industrial", "automotive"]'::jsonb, false, 'https://linemaster.com/wp-content/uploads/2025/03/airval-hercules-duo_optimized.png', 'https://linemaster.com/product/17/airval-hercules-full-shield/')
ON CONFLICT (id) DO NOTHING;

-- Insert initial options data
INSERT INTO options (id, category, label, icon, description, is_medical, available_for, sort_order) VALUES
  -- Applications
  ('industrial', 'application', 'Industrial & Manufacturing', 'Factory', 'Heavy machinery, CNC, assembly', false, '[]'::jsonb, 1),
  ('medical', 'application', 'Medical & Healthcare', 'Heart', 'Surgical, diagnostic, patient care', true, '[]'::jsonb, 2),
  ('automotive', 'application', 'Automotive & Repair', 'Car', 'Lifts, paint booths, tire changers', false, '[]'::jsonb, 3),
  ('woodworking', 'application', 'Woodworking', 'Hammer', 'Saws, lathes, routers', false, '[]'::jsonb, 4),
  ('tattoo', 'application', 'Tattoo & Body Art', 'Palette', 'Precision control for artists', false, '[]'::jsonb, 5),
  ('general', 'application', 'General / Other', 'Coffee', 'Office, consumer, specialty', false, '[]'::jsonb, 6),
  
  -- Technologies
  ('electrical', 'technology', 'Electrical', 'Zap', 'Standard wired connection.', false, '["industrial", "automotive", "woodworking", "tattoo", "general"]'::jsonb, 1),
  ('pneumatic', 'technology', 'Pneumatic (Air)', 'Wind', 'Uses compressed air.', false, '["industrial", "automotive", "woodworking", "general"]'::jsonb, 2),
  ('wireless', 'technology', 'RF Wireless', 'Radio', 'Cord-free operation.', false, '["industrial", "automotive", "general"]'::jsonb, 3),
  
  -- Actions
  ('momentary', 'action', 'Momentary', 'CircleDot', 'Active while pressed.', false, '["electrical", "pneumatic", "wireless"]'::jsonb, 1),
  ('maintained', 'action', 'Maintained', 'ToggleLeft', 'Press ON, press again OFF.', false, '["electrical", "pneumatic"]'::jsonb, 2),
  ('variable', 'action', 'Variable Speed', 'Gauge', 'Speed varies with pressure.', false, '["electrical", "pneumatic"]'::jsonb, 3),
  
  -- Environments
  ('dry', 'environment', 'Dry / Indoor', '', 'IP20 sufficient.', false, '[]'::jsonb, 1),
  ('damp', 'environment', 'Damp / Splash', '', 'IP56 recommended.', false, '[]'::jsonb, 2),
  ('wet', 'environment', 'Wet / Washdown', '', 'IP68 required.', false, '[]'::jsonb, 3),
  
  -- Features
  ('shield', 'feature', 'Safety Guard/Shield', '', 'Prevents accidental activation.', false, '[]'::jsonb, 1),
  ('multi_stage', 'feature', 'Multi-Stage', '', '2 or 3 actuation points.', false, '[]'::jsonb, 2),
  ('twin', 'feature', 'Twin Pedal', '', 'Two independent pedals.', false, '[]'::jsonb, 3),
  ('custom_cable', 'feature', 'Custom Cable Length', '', 'Non-standard cord length.', false, '[]'::jsonb, 4),
  ('custom_connector', 'feature', 'Custom Connector', '', 'Specific plug type.', false, '[]'::jsonb, 5),
  
  -- Console Styles (Medical)
  ('aero', 'console_style', 'Aero Channel', '', 'Low-profile, streamlined design.', false, '[]'::jsonb, 1),
  ('custom', 'console_style', 'Custom Design', '', 'Unique housing tailored to your needs.', false, '[]'::jsonb, 2),
  
  -- Pedal Counts (Medical)
  ('1', 'pedal_count', 'Single', '', 'One function', false, '[]'::jsonb, 1),
  ('2', 'pedal_count', 'Dual', '', 'Two functions', false, '[]'::jsonb, 2),
  ('3', 'pedal_count', 'Triple', '', 'Three functions', false, '[]'::jsonb, 3),
  ('4+', 'pedal_count', 'Multi', '', '4+ controls', false, '[]'::jsonb, 4),
  
  -- Medical Technical Features
  ('wireless_medical', 'medical_feature', 'RF Wireless', '', 'No cords in the OR.', false, '[]'::jsonb, 1),
  ('linear', 'medical_feature', 'Variable Speed', '', 'Proportional control.', false, '[]'::jsonb, 2),
  ('sealed', 'medical_feature', 'Sealed / Washdown', '', 'IP68 for sterilization.', false, '[]'::jsonb, 3),
  
  -- Accessories (Medical)
  ('toe_loops', 'accessory', 'Toe Loops', '', 'Secure foot positioning.', false, '[]'::jsonb, 1),
  ('guards', 'accessory', 'Pedal Guards', '', 'Prevent accidental activation.', false, '[]'::jsonb, 2),
  ('labels', 'accessory', 'Custom Labels/Marking', '', 'Branding or identification.', false, '[]'::jsonb, 3),
  ('color', 'accessory', 'Custom Color', '', 'Match your device.', false, '[]'::jsonb, 4)
ON CONFLICT (id) DO NOTHING;
