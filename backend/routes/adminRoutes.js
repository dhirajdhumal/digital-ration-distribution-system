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
  getAllStocks,
  getAllAllocatedStocks,
  allocateStockToUser,
  getAllUserAllocatedStocks
} = require('../controllers/admin/stockController');

const {
  getAllComplaints
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

router.post('/stocks/allocate', protect, allocateStockToVillageAdmin);
router.post('/stocks/allocate/users', protect, allocateStockToUser);
// Get all allocations
router.get("/allocated-stocks", protect,  getAllAllocatedStocks);
router.get("/allocated-stocks/users", protect,  getAllAllocatedStocks);

/* ================================
   🧾 COMPLAINT MANAGEMENT
================================ */
router.get('/complaints', protect, adminOnly, getAllComplaints);

module.exports = router;
