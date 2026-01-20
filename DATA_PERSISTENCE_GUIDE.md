# Data Persistence Guide

## How Data Persistence Works

The Linemaster Product Finder uses Supabase KV (Key-Value) store to persist all product and configuration data. **Your changes in the admin panel are permanently saved and will NOT be lost when you update or redeploy the application.**

## Version Protection System

We've implemented a **version flag** system to prevent accidental data re-initialization:

```typescript
const DB_VERSION = 'v1.1.0'; // Version flag prevents re-seeding
```

### How It Works:

1. **First Run**: When the app starts for the very first time with no data:
   - Checks if `db_version` flag exists in KV store
   - If not, initializes with default products and options
   - Sets the `db_version` flag to `v1.1.0`

2. **Subsequent Runs/Redeployments**: 
   - Checks if `db_version` === `'v1.1.0'`
   - If yes, **skips initialization entirely**
   - Logs: "Database already initialized (version v1.1.0). Skipping initialization."
   - Your data remains untouched!

3. **When Data Exists**:
   - Even if version flag is missing, data is preserved
   - Logs: "Found X existing products. Preserving user data."
   - No overwriting occurs

## What Happens When You Update the App

When Figma Make redeploys the application (during updates or changes):

✅ **Your product data is SAFE** - stored in Supabase KV, not in code  
✅ **Your admin edits are PRESERVED** - the version flag prevents re-initialization  
✅ **Your custom images persist** - URLs are saved in the database  
✅ **Your feature selections remain** - all product fields are retained  

### Example Scenario:

**Before Update:**
- You edited the Clipper product image in the admin panel
- Changed from `clipper_duo.png` to `clipper_single.png`
- Saved the product

**During Update:**
- Figma Make redeploys the server function
- Server starts up and runs `initializeData()`
- Checks: `db_version === 'v1.1.0'` ✅ Yes!
- **Skips initialization** - your changes are preserved

**After Update:**
- Your custom Clipper image (`clipper_single.png`) is still there
- All other product changes remain intact
- No data loss!

## File Structure

### Data Storage Locations:

| Location | Purpose | Used For |
|----------|---------|----------|
| **Supabase KV Store** | Persistent runtime data | ✅ ACTIVE - All product/option data |
| `/supabase/functions/server/index.tsx` | Server initialization | Default data for first-time setup only |
| `/supabase/functions/server/seed-data.ts` | Seed data reference | Documentation/future migrations |
| `/src/app/data/products.ts` | Frontend fallback | NOT USED (legacy file) |

### How Data Flows:

```
User edits product in Admin Panel
         ↓
POST /products → Server API
         ↓
Supabase KV Store (PERMANENT)
         ↓
GET /products → Returns your data
         ↓
Displayed in Admin Panel & Wizard
```

## Troubleshooting

### Q: My changes disappeared after updating!

**A:** This should NOT happen with v1.1.0+. If it does:

1. Check the server logs for initialization messages
2. Verify that `db_version` is set to `'v1.1.0'`
3. Ensure you're using the admin panel (not editing code files)

### Q: How do I force a re-seed with fresh data?

**A:** If you want to reset to defaults (⚠️ THIS DELETES YOUR DATA):

1. Open `/supabase/functions/server/index.tsx`
2. Change `DB_VERSION = 'v1.1.0'` to `DB_VERSION = 'v1.2.0'`
3. Redeploy the app
4. The system will re-initialize with default data

### Q: How do I back up my product data?

**A:** Currently, data is stored in Supabase KV. To back up:

1. Export products via the admin panel (if CSV export is implemented)
2. OR manually copy product data from the KV store via Supabase dashboard

### Q: Can I edit the default seed data?

**A:** Yes! Edit the `defaultProducts` array in `/supabase/functions/server/index.tsx`. But remember:
- This only affects NEW installations
- Existing data won't be overwritten
- To apply changes to existing data, you must:
  - Either increment `DB_VERSION` (⚠️ resets ALL data)
  - Or manually update via the admin panel

## Best Practices

### ✅ DO:
- Make all product changes through the Admin Panel
- Use the Admin Panel to add/edit/delete products
- Trust the version protection system - your data is safe

### ❌ DON'T:
- Don't edit `/src/app/data/products.ts` (it's not used)
- Don't manually change products in `index.tsx` expecting them to update existing data
- Don't increment `DB_VERSION` unless you want to wipe all data

## Migration Guide (For Future Use)

If you need to update the schema or add new fields while preserving data:

```typescript
// Example: Adding a new field to all products
const products = await kv.get('products') || [];
const updated = products.map(p => ({
  ...p,
  newField: p.newField || 'default value', // Add with fallback
}));
await kv.set('products', updated);
```

Then increment `DB_VERSION` to mark this as completed.

## Summary

Your product changes are **SAFE and PERSISTENT**:

1. ✅ Stored in Supabase KV (not in code)
2. ✅ Protected by version flag (no accidental resets)
3. ✅ Preserved across app updates and redeployments
4. ✅ Backed by robust initialization checks

**The image you fixed for the Clipper (or any other product) will remain exactly as you set it, even after updates.**
