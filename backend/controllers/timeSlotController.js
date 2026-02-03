const TimeSlot = require('../models/TimeSlot');
const User = require('../models/User');

// @desc    Create time slot (Admin/Village Admin)
exports.createTimeSlot = async (req, res) => {
  try {
    const { date, startTime, endTime, maxCapacity, village } = req.body;

    // For village admin, use their village
    const slotVillage = req.user.role === 'villageAdmin' ? req.user.village : village;

    if (!slotVillage) {
      return res.status(400).json({ message: 'Village is required' });
    }

    // Check if slot already exists
    const existingSlot = await TimeSlot.findOne({
      date: new Date(date),
      startTime,
      endTime,
      village: slotVillage,
    });

    if (existingSlot) {
      return res.status(400).json({ message: 'Time slot already exists' });
    }

    const timeSlot = new TimeSlot({
      date: new Date(date),
      startTime,
      endTime,
      maxCapacity: maxCapacity || 50,
      village: slotVillage,
    });

    await timeSlot.save();
    res.status(201).json(timeSlot);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get all time slots
exports.getAllTimeSlots = async (req, res) => {
  try {
    const { village, date, status } = req.query;
    
    let query = {};
    
    if (village) query.village = village;
    if (status) query.status = status;
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      query.date = { $gte: startOfDay, $lte: endOfDay };
    }

    const timeSlots = await TimeSlot.find(query)
      .populate('bookedBy.user', 'name email')
      .sort({ date: 1, startTime: 1 });

    res.status(200).json(timeSlots);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get available time slots for user
exports.getAvailableTimeSlots = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user || !user.village) {
      return res.status(400).json({ message: 'User village not found' });
    }

    // Get future time slots for user's village
    const timeSlots = await TimeSlot.find({
      village: user.village,
      date: { $gte: new Date() },
      status: 'active',
    }).sort({ date: 1, startTime: 1 });

    // Filter available slots
    const availableSlots = timeSlots.filter(slot => 
      slot.currentBookings < slot.maxCapacity
    );

    res.status(200).json(availableSlots);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Book time slot (User)
exports.bookTimeSlot = async (req, res) => {
  try {
    const { timeSlotId } = req.body;
    const userId = req.user._id;

    const timeSlot = await TimeSlot.findById(timeSlotId);
    
    if (!timeSlot) {
      return res.status(404).json({ message: 'Time slot not found' });
    }

    // Check if slot is available
    if (timeSlot.currentBookings >= timeSlot.maxCapacity) {
      return res.status(400).json({ message: 'Time slot is full' });
    }

    if (timeSlot.status !== 'active') {
      return res.status(400).json({ message: 'Time slot is not available' });
    }

    // Check if slot date is in the past
    if (new Date(timeSlot.date) < new Date()) {
      return res.status(400).json({ message: 'Cannot book past time slots' });
    }

    // Check if user already booked this slot
    const alreadyBooked = timeSlot.bookedBy.some(
      booking => booking.user.toString() === userId.toString()
    );

    if (alreadyBooked) {
      return res.status(400).json({ message: 'You have already booked this slot' });
    }

    // Get user and check if they have an active booking
    const user = await User.findById(userId);
    if (user.bookedTimeSlot && user.bookedTimeSlot.status === 'booked') {
      return res.status(400).json({ 
        message: 'You already have an active booking. Cancel it first.' 
      });
    }

    // Add booking
    timeSlot.bookedBy.push({
      user: userId,
      bookedAt: new Date(),
    });
    timeSlot.currentBookings += 1;

    if (timeSlot.currentBookings >= timeSlot.maxCapacity) {
      timeSlot.status = 'full';
    }

    await timeSlot.save();

    // Update user's booking
    user.bookedTimeSlot = {
      timeSlotId: timeSlot._id,
      bookedAt: new Date(),
      status: 'booked',
    };
    await user.save();

    res.status(200).json({
      message: 'Time slot booked successfully',
      timeSlot,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Cancel time slot booking (User)
exports.cancelBooking = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user.bookedTimeSlot || !user.bookedTimeSlot.timeSlotId) {
      return res.status(400).json({ message: 'No active booking found' });
    }

    const timeSlot = await TimeSlot.findById(user.bookedTimeSlot.timeSlotId);
    
    if (!timeSlot) {
      return res.status(404).json({ message: 'Time slot not found' });
    }

    // Remove user from bookedBy array
    timeSlot.bookedBy = timeSlot.bookedBy.filter(
      booking => booking.user.toString() !== userId.toString()
    );
    timeSlot.currentBookings -= 1;

    if (timeSlot.status === 'full') {
      timeSlot.status = 'active';
    }

    await timeSlot.save();

    // Update user's booking status
    user.bookedTimeSlot.status = 'cancelled';
    await user.save();

    res.status(200).json({
      message: 'Booking cancelled successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get user's booking
exports.getUserBooking = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate('bookedTimeSlot.timeSlotId');

    if (!user.bookedTimeSlot || !user.bookedTimeSlot.timeSlotId) {
      return res.status(200).json({ booking: null });
    }

    res.status(200).json({
      booking: user.bookedTimeSlot,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update time slot (Admin/Village Admin)
exports.updateTimeSlot = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, startTime, endTime, maxCapacity, status } = req.body;

    const timeSlot = await TimeSlot.findById(id);
    
    if (!timeSlot) {
      return res.status(404).json({ message: 'Time slot not found' });
    }

    // For village admin, verify slot is from their village
    if (req.user.role === 'villageAdmin') {
      if (timeSlot.village !== req.user.village) {
        return res.status(403).json({ 
          message: 'You can only manage slots for your village' 
        });
      }
    }

    // Validate maxCapacity is not less than current bookings
    if (maxCapacity && maxCapacity < timeSlot.currentBookings) {
      return res.status(400).json({ 
        message: `Cannot set capacity below current bookings (${timeSlot.currentBookings})` 
      });
    }

    // Update fields if provided
    if (date) timeSlot.date = new Date(date);
    if (startTime) timeSlot.startTime = startTime;
    if (endTime) timeSlot.endTime = endTime;
    if (maxCapacity) {
      timeSlot.maxCapacity = maxCapacity;
      // Update status based on new capacity
      if (timeSlot.currentBookings >= maxCapacity) {
        timeSlot.status = 'full';
      } else if (timeSlot.status === 'full') {
        timeSlot.status = 'active';
      }
    }
    if (status) timeSlot.status = status;

    await timeSlot.save();
    
    // Populate bookedBy for consistent response
    await timeSlot.populate('bookedBy.user', 'name email');
    
    res.status(200).json(timeSlot);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Delete time slot (Admin)
exports.deleteTimeSlot = async (req, res) => {
  try {
    const { id } = req.params;

    const timeSlot = await TimeSlot.findById(id);
    
    if (!timeSlot) {
      return res.status(404).json({ message: 'Time slot not found' });
    }

    // Check if there are bookings
    if (timeSlot.currentBookings > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete time slot with active bookings' 
      });
    }

    await TimeSlot.findByIdAndDelete(id);
    res.status(200).json({ message: 'Time slot deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};


// @desc    Manually assign user to time slot (Admin/Village Admin)
exports.assignUserToSlot = async (req, res) => {
  try {
    const { timeSlotId, userId } = req.body;

    const timeSlot = await TimeSlot.findById(timeSlotId);
    
    if (!timeSlot) {
      return res.status(404).json({ message: 'Time slot not found' });
    }

    // Check if slot is available
    if (timeSlot.currentBookings >= timeSlot.maxCapacity) {
      return res.status(400).json({ message: 'Time slot is full' });
    }

    if (timeSlot.status !== 'active') {
      return res.status(400).json({ message: 'Time slot is not available' });
    }

    // Check if user already booked this slot
    const alreadyBooked = timeSlot.bookedBy.some(
      booking => booking.user.toString() === userId.toString()
    );

    if (alreadyBooked) {
      return res.status(400).json({ message: 'User already booked in this slot' });
    }

    // Get user and check if they have an active booking
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // For village admin, verify user is from their village
    if (req.user.role === 'villageAdmin') {
      if (user.village !== req.user.village) {
        return res.status(403).json({ 
          message: 'You can only assign users from your village' 
        });
      }
      if (timeSlot.village !== req.user.village) {
        return res.status(403).json({ 
          message: 'You can only manage slots for your village' 
        });
      }
    }

    // Cancel existing booking if any
    if (user.bookedTimeSlot && user.bookedTimeSlot.status === 'booked') {
      const oldSlot = await TimeSlot.findById(user.bookedTimeSlot.timeSlotId);
      if (oldSlot) {
        oldSlot.bookedBy = oldSlot.bookedBy.filter(
          booking => booking.user.toString() !== userId.toString()
        );
        oldSlot.currentBookings -= 1;
        if (oldSlot.status === 'full') {
          oldSlot.status = 'active';
        }
        await oldSlot.save();
      }
    }

    // Add booking
    timeSlot.bookedBy.push({
      user: userId,
      bookedAt: new Date(),
    });
    timeSlot.currentBookings += 1;

    if (timeSlot.currentBookings >= timeSlot.maxCapacity) {
      timeSlot.status = 'full';
    }

    await timeSlot.save();

    // Update user's booking
    user.bookedTimeSlot = {
      timeSlotId: timeSlot._id,
      bookedAt: new Date(),
      status: 'booked',
    };
    await user.save();

    res.status(200).json({
      message: 'User assigned to time slot successfully',
      timeSlot,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get time slots for village admin's village
exports.getVillageTimeSlots = async (req, res) => {
  try {
    const villageAdmin = await User.findById(req.user._id);
    
    if (!villageAdmin || !villageAdmin.village) {
      return res.status(400).json({ message: 'Village admin village not found' });
    }

    const timeSlots = await TimeSlot.find({
      village: villageAdmin.village,
    })
      .populate('bookedBy.user', 'name email')
      .sort({ date: 1, startTime: 1 });

    res.status(200).json(timeSlots);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Remove user from time slot (Admin/Village Admin)
exports.removeUserFromSlot = async (req, res) => {
  try {
    const { timeSlotId, userId } = req.body;

    const timeSlot = await TimeSlot.findById(timeSlotId);
    
    if (!timeSlot) {
      return res.status(404).json({ message: 'Time slot not found' });
    }

    // For village admin, verify slot is from their village
    if (req.user.role === 'villageAdmin') {
      if (timeSlot.village !== req.user.village) {
        return res.status(403).json({ 
          message: 'You can only manage slots for your village' 
        });
      }
    }

    // Remove user from bookedBy array
    const wasBooked = timeSlot.bookedBy.some(
      booking => booking.user.toString() === userId.toString()
    );

    if (!wasBooked) {
      return res.status(400).json({ message: 'User not found in this slot' });
    }

    timeSlot.bookedBy = timeSlot.bookedBy.filter(
      booking => booking.user.toString() !== userId.toString()
    );
    timeSlot.currentBookings -= 1;

    if (timeSlot.status === 'full') {
      timeSlot.status = 'active';
    }

    await timeSlot.save();

    // Update user's booking status
    const user = await User.findById(userId);
    if (user && user.bookedTimeSlot) {
      user.bookedTimeSlot.status = 'cancelled';
      await user.save();
    }

    res.status(200).json({
      message: 'User removed from time slot successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
