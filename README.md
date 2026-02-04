# 🌾 Digital Ration Distribution System

<div align="center">

![MERN Stack](https://img.shields.io/badge/Stack-MERN-green?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

**A comprehensive full-stack web application to digitalize and automate the Public Distribution System (PDS) for efficient ration management.**

[Features](#-features) • [Tech Stack](#️-tech-stack) • [Installation](#-installation) • [API Documentation](#-api-endpoints) • [Architecture](#️-architecture)

</div>

---

## 📖 About The Project

The Digital Ration Distribution System is a MERN stack application designed to modernize government ration distribution processes. It replaces manual workflows with a secure, role-based digital platform that ensures transparency, efficiency, and accountability in ration allocation and distribution.

### 🎯 Key Highlights

- **MVC Architecture** - Clean separation of concerns for maintainability
- **Role-Based Access Control** - Three distinct user roles with specific permissions
- **Bulk Operations** - Allocate multiple stock items simultaneously
- **Real-Time Tracking** - Monitor stock levels, allocations, and expiry dates
- **Time Slot Management** - Organized collection scheduling to reduce crowding
- **Complete Audit Trail** - Track all allocations with date-based grouping

---

## 🏗️ MVC Architecture

<div align="center">

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                      │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                  VIEW LAYER (React)                      │
│  • Components: Navbar, ProtectedRoute                   │
│  • Pages: Dashboards, Forms, Tables                     │
│  • Context API: State Management                        │
│  • Axios: API Communication                             │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│              CONTROLLER LAYER (Express)                  │
│  • Routes: API Endpoints                                │
│  • Controllers: Business Logic                          │
│  • Middleware: Authentication & Authorization           │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│               MODEL LAYER (MongoDB)                      │
│  • Schemas: Data Structure                              │
│  • Validation: Data Integrity                           │
│  • Relationships: Data Associations                     │
└─────────────────────────────────────────────────────────┘
```

</div>

---

## ✨ Features

<table>
<tr>
<td width="33%" valign="top">

### 👤 For Users
- ✅ Secure JWT Authentication
- ✅ View Allocated Rations (grouped by date)
- ✅ View Assigned Time Slots
- ✅ File Complaints
- ✅ Receive Notifications
- ✅ Expiry Date Tracking

</td>
<td width="33%" valign="top">

### 🏘️ For Village Admins
- ✅ Bulk Stock Allocation
- ✅ Allocation Records
- ✅ Time Slot Management
- ✅ User Assignment
- ✅ Village User Management
- ✅ Status Indicators

</td>
<td width="33%" valign="top">

### 👨‍💼 For Admins
- ✅ Stock Management
- ✅ Bulk Allocation to Village Admins
- ✅ Distribution Records
- ✅ User Role Management
- ✅ Complaint Handling
- ✅ Notification System

</td>
</tr>
</table>

---

## 🛠️ Tech Stack

<div align="center">

| Category | Technologies |
|----------|-------------|
| **Frontend** | React 19.1.1, React Router DOM 7.9.3, Axios 1.12.2, Vite 7.1.7 |
| **Backend** | Node.js, Express.js 5.1.0, JWT, bcrypt.js |
| **Database** | MongoDB, Mongoose 8.18.1 |
| **Architecture** | MVC Pattern, RESTful API |
| **State Management** | Context API |
| **Authentication** | JWT Tokens, bcrypt Password Hashing |

</div>

---

## 📦 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher)
- **MongoDB** (local installation or MongoDB Atlas account)
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/dhirajdhumal/digital-ration-distribution-system.git
   cd digital-ration-distribution-system
   ```

2. **Backend Setup**
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

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

### Running the Application

**Start Backend Server**
```bash
cd backend
npm run dev
```
🚀 Backend runs on `http://localhost:5001`

**Start Frontend Development Server**
```bash
cd frontend
npm run dev
```
🚀 Frontend runs on `http://localhost:5173`

---

## 👥 User Roles

<table>
<tr>
<th>Role</th>
<th>Creation Method</th>
<th>Access Routes</th>
<th>Key Capabilities</th>
</tr>
<tr>
<td><strong>Admin</strong></td>
<td>Manual creation in MongoDB with <code>role: "admin"</code></td>
<td><code>/admin/*</code></td>
<td>Full system control, stock management, user role management</td>
</tr>
<tr>
<td><strong>Village Admin</strong></td>
<td>Promoted by Admin via "Manage User Roles"</td>
<td><code>/village-admin/*</code></td>
<td>Local distribution, time slots, village user management</td>
</tr>
<tr>
<td><strong>User</strong></td>
<td>Public registration at <code>/register</code></td>
<td><code>/user/*</code></td>
<td>View rations, view time slots, file complaints</td>
</tr>
</table>

---

## 📁 Project Structure (MVC Architecture)

```
digital-ration-distribution/
├── backend/                          # Backend (Model & Controller)
│   ├── models/                       # MODEL LAYER
│   │   ├── User.js                   # User schema with roles & allocations
│   │   ├── Stock.js                  # Stock schema with expiry tracking
│   │   ├── TimeSlot.js               # TimeSlot schema with bookings
│   │   ├── Notification.js           # Notification schema
│   │   └── Complaint.js              # Complaint schema with status
│   │
│   ├── controllers/                  # CONTROLLER LAYER
│   │   ├── admin/
│   │   │   ├── stockController.js    # Stock management logic
│   │   │   ├── notificationController.js
│   │   │   ├── complaintController.js
│   │   │   └── villageAdminController.js
│   │   ├── authController.js         # Authentication logic
│   │   ├── userController.js         # User operations
│   │   ├── villageAdminController.js # Village admin operations
│   │   └── timeSlotController.js     # Time slot management
│   │
│   ├── routes/                       # API Routes (Controller Entry)
│   │   ├── authRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── userRoutes.js
│   │   ├── villageAdminRoutes.js
│   │   └── timeSlotRoutes.js
│   │
│   ├── middleware/                   # Middleware
│   │   └── authMiddleware.js         # JWT & role-based auth
│   │
│   ├── server.js                     # Entry point
│   └── .env                          # Environment variables
│
├── frontend/                         # Frontend (View)
│   ├── src/
│   │   ├── components/               # VIEW COMPONENTS
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   ├── pages/                    # VIEW PAGES
│   │   │   ├── Admin/                # Admin interface
│   │   │   ├── VillageAdmin/         # Village admin interface
│   │   │   ├── User/                 # User interface
│   │   │   └── Auth/                 # Login/Register
│   │   │
│   │   ├── context/                  # State Management
│   │   │   └── authContext.jsx
│   │   │
│   │   ├── services/                 # API Service
│   │   │   └── api.js                # Axios configuration
│   │   │
│   │   ├── App.jsx                   # Main app component
│   │   └── main.jsx                  # Entry point
│   │
│   └── vite.config.js
│
└── README.md                         # Main documentation
```

## 🔐 API Endpoints

<details>
<summary><b>Authentication</b></summary>

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

</details>

<details>
<summary><b>User Routes (Protected)</b></summary>

- `GET /api/user/allocated-stocks` - Get user's allocated rations
- `POST /api/user/complaints` - Create complaint
- `GET /api/user/complaints/my` - Get user's complaints
- `GET /api/user/notifications` - Get all notifications
- `GET /api/timeslots/my-booking` - Get user's assigned time slot

</details>

<details>
<summary><b>Village Admin Routes (Protected)</b></summary>

- `GET /api/village-admin/allocated-stocks` - Get allocated stocks
- `POST /api/village-admin/allocate-stock-bulk` - Bulk allocate stocks to users
- `GET /api/village-admin/users` - Get users in village
- `POST /api/timeslots/create` - Create time slot
- `POST /api/timeslots/assign` - Assign user to time slot
- `POST /api/timeslots/remove` - Remove user from time slot
- `GET /api/timeslots/village` - Get village time slots

</details>

<details>
<summary><b>Admin Routes (Protected)</b></summary>

- `POST /api/admin/stocks` - Create new stock
- `PUT /api/admin/stocks/:stockId` - Update stock quantity
- `GET /api/admin/stocks` - Get all stocks
- `POST /api/admin/stocks/allocate-bulk` - Bulk allocate to village admins
- `GET /api/admin/village-admins` - Get all village admins
- `POST /api/admin/make-village-admin` - Promote/demote user role
- `POST /api/admin/notifications` - Create notification
- `GET /api/admin/complaints` - Get all complaints
- `PUT /api/admin/complaints/:id/status` - Update complaint status

</details>

---

## 🎨 Key Features

<div align="center">

| Feature | Description |
|---------|-------------|
| 🔐 **Authentication** | JWT-based auth with bcrypt password hashing |
| 📦 **Bulk Operations** | Allocate multiple items simultaneously |
| 📊 **Allocation Records** | Complete history with date grouping |
| ⏰ **Time Slot Management** | Create, edit, and assign collection slots |
| 🎯 **Status Indicators** | Visual indicators (✓ allocated, ⏳ pending) |
| 🔍 **Search & Filter** | Find users and records quickly |
| 📅 **Expiry Tracking** | Color-coded expiry date alerts |
| 🏘️ **Village Isolation** | Data segregation by village |
| 📱 **Responsive Design** | Works on all screen sizes |
| 🔒 **Role-Based Access** | Three-tier permission system |

</div>

---

## 🔒 Security

- 🔐 JWT token authentication
- 🔑 bcrypt password hashing
- 🛡️ Role-based authorization middleware
- 🚪 Protected API routes
- 🏘️ Village-level data isolation
- ✅ Input validation (frontend & backend)
- 🧹 Auto token cleanup for invalid tokens

---

## 🐛 Troubleshooting

<details>
<summary><b>Token Errors (jwt malformed)</b></summary>

If you see "jwt malformed" errors:
1. Clear browser localStorage: `localStorage.clear()`
2. Restart both servers
3. Login again with fresh credentials

</details>

<details>
<summary><b>Connection Issues</b></summary>

- Ensure MongoDB is running
- Check `.env` file has correct `MONGO_URI`
- Verify ports 5001 (backend) and 5173 (frontend) are available

</details>

<details>
<summary><b>CORS Errors</b></summary>

- Backend runs on `http://localhost:5001`
- Frontend runs on `http://localhost:5173`
- CORS is configured in `server.js`

</details>

<details>
<summary><b>Git Push Rejected</b></summary>

If you see "Updates were rejected" error:
1. Pull remote changes: `git pull origin main`
2. Resolve any merge conflicts
3. Commit the merge: `git add . && git commit -m "Merge remote changes"`
4. Push again: `git push -u origin main`

</details>

---

## 📸 Screenshots

<div align="center">

*Add your application screenshots here*

</div>

---

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

Distributed under the ISC License. See `LICENSE` for more information.

---

## 👨‍💻 Author

**Dhiraj Dhumal**

- GitHub: [@dhirajdhumal](https://github.com/dhirajdhumal)
- Project Link: [https://github.com/dhirajdhumal/digital-ration-distribution-system](https://github.com/dhirajdhumal/digital-ration-distribution-system)

---

## 🙏 Acknowledgments

- Built with MERN Stack
- Inspired by the need to digitalize Public Distribution System
- Thanks to all contributors and supporters

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ by Dhiraj Dhumal

</div>
