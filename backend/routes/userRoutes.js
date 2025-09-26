const express = require('express');
const router = express.Router();
const { getVillageAdmins } = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', protect, adminOnly, getVillageAdmins);

module.exports = router;