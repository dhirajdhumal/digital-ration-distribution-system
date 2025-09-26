const express = require('express');
const router = express.Router();
const { createComplaint, getComplaintsByUser, getNotificationById } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.post('/create-complaint', protect, createComplaint);
router.get('/notification/:id', getNotificationById);
router.get('/my-complaints', protect, getComplaintsByUser);

module.exports = router;
const multer = require('multer');
const upload = multer();    // Initialize multer for parsing multipart/form-data            