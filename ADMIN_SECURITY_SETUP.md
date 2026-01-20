# 🔒 Admin Security Setup Guide

## Overview

Your admin panel now uses **Supabase Auth** with enterprise-grade security features:

✅ **Encrypted password storage** (bcrypt hashing)  
✅ **Session timeout** (auto-logout after 30 min inactivity)  
✅ **Brute force protection** (5 attempts → 15 min lockout)  
✅ **Secure session tokens** (JWT with httpOnly cookies)  
✅ **Activity tracking** (mouse, keyboard, scroll, touch)

---

## 🚀 Quick Setup (3 Steps)

### Step 1: Enable Email Auth in Supabase

1. Go to: **[Auth Providers](https://supabase.com/dashboard/project/dhaqigiwkmsjrchrbllu/auth/providers)**
2. Find **Email** provider
3. Toggle **"Enable Email provider"** → ON ✅
4. **IMPORTANT**: Uncheck **"Confirm email"** (allows login without email verification)
5. Click **Save**

### Step 2: Create Admin Account

**Option A: Via Supabase Dashboard** (Recommended ⭐)

1. Go to: **[Users](https://supabase.com/dashboard/project/dhaqigiwkmsjrchrbllu/auth/users)**
2. Click **"Add user"** → **"Create new user"**
3. Enter:
   - **Email**: `marketing@linemaster.com`
   - **Password**: `SecureLinemaster2025!` (or your choice)
   - **Auto Confirm User**: ✅ **CHECK THIS BOX**
4. Click **"Create user"**

**Option B: Via SQL** (Advanced)

```sql
-- Run this in SQL Editor: https://supabase.com/dashboard/project/dhaqigiwkmsjrchrbllu/sql/new
INSERT INTO auth.users (
  instance_id, id, aud, role, email,
  encrypted_password, email_confirmed_at,
  created_at, updated_at, confirmation_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated', 'authenticated',
  'marketing@linemaster.com',
  crypt('SecureLinemaster2025!', gen_salt('bf')),
  NOW(), NOW(), NOW(), ''
);
```

### Step 3: Test Login

1. Go to: `#/admin` in your app
2. Enter credentials:
   - **Email**: `marketing@linemaster.com`
   - **Password**: The password you set
3. Click **"Sign In"**

**✅ Done!** You now have secure admin access.

---

## 🛡️ Security Features Explained

### 1. **Session Timeout** (30 minutes)
- Auto-logout after 30 min of no activity
- Warns you at 5 min remaining
- Activity = mouse move, keyboard, scroll, touch

### 2. **Brute Force Protection**
- Max 5 login attempts
- Account locks for 15 minutes after 5 failures
- Lockout resets on successful login

### 3. **Password Security**
- Passwords hashed with bcrypt (industry standard)
- Never stored in plain text
- Secure against database breaches

### 4. **Session Management**
- JWT tokens with httpOnly cookies
- Tokens expire automatically
- Protected against cookie hijacking

---

## ⚙️ Advanced Configuration

### Adjust Timeout Settings

Edit `/src/app/lib/supabase.ts`:

```typescript
// Change session timeout (default: 30 minutes)
const SESSION_TIMEOUT = 45 * 60 * 1000; // 45 minutes

// Change max login attempts (default: 5)
const MAX_LOGIN_ATTEMPTS = 3; // 3 attempts

// Change lockout duration (default: 15 minutes)
const LOCKOUT_DURATION = 30 * 60 * 1000; // 30 minutes
```

### Create Additional Admin Accounts

Repeat Step 2 with different emails:
- `john@linemaster.com`
- `sarah@linemaster.com`
- etc.

Each admin gets their own secure account!

---

## 🔐 Best Practices

### ✅ Do This:
- Use strong passwords (12+ chars, mixed case, numbers, symbols)
- Use unique passwords not used elsewhere
- Use a password manager (1Password, LastPass, etc.)
- Use work email addresses (`@linemaster.com`)
- Change passwords every 90 days

### ❌ Don't Do This:
- Simple passwords like "admin123" or "password"
- Share one account across multiple people
- Use personal email addresses
- Write passwords in plain text anywhere

---

## 🚨 Troubleshooting

### Problem: "Invalid login credentials"
**Solutions:**
- Double-check email and password
- Verify user exists in [Supabase Users](https://supabase.com/dashboard/project/dhaqigiwkmsjrchrbllu/auth/users)
- Check **"Auto Confirm User"** was enabled when creating user

### Problem: "Account locked"
**Solutions:**
- Wait 15 minutes for auto-unlock
- **OR** manually clear lockout:
  1. Open browser console (F12)
  2. Run: `localStorage.removeItem('login_attempts')`
  3. Refresh page

### Problem: Session keeps expiring too quickly
**Solutions:**
- Check if you're actively using the app (move mouse, click, scroll)
- Adjust `SESSION_TIMEOUT` in `/src/app/lib/supabase.ts`
- Clear browser cache and cookies

### Problem: Email provider not working
**Solutions:**
- Verify Email provider is enabled in Supabase
- Verify "Confirm email" is **DISABLED**
- Check browser console for detailed error messages

### Problem: Forgot admin password
**Solutions:**
- Create a new admin account (Step 2)
- **OR** reset password via Supabase Dashboard:
  1. Go to [Users](https://supabase.com/dashboard/project/dhaqigiwkmsjrchrbllu/auth/users)
  2. Find the user
  3. Click "..." → "Reset password"

---

## 📊 Security Comparison

| Feature | Old System | New System |
|---------|------------|------------|
| Password Storage | ❌ Hardcoded | ✅ Encrypted (bcrypt) |
| Brute Force Protection | ❌ None | ✅ 5 attempts + lockout |
| Session Timeout | ❌ None | ✅ 30 min auto-logout |
| Multi-User Support | ❌ One password | ✅ Individual accounts |
| Activity Tracking | ❌ None | ✅ Full tracking |
| Cookie Security | ❌ Basic | ✅ httpOnly + secure |
| Password Reset | ❌ Not possible | ✅ Via Supabase |

---

## 🎯 What Changed

### Removed:
- ❌ Hardcoded password (`linemaster2025`)
- ❌ Microsoft OAuth (Azure AD)
- ❌ Simple cookie authentication

### Added:
- ✅ Supabase email/password auth
- ✅ Brute force protection
- ✅ Session timeout
- ✅ Account lockout
- ✅ Individual admin accounts
- ✅ Password reset capability

---

## ✅ Post-Setup Checklist

- [ ] Email provider enabled in Supabase
- [ ] "Confirm email" disabled in Supabase
- [ ] Admin account created
- [ ] Successfully logged in
- [ ] Tested session timeout (wait 30 min or adjust timeout)
- [ ] Tested lockout (fail login 5 times)
- [ ] Saved credentials in password manager
- [ ] Created accounts for all admins

---

## 📞 Support

If you need help:
1. Check browser console for error messages
2. Verify [Supabase Auth settings](https://supabase.com/dashboard/project/dhaqigiwkmsjrchrbllu/auth/providers)
3. Try clearing browser cache/localStorage
4. Create a new admin user if needed

**Project ID**: `dhaqigiwkmsjrchrbllu`

---

**🎉 Your admin panel is now secure!**