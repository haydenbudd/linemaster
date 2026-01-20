# Adding Images to Your Products - Quick Guide

## 📸 You Already Have the Image Links? Perfect!

If you have a CSV with image URLs from your Linemaster website, here's exactly what to do:

## Step 1: Prepare Your CSV

Your CSV should have an **image** column with the full URL:

```csv
id,series,technology,duty,ip,actions,material,description,applications,flagship,image,link
hercules,Hercules,electrical,heavy,IP56,"momentary,maintained",Cast Iron,Heavy-duty switch,"industrial,automotive",true,https://linemaster.com/wp-content/uploads/2025/04/hercules.png,https://linemaster.com/product/167/hercules/
```

### ✅ Valid Image URL Examples:
```
https://linemaster.com/wp-content/uploads/2025/04/hercules.png
https://linemaster.com/wp-content/uploads/2024/12/clipper.jpg
https://linemaster.com/wp-content/uploads/2023/08/dolphin-2.png
```

### Column Order:
```
id,series,technology,duty,ip,actions,material,description,applications,flagship,image,link
```
☝️ The **image** column comes second to last, right before the **link** column

## Step 2: Import Your CSV

1. **Go to Admin Panel**: Click "Admin" in the header
2. **Login**: Use password `linemaster2025`
3. **Click "Bulk Import" tab**
4. **Click "Upload CSV"**
5. **Select your file**
6. **Done!** Images will load automatically

## 🎯 Common Scenarios

### Scenario 1: You Have URLs in Spreadsheet
✅ **Just export to CSV and upload**
- Your image column already has URLs
- No changes needed
- Upload directly

### Scenario 2: Some Products Missing Images
✅ **That's OK!**
- Leave image column empty for those products
- They'll display without images
- Add images later through admin panel

### Scenario 3: Images Are on Different Server
✅ **Any public URL works**
- CDN URLs: `https://cdn.example.com/image.png`
- Cloud storage: `https://storage.example.com/image.jpg`
- Just needs to be publicly accessible

## 📋 Example CSV with Images

Here's a complete example with 3 products:

```csv
id,series,technology,duty,ip,actions,material,description,applications,flagship,image,link
hercules,Hercules,electrical,heavy,IP56,"momentary,maintained",Cast Iron,Ultimate heavy-duty industrial footswitch,"industrial,automotive,woodworking",true,https://linemaster.com/wp-content/uploads/2025/04/hercules.png,https://linemaster.com/product/167/hercules/
clipper,Clipper,electrical,medium,IP20,"momentary,maintained",Cast Iron,Industry standard classic cast iron,"industrial,woodworking,general",true,https://linemaster.com/wp-content/uploads/2025/04/clipper.png,https://linemaster.com/product/115/clipper/
dolphin,Dolphin,electrical,light,IP20,momentary,Polymeric,Omni-directional popular for tattoo artists,"general,tattoo",false,https://linemaster.com/wp-content/uploads/2025/04/dolphin.png,https://linemaster.com/product/129/dolphin/
```

## 🔧 If You Need to Add Images Later

### Option 1: Edit Individual Products
1. Go to Admin Panel
2. Click pencil icon next to product
3. Paste image URL in "Image URL" field
4. Save

### Option 2: Re-import CSV
1. Export current products (from admin)
2. Add image URLs in spreadsheet
3. Re-upload CSV
4. Existing products will be updated

### Option 3: Direct in Supabase
1. Go to Supabase Dashboard
2. Table Editor → `kv_store_a6e7a38d`
3. Find `products` key
4. Edit JSON directly
5. Add image URL to product objects

## 🖼️ Image Best Practices

### Recommended:
- **Format**: PNG or JPG
- **Size**: Under 500KB (optimized)
- **Dimensions**: 800x800px or similar
- **Background**: White or transparent
- **Quality**: High resolution for zoom

### URL Format:
```
✅ GOOD: https://linemaster.com/wp-content/uploads/2025/04/product.png
❌ BAD:  /wp-content/uploads/2025/04/product.png (relative path)
❌ BAD:  C:\images\product.png (local file path)
```

## 🚀 Quick Start for 300+ Products

If you're importing all products with images:

1. **Export your data** with image URLs
2. **Format as CSV**:
   - Make sure headers match template
   - Image column has full URLs
   - Save as `.csv` file
3. **Upload via admin panel**
4. **Verify** - spot check a few products in wizard

### Pro Tip:
Download the template from admin panel to see exact format, then copy your data into it!

## ❓ Troubleshooting

### Images Not Showing?
1. ✅ Check URL is publicly accessible
2. ✅ Open URL in browser to verify
3. ✅ Ensure no typos in URL
4. ✅ Check image file still exists on server

### Images Show Broken Icon?
- URL might be wrong
- Image might be deleted from server
- Check browser console for errors
- Try opening URL directly

### CSV Import Fails?
- Make sure image URLs don't have commas
- If URL has commas, wrap entire URL in quotes
- Check CSV has 12 columns total

## 💡 Example Workflow

**Your situation**: "I have a CSV with 300 products and their image links"

```
1. Open your CSV in Excel/Sheets
2. Verify columns match this order:
   id,series,technology,duty,ip,actions,material,description,applications,flagship,image,link
3. Check image column has full URLs (starts with https://)
4. Save as CSV
5. Go to #/admin
6. Login
7. Bulk Import tab
8. Upload CSV
9. Done! All 300 products with images imported
```

## 📞 Need Help?

**Common Questions:**

**Q: Can I use images from Linemaster website?**  
A: Yes! Just copy the full URL from your website's image locations.

**Q: What if I don't have an image for every product?**  
A: Leave the image field empty. You can add images later.

**Q: Do images need to be the same size?**  
A: No, but consistent sizing looks more professional (recommend 800x800px).

**Q: Can I change images after import?**  
A: Yes! Edit individual products in admin panel anytime.

**Q: Will images slow down the app?**  
A: Not if they're optimized (<500KB). The app loads images from your server/CDN.

---

## ✅ Summary

**You have CSV with image URLs → Just upload it!**

The system automatically:
- ✅ Reads the image column
- ✅ Stores URLs in database  
- ✅ Displays images in wizard
- ✅ Shows images in admin panel
- ✅ Includes images in PDF exports

**No extra steps needed!** 🎉
