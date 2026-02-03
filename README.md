# Digital Ration Distribution System

A comprehensive MERN stack web application designed to digitalize government ration distribution with secure authentication, role-based access control, and transparent stock management.

## 🚀 Features

### For Users
- **Secure Authentication**: Register and login with JWT-based authentication
- **View Allocated Rations**: Check your allocated ration items with quantities, prices, and expiry dates
- **Book Collection Slots**: Schedule your ration collection time to avoid crowding
- **File Complaints**: Report fraud or issues related to ration distribution
- **Track Complaint Status**: Monitor the status of your complaints (pending/resolved)
- **Receive Notifications**: Stay updated with scheme announcements and updates

### For Village Admins
- **Manage Local Distribution**: Allocate rations to users in your village
- **View Allocated Stock**: Track stock allocated to you by the main admin with expiry information
- **Monitor Users**: View and manage users in your village area
- **Create Time Slots**: Set up collection time slots for your village

### For Admins
- **Stock Management**: Create new stock items with expiry dates and batch numbers
- **Expiry Tracking**: Monitor stocks expiring soon or already expired
- **Allocate to Village Admins**: Distribute stock to village-level administrators
- **User Management**: Promote users to village admin roles
- **Handle Complaints**: View and resolve user complaints
- **Send Notifications**: Broadcast scheme updates and announcements
- **Time Slot Management**: Create and manage collection time slots
- **View Reports**: Monitor all allocations and distribution workflows

## 🛠️ Tech Stack

**Frontend:**
- React 19.1.1
- React Router DOM 7.9.3
- Material-UI 7.3.4
- Axios 1.12.2
- Vite 7.1.7

**Backend:**
- Node.js
- Express.js 5.1.0
- MongoDB with Mongoose 8.18.1
- JWT for authentication
- Bcrypt.js for password hashing
- Multer for file uploads

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## 🔧 Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd digital-ration-distribution
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5001
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

## 🚀 Running the Application

### Start Backend Server
```bash
cd backend
npm run dev
```
Backend will run on `http://localhost:5001`

### Start Frontend Development Server
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:5173`

## 👥 User Roles & Access

### Admin
- Email: Create an admin user manually in MongoDB with `role: "admin"`
- Access: `/admin/*` routes
- Capabilities: Full system control

### Village Admin
- Created by: Admin through "Make Village Admin" feature
- Access: `/village-admin/*` routes
- Capabilities: Manage local distribution

### User
- Registration: Public registration available
- Access: `/user/*` routes
- Capabilities: View rations, file complaints, receive notifications

## 📁 Project Structure

```
digital-ration-distribution/
├── backend/
│   ├── controllers/
│   │   ├── admin/
│   │   │   ├── complaintController.js
│   │   │   ├── notificationController.js
│   │   │   ├── stockController.js
│   │   │   └── villageAdminController.js
│   │   ├── authController.js
│   │   ├── userController.js
│   │   └── villageAdminController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── Complaint.js
│   │   ├── Notification.js
│   │   ├── Stock.js
│   │   └── User.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   └── villageAdminRoutes.js
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── authContext.jsx
│   │   ├── pages/
│   │   │   ├── Admin/
│   │   │   ├── Auth/
│   │   │   ├── User/
│   │   │   └── VillageAdmin/
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### User Routes
- `GET /api/user/allocated-stocks` - Get user's allocated rations
- `POST /api/user/complaints` - Create complaint
- `GET /api/user/complaints/my` - Get user's complaints
- `GET /api/user/notifications` - Get all notifications

### Village Admin Routes
- `GET /api/village-admin/allocated-stocks` - Get allocated stocks
- `POST /api/village-admin/allocate-stock` - Allocate stock to users
- `GET /api/village-admin/users` - Get users in village

### Admin Routes
- `POST /api/admin/stocks` - Create new stock
- `PUT /api/admin/stocks/:stockId` - Update stock quantity
- `GET /api/admin/stocks` - Get all stocks
- `POST /api/admin/stocks/allocate` - Allocate to village admin
- `POST /api/admin/stocks/allocate/users` - Allocate to users
- `GET /api/admin/allocated-stocks` - Get village admin allocations
- `GET /api/admin/allocated-stocks/users` - Get user allocations
- `POST /api/admin/notifications` - Create notification
- `GET /api/admin/notifications` - Get all notifications
- `PUT /api/admin/notifications/:id` - Update notification
- `DELETE /api/admin/notifications/:id` - Delete notification
- `GET /api/admin/complaints` - Get all complaints
- `PUT /api/admin/complaints/:id/status` - Update complaint status
- `GET /api/admin/users` - Get all users
- `POST /api/admin/make-village-admin` - Promote user to village admin
- `GET /api/admin/village-admins` - Get all village admins

## 🎨 Key Features Implemented

✅ JWT-based authentication with role-based access control  
✅ Stock creation and management with expiry date tracking  
✅ Multi-level allocation (Admin → Village Admin → User)  
✅ Time-slot scheduling for ration collection  
✅ Complaint management with status tracking  
✅ Notification system for scheme announcements  
✅ User promotion to village admin  
✅ Real-time stock quantity updates  
✅ Expiry alerts for stocks (expiring soon/expired)  
✅ Batch number tracking for inventory  
✅ Responsive Material-UI design  
✅ Protected routes based on user roles  
✅ Comprehensive error handling  

## 🐛 Bug Fixes Applied

- Fixed role case sensitivity (villageadmin → villageAdmin)
- Fixed console.error typo in User Complaint page
- Fixed MakeVillageAdmin roles array issue
- Fixed VillageAdmin AllocateStock endpoint
- Fixed User Notification endpoint
- Added missing getAllUserAllocatedStocks function
- Added complaint status update functionality

## 🔮 Future Enhancements

- Email notifications for bookings and expiry alerts
- SMS reminders for time slots
- Advanced reporting and analytics
- QR code verification for time slots
- Multi-language support
- Mobile app version
- Data export functionality

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

Developed as a MERN stack project for digitalizing government ration distribution.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📞 Support

For support, please create an issue in the repository.