# Product Filtering Fix

## Problem
The product filtering wasn't working correctly. When users selected features like "Safety Guard/Shield", the system would still show products without those features.

## Root Cause
The `Product` data model did not include a `features` field, so there was no way to match user-selected features against product capabilities. The `filterProducts()` function only checked:
- Application
- Technology  
- Action type
- Environment/IP rating

But it **never checked features**, even though users could select them.

## Solution Implemented

### 1. Updated Product Interface
Added optional `features` array to the `Product` interface in:
- `/src/app/lib/api.ts`
- `/src/app/data/products.ts`

```typescript
export interface Product {
  // ... existing fields
  features?: string[]; // Available features like 'shield', 'multi_stage', 'twin'
  // ... rest of fields
}
```

### 2. Updated Product Data
Added `features` arrays to all products based on their characteristics:

**Products with Shield/Guard:**
- Hercules: `features: ['shield']`
- Atlas: `features: ['shield']`
- Wireless Hercules: `features: ['shield']`
- Airval Hercules: `features: ['shield', 'twin']`

**Products with Twin Pedal:**
- Clipper: `features: ['twin']`
- Airval Hercules: `features: ['shield', 'twin']`

**Products with No Special Features:**
- Classic IV: `features: []`
- Dolphin: `features: []`
- Gem-V: `features: []`
- Varior: `features: []`
- Air Seal: `features: []`

### 3. Enhanced Filtering Logic
Updated `filterProducts()` function in `/src/app/App.tsx`:

```typescript
// Filter by selected features (if any features are selected)
if (selectedFeatures.length > 0) {
  // Exclude custom cable/connector from this check (those trigger custom solution)
  const hardwareFeatures = selectedFeatures.filter(
    f => f !== 'custom_cable' && f !== 'custom_connector'
  );
  
  if (hardwareFeatures.length > 0) {
    // Product must have all selected hardware features
    const productFeatures = product.features || [];
    const hasAllFeatures = hardwareFeatures.every(feature => 
      productFeatures.includes(feature)
    );
    if (!hasAllFeatures) return false;
  }
}
```

**Key Logic:**
- Only filters by hardware features (shield, multi_stage, twin)
- Excludes custom_cable and custom_connector (these trigger custom solution flow instead)
- Product must have **ALL** selected hardware features
- If product has no features array, it's treated as having no features

## Result
✅ When user selects "Safety Guard/Shield", only products with `shield` in their features array will be shown (Hercules, Atlas, Wireless Hercules, Airval Hercules)

✅ When user selects "Twin Pedal", only products with `twin` in their features array will be shown (Clipper, Airval Hercules)

✅ Multiple features can be combined (e.g., selecting both "shield" and "twin" will only show Airval Hercules)

✅ Products without the selected features will be filtered out

## Files Modified
1. `/src/app/lib/api.ts` - Added `features` field to Product interface
2. `/src/app/data/products.ts` - Added `features` field and populated all products
3. `/src/app/App.tsx` - Enhanced `filterProducts()` to check selected features
4. `/supabase/functions/server/seed-data.ts` - Added features to seed data

## Testing
To test the fix:
1. Start wizard and select any application → technology → action → environment
2. At the "Additional features" step, select "Safety Guard/Shield"
3. Click "See Results"
4. **Expected:** Only Hercules, Atlas, Wireless Hercules, and Airval Hercules should appear (all have shields)
5. **Not shown:** Clipper, Classic IV, Dolphin, Gem-V, Varior, Air Seal (no shields)

## Database Migration Needed
⚠️ **Important:** The Supabase database needs to be updated with the new `features` column.

Run this SQL in Supabase SQL Editor:
```sql
-- Add features column to products table
ALTER TABLE products 
ADD COLUMN features TEXT[] DEFAULT '{}';

-- Update existing products with their features
UPDATE products SET features = ARRAY['shield'] WHERE id IN ('hercules', 'atlas', 'wireless-hercules');
UPDATE products SET features = ARRAY['twin'] WHERE id = 'clipper';
UPDATE products SET features = ARRAY['shield', 'twin'] WHERE id = 'airval-hercules';
```
