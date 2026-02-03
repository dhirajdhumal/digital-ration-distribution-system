# Troubleshooting Guide

## 🔧 Common Issues and Solutions

### 1. MongoDB Connection Issues

#### Problem: "MongooseServerSelectionError: connect ECONNREFUSED"
**Cause:** MongoDB is not running or connection string is incorrect

**Solutions:**
```bash
# Check if MongoDB is running (local)
mongosh

# If using MongoDB Atlas:
# 1. Check your IP is whitelisted
# 2. Verify connection string in .env
# 3. Ensure password doesn't contain special characters

# Test connection string
node -e "const mongoose = require('mongoose'); mongoose.connect('YOUR_MONGO_URI').then(() => console.log('Connected!')).catch(err => console.log(err))"
```

#### Problem: "Authentication failed"
**Solution:**
- Verify username and password in MONGO_URI
- Check database user permissions in MongoDB Atlas
- Ensure password is URL-encoded if it contains special characters

---

### 2. Port Already in Use

#### Problem: "Error: listen EADDRINUSE: address already in use :::5001"
**Solution:**
```bash
# Windows
npx kill-port 5001
npx kill-port 5173

# Or find and kill process manually
netstat -ano | findstr :5001
taskkill /PID <PID> /F

# Change port in .env (backend)
PORT=5002
```

---

### 3. JWT Token Issues

#### Problem: "Not authorized, token failed"
**Causes:**
- Token expired
- Invalid token
- JWT_SECRET mismatch

**Solutions:**
```javascript
// Clear localStorage in browser console
localStorage.clear()

// Then login again

// Check JWT_SECRET in backend .env
// Ensure it's the same secret used to generate tokens
```

#### Problem: "Not authorized, no token"
**Solution:**
```javascript
// Check if token is being sent
// In browser console:
console.log(localStorage.getItem('user'))

// Should show user object with token
// If null, login again
```

---

### 4. CORS Errors

#### Problem: "Access to XMLHttpRequest blocked by CORS policy"
**Solution:**
```javascript
// Verify backend server.js has CORS enabled
const cors = require('cors');
app.use(cors());

// Check frontend API baseURL
// Should be: http://localhost:5001/api

// Ensure backend is running on port 5001
```

---

### 5. Module Not Found Errors

#### Problem: "Cannot find module 'express'"
**Solution:**
```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install

# If issue persists, clean install:
rmdir /s /q node_modules
del package-lock.json
npm install
```

---

### 6. React Router Issues

#### Problem: "Cannot GET /admin/dashboard" on page refresh
**Solution:**
```javascript
// This is expected in development
// Vite dev server handles this automatically

// For production, configure server to serve index.html for all routes
```

#### Problem: "Blank page after navigation"
**Solution:**
```javascript
// Check browser console for errors
// Verify route exists in App.jsx
// Check ProtectedRoute component
// Ensure user is logged in
```

---

### 7. Login/Register Issues

#### Problem: "User already exists" when registering
**Solution:**
```javascript
// User with that email already exists
// Try different email or login with existing credentials

// To reset database:
// In MongoDB shell:
db.users.deleteOne({ email: "user@example.com" })
```

#### Problem: "Invalid email or password" when logging in
**Solution:**
```javascript
// Verify credentials are correct
// Check if user exists in database
// Ensure password was hashed correctly during registration

// In MongoDB shell:
db.users.findOne({ email: "user@example.com" })
```

---

### 8. Role-Based Access Issues

#### Problem: User redirected to home when accessing admin routes
**Solution:**
```javascript
// Check user role in database
db.users.findOne({ email: "user@example.com" })

// Update role if needed
db.users.updateOne(
  { email: "user@example.com" },
  { $set: { role: "admin" } }
)

// Clear localStorage and login again
localStorage.clear()
```

#### Problem: "Admin access only" error
**Solution:**
```javascript
// Verify user role is "admin" not "Admin" (case-sensitive)
// Check authMiddleware.js for correct role check
// Ensure token contains correct user data
```

---

### 9. Stock Allocation Issues

#### Problem: "Not enough stock available"
**Solution:**
```javascript
// Check available stock quantity
// Ensure you're not allocating more than available
// Verify stock exists in database

// In MongoDB shell:
db.stocks.find()
```

#### Problem: "Stock not found in your allocation"
**Solution:**
```javascript
// Village admin trying to allocate stock they don't have
// Admin must first allocate stock to village admin
// Check village admin's allocatedStock array

// In MongoDB shell:
db.users.findOne({ email: "villageadmin@example.com" })
```

---

### 10. Notification Issues

#### Problem: Notifications not showing
**Solution:**
```javascript
// Check if notifications exist in database
// In MongoDB shell:
db.notifications.find()

// Verify API endpoint is correct
// Check browser console for errors
// Ensure user is logged in
```

---

### 11. Complaint Issues

#### Problem: Complaints not showing status
**Solution:**
```javascript
// Check Complaint model has status field
// Verify complaint was created with status
// Default status should be "pending"

// In MongoDB shell:
db.complaints.find()
```

#### Problem: Cannot update complaint status
**Solution:**
```javascript
// Ensure user is admin
// Check API endpoint: PUT /admin/complaints/:id/status
// Verify complaint ID is correct
// Check browser console for errors
```

---

### 12. Frontend Build Issues

#### Problem: "Failed to resolve import"
**Solution:**
```bash
# Check import paths are correct
# Ensure file extensions are included (.jsx)
# Verify file exists at specified path

# Clean and rebuild
cd frontend
rmdir /s /q node_modules
rmdir /s /q dist
npm install
npm run build
```

---

### 13. Environment Variable Issues

#### Problem: "process.env.MONGO_URI is undefined"
**Solution:**
```bash
# Ensure .env file exists in backend folder
# Check .env file format (no quotes needed)
# Restart backend server after changing .env

# Verify .env is loaded
node -e "require('dotenv').config(); console.log(process.env.MONGO_URI)"
```

---

### 14. Password Hashing Issues

#### Problem: "Password not matching" even with correct password
**Solution:**
```javascript
// Ensure bcrypt is installed
npm install bcryptjs

// Check User model has pre-save hook
// Verify matchPassword method exists
// Test password hashing:
const bcrypt = require('bcryptjs');
bcrypt.hash('password123', 10).then(hash => console.log(hash));
```

---

### 15. API Request Issues

#### Problem: "Network Error" when making API calls
**Solution:**
```javascript
// Check backend server is running
// Verify API baseURL in frontend/src/services/api.js
// Should be: http://localhost:5001/api

// Check browser console for exact error
// Verify request format matches API documentation
```

---

## 🔍 Debugging Tips

### Backend Debugging
```javascript
// Add console.logs in controllers
console.log('Request body:', req.body);
console.log('User:', req.user);
console.log('Params:', req.params);

// Check middleware execution
console.log('Middleware executed');

// Log database queries
const result = await Model.find();
console.log('Query result:', result);
```

### Frontend Debugging
```javascript
// Check state values
console.log('State:', state);

// Check API responses
api.get('/endpoint')
  .then(res => console.log('Response:', res.data))
  .catch(err => console.log('Error:', err.response));

// Check localStorage
console.log('User:', localStorage.getItem('user'));

// Check context values
console.log('Auth context:', user);
```

### Database Debugging
```javascript
// Check all collections
show collections

// Count documents
db.users.countDocuments()
db.stocks.countDocuments()
db.complaints.countDocuments()

// Find with conditions
db.users.find({ role: "admin" })
db.stocks.find({ quantity: { $gt: 0 } })

// Check indexes
db.users.getIndexes()
```

---

## 🚨 Emergency Fixes

### Complete Reset
```bash
# 1. Stop all servers
# Ctrl+C in both terminals

# 2. Clear database
# In MongoDB shell:
use ration_db
db.dropDatabase()

# 3. Clear frontend cache
# In browser console:
localStorage.clear()
sessionStorage.clear()

# 4. Reinstall dependencies
cd backend
rmdir /s /q node_modules
npm install

cd frontend
rmdir /s /q node_modules
npm install

# 5. Restart servers
cd backend && npm run dev
cd frontend && npm run dev
```

### Quick Fix Checklist
- [ ] Backend server running?
- [ ] Frontend server running?
- [ ] MongoDB connected?
- [ ] .env file configured?
- [ ] User logged in?
- [ ] Token valid?
- [ ] Correct API endpoints?
- [ ] Browser console errors?
- [ ] Network tab shows requests?

---

## 📞 Getting Help

### Before Asking for Help:
1. Check this troubleshooting guide
2. Read error messages carefully
3. Check browser console
4. Check backend terminal logs
5. Verify configuration files
6. Try the emergency reset

### When Asking for Help, Provide:
- Exact error message
- Steps to reproduce
- Browser console logs
- Backend terminal logs
- Your environment (OS, Node version)
- What you've already tried

### Useful Commands for Debugging:
```bash
# Check versions
node --version
npm --version
mongosh --version

# Check running processes
netstat -ano | findstr :5001
netstat -ano | findstr :5173

# Check environment
echo %PATH%
node -e "console.log(process.env)"

# Test MongoDB connection
mongosh "your_connection_string"

# Check npm packages
npm list
npm outdated
```

---

## ✅ Prevention Tips

1. **Always check .env file** before starting servers
2. **Keep dependencies updated** regularly
3. **Clear cache** when things seem broken
4. **Use version control** (Git) to track changes
5. **Test after each feature** implementation
6. **Read error messages** completely
7. **Check documentation** before making changes
8. **Backup database** before major changes
9. **Use consistent naming** conventions
10. **Comment your code** for future reference

---

**Remember:** Most issues can be solved by:
1. Reading the error message
2. Checking the console
3. Verifying configuration
4. Restarting servers
5. Clearing cache

If all else fails, try the complete reset procedure above.
