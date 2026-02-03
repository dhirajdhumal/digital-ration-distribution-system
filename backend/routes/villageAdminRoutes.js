const express = require('express');
const router = express.Router();

const {
  getVillageAdminAllocatedStocks,
  allocateStockToUser,
  allocateStockToUserBulk,
  getVillageUsers
} = require('../controllers/villageAdminController');

const { protect, villageAdminOnly } = require('../middleware/authMiddleware');

// Get village admin's allocated stocks
router.get('/allocated-stocks', protect, villageAdminOnly, getVillageAdminAllocatedStocks);

// Allocate stock to users (single item)
router.post('/allocate-stock', protect, villageAdminOnly, allocateStockToUser);

// Allocate multiple stocks to user at once (bulk)
router.post('/allocate-stock-bulk', protect, villageAdminOnly, allocateStockToUserBulk);

// Get users in village admin's area
router.get('/users', protect, villageAdminOnly, getVillageUsers);

module.exports = router;
