# Quick Reference Card

## 🔗 Access Points

| What | How |
|------|-----|
| **Main Wizard** | Default home page or `#/` |
| **Admin Panel** | Click "Admin" in header or go to `#/admin` |
| **Login Password** | `linemaster2025` |
| **Supabase Dashboard** | `https://supabase.com/dashboard/project/dhaqigiwkmsjrchrbllu` |

## ⚡ Common Tasks

### Add a Single Product
1. Go to `#/admin` and login
2. Click "Add Product"
3. Fill in form
4. Click "Create Product"

### Import Multiple Products
1. Go to `#/admin` → Bulk Import tab
2. Download CSV template
3. Fill in your products
4. Upload CSV file
5. Review results

### Edit Existing Product
1. Go to `#/admin`
2. Click pencil icon on product
3. Make changes
4. Click "Update Product"

### Delete Product
1. Go to `#/admin`
2. Click trash icon on product
3. Confirm deletion

### View All Data
1. Go to Supabase dashboard
2. Table Editor → `kv_store_a6e7a38d`
3. Find `products` key

## 📋 Product Fields Quick Reference

```javascript
{
  id:           "hercules"                    // Required, unique
  series:       "Hercules"                    // Required
  technology:   "electrical"                  // electrical|pneumatic|wireless
  duty:         "heavy"                       // light|medium|heavy
  ip:           "IP56"                        // IP20|IP56|IP68
  actions:      ["momentary", "maintained"]   // Array of actions
  material:     "Cast Iron"                   // Required
  description:  "Heavy-duty switch"           // Required
  applications: ["industrial", "automotive"]  // Array of apps
  flagship:     true                          // true|false
  image:        "https://..."                 // Image URL
  link:         "https://..."                 // Product page URL
}
```

## 📊 CSV Template Headers

```
id,series,technology,duty,ip,actions,material,description,applications,flagship,image,link
```

**💡 Image Column:** Just paste your full image URLs from your website!
- Example: `https://linemaster.com/wp-content/uploads/2025/04/hercules.png`
- Leave empty if no image available
- Add later through admin panel if needed

## 🔑 Valid Values

**technology**: `electrical`, `pneumatic`, `wireless`  
**duty**: `light`, `medium`, `heavy`  
**ip**: `IP20`, `IP56`, `IP68`  
**actions**: `momentary`, `maintained`, `variable`  
**applications**: `industrial`, `automotive`, `medical`, `woodworking`, `tattoo`, `general`  
**flagship**: `true`, `false`

## 🛠️ API Endpoints

```
GET    /make-server-a6e7a38d/products        # Get all products
GET    /make-server-a6e7a38d/products/:id    # Get one product
POST   /make-server-a6e7a38d/products        # Create/update product
DELETE /make-server-a6e7a38d/products/:id    # Delete product
GET    /make-server-a6e7a38d/options         # Get all options
```

## 📁 Important Files

| File | Purpose |
|------|---------|
| `/src/app/App.tsx` | Main app with routing |
| `/src/app/lib/api.ts` | API client functions |
| `/supabase/functions/server/index.tsx` | Backend server |
| `/src/app/components/admin/` | Admin panel components |

## 🚨 Troubleshooting

| Issue | Solution |
|-------|----------|
| Can't login | Password is `linemaster2025` |
| Products not saving | Check browser console and Supabase logs |
| CSV import fails | Verify format matches template exactly |
| Changes not showing | Refresh page after saving |
| Database error | Run SQL from `/SETUP_DATABASE.md` |

## 📖 Documentation Files

- `README_ADMIN_SYSTEM.md` - Overview of admin system
- `ADMIN_PANEL_GUIDE.md` - How to use admin panel
- `IMPORTING_300_PRODUCTS.md` - Bulk import guide
- `SETUP_DATABASE.md` - Database setup
- `HOW_TO_UPDATE_DATA.md` - Data management

## 💡 Pro Tips

✅ Export products before major changes  
✅ Test CSV import with 5-10 products first  
✅ Keep product IDs lowercase with hyphens  
✅ Use consistent image hosting  
✅ Back up data regularly from Supabase  
✅ Document bulk updates  

## 🎯 For 300+ Products

**Fastest Method**: CSV Bulk Import
1. Export your current database
2. Format as CSV (see template)
3. Upload via admin panel
4. Done in minutes!

See `/IMPORTING_300_PRODUCTS.md` for detailed guide.

---

**Need help?** Check documentation files or browser console for errors.