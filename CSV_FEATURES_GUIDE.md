# CSV Import with Features Guide

## Overview

The CSV import system now supports the **features** column, allowing you to efficiently add physical features to each footswitch product during bulk import. This integrates seamlessly with the Supabase database and the product filtering system.

## Features Column

### Available Feature Values

| Value | Description | Example Products |
|-------|-------------|------------------|
| `shield` | Product has a safety guard/shield that prevents accidental activation | Hercules, Atlas, Wireless Hercules |
| `twin` | Product has two independent pedals (twin/duo version) | Clipper Duo, Airval Hercules Duo |
| `multi_stage` | Product has multiple actuation points (2-3 stages) | Multi-stage industrial switches |

### How to Use Features in CSV

**Single Feature:**
```csv
id,series,technology,...,features,flagship,image,link
hercules,Hercules,electrical,...,shield,true,https://...,https://...
```

**Multiple Features (comma-separated):**
```csv
id,series,technology,...,features,flagship,image,link
airval-hercules,Airval Hercules,pneumatic,...,"shield,twin",false,https://...,https://...
```

**No Features (leave empty):**
```csv
id,series,technology,...,features,flagship,image,link
dolphin,Dolphin,electrical,...,,false,https://...,https://...
```

## Complete CSV Template

Download the template from the admin panel or use this format:

```csv
id,series,technology,duty,ip,actions,material,description,applications,features,flagship,image,link
hercules-example,Hercules Heavy,electrical,heavy,IP56,"momentary,maintained",Cast Iron,Heavy-duty industrial footswitch,"industrial,automotive",shield,true,https://linemaster.com/wp-content/uploads/2025/04/hercules.png,https://linemaster.com/product/167/hercules/
clipper-example,Clipper,electrical,medium,IP20,"momentary,maintained",Cast Iron,Industry standard classic cast iron,"industrial,woodworking,general",twin,true,https://linemaster.com/wp-content/uploads/2025/04/clipper.png,https://linemaster.com/product/115/clipper/
dolphin-example,Dolphin,electrical,light,IP20,momentary,Polymeric,Omni-directional for precision control,"general,tattoo",,false,https://linemaster.com/wp-content/uploads/2025/04/dolphin.png,https://linemaster.com/product/129/dolphin/
```

## Column Reference

### Required Columns:
- `id` - Unique product identifier (lowercase, hyphenated)
- `series` - Product series name
- `technology` - electrical, pneumatic, or wireless
- `duty` - light, medium, or heavy
- `ip` - IP20, IP56, or IP68
- `material` - Material description
- `description` - Product description

### Array Columns (comma-separated):
- `actions` - momentary, maintained, variable
- `applications` - industrial, automotive, medical, woodworking, tattoo, general
- **`features`** - shield, twin, multi_stage

### Boolean Column:
- `flagship` - true or false

### Optional Columns:
- `image` - Full URL to product image
- `link` - Full URL to product page

## How It Works

### 1. CSV Template Download
When you click "Download Template" in the admin panel:
- A CSV file is generated with the **features** column included
- Example rows show proper feature usage
- Template includes products with shield, twin, and no features

### 2. CSV Import Process
When you upload a CSV file:
1. **Parser reads the features column**
2. **Splits comma-separated values** into an array
3. **Validates and imports** each product
4. **Saves to Supabase** with features field populated

### 3. Database Integration
Features are stored in Supabase as:
```json
{
  "id": "hercules",
  "series": "Hercules",
  "features": ["shield"],
  ...
}
```

### 4. Wizard Filtering
When users select features in the wizard:
- Products are filtered by the `features` array
- Only products with ALL selected features are shown
- Example: Selecting "Safety Guard/Shield" shows only products with `features: ['shield']`

## Examples

### Example 1: Hercules with Shield
```csv
hercules,Hercules,electrical,heavy,IP56,"momentary,maintained",Cast Iron,Ultimate heavy-duty industrial footswitch,"industrial,automotive,woodworking,general",shield,true,https://linemaster.com/wp-content/uploads/2025/04/hercules-full-shield.png,https://linemaster.com/product/167/hercules-full-shield/
```

**Result:**
- Product has `features: ['shield']`
- Shows up when users filter by "Safety Guard/Shield"
- Displayed with 🛡️ Guard badge in admin panel

### Example 2: Airval Hercules with Multiple Features
```csv
airval-hercules,Airval Hercules,pneumatic,heavy,IP20,"momentary,maintained,variable",Cast Iron,Heavy-duty cast iron pneumatic control,"industrial,automotive","shield,twin",false,https://linemaster.com/wp-content/uploads/2025/03/airval-hercules-duo_optimized.png,https://linemaster.com/product/17/airval-hercules-full-shield/
```

**Result:**
- Product has `features: ['shield', 'twin']`
- Shows up when users filter by "Safety Guard/Shield" OR "Twin Pedal"
- Displayed with both 🛡️ Guard and 👯 Twin badges in admin panel

### Example 3: Dolphin with No Features
```csv
dolphin,Dolphin,electrical,light,IP20,momentary,Polymeric,Omni-directional. Popular for tattoo artists.,"general,tattoo,medical",,false,https://linemaster.com/wp-content/uploads/2025/04/dolphin-2.png,https://linemaster.com/product/129/dolphin/
```

**Result:**
- Product has `features: []` (empty array)
- Won't show up in feature-filtered results
- Displayed with "None" in features column of admin panel

## Bulk Import Workflow

### Step 1: Prepare Your Data
1. Create a spreadsheet with all your products
2. Add the features column
3. Use valid feature values: `shield`, `twin`, `multi_stage`
4. For multiple features, use comma-separated values: `shield,twin`

### Step 2: Export to CSV
1. Save your spreadsheet as CSV format
2. Ensure UTF-8 encoding
3. Check that commas in quoted fields are properly escaped

### Step 3: Import via Admin Panel
1. Go to Admin Panel → Products
2. Scroll to "Bulk Import from CSV" section
3. Click "Upload CSV"
4. Review import results
5. Check for any errors

### Step 4: Verify in Database
1. Check the product list table
2. Verify features appear in the Features column
3. Test filtering in the wizard

## Common Issues & Solutions

### Issue: Features not showing up after import

**Solution:**
- Check that you're using valid feature values: `shield`, `twin`, `multi_stage`
- Ensure no extra spaces around feature names
- Verify the features column is not missing in your CSV

### Issue: Multiple features not working

**Solution:**
- Use comma-separated values WITHOUT spaces: `shield,twin`
- If using quotes for the entire cell, make sure commas are inside quotes: `"shield,twin"`
- Don't use semicolons or other separators

### Issue: Product imported but features are empty

**Solution:**
- Check if the features column is in the correct position (after applications, before flagship)
- Ensure the column header is exactly `features` (lowercase, no spaces)
- Verify you didn't accidentally skip the column

## Integration with Supabase

### Database Schema
The features are stored in the `products` table with this structure:

```sql
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  series TEXT NOT NULL,
  technology TEXT NOT NULL,
  ...
  features TEXT[], -- Array of feature strings
  flagship BOOLEAN,
  ...
);
```

### API Endpoint
When products are imported:
```javascript
POST /products
{
  "id": "hercules",
  "series": "Hercules",
  "features": ["shield"],
  ...
}
```

The API automatically handles:
- Array parsing from CSV
- Validation of feature values
- Storage in Supabase KV store
- Retrieval for wizard filtering

## Best Practices

✅ **DO:**
- Use the downloadable template as a starting point
- Keep feature values lowercase and consistent
- Test with a small CSV file first
- Verify imports in the admin panel after upload

❌ **DON'T:**
- Don't use custom feature names (stick to: shield, twin, multi_stage)
- Don't add spaces around commas in feature lists
- Don't skip the features column header in your CSV
- Don't use quotes around single features (only needed for multiple)

## Summary

The features column in CSV import allows you to:
1. ✅ Bulk add features to hundreds of products efficiently
2. ✅ Specify multiple features per product (shield, twin, multi_stage)
3. ✅ Integrate seamlessly with Supabase database
4. ✅ Enable wizard filtering based on product features
5. ✅ Display feature badges in the admin panel

**This makes managing 300+ Linemaster products much more efficient - just prepare your CSV with features and bulk import!**
