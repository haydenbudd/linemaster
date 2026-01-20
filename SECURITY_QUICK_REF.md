# 🔒 Security Quick Reference

## 📋 TL;DR Setup (2 Minutes)

1. **Enable Email Auth**: [Supabase Auth Providers](https://supabase.com/dashboard/project/dhaqigiwkmsjrchrbllu/auth/providers)
   - Toggle "Email" → ON
   - Uncheck "Confirm email"
   - Save

2. **Create Admin**: [Supabase Users](https://supabase.com/dashboard/project/dhaqigiwkmsjrchrbllu/auth/users)
   - Click "Add user" → "Create new user"
   - Email: `marketing@linemaster.com`
   - Password: `SecureLinemaster2025!`
   - ✅ Check "Auto Confirm User"
   - Create

3. **Test**: Go to `#/admin` and login

---

## 🛡️ Security Features At-a-Glance

| Feature | Details | Config Location |
|---------|---------|----------------|
| **Session Timeout** | 30 min auto-logout | `/src/app/lib/supabase.ts` line 10 |
| **Max Login Attempts** | 5 failures | `/src/app/lib/supabase.ts` line 11 |
| **Lockout Duration** | 15 minutes | `/src/app/lib/supabase.ts` line 12 |
| **Password Hashing** | bcrypt (Supabase) | Automatic |
| **Session Warning** | 5 min before expiry | `/src/app/components/admin/AdminContainer.tsx` line 53 |

---

## ⚙️ Quick Config Changes

### Change Session Timeout
```typescript
// /src/app/lib/supabase.ts line 10
const SESSION_TIMEOUT = 45 * 60 * 1000; // 45 minutes
```

### Change Max Attempts
```typescript
// /src/app/lib/supabase.ts line 11
const MAX_LOGIN_ATTEMPTS = 3; // 3 attempts
```

### Change Lockout Time
```typescript
// /src/app/lib/supabase.ts line 12
const LOCKOUT_DURATION = 30 * 60 * 1000; // 30 minutes
```

### Change Warning Time
```typescript
// /src/app/components/admin/AdminContainer.tsx line 53
if (minutesRemaining < 10 && minutesRemaining > 0) {
  // Warn at 10 min instead of 5
}
```

---

## 🚨 Common Issues & Fixes

### Can't Login - "Invalid credentials"
```bash
# Check user exists:
https://supabase.com/dashboard/project/dhaqigiwkmsjrchrbllu/auth/users

# Check email provider enabled:
https://supabase.com/dashboard/project/dhaqigiwkmsjrchrbllu/auth/providers
```

### Account Locked
```javascript
// Browser console (F12):
localStorage.removeItem('login_attempts')
// Then refresh page
```

### Session Expires Too Fast
```typescript
// Increase timeout in /src/app/lib/supabase.ts:
const SESSION_TIMEOUT = 60 * 60 * 1000; // 60 minutes
```

### Forgot Password
```bash
# Option 1: Create new admin account
# Option 2: Reset in Supabase Dashboard:
https://supabase.com/dashboard/project/dhaqigiwkmsjrchrbllu/auth/users
# → Find user → "..." → "Reset password"
```

---

## 🔐 Password Best Practices

### ✅ Good Passwords:
- `LineM@ster2025!Secure`
- `ProductFinder#2025$`
- `FootSwitch!Admin99`

### ❌ Bad Passwords:
- `password123`
- `admin`
- `linemaster`

### 💡 Tip:
Use a password manager like 1Password or LastPass!

---

## 📞 Quick Links

| Resource | URL |
|----------|-----|
| **Auth Providers** | https://supabase.com/dashboard/project/dhaqigiwkmsjrchrbllu/auth/providers |
| **Users** | https://supabase.com/dashboard/project/dhaqigiwkmsjrchrbllu/auth/users |
| **Database Editor** | https://supabase.com/dashboard/project/dhaqigiwkmsjrchrbllu/editor |
| **SQL Editor** | https://supabase.com/dashboard/project/dhaqigiwkmsjrchrbllu/sql/new |
| **Admin Panel** | `#/admin` in your app |

---

## 🎯 What's Protected

✅ **Password hashing** - bcrypt encryption  
✅ **Session timeout** - 30 min inactivity  
✅ **Brute force** - 5 attempts max  
✅ **Cookie security** - httpOnly + JWT  
✅ **Activity tracking** - Mouse, keyboard, scroll  
✅ **Multi-user** - Individual accounts  

---

## 📊 Default Settings

```typescript
SESSION_TIMEOUT = 30 minutes
MAX_LOGIN_ATTEMPTS = 5
LOCKOUT_DURATION = 15 minutes
WARNING_TIME = 5 minutes before expiry
SESSION_CHECK_INTERVAL = 60 seconds
```

---

## 🔮 Optional Additions

Want even more security?

- **2FA via Email** - Send verification codes
- **Audit Log** - Track all admin actions
- **IP Whitelist** - Restrict by IP address
- **Password Policy** - Enforce complexity
- **Magic Links** - Passwordless login

Just ask!

---

**📚 Full Docs**: See `ADMIN_SECURITY_SETUP.md` and `SECURITY_FEATURES.md`

**Project ID**: `dhaqigiwkmsjrchrbllu`

**Ready to go!** 🚀