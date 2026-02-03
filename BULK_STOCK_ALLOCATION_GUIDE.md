# Bulk Stock Allocation Feature

## Overview
Village admins can now allocate multiple stock items (rice, oil, wheat, etc.) to a user at the same time, instead of allocating them one by one.

## Features

### Frontend (`frontend/src/pages/VillageAdmin/AllocateStock.jsx`)
- **Dynamic Form**: Add multiple stock items before submitting
- **Add/Remove Rows**: Easily add or remove stock items from the allocation
- **Individual Validation**: Each stock item shows available quantity and validates input
- **Bulk Submission**: All items are allocated in a single transaction

### Backend (`backend/controllers/villageAdminController.js`)
- **New Function**: `allocateStockToUserBulk`
- **Validation**: Checks all items before processing any allocation
- **Atomic Operation**: All items are allocated together or none at all
- **Stock Tracking**: Updates both village admin and user stock records

## How to Use

### For Village Admins:

1. **Navigate to Allocate Stock Page**
   - Go to Village Admin Dashboard → Allocate Stock

2. **Select User**
   - Choose the user from the dropdown

3. **Add Stock Items**
   - Select first stock item (e.g., Rice)
   - Enter quantity
   - Click "+ Add Another Stock Item" button
   - Select second stock item (e.g., Oil)
   - Enter quantity
   - Repeat for all items you want to allocate

4. **Remove Items** (Optional)
   - Click "Remove" button on any item to remove it from the list

5. **Submit**
   - Click "Allocate All Stock Items" button
   - All items will be allocated at once

## Example Allocation

**User**: John Doe

**Stock Items**:
- Rice: 10 kg
- Oil: 2 liters
- Wheat: 5 kg
- Sugar: 3 kg

All four items will be allocated to John Doe in a single operation.

## API Endpoint

**POST** `/api/village-admin/allocate-stock-bulk`

**Request Body**:
```json
{
  "userId": "user_id_here",
  "allocations": [
    {
      "stockId": "stock_id_1",
      "quantity": 10,
      "unit": "kg"
    },
    {
      "stockId": "stock_id_2",
      "quantity": 2,
      "unit": "liters"
    },
    {
      "stockId": "stock_id_3",
      "quantity": 5,
      "unit": "kg"
    }
  ]
}
```

**Response**:
```json
{
  "message": "Successfully allocated 3 stock item(s) to user",
  "updatedStocks": [
    {
      "stockId": "stock_id_1",
      "remainingQuantity": 90
    },
    {
      "stockId": "stock_id_2",
      "remainingQuantity": 18
    },
    {
      "stockId": "stock_id_3",
      "remainingQuantity": 45
    }
  ]
}
```

## Validation Rules

1. **User Validation**:
   - User must exist and have role 'user'
   - User must be from the same village as the village admin

2. **Stock Validation**:
   - All stock items must exist in village admin's allocation
   - Sufficient quantity must be available for each item
   - Quantity must be greater than 0

3. **Transaction Safety**:
   - All validations are performed before any allocation
   - If any item fails validation, no items are allocated
   - This ensures data consistency

## Benefits

1. **Time Saving**: Allocate all items at once instead of multiple submissions
2. **Better UX**: Clear interface showing all items being allocated
3. **Reduced Errors**: Single transaction reduces chance of partial allocations
4. **Flexibility**: Can allocate 1 item or 10+ items in the same operation
5. **Easy Management**: Add/remove items before submitting

## UI Features

- **Card-based Layout**: Each stock item in its own card
- **Item Numbering**: Clear numbering (Item #1, Item #2, etc.)
- **Remove Buttons**: Easy to remove unwanted items
- **Add Button**: Prominent button to add more items
- **Validation Feedback**: Shows max available quantity for each item
- **Disabled States**: Prevents invalid submissions

## Files Modified

1. `frontend/src/pages/VillageAdmin/AllocateStock.jsx` - Complete UI overhaul
2. `backend/controllers/villageAdminController.js` - Added `allocateStockToUserBulk` function
3. `backend/routes/villageAdminRoutes.js` - Added bulk allocation route

## Backward Compatibility

The original single-item allocation endpoint (`/allocate-stock`) is still available and functional. The new bulk endpoint is an addition, not a replacement.

## Testing Checklist

- [x] Add multiple stock items to form
- [x] Remove stock items from form
- [x] Allocate single item (should work)
- [x] Allocate multiple items (2-5 items)
- [x] Try to allocate more than available quantity (should fail)
- [x] Try to allocate to user from different village (should fail)
- [x] Verify stock quantities update correctly
- [x] Verify user receives all allocated items
- [x] Check that partial allocations don't occur on error

## Future Enhancements

- Add preset allocation templates (e.g., "Standard Monthly Ration")
- Show user's current stock before allocating
- Add allocation history/logs
- Export allocation reports
