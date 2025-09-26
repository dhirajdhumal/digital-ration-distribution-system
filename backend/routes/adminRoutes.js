const express = require('express');
const router = express.Router();
const { createNotification, getAllNotifications, updateNotification, deleteNotification, getVillageAdmins, makeVillageAdmin, getAllComplaints, createStock } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/make-village-admin', protect, adminOnly, makeVillageAdmin);

router.post("/create-notification", protect, adminOnly, createNotification);
router.post('/create-stock', protect, adminOnly, createStock)
router.put('/update-notification/:id', protect, adminOnly, updateNotification);
router.delete('/delete-notification/:id', protect, adminOnly, deleteNotification);

router.get('/get-all-village-admins', protect, adminOnly, getVillageAdmins);
router.get('/all-complaints', protect, adminOnly, getAllComplaints);
router.get("/all-notifications", protect, adminOnly, getAllNotifications);

module.exports = router;