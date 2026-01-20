# How to Update Products and Options

Your Linemaster Product Finder is now powered by Supabase's KV (Key-Value) store. All products and wizard options are stored in the database and can be updated!

## Quick Overview

The application automatically initializes with all your products and options on first run. The data is stored in two keys:
- `products` - Array of all foot switch products
- `options` - Array of all wizard flow options

## How to View/Edit Data

### Option 1: Via Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **Database** → **Tables** → `kv_store_a6e7a38d`
3. Look for rows with these keys:
   - `key = 'products'` - Contains all products
   - `key = 'options'` - Contains all wizard options
4. Click on the `value` field to view/edit the JSON data

### Option 2: Via API Endpoints

You can also use the REST API to manage data programmatically:

**Products:**
- GET `/products` - List all products
- GET `/products/:id` - Get single product
- POST `/products` - Create or update product
- DELETE `/products/:id` - Delete product

**Options:**
- GET `/options` - List all options
- GET `/options/:category` - Get options by category
- POST `/options` - Create or update option
- DELETE `/options/:id` - Delete option

## Data Structure

### Products

Each product has these fields:

```json
{
  "id": "hercules",
  "series": "Hercules",
  "technology": "electrical",
  "duty": "heavy",
  "ip": "IP56",
  "actions": ["momentary", "maintained"],
  "material": "Cast Iron",
  "description": "The ultimate heavy-duty industrial footswitch.",
  "applications": ["industrial", "automotive", "woodworking", "general"],
  "flagship": true,
  "image": "https://linemaster.com/...",
  "link": "https://linemaster.com/product/..."
}
```

**Field Descriptions:**
- `id` - Unique identifier (lowercase-with-hyphens)
- `series` - Product name/series
- `technology` - "electrical", "pneumatic", or "wireless"
- `duty` - "heavy", "medium", or "light"
- `ip` - IP rating (e.g., "IP20", "IP56", "IP68")
- `actions` - Array of action types (e.g., ["momentary", "maintained", "variable"])
- `material` - Material description
- `description` - Product description
- `applications` - Array of application IDs (e.g., ["industrial", "automotive"])
- `flagship` - true/false for featured products
- `image` - Full URL to product image
- `link` - Full URL to product page

### Options

Each option has these fields:

```json
{
  "id": "industrial",
  "category": "application",
  "label": "Industrial & Manufacturing",
  "icon": "Factory",
  "description": "Heavy machinery, CNC, assembly",
  "sortOrder": 1,
  "availableFor": ["industrial", "automotive"],
  "hideFor": ["wireless"],
  "isMedical": false
}
```

**Field Descriptions:**
- `id` - Unique identifier
- `category` - Category type:
  - `application` - Application types (Step 1)
  - `technology` - Technology options (Step 2)
  - `action` - Action types (Step 3)
  - `environment` - Environment options (Step 4)
  - `feature` - Additional features (Step 5)
  - `console_style` - Medical flow console styles
  - `pedal_count` - Medical flow pedal counts
  - `medical_feature` - Medical technical features
  - `accessory` - Medical accessories
- `label` - Display text shown to users
- `icon` - Lucide icon name (e.g., "Factory", "Car", "Heart")
- `description` - Subtitle/help text
- `sortOrder` - Display order (lower numbers appear first)
- `availableFor` - Array of IDs where this option should be shown (optional)
- `hideFor` - Array of IDs where this option should be hidden (optional)
- `isMedical` - Set to true for medical application (optional)

## Common Tasks

### Add a New Product

1. Go to Supabase Dashboard → Database → kv_store_a6e7a38d
2. Find the row with `key = 'products'`
3. Click the `value` field to edit
4. Add your new product to the array:

```json
{
  "id": "new-product",
  "series": "New Product",
  "technology": "electrical",
  "duty": "medium",
  "ip": "IP20",
  "actions": ["momentary"],
  "material": "Aluminum",
  "description": "New product description",
  "applications": ["industrial", "general"],
  "flagship": false,
  "image": "https://...",
  "link": "https://..."
}
```

5. Save changes
6. Refresh your app to see the new product

### Update Product Details

1. Find the row with `key = 'products'`
2. Locate the product you want to edit in the JSON array
3. Modify the fields (description, image, link, etc.)
4. Save changes
5. Refresh your app

### Add a New Wizard Option

1. Go to Supabase Dashboard → Database → kv_store_a6e7a38d
2. Find the row with `key = 'options'`
3. Click the `value` field to edit
4. Add your new option to the array:

```json
{
  "id": "new-option",
  "category": "application",
  "label": "New Industry",
  "icon": "Building",
  "description": "Description of the industry",
  "sortOrder": 7
}
```

5. Save changes
6. Refresh your app

### Reorder Options

Simply change the `sortOrder` value. Lower numbers appear first.

### Change Option Filtering

Use `availableFor` and `hideFor` arrays:

```json
{
  "id": "electrical",
  "category": "technology",
  "label": "Electrical",
  "availableFor": ["industrial", "automotive", "general"],
  "hideFor": []
}
```

This option will only show when the user selects "industrial", "automotive", or "general" application.

## Available Icons

Icons use Lucide React. Common icon names:
- Factory, Building, Store, Warehouse
- Car, Truck, Bike
- Heart, Cross, Activity, Stethoscope
- Hammer, Wrench, Ruler, Palette
- Coffee, Home, Users
- Zap, Wind, Radio, Wifi
- CircleDot, Circle, Target
- ToggleLeft, ToggleRight
- Gauge, Speedometer
- Shield, Lock, Key
- Droplets, CloudRain, Umbrella
- Award, Star, Trophy

Full list: https://lucide.dev/icons/

## Important Notes

- Changes require a page refresh to appear
- Always maintain valid JSON format
- Product `id` must be unique
- Option `id` must be unique within the same category
- Arrays use JSON format: `["value1", "value2"]`
- The app auto-initializes data on first run if keys don't exist

## Backup Your Data

To backup your current data:

1. Go to Database → kv_store_a6e7a38d
2. Copy the `value` JSON for both `products` and `options` keys
3. Save to a text file for safekeeping

## Troubleshooting

**Changes not appearing:**
- Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)
- Check browser console for errors
- Verify JSON is valid (no syntax errors)

**Data disappeared:**
- The initialization only runs if the keys don't exist
- If you accidentally deleted data, you can manually add it back or redeploy the edge function

**Invalid JSON error:**
- Use a JSON validator to check your syntax
- Common issues: missing commas, extra commas, unquoted strings

## Need More Help?

Check the browser console for detailed error messages when the app loads. This will help identify any data format issues.
