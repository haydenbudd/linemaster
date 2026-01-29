-- Migration: Set up wizard to use Stock Switches table directly
-- This adds wizard-friendly columns to Stock Switches and creates the wizard_options table

-- ============================================
-- Step 1: Add missing columns to Stock Switches
-- ============================================

ALTER TABLE "Stock Switches"
ADD COLUMN IF NOT EXISTS applications TEXT[],
ADD COLUMN IF NOT EXISTS duty TEXT,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- ============================================
-- Step 2: Create wizard_options table
-- ============================================

CREATE TABLE IF NOT EXISTS wizard_options (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL CHECK (category IN (
    'application', 'technology', 'action', 'environment', 'feature',
    'console_style', 'pedal_count', 'medical_feature', 'accessory'
  )),
  label TEXT NOT NULL,
  icon TEXT,
  description TEXT,
  is_medical BOOLEAN DEFAULT false,
  available_for TEXT[] DEFAULT '{}',
  hide_for TEXT[] DEFAULT '{}',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on category for faster filtering
CREATE INDEX IF NOT EXISTS idx_wizard_options_category ON wizard_options(category);

-- ============================================
-- Step 3: Enable RLS and create policies
-- ============================================

-- Enable RLS on Stock Switches if not already enabled
ALTER TABLE "Stock Switches" ENABLE ROW LEVEL SECURITY;

-- Enable RLS on wizard_options
ALTER TABLE wizard_options ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Public read Stock Switches" ON "Stock Switches";
DROP POLICY IF EXISTS "Auth insert Stock Switches" ON "Stock Switches";
DROP POLICY IF EXISTS "Auth update Stock Switches" ON "Stock Switches";
DROP POLICY IF EXISTS "Auth delete Stock Switches" ON "Stock Switches";

DROP POLICY IF EXISTS "Public read wizard_options" ON wizard_options;
DROP POLICY IF EXISTS "Auth insert wizard_options" ON wizard_options;
DROP POLICY IF EXISTS "Auth update wizard_options" ON wizard_options;
DROP POLICY IF EXISTS "Auth delete wizard_options" ON wizard_options;

-- Stock Switches policies
CREATE POLICY "Public read Stock Switches" ON "Stock Switches"
  FOR SELECT TO public USING (true);

CREATE POLICY "Auth insert Stock Switches" ON "Stock Switches"
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Auth update Stock Switches" ON "Stock Switches"
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Auth delete Stock Switches" ON "Stock Switches"
  FOR DELETE TO authenticated USING (true);

-- wizard_options policies
CREATE POLICY "Public read wizard_options" ON wizard_options
  FOR SELECT TO public USING (true);

CREATE POLICY "Auth insert wizard_options" ON wizard_options
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Auth update wizard_options" ON wizard_options
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Auth delete wizard_options" ON wizard_options
  FOR DELETE TO authenticated USING (true);

-- ============================================
-- Step 4: Populate wizard_options from existing data
-- ============================================

INSERT INTO wizard_options (id, category, label, icon, description, is_medical, available_for, hide_for, sort_order) VALUES
  -- Applications
  ('industrial', 'application', 'Industrial & Manufacturing', 'Factory', 'Heavy machinery, CNC, assembly', false, '{}', '{}', 1),
  ('medical', 'application', 'Medical & Healthcare', 'Heart', 'Surgical, diagnostic, patient care', true, '{}', '{}', 2),
  ('automotive', 'application', 'Automotive & Repair', 'Car', 'Lifts, paint booths, tire changers', false, '{}', '{}', 3),
  ('woodworking', 'application', 'Woodworking', 'Hammer', 'Saws, lathes, routers', false, '{}', '{}', 4),
  ('tattoo', 'application', 'Tattoo & Body Art', 'Palette', 'Precision control for artists', false, '{}', '{}', 5),
  ('general', 'application', 'General / Other', 'Coffee', 'Office, consumer, specialty', false, '{}', '{}', 6),

  -- Technologies
  ('electrical', 'technology', 'Electrical', 'Zap', 'Standard wired connection.', false, ARRAY['industrial', 'automotive', 'woodworking', 'tattoo', 'general'], '{}', 1),
  ('pneumatic', 'technology', 'Pneumatic (Air)', 'Wind', 'Uses compressed air.', false, ARRAY['industrial', 'automotive', 'woodworking', 'general'], '{}', 2),
  ('wireless', 'technology', 'RF Wireless', 'Radio', 'Cord-free operation.', false, ARRAY['industrial', 'automotive', 'general'], '{}', 3),

  -- Actions
  ('momentary', 'action', 'Momentary', 'CircleDot', 'Active while pressed.', false, ARRAY['electrical', 'pneumatic', 'wireless'], '{}', 1),
  ('maintained', 'action', 'Maintained', 'ToggleLeft', 'Press ON, press again OFF.', false, ARRAY['electrical', 'pneumatic'], '{}', 2),
  ('variable', 'action', 'Variable Speed', 'Gauge', 'Speed varies with pressure.', false, ARRAY['electrical', 'pneumatic'], '{}', 3),

  -- Environments
  ('dry', 'environment', 'Dry / Indoor', 'Home', 'IP20 sufficient.', false, '{}', '{}', 1),
  ('damp', 'environment', 'Damp / Splash', 'CloudRain', 'IP56 recommended.', false, '{}', '{}', 2),
  ('wet', 'environment', 'Wet / Washdown', 'Droplets', 'IP68 required.', false, '{}', '{}', 3),

  -- Features
  ('feature-shield', 'feature', 'Safety Guard/Shield', 'Shield', 'Prevents accidental activation.', false, '{}', '{}', 1),
  ('feature-multi_stage', 'feature', 'Multi-Stage', 'Layers', '2 or 3 actuation points.', false, '{}', '{}', 2),
  ('feature-twin', 'feature', 'Twin Pedal', 'Copy', 'Two independent pedals.', false, '{}', '{}', 3),
  ('feature-custom-cable', 'feature', 'Custom Cable Length', 'Cable', 'Non-standard cord length.', false, '{}', ARRAY['wireless', 'pneumatic'], 4),
  ('feature-custom-connector', 'feature', 'Custom Connector', 'Plug', 'Specific plug type.', false, '{}', '{}', 5),

  -- Console Styles (Medical)
  ('aero', 'console_style', 'Aero Channel', 'Wind', 'Low-profile, streamlined design.', false, '{}', '{}', 1),
  ('custom', 'console_style', 'Custom Design', 'Wrench', 'Unique housing tailored to your needs.', false, '{}', '{}', 2),

  -- Pedal Counts (Medical)
  ('1', 'pedal_count', 'Single', 'CircleDot', 'One function', false, '{}', '{}', 1),
  ('2', 'pedal_count', 'Dual', 'Circle', 'Two functions', false, '{}', '{}', 2),
  ('3', 'pedal_count', 'Triple', 'Circle', 'Three functions', false, '{}', '{}', 3),
  ('4+', 'pedal_count', 'Multi', 'MoreHorizontal', '4+ controls', false, '{}', '{}', 4),

  -- Medical Technical Features
  ('wireless_medical', 'medical_feature', 'RF Wireless', 'Radio', 'No cords in the OR.', false, '{}', '{}', 1),
  ('linear', 'medical_feature', 'Variable Speed', 'Gauge', 'Proportional control.', false, '{}', '{}', 2),
  ('sealed', 'medical_feature', 'Sealed / Washdown', 'Droplets', 'IP68 for sterilization.', false, '{}', '{}', 3),

  -- Accessories (Medical)
  ('toe_loops', 'accessory', 'Toe Loops', 'Footprints', 'Secure foot positioning.', false, '{}', '{}', 1),
  ('guards', 'accessory', 'Pedal Guards', 'Shield', 'Prevent accidental activation.', false, '{}', '{}', 2),
  ('labels', 'accessory', 'Custom Labels/Marking', 'Tag', 'Branding or identification.', false, '{}', '{}', 3),
  ('color', 'accessory', 'Custom Color', 'Palette', 'Match your device.', false, '{}', '{}', 4)
ON CONFLICT (id) DO UPDATE SET
  category = EXCLUDED.category,
  label = EXCLUDED.label,
  icon = EXCLUDED.icon,
  description = EXCLUDED.description,
  is_medical = EXCLUDED.is_medical,
  available_for = EXCLUDED.available_for,
  hide_for = EXCLUDED.hide_for,
  sort_order = EXCLUDED.sort_order,
  updated_at = NOW();

-- ============================================
-- Step 5: Populate duty based on series
-- ============================================

-- Heavy duty series
UPDATE "Stock Switches" SET duty = 'heavy'
WHERE duty IS NULL AND (
  series ILIKE '%Hercules%' OR
  series ILIKE '%Atlas%' OR
  series ILIKE 'Airval Hercules%' OR
  series ILIKE 'Anti-Trip Hercules%'
);

-- Medium duty series
UPDATE "Stock Switches" SET duty = 'medium'
WHERE duty IS NULL AND (
  series ILIKE '%Clipper%' OR
  series ILIKE '%Classic%' OR
  series ILIKE 'Airval - Clipper%' OR
  series ILIKE 'Airval- Clipper%'
);

-- Light duty series
UPDATE "Stock Switches" SET duty = 'light'
WHERE duty IS NULL AND (
  series ILIKE '%Dolphin%' OR
  series ILIKE '%Gem%' OR
  series ILIKE '%Aquiline%' OR
  series ILIKE '%Air Seal%' OR
  series ILIKE 'Airval- Classic%' OR
  series ILIKE 'Airval - Classic%' OR
  series ILIKE 'Airval - Compact%' OR
  series ILIKE 'Airval- Compact%' OR
  series ILIKE 'Airval - Premier%' OR
  series ILIKE 'Airval- Premier%'
);

-- Default anything else to medium
UPDATE "Stock Switches" SET duty = 'medium'
WHERE duty IS NULL;

-- ============================================
-- Step 6: Set default applications
-- ============================================

-- Industrial-focused products
UPDATE "Stock Switches" SET applications = ARRAY['industrial', 'automotive', 'woodworking', 'general']
WHERE applications IS NULL AND (
  series ILIKE '%Hercules%' OR
  series ILIKE '%Atlas%' OR
  series ILIKE '%Clipper%' OR
  series ILIKE '%Classic%' OR
  series ILIKE '%Airval%'
);

-- Light-duty products often used for tattoo/medical
UPDATE "Stock Switches" SET applications = ARRAY['general', 'tattoo', 'medical']
WHERE applications IS NULL AND (
  series ILIKE '%Dolphin%' OR
  series ILIKE '%Gem%' OR
  series ILIKE '%Aquiline%'
);

-- Default for anything else
UPDATE "Stock Switches" SET applications = ARRAY['industrial', 'general']
WHERE applications IS NULL;
