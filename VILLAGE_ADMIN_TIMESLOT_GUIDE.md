# Village Admin Time Slot Management Guide

## 🎯 Overview

Village Admins can now create and manage time slots for their village, and manually assign users to specific slots. This gives them full control over ration collection scheduling for their area.

## ✨ New Features for Village Admin

### 1. Create Time Slots
- Create time slots specifically for their village
- Set date, time range, and capacity
- Village is automatically set to their assigned village

### 2. View All Slots
- See all time slots for their village
- View booking status and capacity
- See list of users booked in each slot

### 3. Manually Assign Users
- Select any user from their village
- Assign them to a specific time slot
- System automatically handles:
  - Capacity checks
  - Duplicate booking prevention
  - Moving users from old slots

### 4. Remove Users from Slots
- Remove users from time slots if needed
- Frees up capacity for other users
- Updates user's booking status

### 5. Delete Time Slots
- Delete slots that have no bookings
- Cannot delete slots with active bookings

## 🔧 Backend Implementation

### New API Endpoints:

```
POST   /api/timeslots/assign         - Assign user to slot
POST   /api/timeslots/remove         - Remove user from slot
GET    /api/timeslots/village        - Get slots for village admin's village
```

### New Controller Functions:

1. **assignUserToSlot** - Manually assign a user to a time slot
   - Validates capacity
   - Checks village permissions
   - Handles existing bookings
   - Updates both slot and user records

2. **removeUserFromSlot** - Remove a user from a time slot
   - Validates permissions
   - Updates capacity
   - Cancels user's booking

3. **getVillageTimeSlots** - Get all slots for village admin's village
   - Filters by village
   - Populates user details
   - Sorted by date and time

### Security Features:

- ✅ Village admins can only manage slots for their village
- ✅ Village admins can only assign users from their village
- ✅ Automatic village validation
- ✅ Capacity enforcement
- ✅ Duplicate booking prevention

## 🎨 Frontend Implementation

### New Page: Village Admin Time Slots

**Location:** `/village-admin/timeslots`

**Features:**

1. **Create Time Slot Section**
   - Date picker (future dates only)
   - Time range inputs
   - Capacity input
   - Village auto-filled

2. **Assign User Section**
   - Dropdown of available slots
   - Dropdown of village users
   - One-click assignment

3. **Slots List Section**
   - Card view of all slots
   - Status indicators
   - Capacity progress
   - Booked users table
   - Remove user buttons
   - Delete slot button

## 📋 Usage Examples

### Creating a Time Slot:

1. Login as Village Admin
2. Go to Dashboard → "Manage Time Slots"
3. Fill in the form:
   - Date: 2024-02-15
   - Start Time: 09:00
   - End Time: 10:00
   - Max Capacity: 50
4. Click "Create Time Slot"

### Assigning a User:

1. In the "Assign User to Time Slot" section
2. Select a time slot from dropdown
3. Select a user from dropdown
4. Click "Assign User to Slot"
5. User is immediately assigned

### Removing a User:

1. Find the time slot in the list
2. Locate the user in the "Booked Users" table
3. Click "Remove" button next to their name
4. Confirm the action

## 🔄 Workflow

### Typical Village Admin Workflow:

```
1. Create Time Slots
   ↓
2. View Village Users
   ↓
3. Assign Users to Slots
   ↓
4. Monitor Bookings
   ↓
5. Adjust as Needed (Remove/Reassign)
   ↓
6. Mark Slots as Completed
```

## 🎯 Business Rules

### Assignment Rules:
- ✅ User can only be in one active slot at a time
- ✅ Assigning to new slot cancels old booking
- ✅ Cannot assign to full slots
- ✅ Cannot assign to inactive slots
- ✅ Cannot assign users from other villages

### Deletion Rules:
- ✅ Can only delete slots with no bookings
- ✅ Cannot delete slots with active users
- ✅ Can only delete slots from own village

### Capacity Rules:
- ✅ Slot marked "full" when capacity reached
- ✅ Slot marked "active" when space available
- ✅ Real-time capacity updates

## 📊 Benefits

### For Village Admins:
- ✅ Full control over local scheduling
- ✅ Can prioritize certain users
- ✅ Better crowd management
- ✅ Flexibility to adjust bookings
- ✅ Clear visibility of all bookings

### For Users:
- ✅ Can still self-book if preferred
- ✅ Village admin can help those without tech access
- ✅ Guaranteed slot assignment
- ✅ Better organization

### For System:
- ✅ Distributed management
- ✅ Reduced admin workload
- ✅ Village-level autonomy
- ✅ Better scalability

## 🔍 API Examples

### Assign User to Slot:
```javascript
POST /api/timeslots/assign
{
  "timeSlotId": "slot_id_here",
  "userId": "user_id_here"
}

Response:
{
  "message": "User assigned to time slot successfully",
  "timeSlot": { ... }
}
```

### Remove User from Slot:
```javascript
POST /api/timeslots/remove
{
  "timeSlotId": "slot_id_here",
  "userId": "user_id_here"
}

Response:
{
  "message": "User removed from time slot successfully"
}
```

### Get Village Time Slots:
```javascript
GET /api/timeslots/village

Response:
[
  {
    "_id": "slot_id",
    "date": "2024-02-15",
    "startTime": "09:00",
    "endTime": "10:00",
    "maxCapacity": 50,
    "currentBookings": 25,
    "village": "Village 1",
    "bookedBy": [
      {
        "user": {
          "_id": "user_id",
          "name": "John Doe",
          "email": "john@example.com"
        },
        "bookedAt": "2024-02-10T10:30:00.000Z"
      }
    ],
    "status": "active"
  }
]
```

## 🧪 Testing Checklist

- [ ] Village admin can create time slots
- [ ] Village admin can view their village's slots
- [ ] Village admin can assign users to slots
- [ ] Village admin can remove users from slots
- [ ] Village admin can delete empty slots
- [ ] Village admin cannot manage other villages' slots
- [ ] Village admin cannot assign users from other villages
- [ ] Capacity is enforced correctly
- [ ] User's old booking is cancelled when reassigned
- [ ] Status updates correctly (active/full)
- [ ] Cannot delete slots with bookings

## 🚨 Common Issues & Solutions

### Issue: "You can only assign users from your village"
**Solution:** Ensure the user belongs to the same village as the village admin.

### Issue: "Time slot is full"
**Solution:** Remove a user first or create a new slot.

### Issue: "User already booked in this slot"
**Solution:** User is already assigned. No action needed.

### Issue: Cannot delete slot
**Solution:** Remove all users from the slot first, then delete.

## 📱 UI Features

### Visual Indicators:
- 🟢 Green: Active slots with space
- 🟠 Orange: Full slots
- 🔵 Blue: Completed slots
- 🔴 Red: Cancelled slots

### Interactive Elements:
- Dropdown filters for easy selection
- One-click assignment
- Confirmation dialogs for deletions
- Real-time capacity updates
- Responsive table layout

## 🎓 Best Practices

1. **Create Slots in Advance**
   - Plan slots for the week ahead
   - Consider peak times

2. **Monitor Capacity**
   - Check slot utilization
   - Create additional slots if needed

3. **Communicate with Users**
   - Inform users of their assigned slots
   - Provide alternative contact methods

4. **Regular Updates**
   - Mark completed slots
   - Remove no-shows if needed

5. **Backup Planning**
   - Have extra slots ready
   - Be flexible with assignments

## 🔮 Future Enhancements

- SMS notifications when assigned
- Bulk user assignment
- Recurring time slots
- Slot templates
- Analytics dashboard
- Export booking lists
- QR code generation

---

**Status:** ✅ COMPLETE  
**Last Updated:** February 3, 2026  
**Version:** 2.1.0
