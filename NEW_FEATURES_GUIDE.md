# New Features Guide - Time Slot Scheduling & Expiry Date Tracking

## 🎉 Overview

Two major features have been added to the Digital Ration Distribution System:

1. **Time-Slot Scheduling** - Users can book collection time slots to avoid crowding
2. **Expiry Date Tracking** - Track stock expiry dates and get alerts for expiring items

---

## ⏰ Time-Slot Scheduling System

### Features

#### For Admins/Village Admins:
- Create time slots with date, time range, and capacity
- View all time slots with booking status
- Update time slot status (active, full, completed, cancelled)
- Delete time slots (only if no bookings exist)
- Monitor capacity and bookings in real-time

#### For Users:
- View available time slots for their village
- Book a time slot for ration collection
- View current booking details
- Cancel booking if needed
- Visual capacity indicators

### Database Schema

**TimeSlot Model:**
```javascript
{
  date: Date,              // Collection date
  startTime: String,       // e.g., "09:00"
  endTime: String,         // e.g., "10:00"
  maxCapacity: Number,     // Maximum users allowed
  currentBookings: Number, // Current number of bookings
  village: String,         // Village name
  bookedBy: [{
    user: ObjectId,        // Reference to User
    bookedAt: Date         // Booking timestamp
  }],
  status: String,          // active, full, completed, cancelled
}
```

**User Model Update:**
```javascript
{
  // ... existing fields
  bookedTimeSlot: {
    timeSlotId: ObjectId,  // Reference to TimeSlot
    bookedAt: Date,        // When booked
    status: String         // booked, completed, cancelled
  }
}
```

### API Endpoints

#### Admin/Village Admin Routes:
```
POST   /api/timeslots/create        - Create new time slot
GET    /api/timeslots/all           - Get all time slots
PUT    /api/timeslots/:id           - Update time slot
DELETE /api/timeslots/:id           - Delete time slot
```

#### User Routes:
```
GET    /api/timeslots/available     - Get available slots for user's village
POST   /api/timeslots/book          - Book a time slot
POST   /api/timeslots/cancel        - Cancel current booking
GET    /api/timeslots/my-booking    - Get user's current booking
```

### Frontend Pages

#### Admin - TimeSlots Management (`/admin/timeslots`)
- Create new time slots
- View all time slots in table format
- Update slot status
- Delete slots
- Color-coded status indicators

#### User - Time Slot Booking (`/user/timeslot-booking`)
- View available slots
- Visual capacity indicators (progress bars)
- Book slots with one click
- View current booking
- Cancel booking

### Usage Examples

#### Creating a Time Slot (Admin):
```javascript
POST /api/timeslots/create
{
  "date": "2024-02-15",
  "startTime": "09:00",
  "endTime": "10:00",
  "maxCapacity": 50,
  "village": "Village 1"
}
```

#### Booking a Slot (User):
```javascript
POST /api/timeslots/book
{
  "timeSlotId": "slot_id_here"
}
```

### Business Rules

1. **One Booking Per User**: Users can only have one active booking at a time
2. **Village-Based**: Users can only book slots for their village
3. **Capacity Management**: Slots automatically marked as "full" when capacity reached
4. **Past Slots**: Cannot book slots in the past
5. **Cancellation**: Users can cancel their booking anytime
6. **Deletion**: Admins can only delete slots with no bookings

---

## 📅 Expiry Date Tracking System

### Features

#### For Admins:
- Add expiry date when creating stock
- Add batch numbers for tracking
- View stocks expiring within 30 days
- View expired stocks
- Color-coded alerts (red for expired, orange for expiring soon)
- Days remaining/ago calculation

#### For Users:
- See expiry dates on allocated rations
- Visual indicators for expired/expiring items
- Batch number information

### Database Schema

**Stock Model Update:**
```javascript
{
  // ... existing fields
  expiryDate: Date,        // Optional expiry date
  batchNumber: String,     // Optional batch tracking
  
  // Virtual fields (calculated)
  isExpired: Boolean,      // true if past expiry date
  isExpiringSoon: Boolean  // true if expires within 30 days
}
```

### API Endpoints

```
GET /api/admin/stocks/expiring  - Get stocks expiring within 30 days
GET /api/admin/stocks/expired   - Get expired stocks
```

### Frontend Pages

#### Admin - Create Stock (Updated)
- Added expiry date field (optional)
- Added batch number field (optional)
- Date picker with minimum date validation

#### Admin - Expiring Stocks (`/admin/expiring-stocks`)
- Two sections: Expiring Soon & Expired
- Table view with color coding
- Days remaining/ago calculation
- Batch number display

#### User - Allocated Rations (Updated)
- Shows expiry date if available
- Color-coded status:
  - Red: EXPIRED
  - Orange: Expiring Soon
  - Green: Fresh
- Batch number display

### Usage Examples

#### Creating Stock with Expiry:
```javascript
POST /api/admin/stocks
{
  "item": "Rice",
  "quantity": 1000,
  "unit": "kg",
  "price": 50,
  "expiryDate": "2024-12-31",
  "batchNumber": "BATCH-2024-001"
}
```

#### Getting Expiring Stocks:
```javascript
GET /api/admin/stocks/expiring
// Returns stocks expiring within 30 days
```

### Visual Indicators

**Expiry Status Colors:**
- 🟢 Green: More than 30 days until expiry
- 🟠 Orange: 8-30 days until expiry
- 🔴 Red: Less than 7 days or expired

**Days Display:**
- "X days" - Days until expiry (orange/red)
- "X days ago" - Days since expired (red)

---

## 🚀 How to Use

### For Admins:

1. **Create Time Slots:**
   - Go to Admin Dashboard
   - Click "Manage Time Slots"
   - Fill in date, time, capacity, and village
   - Click "Create Time Slot"

2. **Monitor Bookings:**
   - View all slots in the table
   - See current bookings vs capacity
   - Update status as needed
   - Delete unused slots

3. **Create Stock with Expiry:**
   - Go to "Create Stock"
   - Fill in item details
   - Add expiry date (optional)
   - Add batch number (optional)
   - Click "Create Stock"

4. **Monitor Expiring Stocks:**
   - Go to "Expiring Stocks"
   - View stocks expiring soon (orange)
   - View expired stocks (red)
   - Take action to distribute or remove

### For Users:

1. **Book Collection Slot:**
   - Go to User Dashboard
   - Click "Book Collection Slot"
   - View available slots
   - Click "Book This Slot"
   - See confirmation

2. **View Booking:**
   - Your current booking shows at top
   - See date, time, and village
   - Cancel if needed

3. **Check Rations:**
   - Go to "Your Allocated Rations"
   - See expiry dates (if available)
   - Check color indicators
   - Plan collection accordingly

---

## 📊 Benefits

### Time-Slot Scheduling:
- ✅ Reduces crowding at distribution centers
- ✅ Better queue management
- ✅ Improved user experience
- ✅ Efficient resource allocation
- ✅ Real-time capacity tracking

### Expiry Date Tracking:
- ✅ Prevents distribution of expired items
- ✅ Better inventory management
- ✅ Reduces waste
- ✅ Ensures food safety
- ✅ Batch tracking for recalls

---

## 🔧 Technical Implementation

### Backend:
- New TimeSlot model with virtuals
- Updated Stock model with expiry fields
- New timeSlotController with 8 functions
- New timeSlotRoutes with 7 endpoints
- Updated stockController with expiry queries

### Frontend:
- 3 new pages (TimeSlots, TimeSlotBooking, ExpiringStocks)
- Updated CreateStock with expiry fields
- Updated AllocatedRations with expiry display
- Updated dashboards with new navigation
- Color-coded visual indicators

### Database:
- TimeSlot collection
- User.bookedTimeSlot field
- Stock.expiryDate field
- Stock.batchNumber field

---

## 🎯 Future Enhancements

### Time-Slot System:
- SMS/Email reminders before slot time
- QR code for slot verification
- Recurring time slots
- Slot preferences based on history
- Waitlist for full slots

### Expiry Tracking:
- Automatic notifications for expiring stocks
- First-expiry-first-out (FEFO) allocation
- Expiry reports and analytics
- Integration with supplier systems
- Barcode scanning for batch entry

---

## 📝 Testing Checklist

### Time-Slot Scheduling:
- [ ] Admin can create time slots
- [ ] User can view available slots
- [ ] User can book a slot
- [ ] User cannot book multiple slots
- [ ] User can cancel booking
- [ ] Slot marked full when capacity reached
- [ ] Cannot book past slots
- [ ] Village-based filtering works
- [ ] Status updates work
- [ ] Delete works (only for empty slots)

### Expiry Date Tracking:
- [ ] Can create stock with expiry date
- [ ] Can create stock without expiry date
- [ ] Expiring stocks show correctly
- [ ] Expired stocks show correctly
- [ ] Color coding works
- [ ] Days calculation accurate
- [ ] Batch numbers display
- [ ] User sees expiry on rations
- [ ] Visual indicators work

---

## 🐛 Known Limitations

1. **Time Zones**: Currently uses server time zone
2. **Slot Conflicts**: No automatic conflict detection for overlapping times
3. **Capacity Changes**: Changing capacity doesn't affect existing bookings
4. **Expiry Alerts**: No automatic notifications (manual check required)
5. **Batch Management**: Basic tracking only, no advanced features

---

## 📞 Support

For issues or questions:
1. Check this guide
2. Review API documentation
3. Check browser console for errors
4. Verify database entries
5. Check backend logs

---

**Last Updated:** February 3, 2026  
**Version:** 2.0.0  
**Status:** ✅ COMPLETE
