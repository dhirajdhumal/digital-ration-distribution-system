# API Documentation

Base URL: `http://localhost:5001/api`

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 Auth Routes

### Register User
```http
POST /auth/register
```

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "village": "Village Name"
}
```

**Response:**
```json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "village": "Village Name",
  "token": "jwt_token_here"
}
```

### Login User
```http
POST /auth/login
```

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "token": "jwt_token_here"
}
```

---

## 👤 User Routes

### Get User's Allocated Stocks
```http
GET /user/allocated-stocks
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "stockId": {
      "_id": "stock_id",
      "item": "Rice",
      "unit": "kg",
      "price": 50
    },
    "quantity": 10,
    "unit": "kg",
    "allocatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

### Create Complaint
```http
POST /user/complaints
Authorization: Bearer <token>
```

**Body:**
```json
{
  "title": "Quality Issue",
  "description": "The rice quality is not good"
}
```

**Response:**
```json
{
  "_id": "complaint_id",
  "user": "user_id",
  "title": "Quality Issue",
  "description": "The rice quality is not good",
  "status": "pending",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

### Get User's Complaints
```http
GET /user/complaints/my
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "_id": "complaint_id",
    "title": "Quality Issue",
    "description": "The rice quality is not good",
    "status": "pending",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

### Get All Notifications
```http
GET /user/notifications
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "_id": "notification_id",
    "notificationId": "1234567890",
    "notificationTitle": "New Scheme",
    "notificationBody": "Government announces new ration scheme"
  }
]
```

### Get Notification by ID
```http
GET /user/notifications/:id
Authorization: Bearer <token>
```

---

## 🏘️ Village Admin Routes

### Get Village Admin's Allocated Stocks
```http
GET /village-admin/allocated-stocks
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "stockId": {
      "_id": "stock_id",
      "item": "Rice",
      "unit": "kg",
      "price": 50
    },
    "quantity": 100,
    "unit": "kg",
    "allocatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

### Allocate Stock to User
```http
POST /village-admin/allocate-stock
Authorization: Bearer <token>
```

**Body:**
```json
{
  "userId": "user_id",
  "stockId": "stock_id",
  "quantity": 10,
  "unit": "kg"
}
```

**Response:**
```json
{
  "message": "Stock allocated to user successfully",
  "allocatedStock": {
    "stockId": "stock_id",
    "quantity": 10,
    "unit": "kg"
  },
  "remainingStock": 90
}
```

### Get Users in Village
```http
GET /village-admin/users
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "village": "Village 1"
  }
]
```

---

## 👨‍💼 Admin Routes

### Stock Management

#### Create Stock
```http
POST /admin/stocks
Authorization: Bearer <token>
```

**Body:**
```json
{
  "item": "Rice",
  "quantity": 1000,
  "unit": "kg",
  "price": 50
}
```

**Response:**
```json
{
  "message": "New stock created successfully",
  "stock": {
    "_id": "stock_id",
    "item": "Rice",
    "quantity": 1000,
    "unit": "kg",
    "price": 50,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### Update Stock Quantity
```http
PUT /admin/stocks/:stockId
Authorization: Bearer <token>
```

**Body:**
```json
{
  "quantity": 1500
}
```

**Response:**
```json
{
  "message": "Stock quantity updated successfully",
  "stock": {
    "_id": "stock_id",
    "item": "Rice",
    "quantity": 1500,
    "unit": "kg",
    "price": 50
  }
}
```

#### Get All Stocks
```http
GET /admin/stocks
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "_id": "stock_id",
    "item": "Rice",
    "quantity": 1000,
    "unit": "kg",
    "price": 50,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

#### Allocate Stock to Village Admin
```http
POST /admin/stocks/allocate
Authorization: Bearer <token>
```

**Body:**
```json
{
  "villageAdminId": "admin_id",
  "stockId": "stock_id",
  "quantity": 100,
  "unit": "kg"
}
```

**Response:**
```json
{
  "message": "Stock allocated successfully",
  "allocatedStock": {
    "stockId": "stock_id",
    "quantity": 100,
    "unit": "kg"
  },
  "remainingStock": 900
}
```

#### Allocate Stock to User (Direct)
```http
POST /admin/stocks/allocate/users
Authorization: Bearer <token>
```

**Body:**
```json
{
  "userId": "user_id",
  "stockId": "stock_id",
  "quantity": 10,
  "unit": "kg"
}
```

#### Get Village Admin Allocations
```http
GET /admin/allocated-stocks
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "villageAdminId": "admin_id",
    "villageAdminName": "Admin Name",
    "stockItem": "Rice",
    "quantity": 100,
    "unit": "kg",
    "allocatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

#### Get User Allocations
```http
GET /admin/allocated-stocks/users
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "userId": "user_id",
    "userName": "John Doe",
    "userVillage": "Village 1",
    "stockItem": "Rice",
    "quantity": 10,
    "unit": "kg",
    "allocatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

### Notification Management

#### Create Notification
```http
POST /admin/notifications
Authorization: Bearer <token>
```

**Body:**
```json
{
  "notificationTitle": "New Scheme 2024",
  "notificationBody": "Government announces new ration scheme"
}
```

**Response:**
```json
{
  "_id": "notification_id",
  "notificationId": "1234567890",
  "notificationTitle": "New Scheme 2024",
  "notificationBody": "Government announces new ration scheme"
}
```

#### Get All Notifications
```http
GET /admin/notifications
Authorization: Bearer <token>
```

#### Update Notification
```http
PUT /admin/notifications/:id
Authorization: Bearer <token>
```

**Body:**
```json
{
  "notificationTitle": "Updated Title",
  "notificationBody": "Updated body"
}
```

#### Delete Notification
```http
DELETE /admin/notifications/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Notification deleted successfully"
}
```

### Complaint Management

#### Get All Complaints
```http
GET /admin/complaints
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "_id": "complaint_id",
    "title": "Quality Issue",
    "description": "The rice quality is not good",
    "status": "pending",
    "user": {
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

#### Update Complaint Status
```http
PUT /admin/complaints/:id/status
Authorization: Bearer <token>
```

**Body:**
```json
{
  "status": "resolved"
}
```

**Response:**
```json
{
  "_id": "complaint_id",
  "title": "Quality Issue",
  "description": "The rice quality is not good",
  "status": "resolved",
  "user": {
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### User Management

#### Get All Users
```http
GET /admin/users
Authorization: Bearer <token>
```

**Response:**
```json
{
  "users": [
    {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "village": "Village 1"
    }
  ],
  "roles": [
    { "name": "villageAdmin", "label": "Village Admin" },
    { "name": "admin", "label": "Admin" }
  ]
}
```

#### Make Village Admin
```http
POST /admin/make-village-admin
Authorization: Bearer <token>
```

**Body:**
```json
{
  "userId": "user_id",
  "role": "villageAdmin"
}
```

**Response:**
```json
{
  "message": "User promoted to villageAdmin",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "villageAdmin",
    "village": "Village 1"
  }
}
```

#### Get All Village Admins
```http
GET /admin/village-admins
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "_id": "admin_id",
    "name": "Admin Name",
    "email": "admin@example.com",
    "role": "villageAdmin",
    "village": "Village 1",
    "allocatedStock": [
      {
        "stockId": {
          "item": "Rice",
          "unit": "kg",
          "price": 50
        },
        "quantity": 100,
        "unit": "kg"
      }
    ]
  }
]
```

---

## 🔒 Role-Based Access

| Route | User | Village Admin | Admin |
|-------|------|---------------|-------|
| `/api/auth/*` | ✅ | ✅ | ✅ |
| `/api/user/*` | ✅ | ✅ | ✅ |
| `/api/village-admin/*` | ❌ | ✅ | ✅ |
| `/api/admin/*` | ❌ | ❌ | ✅ |

---

## ⚠️ Error Responses

### 400 Bad Request
```json
{
  "message": "Invalid user data"
}
```

### 401 Unauthorized
```json
{
  "message": "Not authorized, no token"
}
```

### 403 Forbidden
```json
{
  "message": "Admin access only"
}
```

### 404 Not Found
```json
{
  "message": "User not found"
}
```

### 500 Server Error
```json
{
  "message": "Server Error"
}
```

---

## 📝 Notes

1. All timestamps are in ISO 8601 format
2. Passwords are automatically hashed before storage
3. JWT tokens expire in 30 days
4. Stock quantities are automatically updated after allocation
5. Complaint status can be: "pending" or "resolved"
6. User roles can be: "user", "villageAdmin", or "admin"
