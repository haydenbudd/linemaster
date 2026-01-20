# Linemaster Product Finder - Backend Integration

This application has been upgraded to use Supabase as a backend, making all products and wizard options fully manageable through a database interface.

## What's Changed

### Before
- Products and options were hardcoded in static TypeScript files
- Any changes required code edits and redeployment

### After
- Products and options are stored in Supabase PostgreSQL database
- Fully updatable through Supabase dashboard
- No code changes needed to manage content
- Real-time updates (visible after page refresh)

## Architecture

```
Frontend (React App)
    ↓
API Layer (/src/app/lib/api.ts)
    ↓
Edge Function Server (/supabase/functions/server/index.tsx)
    ↓
Supabase PostgreSQL Database
```

### Database Tables

1. **products** - Stores all foot switch products
   - Product details (series, technology, duty, IP rating, etc.)
   - Images and links
   - Applications and features

2. **options** - Stores wizard flow options
   - Categories (application, technology, action, environment, feature, etc.)
   - Both Standard and Medical flow options
   - Dynamic filtering rules (availableFor, hideFor)

## Setup Instructions

### Step 1: Create Database Tables

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the SQL from `/DATABASE_SETUP_INSTRUCTIONS.md`
4. Run the CREATE TABLE statements
5. Run the INSERT statements to populate initial data

### Step 2: Verify Setup

1. Go to **Table Editor** in Supabase dashboard
2. Verify you see `products` table with 10 products
3. Verify you see `options` table with 40+ options
4. Check that Row Level Security is enabled on both tables

### Step 3: Test the Application

1. Refresh your application
2. You should see the loading spinner briefly
3. The wizard should load with all options
4. Products should display correctly in results

## Managing Content

### Update Products

**Via Supabase Dashboard:**
1. Go to Table Editor → products
2. Click any row to edit
3. Modify fields (series, description, image, link, etc.)
4. Save changes
5. Refresh app to see updates

**Example Updates:**
- Change product images
- Update descriptions
- Add new products
- Mark products as flagship
- Update product links

### Update Wizard Options

**Via Supabase Dashboard:**
1. Go to Table Editor → options
2. Click any row to edit
3. Key fields to modify:
   - `label`: Display text shown to users
   - `description`: Subtitle/help text
   - `icon`: Lucide icon name (e.g., 'Factory', 'Car', 'Heart')
   - `sort_order`: Display order (lower = first)
   - `available_for`: Array of values where this option shows
   - `hide_for`: Array of values where this option hides

**Example Updates:**
- Reorder options by changing sort_order
- Update option labels and descriptions
- Add new wizard steps
- Modify filtering logic

### Add New Products

1. Table Editor → products → Insert → Insert row
2. Fill in required fields:
   ```
   id: 'new-product-id'
   series: 'Product Name'
   technology: 'electrical' | 'pneumatic' | 'wireless'
   duty: 'heavy' | 'medium' | 'light'
   ip: 'IP20' | 'IP56' | 'IP68'
   actions: ['momentary', 'maintained', 'variable']
   material: 'Material description'
   description: 'Product description'
   applications: ['industrial', 'automotive', etc.]
   flagship: true | false
   image: 'https://...'
   link: 'https://...'
   ```
3. Save

### Add New Wizard Options

1. Table Editor → options → Insert → Insert row
2. Fill in fields:
   ```
   id: 'unique-option-id'
   category: 'application' | 'technology' | 'action' | 'environment' | 'feature'
   value: 'internal-value'
   label: 'Display Text'
   description: 'Help text'
   icon: 'IconName'
   sort_order: 1
   ```
3. Save

## API Endpoints

The Edge Function provides these REST endpoints:

### Products
- `GET /products` - List all products
- `GET /products/:id` - Get single product
- `POST /products` - Create or update product
- `DELETE /products/:id` - Delete product

### Options
- `GET /options` - List all options
- `GET /options/:category` - Get options by category
- `POST /options` - Create or update option
- `DELETE /options/:id` - Delete option

### Health Check
- `GET /health` - Check API status

## Data Format Notes

### Arrays in PostgreSQL
When entering arrays in Supabase UI:
- Use JSON format: `["value1", "value2"]`
- In SQL use: `ARRAY['value1', 'value2']`

### Icon Names
Icons use Lucide React icon names:
- Factory, Car, Heart, Hammer, Palette, Coffee
- Zap, Wind, Radio, CircleDot, ToggleLeft, Gauge
- Shield, Droplets, Award, etc.

See full list: https://lucide.dev/icons/

## Troubleshooting

### Data Not Loading

1. **Check Browser Console**
   - Open DevTools → Console
   - Look for API errors

2. **Verify Database**
   - Tables exist and have data
   - RLS policies allow public SELECT
   - Columns match schema

3. **Test API Directly**
   ```
   https://[project-id].supabase.co/functions/v1/make-server-a6e7a38d/health
   ```

4. **Check Edge Function**
   - Go to Functions in Supabase dashboard
   - Verify function is deployed
   - Check logs for errors

### Options Not Displaying

1. **Check category field** - Must match exactly:
   - `application`, `technology`, `action`, `environment`, `feature`
   - `console_style`, `pedal_count`, `medical_feature`, `accessory`

2. **Check icon names** - Must be valid Lucide icon names

3. **Check sort_order** - Lower numbers appear first

### Products Not Filtering

1. **Check applications array** - Must include selected application
2. **Check technology field** - Must match exactly
3. **Check actions array** - Must include selected action
4. **Check IP rating** - Must meet environment requirements

## Seed Data Reference

All initial data is in `/supabase/functions/server/seed-data.ts`
- 10 products (Hercules, Atlas, Clipper, etc.)
- 40+ wizard options across all categories

## Next Steps

Once the database is set up:

1. ✅ Products and options load from Supabase
2. ✅ Edit content through dashboard (no code changes)
3. ✅ Add new products and options as needed
4. 🎯 Consider adding admin UI in the app itself
5. 🎯 Add image upload functionality
6. 🎯 Add bulk import/export features

## Files Overview

- `/supabase/functions/server/index.tsx` - Edge Function API server
- `/supabase/functions/server/seed-data.ts` - Initial data reference
- `/src/app/lib/api.ts` - Frontend API client
- `/DATABASE_SETUP_INSTRUCTIONS.md` - Detailed SQL setup guide
- `/README_BACKEND.md` - This file

---

**Ready to go!** Follow the setup instructions in `/DATABASE_SETUP_INSTRUCTIONS.md` to initialize your database, then start managing your product finder content through Supabase.
