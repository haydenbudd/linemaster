# WordPress Deployment Guide
## Linemaster Product Finder - Standalone Page Integration

This guide explains how to deploy the Product Finder React app to your WordPress site as a standalone page at `linemaster.com/product-finder/`.

---

## 📋 Prerequisites

- Full server/FTP access to your WordPress installation
- WordPress theme with custom page template support
- Modern hosting with .htaccess support (Apache)

---

## 🚀 Deployment Steps

### Step 1: Upload React App Files

1. **Build the app** (already done ✅):
   ```bash
   npm run build
   ```

2. **Upload the `dist/` folder contents** to your WordPress server:
   - **Destination:** `/public_html/product-finder/` (or `/var/www/html/product-finder/`)
   - **Files to upload:**
     - `index.html`
     - `assets/` folder (contains all CSS and JS files)

   **Using FTP/SFTP:**
   ```
   WordPress Root
   ├── wp-admin/
   ├── wp-content/
   ├── wp-includes/
   └── product-finder/          ← CREATE THIS FOLDER
       ├── index.html
       └── assets/
           ├── index-2ohXmRAt.js
           ├── index-B8NDz6ZX.css
           ├── purify.es-B9ZVCkUG.js
           ├── index.es-wtukTq3a.js
           └── html2canvas.esm-QH1iLAAe.js
   ```

3. **Upload `.htaccess`** (from `/wordpress/.htaccess` in this repo):
   - Place at: `/public_html/product-finder/.htaccess`
   - This enables proper routing and asset caching

---

### Step 2: Add WordPress Page Template (Optional - For Seamless Theme Integration)

If you want the Product Finder to appear WITH your WordPress theme's header/footer:

1. **Upload page template:**
   - Source: `/wordpress/page-product-finder.php` (from this repo)
   - Destination: `/wp-content/themes/YOUR-THEME/page-product-finder.php`

2. **Create WordPress Page:**
   - Go to WordPress Admin → Pages → Add New
   - Title: "Product Finder"
   - Permalink: Set to `/product-finder-page/` (different from subdirectory!)
   - Template: Select "Product Finder (Full Width)" from Page Attributes
   - Publish

3. **Update the page template** to reference correct asset files:
   - Edit `page-product-finder.php`
   - Find the `<script>` and `<link>` tags
   - **IMPORTANT:** Update the asset filenames to match your actual build output (they change with each build)

   Example:
   ```php
   <!-- Find the actual filenames in dist/assets/ after building -->
   <script type="module" crossorigin src="/product-finder/assets/index-[HASH].js"></script>
   <link rel="stylesheet" crossorigin href="/product-finder/assets/index-[HASH].css">
   ```

---

### Step 3: Choose Your Access Method

You now have TWO ways to access the Product Finder:

#### **Option A: Direct Subdirectory Access** (Recommended)
- URL: `https://linemaster.com/product-finder/`
- Standalone app, no WordPress theme wrapper
- Faster loading, complete isolation
- ✅ **This is the cleanest approach**

#### **Option B: WordPress Page Template**
- URL: `https://linemaster.com/product-finder-page/`
- Includes WordPress theme header/footer/navigation
- Better for maintaining consistent site design
- Requires updating asset paths on each rebuild

---

## 🔧 Configuration Notes

### Base Path
The app is configured with `base: '/product-finder/'` in `vite.config.ts`. This means:
- All asset URLs will be relative to `/product-finder/`
- If you change the subdirectory name, update `vite.config.ts` and rebuild

### Admin Panel
The Product Finder includes an admin panel at:
- Direct: `https://linemaster.com/product-finder/#/admin`
- Or click "Admin" in the app header
- Default password: `linemaster2025`

### Supabase Backend
The app connects to Supabase for:
- Product data storage
- Admin authentication
- Make sure Supabase is properly configured (check `/utils/supabase/info.tsx`)

---

## 📂 File Structure Summary

```
WordPress Installation
├── public_html/
│   ├── wp-content/
│   │   └── themes/
│   │       └── your-theme/
│   │           └── page-product-finder.php    ← Optional page template
│   │
│   └── product-finder/                        ← Main app location
│       ├── .htaccess                          ← Routing & caching
│       ├── index.html                         ← App entry point
│       └── assets/
│           ├── index-[hash].js                ← Main JS bundle
│           ├── index-[hash].css               ← Styles
│           └── [other assets]
```

---

## ✅ Verification Checklist

After deployment, verify:

- [ ] App loads at `https://linemaster.com/product-finder/`
- [ ] No 404 errors in browser console (check Network tab)
- [ ] CSS styles load correctly
- [ ] Images display (Linemaster logo)
- [ ] Wizard flows work (select options → see results)
- [ ] Admin panel accessible at `#/admin`
- [ ] Dark mode toggle works
- [ ] PDF download works
- [ ] Mobile responsive (test on phone)

---

## 🐛 Troubleshooting

### Issue: "404 Not Found" for assets
**Solution:** Check that asset paths in `index.html` match the actual filenames in `dist/assets/`

### Issue: Blank white page
**Solution:**
1. Check browser console for JavaScript errors
2. Verify base path in `vite.config.ts` matches subdirectory name
3. Ensure all files uploaded correctly

### Issue: CSS not loading / unstyled page
**Solution:**
1. Check Network tab for 404 on CSS file
2. Verify CSS filename in `index.html` matches `dist/assets/index-*.css`

### Issue: Admin login not working
**Solution:**
1. Verify Supabase credentials in `/utils/supabase/info.tsx`
2. Check browser console for API errors
3. Default password: `linemaster2025`

---

## 🔄 Updating the App

When you make changes:

1. **Rebuild the app:**
   ```bash
   npm run build
   ```

2. **Upload new files:**
   - Replace contents of `/product-finder/` folder
   - **Note:** Asset filenames will have new hashes

3. **If using WordPress page template:**
   - Update asset references in `page-product-finder.php` to match new filenames

---

## 🎯 Next Steps

1. **Test thoroughly** on your staging site first
2. **Backup** your WordPress site before deploying to production
3. **Set strong admin password** in the Supabase dashboard
4. **Monitor** browser console for any errors after deployment
5. **Update product data** via the admin panel

---

## 🔗 Useful Links

- Supabase Dashboard: `https://supabase.com/dashboard/project/dhaqigiwkmsjrchrbllu`
- Admin Panel: `https://linemaster.com/product-finder/#/admin`
- Documentation: See other `.md` files in this repo

---

## 💡 Pro Tips

✅ Use **Option A (Direct Subdirectory)** for best performance
✅ Enable **GZIP compression** via `.htaccess` (already included)
✅ Add link to Product Finder in your WordPress navigation menu
✅ Consider adding a redirect: `linemaster.com/finder` → `/product-finder/`
✅ Test on multiple browsers (Chrome, Safari, Firefox, Edge)
✅ Monitor Supabase usage for API rate limits

---

**Need help?** Check the browser console for errors or contact support.
