# Quick Command Reference

## 🚀 Installation Commands

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd frontend
npm install
```

## ▶️ Run Commands

### Start Backend (Development)
```bash
cd backend
npm run dev
```

### Start Backend (Production)
```bash
cd backend
npm start
```

### Start Frontend (Development)
```bash
cd frontend
npm run dev
```

### Build Frontend (Production)
```bash
cd frontend
npm run build
```

### Preview Frontend Build
```bash
cd frontend
npm run preview
```

## 🧹 Cleanup Commands

### Remove node_modules (Backend)
```bash
cd backend
rmdir /s /q node_modules
```

### Remove node_modules (Frontend)
```bash
cd frontend
rmdir /s /q node_modules
```

### Clean Install (Backend)
```bash
cd backend
rmdir /s /q node_modules
del package-lock.json
npm install
```

### Clean Install (Frontend)
```bash
cd frontend
rmdir /s /q node_modules
del package-lock.json
npm install
```

## 🔧 Utility Commands

### Kill Port 5001 (Backend)
```bash
npx kill-port 5001
```

### Kill Port 5173 (Frontend)
```bash
npx kill-port 5173
```

### Check Node Version
```bash
node --version
```

### Check npm Version
```bash
npm --version
```

## 📦 Package Management

### Install Specific Package (Backend)
```bash
cd backend
npm install package-name
```

### Install Specific Package (Frontend)
```bash
cd frontend
npm install package-name
```

### Update All Packages (Backend)
```bash
cd backend
npm update
```

### Update All Packages (Frontend)
```bash
cd frontend
npm update
```

### Check for Outdated Packages
```bash
npm outdated
```

## 🗄️ MongoDB Commands

### Connect to MongoDB (Local)
```bash
mongosh
```

### Show Databases
```javascript
show dbs
```

### Use Database
```javascript
use ration_db
```

### Show Collections
```javascript
show collections
```

### Find All Users
```javascript
db.users.find().pretty()
```

### Find User by Email
```javascript
db.users.findOne({ email: "admin@example.com" })
```

### Update User Role to Admin
```javascript
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "admin" } }
)
```

### Delete All Notifications
```javascript
db.notifications.deleteMany({})
```

### Delete All Complaints
```javascript
db.complaints.deleteMany({})
```

### Count Documents
```javascript
db.users.countDocuments()
db.stocks.countDocuments()
db.complaints.countDocuments()
```

## 🔍 Debugging Commands

### View Backend Logs
```bash
cd backend
npm run dev
# Logs will appear in terminal
```

### View Frontend Logs
```bash
cd frontend
npm run dev
# Open browser console (F12)
```

### Test Backend API (using curl)
```bash
# Test login
curl -X POST http://localhost:5001/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@example.com\",\"password\":\"password123\"}"

# Test get stocks (with token)
curl -X GET http://localhost:5001/api/admin/stocks ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🧪 Testing Commands

### Run ESLint (Frontend)
```bash
cd frontend
npm run lint
```

### Fix ESLint Issues
```bash
cd frontend
npm run lint -- --fix
```

## 🌐 Git Commands

### Initialize Git
```bash
git init
```

### Add All Files
```bash
git add .
```

### Commit Changes
```bash
git commit -m "Initial commit"
```

### Push to Remote
```bash
git remote add origin <repository-url>
git push -u origin main
```

### Check Status
```bash
git status
```

### View Commit History
```bash
git log --oneline
```

## 📝 Environment Setup

### Create .env File (Backend)
```bash
cd backend
echo MONGO_URI=your_mongodb_uri > .env
echo JWT_SECRET=your_jwt_secret >> .env
echo PORT=5001 >> .env
```

### View .env File
```bash
cd backend
type .env
```

## 🔐 Security Commands

### Generate Random JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Hash Password (for testing)
```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('password123', 10).then(hash => console.log(hash))"
```

## 📊 Performance Commands

### Check Bundle Size (Frontend)
```bash
cd frontend
npm run build
# Check dist folder size
```

### Analyze Dependencies
```bash
npm list --depth=0
```

### Check for Security Vulnerabilities
```bash
npm audit
```

### Fix Security Vulnerabilities
```bash
npm audit fix
```

## 🚀 Deployment Commands

### Build for Production
```bash
# Backend - no build needed, just ensure .env is set
cd backend

# Frontend
cd frontend
npm run build
# Output will be in dist/ folder
```

### Test Production Build Locally
```bash
cd frontend
npm run preview
```

## 💡 Useful Shortcuts

### Open Project in VS Code
```bash
code .
```

### Open Backend in VS Code
```bash
cd backend
code .
```

### Open Frontend in VS Code
```bash
cd frontend
code .
```

### Open Multiple Terminals
```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2 (new terminal)
cd frontend && npm run dev
```

## 🔄 Quick Reset Commands

### Reset Database (Delete All Data)
```javascript
// In MongoDB shell
use ration_db
db.dropDatabase()
```

### Reset Frontend State
```javascript
// In browser console
localStorage.clear()
sessionStorage.clear()
location.reload()
```

### Full Project Reset
```bash
# Backend
cd backend
rmdir /s /q node_modules
del package-lock.json
npm install

# Frontend
cd frontend
rmdir /s /q node_modules
del package-lock.json
npm install

# Database
# Connect to MongoDB and drop database
```

## 📱 Browser Commands

### Open Browser Console
```
F12 or Ctrl+Shift+I
```

### Clear Browser Cache
```
Ctrl+Shift+Delete
```

### Hard Reload
```
Ctrl+Shift+R or Ctrl+F5
```

## 🎯 Quick Start (All in One)

### Windows PowerShell
```powershell
# Start both servers
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"
```

### Windows CMD
```cmd
# Terminal 1
start cmd /k "cd backend && npm run dev"

# Terminal 2
start cmd /k "cd frontend && npm run dev"
```

---

## 📞 Need Help?

If a command doesn't work:
1. Check you're in the correct directory
2. Ensure all dependencies are installed
3. Verify Node.js and npm are installed
4. Check for typos in the command
5. Try running as administrator if needed

## 🎉 Most Used Commands

```bash
# Start development
cd backend && npm run dev
cd frontend && npm run dev

# Install dependencies
npm install

# Kill ports
npx kill-port 5001
npx kill-port 5173

# View logs
# Check terminal output

# Reset localStorage
# Browser console: localStorage.clear()
```
