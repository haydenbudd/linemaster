# Database Setup Instructions

Your Figma Make app is now connected to your Supabase project: **dhaqigiwkmsjrchrbllu**

## Step 1: Create the KV Store Table

Go to your Supabase SQL Editor and run this command:

**Dashboard URL:** https://supabase.com/dashboard/project/dhaqigiwkmsjrchrbllu/sql

**SQL Command:**
```sql
CREATE TABLE IF NOT EXISTS kv_store_a6e7a38d (
  key TEXT NOT NULL PRIMARY KEY,
  value JSONB NOT NULL
);
```

## Step 2: Run Your App

After creating the table:

1. **Preview/Run your app** in Figma Make
2. The app will automatically initialize with all products and wizard data
3. Check the browser console for confirmation messages

## Step 3: View Your Data

Go to the Table Editor:
https://supabase.com/dashboard/project/dhaqigiwkmsjrchrbllu/editor/kv_store_a6e7a38d

You should see these keys:
- `products` - All 10 Linemaster products
- `standard-flow-options` - Standard wizard configuration
- `medical-flow-options` - Medical wizard configuration

## Connection Details

✅ **Project ID:** dhaqigiwkmsjrchrbllu
✅ **Supabase URL:** https://dhaqigiwkmsjrchrbllu.supabase.co
✅ **Frontend:** Already connected via `/utils/supabase/info.tsx`
✅ **Backend:** Uses environment variables (auto-configured)

## Troubleshooting

If you see any errors:

1. **Check the table exists:** Run the SQL command above
2. **Check console logs:** Look for initialization messages
3. **Verify connection:** Make sure the SQL command ran successfully

## Next Steps

Once the table is created and data is initialized:
- Use the app normally
- Edit data directly in Supabase Table Editor
- See `/HOW_TO_UPDATE_DATA.md` for instructions on updating products
