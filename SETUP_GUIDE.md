# Quick Setup Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 2: Configure Environment

Create `backend/.env` file:
```env
MONGO_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/ration_db
JWT_SECRET=your_super_secret_jwt_key_here_12345
PORT=5001
```

**Note:** Replace the MongoDB URI with your own connection string.

### Step 3: Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Step 4: Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:5001

## 👤 Creating Your First Admin User

Since there's no admin by default, you need to create one manually in MongoDB:

### Option 1: Using MongoDB Compass
1. Connect to your database
2. Go to the `users` collection
3. Insert a new document:
```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "$2a$10$YourHashedPasswordHere",
  "role": "admin",
  "village": "Main Office",
  "allocatedStock": [],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Option 2: Register and Update
1. Register a normal user through the app
2. Go to MongoDB and change that user's `role` from "user" to "admin"

### Option 3: Use MongoDB Shell
```javascript
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "admin" } }
)
```

## 🎯 Testing the Application

### 1. Test User Registration
- Go to http://localhost:5173/register
- Register a new user with village name

### 2. Test Admin Login
- Go to http://localhost:5173/login
- Login with admin credentials
- You should be redirected to `/admin/dashboard`

### 3. Create Stock Items
- Navigate to "Create Stock" from admin dashboard
- Add items like: Rice (1000 kg, ₹50/kg)

### 4. Promote Village Admin
- Go to "Make Village Admin"
- Select a user and promote to "villageAdmin"

### 5. Allocate Stock
- Allocate stock from Admin → Village Admin
- Login as Village Admin
- Allocate stock from Village Admin → User

### 6. Test User Features
- Login as regular user
- View allocated rations
- File a complaint
- View notifications

## 🔧 Common Issues & Solutions

### Issue: MongoDB Connection Failed
**Solution:** Check your MongoDB URI in `.env` file. Ensure your IP is whitelisted in MongoDB Atlas.

### Issue: Port Already in Use
**Solution:** 
```bash
# Kill process on port 5001
npx kill-port 5001

# Or change PORT in .env file
PORT=5002
```

### Issue: CORS Error
**Solution:** Backend already has CORS enabled. Ensure backend is running on port 5001.

### Issue: Token Invalid
**Solution:** Clear localStorage and login again:
```javascript
// In browser console
localStorage.clear()
```

## 📱 Default Test Accounts

After setup, create these test accounts:

1. **Admin**
   - Email: admin@ration.gov
   - Role: admin
   - Village: Main Office

2. **Village Admin**
   - Email: village1@ration.gov
   - Role: villageAdmin
   - Village: Village 1

3. **User**
   - Email: user1@example.com
   - Role: user
   - Village: Village 1

## 🎨 Features to Test

- ✅ User registration and login
- ✅ Admin dashboard with all panels
- ✅ Stock creation and management
- ✅ Stock allocation (Admin → Village Admin → User)
- ✅ Complaint filing and status updates
- ✅ Notification creation and viewing
- ✅ User promotion to village admin
- ✅ Role-based route protection

## 📊 Sample Data

### Sample Stock Items
```javascript
[
  { item: "Rice", quantity: 1000, unit: "kg", price: 50 },
  { item: "Wheat", quantity: 800, unit: "kg", price: 40 },
  { item: "Sugar", quantity: 500, unit: "kg", price: 60 },
  { item: "Cooking Oil", quantity: 300, unit: "liters", price: 150 }
]
```

### Sample Notification
```javascript
{
  notificationTitle: "New Ration Scheme 2024",
  notificationBody: "Government announces new subsidized ration scheme for all eligible families. Please collect your ration cards."
}
```

## 🚨 Important Notes

1. **Security**: Change JWT_SECRET in production
2. **Database**: Use MongoDB Atlas for production
3. **Environment**: Never commit `.env` file
4. **Passwords**: All passwords are hashed with bcrypt
5. **Tokens**: JWT tokens expire in 30 days

## 📞 Need Help?

If you encounter any issues:
1. Check the console for error messages
2. Verify all dependencies are installed
3. Ensure MongoDB is running
4. Check that both frontend and backend are running
5. Clear browser cache and localStorage

## 🎉 You're All Set!

Your Digital Ration Distribution System is now ready to use. Start by creating an admin user and exploring all the features!
