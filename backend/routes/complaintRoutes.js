const express = require('express');
const router = express.Router();
const { createComplaint, getAllComplaints } = require('../controllers/complaintController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createComplaint);
router.get('/', protect, getAllComplaints);

module.exports = router;
