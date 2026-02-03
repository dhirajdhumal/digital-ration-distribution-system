# Token Authorization Fix Guide

## 🐛 Issue: "Not authorized, token failed"

This error was occurring when admin tried to create new stock items.

## 🔍 Root Causes Found:

### 1. **Missing Return Statements in Auth Middleware**
**Problem:** The `protect` middleware wasn't returning after sending error responses, causing it to continue execution.

**Fixed in:** `backend/middleware/authMiddleware.js`

**Changes:**
- Added `return` statements before all `res.status()` calls
- Added `return next()` in success case
- Added user existence check
- Improved error logging

### 2. **Token Retrieval Mismatch in API Service**
**Problem:** The API interceptor was looking for `localStorage.getItem("token")`, but the auth context stores the entire user object under `localStorage.getItem("user")`.

**Fixed in:** `frontend/src/services/api.js`

**Changes:**
- Now retrieves user object from localStorage
- Parses JSON and extracts token
- Added error handling for JSON parsing

## ✅ Solution Applied:

### Backend Fix (authMiddleware.js):
```javascript
const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            
            if (!req.user) {
                return res.status(401).json({ message: 'User not found' });
            }
            
            return next(); // ✅ Added return
        } catch (error) {
            console.error('Token verification error:', error.message);
            return res.status(401).json({ message: 'Not authorized, token failed' }); // ✅ Added return
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' }); // ✅ Added return
    }
};
```

### Frontend Fix (api.js):
```javascript
api.interceptors.request.use((config) => {
  const userStr = localStorage.getItem("user"); // ✅ Get user object
  
  if (userStr) {
    try {
      const user = JSON.parse(userStr); // ✅ Parse JSON
      if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`; // ✅ Extract token
      }
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
    }
  }

  return config;
});
```

## 🧪 How to Test:

1. **Clear Browser Storage:**
   ```javascript
   // In browser console
   localStorage.clear()
   ```

2. **Restart Backend Server:**
   ```bash
   cd backend
   npm run dev
   ```

3. **Login Again:**
   - Go to login page
   - Login with admin credentials
   - Check browser console for any errors

4. **Test Create Stock:**
   - Navigate to Admin Dashboard
   - Click "Create Stock"
   - Fill in the form
   - Submit

5. **Verify Token in Browser:**
   ```javascript
   // In browser console
   const user = JSON.parse(localStorage.getItem('user'))
   console.log('Token:', user.token)
   console.log('Role:', user.role)
   ```

## 🔍 Debugging Tips:

### Check Token in Request:
Open browser DevTools → Network tab → Click on the failed request → Headers tab → Look for:
```
Authorization: Bearer <your_token_here>
```

### Check Token Validity:
```javascript
// In browser console
const user = JSON.parse(localStorage.getItem('user'))
console.log('User:', user)
console.log('Token exists:', !!user.token)
console.log('Role:', user.role)
```

### Check Backend Logs:
Look for error messages in the backend terminal:
```
Token verification error: <error message>
```

## 🚨 Common Issues After Fix:

### Issue 1: Still Getting Error
**Solution:** Clear localStorage and login again
```javascript
localStorage.clear()
// Then login again
```

### Issue 2: Token Expired
**Solution:** Tokens expire after 30 days. Login again to get a new token.

### Issue 3: Wrong Role
**Solution:** Verify user role in database:
```javascript
// In MongoDB shell
db.users.findOne({ email: "admin@example.com" })
// Check if role is "admin"
```

## ✅ Expected Behavior Now:

1. ✅ Admin can create stock items
2. ✅ Token is properly attached to all requests
3. ✅ Auth middleware properly validates tokens
4. ✅ Clear error messages for debugging
5. ✅ No more "token failed" errors for valid tokens

## 📝 Prevention:

To avoid similar issues in the future:

1. **Always use return statements** in middleware after sending responses
2. **Keep token storage consistent** between auth context and API service
3. **Add proper error logging** for debugging
4. **Test authentication flow** after any auth-related changes
5. **Clear localStorage** when testing auth changes

---

**Status:** ✅ FIXED  
**Last Updated:** February 3, 2026
