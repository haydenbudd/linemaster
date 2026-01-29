-- Migration: Setup Wizard Schema and Data
-- Description: Adds columns to Stock Switches, creates wizard_options, sets up RLS, and seeds data.

-- 1. Add new columns to "Stock Switches" if they don't exist
ALTER TABLE "Stock Switches" ADD COLUMN IF NOT EXISTS "applications" text[] DEFAULT '{}';
ALTER TABLE "Stock Switches" ADD COLUMN IF NOT EXISTS "duty" text;
ALTER TABLE "Stock Switches" ADD COLUMN IF NOT EXISTS "description" text;
ALTER TABLE "Stock Switches" ADD COLUMN IF NOT EXISTS "image_url" text;
ALTER TABLE "Stock Switches" ADD COLUMN IF NOT EXISTS "connector_type" text; -- Added to support connection filtering
ALTER TABLE "Stock Switches" ADD COLUMN IF NOT EXISTS "certifications" text;
ALTER TABLE "Stock Switches" ADD COLUMN IF NOT EXISTS "voltage" text;
ALTER TABLE "Stock Switches" ADD COLUMN IF NOT EXISTS "amperage" text;
ALTER TABLE "Stock Switches" ADD COLUMN IF NOT EXISTS "flagship" boolean DEFAULT false;

-- 2. Create wizard_options table
CREATE TABLE IF NOT EXISTS wizard_options (
    id text PRIMARY KEY,
    category text NOT NULL,
    label text NOT NULL,
    icon text,
    description text,
    "isMedical" boolean DEFAULT false,
    "availableFor" text[],
    "hideFor" text[],
    "sortOrder" integer DEFAULT 0,
    created_at timestamptz DEFAULT now()
);

-- 3. Enable RLS
ALTER TABLE "Stock Switches" ENABLE ROW LEVEL SECURITY;
ALTER TABLE wizard_options ENABLE ROW LEVEL SECURITY;

-- 4. Create Policies
-- Public Read for Stock Switches
CREATE POLICY "Public Read Stock Switches" ON "Stock Switches"
    FOR SELECT
    USING (true);

-- Authenticated Write for Stock Switches (for Admin Importer)
CREATE POLICY "Authenticated Write Stock Switches" ON "Stock Switches"
    FOR ALL
    USING (auth.role() = 'authenticated');

-- Public Read for wizard_options
CREATE POLICY "Public Read wizard_options" ON wizard_options
    FOR SELECT
    USING (true);

-- Authenticated Write for wizard_options
CREATE POLICY "Authenticated Write wizard_options" ON wizard_options
    FOR ALL
    USING (auth.role() = 'authenticated');

-- 5. Seed wizard_options
INSERT INTO wizard_options (id, category, label, icon, description, "isMedical", "availableFor", "hideFor", "sortOrder")
VALUES
    -- Applications
    ('industrial', 'application', 'Industrial & Manufacturing', 'Factory', 'Heavy machinery, CNC, assembly', false, null, null, 1),
    ('medical', 'application', 'Medical & Healthcare', 'Heart', 'Surgical, diagnostic, patient care', true, null, null, 2),
    ('automotive', 'application', 'Automotive & Repair', 'Car', 'Lifts, paint booths, tire changers', false, null, null, 3),
    ('woodworking', 'application', 'Woodworking', 'Hammer', 'Saws, lathes, routers', false, null, null, 4),
    ('tattoo', 'application', 'Tattoo & Body Art', 'Palette', 'Precision control for artists', false, null, null, 5),
    ('general', 'application', 'General / Other', 'Coffee', 'Office, consumer, specialty', false, null, null, 6),

    -- Technologies
    ('electrical', 'technology', 'Electrical', 'Zap', 'Standard wired connection.', false, ARRAY['industrial', 'automotive', 'woodworking', 'tattoo', 'general'], null, 1),
    ('pneumatic', 'technology', 'Pneumatic (Air)', 'Wind', 'Uses compressed air.', false, ARRAY['industrial', 'automotive', 'woodworking', 'general'], null, 2),
    ('wireless', 'technology', 'RF Wireless', 'Radio', 'Cord-free operation.', false, ARRAY['industrial', 'automotive', 'general'], null, 3),

    -- Actions
    ('momentary', 'action', 'Momentary', 'CircleDot', 'Active while pressed.', false, ARRAY['electrical', 'pneumatic', 'wireless'], null, 1),
    ('maintained', 'action', 'Maintained', 'ToggleLeft', 'Press ON, press again OFF.', false, ARRAY['electrical', 'pneumatic'], null, 2),
    ('variable', 'action', 'Variable Speed', 'Gauge', 'Speed varies with pressure.', false, ARRAY['electrical', 'pneumatic'], null, 3),

    -- Environments
    ('dry', 'environment', 'Dry / Indoor', 'Home', 'IP20 sufficient.', false, null, null, 1),
    ('damp', 'environment', 'Damp / Splash', 'CloudRain', 'IP56 recommended.', false, null, null, 2),
    ('wet', 'environment', 'Wet / Washdown', 'Droplets', 'IP68 required.', false, null, null, 3),

    -- Materials (New Category for Wizard)
    ('Cast Iron', 'material', 'Heavy Duty (Cast Iron)', 'Anvil', 'Maximum stability and durability.', false, null, null, 1),
    ('Cast Aluminum', 'material', 'Medium Duty (Aluminum)', 'Feather', 'Strong yet lightweight.', false, null, null, 2),
    ('Polymeric', 'material', 'Light Duty (Plastic)', 'Leaf', 'Cost-effective for light use.', false, null, null, 3),
    ('Formed Steel', 'material', 'General Purpose (Steel)', 'Box', 'Durable standard housing.', false, null, null, 4),

    -- Connectors (New Category)
    ('3-prong', 'connector', '3-Prong Plug', 'Plug', 'Standard household plug.', false, ARRAY['electrical'], null, 1),
    ('flying-leads', 'connector', 'Flying Leads', 'Cable', 'Bare wire ends for custom wiring.', false, ARRAY['electrical'], null, 2),
    ('phone-plug', 'connector', 'Phone Plug (1/4")', 'Phone', '1/4 inch phone jack.', false, ARRAY['electrical'], null, 3),

    -- Features
    ('feature-shield', 'feature', 'Safety Guard/Shield', null, 'Prevents accidental activation.', false, null, null, 1),
    ('feature-multi_stage', 'feature', 'Multi-Stage', null, '2 or 3 actuation points.', false, null, null, 2),
    ('feature-twin', 'feature', 'Twin Pedal', null, 'Two independent pedals.', false, null, null, 3),
    ('feature-custom-cable', 'feature', 'Custom Cable Length', null, 'Non-standard cord length.', false, null, ARRAY['wireless', 'pneumatic'], 4),
    ('feature-custom-connector', 'feature', 'Custom Connector', null, 'Specific plug type.', false, null, null, 5)
ON CONFLICT (id) DO UPDATE SET
    label = EXCLUDED.label,
    description = EXCLUDED.description,
    "availableFor" = EXCLUDED."availableFor",
    "hideFor" = EXCLUDED."hideFor",
    "sortOrder" = EXCLUDED."sortOrder";

-- 6. Auto-populate duty based on Series (Heuristic Update)
UPDATE "Stock Switches" SET duty = 'heavy' WHERE "Series" ILIKE '%hercules%' OR "Series" ILIKE '%atlas%';
UPDATE "Stock Switches" SET duty = 'medium' WHERE "Series" ILIKE '%clipper%' OR "Series" ILIKE '%classic%';
UPDATE "Stock Switches" SET duty = 'light' WHERE "Series" ILIKE '%dolphin%' OR "Series" ILIKE '%gem%' OR "Series" ILIKE '%compact%';
