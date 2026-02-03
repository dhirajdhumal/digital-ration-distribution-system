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
  updateStockQuantity,
  allocateStockToVillageAdmin,
  allocateStockToVillageAdminBulk,
  getAllStocks,
  getAllAllocatedStocks,
  allocateStockToUser,
  getAllUserAllocatedStocks,
  getExpiringStocks,
  getExpiredStocks
} = require('../controllers/admin/stockController');

const {
  getAllComplaints,
  updateComplaintStatus
} = require('../controllers/admin/complaintController');

const {
  getAllUsers,
  makeVillageAdmin,
  getVillageAdmins
} = require('../controllers/admin/villageAdminController');

// 🛡️ Middleware
const { protect, adminOnly } = require('../middleware/authMiddleware');

/* ================================
   👤 VILLAGE ADMIN MANAGEMENT
================================ */
router.get('/village-admins', protect, adminOnly, getVillageAdmins);
router.get('/users', protect,  getAllUsers);
router.post('/make-village-admin', protect, adminOnly, makeVillageAdmin);


/* ================================
   🔔 NOTIFICATION MANAGEMENT
================================ */
router
  .route('/notifications')
  .post(protect, adminOnly, createNotification)
  .get(protect, getAllNotifications);

router
  .route('/notifications/:id')
  .put(protect, adminOnly, updateNotification)
  .delete(protect, adminOnly, deleteNotification);

/* ================================
   📦 STOCK MANAGEMENT
================================ */
router.post('/stocks', protect, adminOnly, createStock);
router.put('/stocks/:stockId', protect, updateStockQuantity);
router.get('/stocks', protect,  getAllStocks);
router.get('/stocks/expiring', protect, adminOnly, getExpiringStocks);
router.get('/stocks/expired', protect, adminOnly, getExpiredStocks);

router.post('/stocks/allocate', protect, allocateStockToVillageAdmin);
router.post('/stocks/allocate-bulk', protect, adminOnly, allocateStockToVillageAdminBulk);
router.post('/stocks/allocate/users', protect, allocateStockToUser);
// Get all allocations
router.get("/allocated-stocks", protect, getAllAllocatedStocks);
router.get("/allocated-stocks/users", protect, getAllUserAllocatedStocks);

/* ================================
   🧾 COMPLAINT MANAGEMENT
================================ */
router.get('/complaints', protect, adminOnly, getAllComplaints);
router.put('/complaints/:id/status', protect, adminOnly, updateComplaintStatus);

module.exports = router;
