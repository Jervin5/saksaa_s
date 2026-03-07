# SAKSAAS Setup & Debugging Guide

## Issue: JSON Parsing Error During Login
**Error Message:** `Unexpected token '<', "<br /> <b>"... is not valid JSON`

This error means the PHP backend is returning HTML (error page) instead of JSON.

## ✅ Fixes Applied

### 1. **Password Verification (CRITICAL)**
   - **File:** `php/auth.php`
   - **Issue:** Login was NOT verifying passwords against PasswordHash
   - **Fix:** Added proper `password_verify()` check in `handleLogin()`
   - **Status:** ✅ Fixed

### 2. **Better Error Handling**
   - **File:** `php/auth.php`
   - **Changes:** 
     - Set `Content-Type: application/json` header FIRST (before any output)
     - Added try-catch blocks to handlers
     - Added debug error messages
     - Improved database error reporting
   - **Status:** ✅ Updated

### 3. **Database Schema**
   - **File:** `database_schema.sql`
   - **Required Columns in Users table:**
     - `UserID` (INT PRIMARY KEY)
     - `FullName` (NVARCHAR(100))
     - `Email` (NVARCHAR(100) UNIQUE)
     - `PasswordHash` (NVARCHAR(255)) - CRITICAL
     - `Role` (NVARCHAR(20))
     - `Phone` (NVARCHAR(20))
     - `AddressLine1` (NVARCHAR(255))
     - `City` (NVARCHAR(100))
     - `Pincode` (NVARCHAR(10))
     - `ProfileImage` (NVARCHAR(MAX)) - May need to be added with migration

### 4. **Sign-Out Confirmation**
   - **File:** `src/pages/AccountDetails.tsx`
   - **Status:** ✅ Already implemented with `window.confirm()`

---

## 🔧 Troubleshooting Steps

### Step 1: Test Database Connection
Run this test in your browser: `http://localhost/saksaas/test-db.php`

Expected output: Table structure and user count

### Step 2: Run Database Migration
Run in your browser: `http://localhost/saksaas/migrate.php`

This will:
- Add `ProfileImage` column if missing
- Add `PasswordHash` column if missing

### Step 3: Check Browser Console
1. Open DevTools (F12)
2. Go to Network tab
3. Try to login
4. Click on the failed request
5. Check Response tab to see actual PHP error

### Step 4: Verify API Endpoint
POST request should be sent to: `http://localhost/saksaas/auth.php?action=login`

Body should be:
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

---

## 📋 Verification Checklist

- [ ] Database table exists and has all columns
- [ ] Users table has at least one test user with hashed password
- [ ] `php/auth.php` exists with switch-case handlers
- [ ] `Content-Type: application/json` header is set first
- [ ] Frontend is calling correct API endpoint
- [ ] CORS headers are configured for `http://localhost:3001`
- [ ] Test user password is hashed with `password_hash(..., PASSWORD_BCRYPT)`

---

## 🧪 Test User Creation

Run this SQL to create a test user:
```sql
INSERT INTO Users (FullName, Email, PasswordHash, Role) 
VALUES (
  'Test User',
  'test@saksaas.com',
  '$2y$10$...hashed_password_here...',
  'Customer'
);
```

To generate hash in PHP:
```php
echo password_hash('testpass123', PASSWORD_BCRYPT);
```

---

## 📝 File Changes Summary

| File | Change | Status |
|------|--------|--------|
| `php/auth.php` | Fixed password verification, added error handling | ✅ |
| `src/pages/AccountDetails.tsx` | Sign-out confirmation | ✅ |
| `php/test-db.php` | New testing script | ✅ |
| `php/migrate.php` | New migration script | ✅ |

---

## 🚀 Next Steps

1. **Verify Database:** Run `http://localhost/saksaas/test-db.php`
2. **Run Migration:** Run `http://localhost/saksaas/migrate.php`
3. **Test User:** Create test user with hashed password
4. **Test Login:** Try logging in from frontend
5. **Check Console:** If error, check Network tab for actual error message

---

## Common Issues & Solutions

### ❌ "Database connection failed"
- Check MySQL is running
- Verify credentials: `localhost`, `root`, `` (no password), `saksaas`
- Ensure saksaas database exists

### ❌ "Email not found"
- Test user doesn't exist in database
- Check email spelling
- Run test SQL provided above

### ❌ "<br /> <b>" HTML error
- Headers being sent after output
- Check for `echo` statements before headers
- Look at Network Response tab for full error

### ❌ "Invalid password"
- Password hash in database is invalid
- Recreate user with `password_hash()` generated hash
- Don't store plain text passwords!

