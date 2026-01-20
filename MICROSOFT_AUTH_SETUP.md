# Microsoft Authentication Setup Guide

## Overview
This guide will help you set up Microsoft Azure AD authentication for the Linemaster Product Finder admin panel.

## Prerequisites
- Access to your Microsoft 365 admin portal
- Supabase project access

---

## Part 1: Azure AD Configuration

### Step 1: Create an App Registration

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** → **App registrations**
3. Click **"New registration"**

4. Fill in the details:
   - **Name**: `Linemaster Product Finder`
   - **Supported account types**: Select one:
     - **"Accounts in this organizational directory only"** (Single tenant) - Recommended for work/school accounts
     - **"Accounts in any organizational directory"** (Multi-tenant) - If you need multiple organizations
   - **Redirect URI**: 
     - Platform: **Web**
     - URL: `https://dhaqigiwkmsjrchrbllu.supabase.co/auth/v1/callback`
   
5. Click **"Register"**

### Step 2: Get Your Application (client) ID

After registration, you'll see the **Overview** page:
- Copy the **Application (client) ID** (it's a GUID like `064295e0-1505-49c2-8ac6-d5bdd0bcbabc`)
- Copy the **Directory (tenant) ID** (it's a GUID like `d6d0340b-8d79-4cc3-8990-00c8b80f905b`)

**Save these values - you'll need them for Supabase!**

### Step 3: Create a Client Secret

1. In your app registration, go to **Certificates & secrets** (left sidebar)
2. Click **"New client secret"**
3. Add a description: `Supabase Auth`
4. Choose expiration: **24 months** (or your preference)
5. Click **"Add"**
6. **IMMEDIATELY COPY THE SECRET VALUE** - You can only see it once!
   - It will look like: `abc123~def456.ghi789`

**⚠️ CRITICAL: Copy this secret value NOW - you cannot retrieve it later!**

### Step 4: Configure API Permissions

1. Go to **API permissions** (left sidebar)
2. You should see `Microsoft Graph` → `User.Read` already added
3. If not, click **"Add a permission"**:
   - Select **Microsoft Graph**
   - Select **Delegated permissions**
   - Check **`User.Read`** and **`email`**
   - Click **"Add permissions"**
4. Click **"Grant admin consent for [Your Organization]"** (if you have admin rights)

---

## Part 2: Supabase Configuration

### Step 1: Enable Azure Provider

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/dhaqigiwkmsjrchrbllu/auth/providers)
2. Find **Azure** in the list of providers
3. Click to expand/enable it

### Step 2: Enter Your Credentials

Fill in the form with the values you copied from Azure:

**Application (client) ID:**
```
064295e0-1505-49c2-8ac6-d5bdd0bcbabc
```
*(Use YOUR actual client ID from Step 2)*

**Secret Value:**
```
abc123~def456.ghi789
```
*(Use YOUR actual secret from Step 3)*

**Azure Tenant URL (optional):**

**Option 1 - Just Tenant ID (Recommended):**
```
d6d0340b-8d79-4cc3-8990-00c8b80f905b
```

**Option 2 - Full URL:**
```
https://login.microsoftonline.com/d6d0340b-8d79-4cc3-8990-00c8b80f905b
```

**Option 3 - Leave Empty**
- If you have a single-tenant app, you can leave this empty

*(Use YOUR actual tenant ID from Step 2)*

### Step 3: Save Configuration

1. Click **"Save"** at the bottom
2. Make sure the Azure provider is **ENABLED** (toggle should be ON)

---

## Part 3: Test the Integration

### Step 1: Test Login

1. Go to your app: Navigate to `#/admin`
2. Click **"Sign in with Microsoft"**
3. You should be redirected to Microsoft login
4. Sign in with your work/school account
5. Consent to permissions (first time only)
6. You should be redirected back to the admin panel

### Step 2: Troubleshooting

**If redirect fails:**

1. **Check Console Errors**:
   - Open browser DevTools (F12)
   - Look for error messages
   - Common issues:
     - `404 Not Found` = Tenant URL is wrong
     - `invalid_client` = Client ID or Secret is wrong
     - `redirect_uri_mismatch` = Redirect URI doesn't match Azure

2. **Verify Redirect URI in Azure**:
   - Go back to Azure Portal → Your App → **Authentication**
   - Make sure it shows: `https://dhaqigiwkmsjrchrbllu.supabase.co/auth/v1/callback`
   - If not, add it under **Web** platform

3. **Check Tenant ID**:
   - In Supabase, try using JUST the tenant ID (no URL)
   - Format: `d6d0340b-8d79-4cc3-8990-00c8b80f905b`

4. **Verify Provider is Enabled**:
   - In Supabase Auth Providers page
   - Make sure Azure toggle is **ON** (green)

---

## Quick Reference

### What You Need from Azure:
1. **Application (client) ID**: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
2. **Client Secret Value**: `abc~123.xyz` ⚠️ Copy immediately after creating
3. **Directory (tenant) ID**: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`

### What to Put in Supabase:
- **Application (client) ID** → Copy your client ID
- **Secret Value** → Copy your client secret
- **Azure Tenant URL** → Just the tenant ID (or full URL, or leave empty)

### Redirect URI for Azure:
```
https://dhaqigiwkmsjrchrbllu.supabase.co/auth/v1/callback
```

---

## Current Configuration

Based on the console errors, your current setup appears to have:

**Client ID**: `064295e0-1505-49c2-8ac6-d5bdd0bcbabc` ✅
**Tenant ID**: `d6d0340b-8d79-4cc3-8990-00c8b80f905b` ✅

**Problem**: The Tenant URL in Supabase was formatted incorrectly as `linemaster.com/d6d0340b-8d79-4cc3-8990-00c8b80f905b`

**Solution**: Change it to just `d6d0340b-8d79-4cc3-8990-00c8b80f905b` (remove `linemaster.com/`)

---

## Still Not Working?

### Use Password Authentication (Temporary)

While you're setting up Azure:

1. Go to `#/admin`
2. Click **"Use temporary password instead"**  
3. Enter: `linemaster2025`
4. You'll have full admin access

### Get Help

Common error messages:

**"Provider is not enabled"**
- Enable Azure in Supabase Auth Providers
- Make sure the toggle is ON

**"404 Not Found"**
- Tenant URL format is wrong
- Try using just the tenant ID

**"invalid_client"**
- Client ID or Secret is incorrect
- Double-check values in both Azure and Supabase

**"redirect_uri_mismatch"**
- Redirect URI in Azure doesn't match Supabase
- Add `https://dhaqigiwkmsjrchrbllu.supabase.co/auth/v1/callback` to Azure

---

## Security Notes

- **Never commit secrets**: Don't put client secrets in code
- **Rotate secrets regularly**: Set a reminder to rotate every 12-24 months
- **Limit permissions**: Only request the permissions you need
- **Single tenant recommended**: For work/school accounts, use single-tenant for better security

---

## For Production Deployment

When you deploy to production, you'll need to:

1. **Update Redirect URI in Azure**:
   - Add your production domain's callback URL
   - Format: `https://yourproductiondomain.com/auth/callback`

2. **Update Supabase Configuration**:
   - Site URL in Supabase settings
   - Allowed redirect URLs

3. **Test thoroughly** before removing password fallback