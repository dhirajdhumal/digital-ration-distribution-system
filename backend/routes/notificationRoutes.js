const express = require('express');
const { createNotification, getAllNotifications, getNotificationById, updateNotification, deleteNotification } = require('../controllers/notificationController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.post("/", protect, adminOnly, createNotification);
router.put('/:id', protect, adminOnly, updateNotification);
router.delete('/:id', protect, adminOnly, deleteNotification);

router.get("/", getAllNotifications);
router.get('/:id', getNotificationById);

module.exports = router;