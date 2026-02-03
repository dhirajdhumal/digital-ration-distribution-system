const User = require('../models/User');
const Stock = require('../models/Stock');

// Get village admin's allocated stocks
exports.getVillageAdminAllocatedStocks = async (req, res) => {
  try {
    const villageAdminId = req.user._id;
    
    const villageAdmin = await User.findById(villageAdminId)
      .populate('allocatedStock.stockId', 'item unit price');
    
    if (!villageAdmin) {
      return res.status(404).json({ message: 'Village admin not found' });
    }

    res.status(200).json(villageAdmin.allocatedStock);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Allocate stock to users
exports.allocateStockToUser = async (req, res) => {
  try {
    const villageAdminId = req.user._id;
    const { userId, stockId, quantity, unit } = req.body;
    const qtyToAdd = Number(quantity);

    // Get village admin's allocated stock
    const villageAdmin = await User.findById(villageAdminId);
    if (!villageAdmin) {
      return res.status(404).json({ message: 'Village admin not found' });
    }

    // Check if village admin has this stock
    const adminStock = villageAdmin.allocatedStock.find(
      (s) => s.stockId.toString() === stockId
    );

    if (!adminStock) {
      return res.status(404).json({ message: 'Stock not found in your allocation' });
    }

    if (adminStock.quantity < qtyToAdd) {
      return res.status(400).json({ message: 'Not enough stock available' });
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user || user.role !== 'user') {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if stock is already allocated to user
    let userAllocation = user.allocatedStock.find(
      (s) => s.stockId.toString() === stockId
    );

    if (userAllocation) {
      userAllocation.quantity += qtyToAdd;
      userAllocation.unit = unit;
      userAllocation.allocatedAt = new Date();
    } else {
      userAllocation = { stockId, quantity: qtyToAdd, unit };
      user.allocatedStock.push(userAllocation);
    }

    // Deduct from village admin's stock
    adminStock.quantity -= qtyToAdd;
    await villageAdmin.save();
    await user.save();

    res.status(200).json({
      message: 'Stock allocated to user successfully',
      allocatedStock: userAllocation,
      remainingStock: adminStock.quantity
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Allocate multiple stocks to user at once (Bulk Allocation)
exports.allocateStockToUserBulk = async (req, res) => {
  try {
    const villageAdminId = req.user._id;
    const { userId, allocations } = req.body;

    if (!allocations || allocations.length === 0) {
      return res.status(400).json({ message: 'No stock items to allocate' });
    }

    // Get village admin's allocated stock
    const villageAdmin = await User.findById(villageAdminId);
    if (!villageAdmin) {
      return res.status(404).json({ message: 'Village admin not found' });
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user || user.role !== 'user') {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify user is from same village
    if (user.village !== villageAdmin.village) {
      return res.status(403).json({ message: 'User is not from your village' });
    }

    // Validate all allocations first
    const validatedAllocations = [];
    for (const allocation of allocations) {
      const { stockId, quantity, unit } = allocation;
      const qtyToAdd = Number(quantity);

      if (!stockId || !qtyToAdd || qtyToAdd <= 0) {
        continue; // Skip invalid entries
      }

      // Check if village admin has this stock
      const adminStock = villageAdmin.allocatedStock.find(
        (s) => s.stockId.toString() === stockId
      );

      if (!adminStock) {
        return res.status(404).json({ 
          message: `Stock item not found in your allocation` 
        });
      }

      if (adminStock.quantity < qtyToAdd) {
        return res.status(400).json({ 
          message: `Not enough stock available for one of the items` 
        });
      }

      validatedAllocations.push({
        stockId,
        quantity: qtyToAdd,
        unit,
        adminStock
      });
    }

    if (validatedAllocations.length === 0) {
      return res.status(400).json({ message: 'No valid stock items to allocate' });
    }

    // Process all allocations
    const updatedStocks = [];
    for (const allocation of validatedAllocations) {
      const { stockId, quantity, unit, adminStock } = allocation;

      // Check if stock is already allocated to user
      let userAllocation = user.allocatedStock.find(
        (s) => s.stockId.toString() === stockId
      );

      if (userAllocation) {
        userAllocation.quantity += quantity;
        userAllocation.unit = unit;
        userAllocation.allocatedAt = new Date();
      } else {
        userAllocation = { stockId, quantity, unit };
        user.allocatedStock.push(userAllocation);
      }

      // Deduct from village admin's stock
      adminStock.quantity -= quantity;
      
      updatedStocks.push({
        stockId,
        remainingQuantity: adminStock.quantity
      });
    }

    await villageAdmin.save();
    await user.save();

    res.status(200).json({
      message: `Successfully allocated ${validatedAllocations.length} stock item(s) to user`,
      updatedStocks
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get users in village admin's area
exports.getVillageUsers = async (req, res) => {
  try {
    const villageAdminId = req.user._id;
    
    const villageAdmin = await User.findById(villageAdminId);
    if (!villageAdmin) {
      return res.status(404).json({ message: 'Village admin not found' });
    }

    // Get users from the same village with populated stock details
    const users = await User.find({ 
      role: 'user',
      village: villageAdmin.village 
    })
    .select('-password')
    .populate('allocatedStock.stockId', 'item unit price expiryDate batchNumber');

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
