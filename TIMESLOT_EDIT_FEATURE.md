# Time Slot Edit/Update Feature

## Overview
Added comprehensive edit functionality for time slots in both Admin and Village Admin interfaces.

## Features Added

### 1. Backend Updates (`backend/controllers/timeSlotController.js`)
- **Enhanced `updateTimeSlot` function** to accept and update:
  - `date` - Change the date of the time slot
  - `startTime` - Modify start time
  - `endTime` - Modify end time
  - `maxCapacity` - Update maximum capacity
  - `status` - Change slot status
  
- **Validation**:
  - Prevents setting capacity below current bookings
  - Village admin can only edit slots from their village
  - Automatically updates status to 'full' or 'active' based on capacity changes

### 2. Admin Time Slots Page (`frontend/src/pages/Admin/TimeSlots.jsx`)
- **Edit Mode UI**:
  - Click "Edit" button to enter edit mode
  - Yellow background (#fff9e6) indicates editing state
  - Edit form includes: date, start time, end time, max capacity, village
  - "Save Changes" and "Cancel" buttons
  
- **Features**:
  - Inline editing within the time slot card
  - Minimum capacity validation (cannot be less than current bookings)
  - Shows booked users table in view mode
  - Status dropdown for quick status changes
  - Delete button (disabled if there are bookings)

### 3. Village Admin Time Slots Page (`frontend/src/pages/VillageAdmin/TimeSlots.jsx`)
- **Same Edit Functionality** as Admin page
- **Additional Features**:
  - Filtered to show only village admin's village slots
  - User assignment functionality
  - Remove user from slot functionality
  - Shows available users count

## How to Use

### For Admins:
1. Navigate to Admin Dashboard → Manage Time Slots
2. Find the time slot you want to edit
3. Click the "Edit" button
4. Modify any fields (date, time, capacity, village)
5. Click "Save Changes" or "Cancel"

### For Village Admins:
1. Navigate to Village Admin Dashboard → Manage Time Slots
2. Find the time slot you want to edit
3. Click the "Edit" button
4. Modify any fields (date, time, capacity)
5. Click "Save Changes" or "Cancel"

## Validation Rules

1. **Max Capacity**: Cannot be set below current number of bookings
2. **Date**: Cannot select past dates (minimum is today)
3. **Village Admin**: Can only edit slots from their own village
4. **Status**: Automatically updated based on capacity:
   - If bookings >= capacity → status becomes 'full'
   - If bookings < capacity and status was 'full' → status becomes 'active'

## API Endpoint

**PUT** `/api/timeslots/:id`

**Request Body**:
```json
{
  "date": "2024-12-25",
  "startTime": "10:00",
  "endTime": "12:00",
  "maxCapacity": 100,
  "status": "active"
}
```

**Response**:
```json
{
  "_id": "...",
  "date": "2024-12-25T00:00:00.000Z",
  "startTime": "10:00",
  "endTime": "12:00",
  "maxCapacity": 100,
  "currentBookings": 45,
  "status": "active",
  "village": "Village Name",
  "bookedBy": [...]
}
```

## Security

- Village admins can only edit slots from their own village
- Admins can edit any time slot
- Capacity cannot be reduced below current bookings
- All changes are validated on the backend

## UI/UX Improvements

1. **Visual Feedback**: Yellow background during edit mode
2. **Clear Actions**: Separate "Save" and "Cancel" buttons
3. **Validation Messages**: Shows minimum capacity requirements
4. **Consistent Layout**: Same edit experience across Admin and Village Admin
5. **Booked Users Display**: Shows who has booked the slot (in view mode)

## Files Modified

1. `backend/controllers/timeSlotController.js` - Enhanced updateTimeSlot function
2. `frontend/src/pages/Admin/TimeSlots.jsx` - Added edit functionality
3. `frontend/src/pages/VillageAdmin/TimeSlots.jsx` - Already had edit functionality (now complete)

## Testing Checklist

- [x] Edit date of time slot
- [x] Edit start and end times
- [x] Edit max capacity (above current bookings)
- [x] Try to set capacity below bookings (should fail)
- [x] Cancel edit operation
- [x] Save changes successfully
- [x] Village admin can only edit their village slots
- [x] Admin can edit any slot
- [x] Status updates automatically based on capacity
