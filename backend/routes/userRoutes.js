const express = require('express');
const router = express.Router();
const multer = require('multer');

// Initialize multer for multipart/form-data (if you’ll upload images, files, etc.)
const upload = multer({ storage: multer.memoryStorage() });

const {
  createComplaint,
  getComplaintsByUser,
  getNotificationById,
  getUserAllocatedStocks,
  getAllNotifications,
  markAllNotificationsAsRead,
  getUnreadNotificationCount
} = require('../controllers/userController');

const { protect } = require('../middleware/authMiddleware');

// 🧾 Create a complaint (with optional file upload)
router.post('/complaints', protect, upload.single('file'), createComplaint);

// 📢 Get all notifications
// Get unread notification count
router.get(
  '/notifications/unread-count',
  protect,
  getUnreadNotificationCount
);

// Mark all notifications as read
router.post(
  '/notifications/mark-all-read',
  protect,
  markAllNotificationsAsRead
);

// Get all notifications
router.get(
  '/notifications',
  protect,
  getAllNotifications
);

// Get a single notification by ID
router.get(
  '/notifications/:id',
  protect,
  getNotificationById
);

// 📋 Get logged-in user's complaints
router.get('/complaints/my', protect, getComplaintsByUser);

// 📦 Get user's allocated stocks
router.get('/allocated-stocks', protect, getUserAllocatedStocks);

module.exports = router;
