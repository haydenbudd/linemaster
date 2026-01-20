# Admin Panel Guide

## 🚀 Quick Start

### Accessing the Admin Panel

1. **From the Main App**: Click the "Admin" button in the header (top right)
2. **Direct URL**: Go to `#/admin` in your browser
3. **Login**: Use password: `linemaster2025`

## 📊 Features

### 1. Product Management

**View All Products**
- See complete product list with search functionality
- Filter by name, ID, or description
- View technology, duty rating, and application count

**Add New Product**
- Click "Add Product" button
- Fill in all required fields:
  - Product ID (unique identifier)
  - Series name
  - Technology (Electrical/Pneumatic/Wireless)
  - Duty rating (Light/Medium/Heavy)
  - IP rating (IP20/IP56/IP68)
  - Material
  - Description
  - Actions (momentary, maintained, variable)
  - Applications (industrial, automotive, medical, etc.)
  - Image URL (optional)
  - Product page link (optional)
  - Flagship status

**Edit Products**
- Click the pencil icon next to any product
- Modify any field except Product ID
- Save changes

**Delete Products**
- Click the trash icon next to any product
- Confirm deletion

### 2. CSV Bulk Import

**Download Template**
- Click "Download Template" to get a sample CSV file
- Use this as a guide for formatting your product data

**CSV Format Requirements**
```csv
id,series,technology,duty,ip,actions,material,description,applications,flagship,image,link
hercules,Hercules,electrical,heavy,IP56,"momentary,maintained",Cast Iron,Heavy-duty switch,"industrial,automotive",true,https://...,https://...
```

**Important Notes:**
- First row must contain column headers
- Use comma-separated values for arrays (actions, applications)
- Use "true" or "false" for flagship field
- Enclose values with commas in quotes

**Import Process**
1. Prepare your CSV file
2. Go to "Bulk Import" tab
3. Click "Upload CSV"
4. Review import results
5. Products are automatically saved to database

### 3. Statistics Dashboard

View real-time stats:
- Total product count
- Electrical products count
- Wireless products count

## 🔐 Security

**Default Password**: `linemaster2025`

**To Change Password:**
1. Edit `/src/app/components/admin/AdminLogin.tsx`
2. Change line: `if (password === 'linemaster2025')`
3. Update to your new password

**Note**: This is a simple client-side authentication. For production use, implement proper server-side authentication.

## 💾 Data Storage

All data is stored in Supabase's KV store:
- **Table**: `kv_store_a6e7a38d`
- **Key**: `products`
- **Format**: JSON array

**View Data in Supabase:**
1. Go to your Supabase dashboard
2. Navigate to Table Editor
3. Open `kv_store_a6e7a38d` table
4. Find row with key = 'products'
5. View/edit the JSON value directly

## 📝 Product Schema

```typescript
{
  id: string;              // Unique identifier (e.g., 'hercules')
  series: string;          // Product name (e.g., 'Hercules')
  technology: string;      // 'electrical' | 'pneumatic' | 'wireless'
  duty: string;            // 'light' | 'medium' | 'heavy'
  ip: string;              // 'IP20' | 'IP56' | 'IP68'
  actions: string[];       // ['momentary', 'maintained', 'variable']
  material: string;        // e.g., 'Cast Iron'
  description: string;     // Brief product description
  applications: string[];  // ['industrial', 'automotive', 'medical', etc.]
  flagship: boolean;       // Featured product flag
  image: string;           // Product image URL
  link: string;            // Product page URL
}
```

## 🎯 Best Practices

### Product IDs
- Use lowercase, hyphenated format
- Make them descriptive but concise
- Examples: `hercules`, `wireless-hercules`, `air-seal`

### Images
- Use absolute URLs (https://...)
- Linemaster CDN: `https://linemaster.com/wp-content/uploads/...`
- Keep images optimized (< 500KB recommended)

### Applications
Available options:
- `industrial` - Industrial & Manufacturing
- `automotive` - Automotive & Repair
- `medical` - Medical & Healthcare
- `woodworking` - Woodworking
- `tattoo` - Tattoo & Body Art
- `general` - General / Other

### Actions
- `momentary` - Active while pressed
- `maintained` - Press ON, press OFF
- `variable` - Speed varies with pressure

## 🔄 Workflow

### Adding 300+ Products

**Option A: CSV Import (Recommended)**
1. Export your product database to CSV
2. Format according to template
3. Use bulk import feature
4. Review and fix any errors

**Option B: Manual Entry**
1. Add products one by one
2. Use product form
3. Good for initial setup or small additions

**Option C: Direct Database Edit**
1. Go to Supabase dashboard
2. Edit `products` key in KV store
3. Paste JSON array
4. Useful for large data migrations

## 🐛 Troubleshooting

**Import Errors**
- Check CSV formatting
- Ensure all required fields are present
- Verify comma-separated values are quoted
- Check for special characters

**Save Failures**
- Check browser console for errors
- Verify Supabase connection
- Ensure valid JSON structure

**Products Not Showing**
- Refresh the product list
- Check if products were saved
- View data in Supabase dashboard

## 📞 Support

For issues with:
- **Admin panel**: Check browser console for errors
- **Database**: View Supabase logs
- **API**: Check network tab in dev tools

## 🚀 Next Steps

1. Set up your Supabase database (see `/SETUP_DATABASE.md`)
2. Access admin panel and log in
3. Import your product catalog via CSV
4. Test the wizard with real data
5. Customize branding and styling as needed
