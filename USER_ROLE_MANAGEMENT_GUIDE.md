# User Role Management Guide

## 🎯 Overview

Admins can now manage user roles bidirectionally - promoting users to Village Admin and demoting Village Admins back to regular users.

## ✨ New Features

### 1. **Promote User to Village Admin**
- Select any regular user
- Change their role to "Village Admin"
- They gain access to village-level management features

### 2. **Demote Village Admin to User**
- Select any village admin
- Change their role back to "User"
- They lose village admin privileges

### 3. **View All Users by Role**
- See all Village Admins in one table
- See all Regular Users in another table
- Easy overview of role distribution

## 📋 How to Use

### Promoting a User:

1. Go to Admin Dashboard
2. Click "Manage User Roles"
3. In the dropdown, select a user (shows current role)
4. Select "Village Admin" as the new role
5. Click "Change Role"
6. User is now promoted ✅

### Demoting a Village Admin:

1. Go to Admin Dashboard
2. Click "Manage User Roles"
3. In the dropdown, select a village admin (shows current role)
4. Select "User" as the new role
5. Click "Change Role"
6. Village Admin is now demoted to regular user ✅

## 🎨 UI Features

### Smart Dropdown:
- Shows all users (both regular and village admins)
- Displays current role next to each name
- Format: `Name (Village) - Current: Role`

### Role Selection:
- Two options: "User" or "Village Admin"
- Clear labels for easy selection

### Visual Feedback:
- Success message when role changed
- Error message if same role selected
- Auto-hide messages after 3 seconds

### User Tables:
- **Village Admins Table** (Blue theme)
  - Shows all current village admins
  - Displays name, email, village
  
- **Regular Users Table** (Green theme)
  - Shows all regular users
  - Displays name, email, village

## 🔒 Security & Validation

### Validations:
- ✅ Cannot assign same role user already has
- ✅ Must select both user and role
- ✅ Backend validates role changes
- ✅ Only admins can change roles

### What Happens When Demoting:
- ❌ Loses access to village admin dashboard
- ❌ Cannot create time slots
- ❌ Cannot assign users to slots
- ❌ Cannot allocate stock to users
- ✅ Keeps their user account
- ✅ Can still book time slots as regular user
- ✅ Can still view allocated rations

### What Happens When Promoting:
- ✅ Gains access to village admin dashboard
- ✅ Can create time slots for their village
- ✅ Can assign users to slots
- ✅ Can allocate stock to users in their village
- ✅ Keeps all their previous data

## 📊 Use Cases

### When to Promote:
- User is trusted and responsible
- Need local management in a village
- Want to distribute admin workload
- User has good knowledge of their village

### When to Demote:
- Village admin is no longer active
- Village admin role no longer needed
- Consolidating management
- User requested to step down

## 🔄 Backend API

### Endpoint:
```
POST /api/admin/make-village-admin
```

### Request Body:
```json
{
  "userId": "user_id_here",
  "role": "villageAdmin"  // or "user"
}
```

### Response:
```json
{
  "message": "User promoted to villageAdmin",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "villageAdmin",
    "village": "Village 1"
  }
}
```

## 📝 Example Scenarios

### Scenario 1: Promoting a User
```
1. Admin selects "John Doe (Village 1) - Current: User"
2. Admin selects "Village Admin" role
3. Clicks "Change Role"
4. ✅ John is now Village Admin
5. John can now manage Village 1
```

### Scenario 2: Demoting a Village Admin
```
1. Admin selects "Jane Smith (Village 2) - Current: Village Admin"
2. Admin selects "User" role
3. Clicks "Change Role"
4. ✅ Jane is now a regular User
5. Jane loses village admin access
```

### Scenario 3: Trying to Assign Same Role
```
1. Admin selects "Bob (Village 3) - Current: User"
2. Admin selects "User" role (same as current)
3. Clicks "Change Role"
4. ❌ Error: "User already has this role"
```

## 🎯 Best Practices

1. **Review Before Changing**
   - Check user's current role in dropdown
   - Confirm you're selecting the right role
   - Verify the user's village

2. **Communicate Changes**
   - Inform users when promoting them
   - Explain new responsibilities
   - Provide training if needed

3. **Monitor Activity**
   - Check village admin performance
   - Review their actions regularly
   - Demote if necessary

4. **Keep Records**
   - Note why roles were changed
   - Track promotion/demotion dates
   - Document any issues

## 🔍 Troubleshooting

### Issue: "User already has this role"
**Solution:** Check the current role in the dropdown. Select a different role.

### Issue: Cannot find user in dropdown
**Solution:** User might be an admin. Only regular users and village admins appear.

### Issue: Role change not reflecting
**Solution:** 
1. Refresh the page
2. Check if user logs out and logs back in
3. Verify in database

### Issue: Demoted user still has access
**Solution:** User needs to logout and login again for role change to take effect.

## ✅ Testing Checklist

- [ ] Can promote user to village admin
- [ ] Can demote village admin to user
- [ ] Cannot assign same role
- [ ] Dropdown shows current roles
- [ ] Success message appears
- [ ] User list refreshes after change
- [ ] Tables show correct users by role
- [ ] Promoted user gains access
- [ ] Demoted user loses access

---

**Status:** ✅ COMPLETE  
**Last Updated:** February 3, 2026  
**Version:** 2.2.0
