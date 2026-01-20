# Importing 300+ Products Guide

## 📋 Overview

This guide will help you import your complete Linemaster product catalog into the system.

## 🎯 Preparation Steps

### Step 1: Gather Your Product Data

Collect the following information for each product:
- Product ID/SKU
- Product series name
- Technology type (Electrical, Pneumatic, Wireless)
- Duty rating (Light, Medium, Heavy)
- IP rating (IP20, IP56, IP68)
- Switch actions available
- Housing material
- Product description
- Target applications/industries
- Product image URL
- Product page URL
- Flagship status

### Step 2: Create Your CSV File

#### Method A: Export from Existing System
If you have products in an existing database or CRM:
1. Export to CSV format
2. Map columns to match template
3. Clean and format data

#### Method B: Use Spreadsheet
1. Download the CSV template from admin panel
2. Open in Excel/Google Sheets
3. Fill in one row per product
4. Save as CSV

### Step 3: Format Your Data

#### Required Columns
```
id, series, technology, duty, ip, actions, material, description, applications, flagship, image, link
```

#### Data Formatting Rules

**ID Column:**
- Lowercase, no spaces
- Use hyphens for separation
- Must be unique
- Examples: `hercules`, `clipper-duo`, `wireless-atlas`

**Technology Column:**
- Must be: `electrical`, `pneumatic`, or `wireless`
- All lowercase
- No variations

**Duty Column:**
- Must be: `light`, `medium`, or `heavy`
- All lowercase

**IP Column:**
- Must be: `IP20`, `IP56`, or `IP68`
- Uppercase IP, number

**Actions Column:**
- Comma-separated, in quotes
- Options: `momentary`, `maintained`, `variable`
- Example: `"momentary,maintained"`

**Applications Column:**
- Comma-separated, in quotes
- Options: `industrial`, `automotive`, `medical`, `woodworking`, `tattoo`, `general`
- Example: `"industrial,automotive,woodworking"`

**Flagship Column:**
- Use: `true` or `false` (lowercase)
- No quotes

#### Example Rows

```csv
id,series,technology,duty,ip,actions,material,description,applications,flagship,image,link
hercules,Hercules,electrical,heavy,IP56,"momentary,maintained",Cast Iron,Ultimate heavy-duty industrial footswitch,"industrial,automotive,woodworking",true,https://linemaster.com/wp-content/uploads/2025/04/hercules.png,https://linemaster.com/product/167/hercules/
clipper,Clipper,electrical,medium,IP20,"momentary,maintained",Cast Iron,Industry standard classic cast iron,"industrial,woodworking,automotive,general",true,https://linemaster.com/wp-content/uploads/2025/04/clipper.png,https://linemaster.com/product/115/clipper/
wireless-hercules,RF Wireless Hercules,wireless,heavy,IP68,momentary,Cast Iron,RF Wireless eliminates trip hazards,"industrial,automotive,medical",true,https://linemaster.com/wp-content/uploads/2025/04/rf-hercules.png,https://linemaster.com/product/475/wireless-hercules/
```

## 🔍 Data Validation Checklist

Before importing, verify:

- [ ] All required columns are present
- [ ] Every product has a unique ID
- [ ] Technology values are: electrical, pneumatic, or wireless
- [ ] Duty values are: light, medium, or heavy
- [ ] IP ratings are: IP20, IP56, or IP68
- [ ] Actions use correct terms: momentary, maintained, variable
- [ ] Applications use correct terms
- [ ] Flagship column uses true/false
- [ ] Multi-value fields (actions, applications) are in quotes
- [ ] No special characters that could break CSV parsing
- [ ] Image URLs are valid and accessible
- [ ] Product page URLs are valid

## 📤 Import Process

### Option 1: CSV Import (Recommended for 300+ products)

1. **Prepare CSV file** following format above
2. **Access Admin Panel**: Click "Admin" in header, login with `linemaster2025`
3. **Go to Bulk Import tab**
4. **Download template** (optional - for reference)
5. **Click "Upload CSV"**
6. **Select your file**
7. **Review results**:
   - Green = Success
   - Yellow = Warnings (some products imported, some errors)
   - Shows count of successful imports
   - Lists any errors with row numbers
8. **Fix errors** if any:
   - Note the row numbers with errors
   - Fix those rows in your CSV
   - Re-upload the corrected file

### Option 2: Direct Database Insert (Advanced)

If you're comfortable with JSON:

1. Format your products as JSON array:
```json
[
  {
    "id": "hercules",
    "series": "Hercules",
    "technology": "electrical",
    "duty": "heavy",
    "ip": "IP56",
    "actions": ["momentary", "maintained"],
    "material": "Cast Iron",
    "description": "Ultimate heavy-duty industrial footswitch",
    "applications": ["industrial", "automotive", "woodworking"],
    "flagship": true,
    "image": "https://linemaster.com/...",
    "link": "https://linemaster.com/..."
  },
  // ... more products
]
```

2. Go to Supabase Dashboard
3. Open Table Editor → `kv_store_a6e7a38d`
4. Find row with key = `products`
5. Replace value field with your JSON array
6. Save

### Option 3: API Import (For Developers)

Use the REST API to programmatically import:

```javascript
const products = [/* your product array */];

for (const product of products) {
  await fetch('https://YOUR_PROJECT.supabase.co/functions/v1/make-server-a6e7a38d/products', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_ANON_KEY',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
  });
}
```

## 🎨 Product Images

### Image Requirements
- Format: PNG, JPG, or WebP
- Size: Recommended < 500KB
- Dimensions: 800x800px minimum
- Background: Transparent or white preferred

### Hosting Options
1. **Linemaster CDN** (recommended if available)
   - Pattern: `https://linemaster.com/wp-content/uploads/YYYY/MM/filename.png`

2. **Supabase Storage** (if needed)
   - Upload to Supabase Storage bucket
   - Get public URL
   - Use in product image field

3. **External CDN**
   - Use any publicly accessible URL
   - Ensure high availability

## 🧪 Testing

After import:

1. **Verify Count**: Check admin dashboard shows correct number
2. **Test Search**: Search for random products
3. **Test Wizard**: Go through wizard and verify:
   - Products appear in results
   - Filtering works correctly
   - All product data displays properly
4. **Check Edge Cases**:
   - Products with all applications
   - Products with single application
   - Products with multiple actions
   - Flagship vs non-flagship
5. **Validate Images**: Spot-check that images load

## 🐛 Common Import Errors

### "Column count mismatch"
**Cause**: Row has different number of commas than header
**Fix**: Check for unquoted commas in descriptions

### "Missing required fields"
**Cause**: Empty id, series, or technology field
**Fix**: Fill in all required fields

### "Parse error"
**Cause**: Invalid CSV formatting
**Fix**: Ensure proper quoting, no line breaks within cells

### "Duplicate ID"
**Cause**: Two products with same ID
**Fix**: Make each ID unique

## 💡 Pro Tips

### Batch Processing
- Import in batches of 50-100 products
- Easier to identify and fix errors
- Less likely to timeout

### Product Grouping
- Group similar products together in CSV
- Makes reviewing easier
- Helps identify patterns in errors

### Version Control
- Keep a master CSV file
- Save versions as you make changes
- Document any bulk updates

### Data Cleanup
Common data cleanup tasks:
- Standardize capitalization
- Remove extra spaces
- Validate URLs
- Ensure consistent terminology
- Remove special characters

## 📊 Sample Data Structure

Here's a complete example for reference:

```csv
id,series,technology,duty,ip,actions,material,description,applications,flagship,image,link
hercules,Hercules,electrical,heavy,IP56,"momentary,maintained",Cast Iron,Ultimate heavy-duty industrial footswitch,"industrial,automotive,woodworking,general",true,https://linemaster.com/wp-content/uploads/2025/04/hercules.png,https://linemaster.com/product/167/hercules/
atlas,Atlas,electrical,heavy,IP68,momentary,Cast Aluminum,Fully sealed IP68 heavy-duty switch,"industrial,automotive",false,https://linemaster.com/wp-content/uploads/2025/04/atlas.png,https://linemaster.com/product/77/atlas/
clipper,Clipper,electrical,medium,IP20,"momentary,maintained",Cast Iron,Industry standard classic cast iron,"industrial,woodworking,automotive,general",true,https://linemaster.com/wp-content/uploads/2025/04/clipper.png,https://linemaster.com/product/115/clipper/
dolphin,Dolphin,electrical,light,IP20,momentary,Polymeric,Omni-directional popular for tattoo artists,"general,tattoo,medical",false,https://linemaster.com/wp-content/uploads/2025/04/dolphin.png,https://linemaster.com/product/129/dolphin/
```

## ✅ Post-Import Checklist

- [ ] All 300+ products imported successfully
- [ ] Product count matches in admin dashboard
- [ ] Random sample products display correctly
- [ ] Wizard filtering works properly
- [ ] Images load correctly
- [ ] Product links work
- [ ] Search functionality works
- [ ] No duplicate products
- [ ] Flagship products marked correctly
- [ ] All applications/categories covered

## 🚀 Next Steps

After successful import:
1. Test the wizard thoroughly
2. Get feedback from users
3. Refine product descriptions
4. Add missing product images
5. Update products as catalog changes
6. Document any custom modifications

## 📞 Need Help?

If you encounter issues:
1. Check browser console for errors
2. Review CSV format against template
3. Test with small batch first (10 products)
4. Check Supabase logs for API errors
5. Verify database connection is working
