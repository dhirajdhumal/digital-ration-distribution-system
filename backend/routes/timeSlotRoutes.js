const express = require('express');
const router = express.Router();

const {
  createTimeSlot,
  getAllTimeSlots,
  getAvailableTimeSlots,
  bookTimeSlot,
  cancelBooking,
  getUserBooking,
  updateTimeSlot,
  deleteTimeSlot,
  assignUserToSlot,
  getVillageTimeSlots,
  removeUserFromSlot,
} = require('../controllers/timeSlotController');

const { protect, adminOnly, villageAdminOnly } = require('../middleware/authMiddleware');

// Admin/Village Admin routes
router.post('/create', protect, createTimeSlot);
router.get('/all', protect, getAllTimeSlots);
router.get('/village', protect, getVillageTimeSlots); // Get slots for village admin's village
router.put('/:id', protect, updateTimeSlot);
router.delete('/:id', protect, deleteTimeSlot);
router.post('/assign', protect, assignUserToSlot); // Manually assign user to slot
router.post('/remove', protect, removeUserFromSlot); // Remove user from slot

// User routes
router.get('/available', protect, getAvailableTimeSlots);
router.post('/book', protect, bookTimeSlot);
router.post('/cancel', protect, cancelBooking);
router.get('/my-booking', protect, getUserBooking);

module.exports = router;
