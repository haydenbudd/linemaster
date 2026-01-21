# WordPress Integration Files

This folder contains files needed to integrate the Product Finder into your WordPress site.

## Files Included

### 1. `page-product-finder.php`
WordPress custom page template for seamless theme integration.

**Where to upload:** `/wp-content/themes/YOUR-THEME/page-product-finder.php`

**Usage:**
- Create a new WordPress page
- Select "Product Finder (Full Width)" template
- Publish the page

**Important:** Update the asset filenames (JS/CSS) to match your build output after running `npm run build`.

---

### 2. `.htaccess`
Apache configuration for the `/product-finder/` subdirectory.

**Where to upload:** `/public_html/product-finder/.htaccess` (same folder as index.html)

**Features:**
- SPA routing (serves index.html for all requests)
- GZIP compression for faster loading
- Browser caching for assets (images, CSS, JS)

---

## Deployment Instructions

See **`/WORDPRESS_DEPLOYMENT.md`** in the project root for complete step-by-step deployment instructions.

---

## Quick Summary

1. Build the app: `npm run build`
2. Upload `dist/` contents to `/product-finder/` on your WordPress server
3. Upload `.htaccess` to `/product-finder/`
4. (Optional) Upload `page-product-finder.php` to your theme folder
5. Access at: `https://linemaster.com/product-finder/`

---

## Notes

- The app is configured with `base: '/product-finder/'` in `vite.config.ts`
- If you rename the subdirectory, update the base path and rebuild
- Asset filenames change with each build (they include content hashes)
- The app uses hash-based routing (`#/` and `#/admin`)
