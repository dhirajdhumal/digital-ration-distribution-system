const mongoose = require('mongoose');

const TimeSlotSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  maxCapacity: {
    type: Number,
    required: true,
    default: 50,
  },
  currentBookings: {
    type: Number,
    default: 0,
  },
  village: {
    type: String,
    required: true,
  },
  bookedBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    bookedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  status: {
    type: String,
    enum: ['active', 'full', 'completed', 'cancelled'],
    default: 'active',
  },
}, { timestamps: true });

// Virtual to check if slot is available
TimeSlotSchema.virtual('isAvailable').get(function() {
  return this.currentBookings < this.maxCapacity && this.status === 'active';
});

// Virtual to get available slots
TimeSlotSchema.virtual('availableSlots').get(function() {
  return this.maxCapacity - this.currentBookings;
});

TimeSlotSchema.set('toJSON', { virtuals: true });
TimeSlotSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('TimeSlot', TimeSlotSchema);
