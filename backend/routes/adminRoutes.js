const express = require('express');
const router = express.Router();

// 🧩 Import controllers
const {
  createNotification,
  getAllNotifications,
  updateNotification,
  deleteNotification
} = require('../controllers/admin/notificationController');

const {
  createStock,
  allocateStockToVillageAdmin,
  getAllStocks,
  getStockItemsList
} = require('../controllers/admin/stockController');

const {
  getAllComplaints
} = require('../controllers/admin/complaintController');

const {
  makeVillageAdmin,
  getVillageAdmins
} = require('../controllers/admin/villageAdminController');

// 🛡️ Middleware
const { protect, adminOnly } = require('../middleware/authMiddleware');

/* ================================
   👤 VILLAGE ADMIN MANAGEMENT
================================ */
router.post('/village-admin', protect, adminOnly, makeVillageAdmin);
router.get('/village-admins', protect, adminOnly, getVillageAdmins);

/* ================================
   🔔 NOTIFICATION MANAGEMENT
================================ */
router
  .route('/notifications')
  .post(protect, adminOnly, createNotification)
  .get(protect, adminOnly, getAllNotifications);

router
  .route('/notifications/:id')
  .put(protect, adminOnly, updateNotification)
  .delete(protect, adminOnly, deleteNotification);

/* ================================
   📦 STOCK MANAGEMENT
================================ */
router.post('/stocks', protect, adminOnly, createStock);
router.get('/stocks', protect, adminOnly, getAllStocks);
router.get('/stocks/items', protect, adminOnly, getStockItemsList);
router.post('/stocks/allocate', protect, adminOnly, allocateStockToVillageAdmin);

/* ================================
   🧾 COMPLAINT MANAGEMENT
================================ */
router.get('/complaints', protect, adminOnly, getAllComplaints);

module.exports = router;
