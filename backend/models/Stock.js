const mongoose = require('mongoose');

const StockSchema = new mongoose.Schema({
  item: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  expiryDate: {
    type: Date,
    required: false,
  },
  batchNumber: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Virtual to check if stock is expired
StockSchema.virtual('isExpired').get(function() {
  if (!this.expiryDate) return false;
  return new Date() > this.expiryDate;
});

// Virtual to check if stock is expiring soon (within 30 days)
StockSchema.virtual('isExpiringSoon').get(function() {
  if (!this.expiryDate) return false;
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
  return new Date() < this.expiryDate && this.expiryDate < thirtyDaysFromNow;
});

StockSchema.set('toJSON', { virtuals: true });
StockSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Stock', StockSchema);
