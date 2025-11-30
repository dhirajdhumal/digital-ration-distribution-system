const Stock = require('../../models/Stock');
const User = require('../../models/User');



exports.createStock = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { item, quantity, unit, price } = req.body;

    // Convert quantity to number
    const qtyToAdd = Number(quantity);
    if (isNaN(qtyToAdd) || qtyToAdd <= 0) {
      return res.status(400).json({ message: 'Quantity must be a positive number' });
    }

    // 1️⃣ Check if the stock item already exists (same item + unit + price)
    const existingStock = await Stock.findOne({ item, unit, price });

    if (existingStock) {
      // ✅ If exists, add the quantity
      existingStock.quantity += qtyToAdd;
      const updatedStock = await existingStock.save();
      return res.status(200).json({
        message: 'Stock quantity updated successfully',
        stock: updatedStock
      });
    }

    // 2️⃣ Otherwise, create a new stock
    const newStock = new Stock({ item, quantity: qtyToAdd, unit, price });
    const savedStock = await newStock.save();
    res.status(201).json({
      message: 'New stock created successfully',
      stock: savedStock
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

//update stock quantity
exports.updateStockQuantity = async (req, res) => {
  try{
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const { stockId } = req.params;
    const { quantity } = req.body;
    const qtyToUpdate = Number(quantity);
    if (isNaN(qtyToUpdate) || qtyToUpdate < 0) {
      return res.status(400).json({ message: 'Quantity must be a non-negative number' });
    }
    const stock = await Stock.findById(stockId);
    if (!stock) {
      return res.status(404).json({ message: 'Stock item not found' });
    }
    stock.quantity = qtyToUpdate;
    const updatedStock = await stock.save();
    res.status(200).json({
      message: 'Stock quantity updated successfully',
      stock: updatedStock
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


//get all stocks details
exports.getAllStocks = async (req, res) => {
    try {
        const stocks = await Stock.find({}, "_id item quantity unit price createdAt updatedAt");
        res.status(200).json(stocks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};



// Allocate stock to a normal user
exports.allocateStockToUser = async (req, res) => {
  try {
    const { userId, stockId, quantity, unit } = req.body;
    const qtyToAdd = Number(quantity); // ensure numeric

    // 1️⃣ Check if stock exists
    const stock = await Stock.findById(stockId);
    if (!stock) return res.status(404).json({ message: "Stock item not found" });

    // 2️⃣ Check if enough stock is available
    if (stock.quantity < qtyToAdd) {
      return res.status(400).json({ message: "Not enough stock available" });
    }

    // 3️⃣ Find the user
    const user = await User.findById(userId);
    if (!user || user.role !== "user") {
      return res.status(404).json({ message: "User not found" });
    }

    // 4️⃣ Check if stock is already allocated
    let allocation = user.allocatedStock.find(
      (s) => s.stockId.toString() === stockId
    );

    if (allocation) {
      // ✅ Update existing allocation
      allocation.quantity += qtyToAdd;
      allocation.unit = unit;
      allocation.allocatedAt = new Date();
    } else {
      // ✅ Add new allocation
      allocation = { stockId, quantity: qtyToAdd, unit };
      user.allocatedStock.push(allocation);
    }

    // 5️⃣ Deduct from stock
    stock.quantity -= qtyToAdd;
    await stock.save();

    // 6️⃣ Save user allocation
    await user.save();

    res.status(200).json({
      message: "Stock allocated to user successfully",
      allocatedStock: allocation,
      remainingStock: stock.quantity
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



exports.allocateStockToVillageAdmin = async (req, res) => {
  try {
    const { villageAdminId, stockId, quantity, unit } = req.body;
    const qtyToAdd = Number(quantity); // ensure it's numeric

    // 1️⃣ Check if stock exists
    const stock = await Stock.findById(stockId);
    if (!stock) return res.status(404).json({ message: "Stock item not found" });

    // 2️⃣ Check if enough stock is available
    if (stock.quantity < qtyToAdd) {
      return res.status(400).json({ message: "Not enough stock available" });
    }

    // 3️⃣ Find village admin
    const admin = await User.findById(villageAdminId);
    if (!admin || admin.role !== "villageAdmin") {
      return res.status(404).json({ message: "Village admin not found" });
    }

    // 4️⃣ Check if stock is already allocated
    let allocation = admin.allocatedStock.find(
      (s) => s.stockId.toString() === stockId
    );

    if (allocation) {
      // ✅ Update existing allocation
      allocation.quantity += qtyToAdd;
      allocation.unit = unit; // optional: update unit if needed
      allocation.allocatedAt = new Date();
    } else {
      // ✅ Add new allocation
      allocation = { stockId, quantity: qtyToAdd, unit };
      admin.allocatedStock.push(allocation);
    }

    // 5️⃣ Deduct from stock
    stock.quantity -= qtyToAdd;
    await stock.save();

    // 6️⃣ Save admin allocation
    await admin.save();

    res.status(200).json({
      message: "Stock allocated successfully",
      allocatedStock: allocation,
      remainingStock: stock.quantity
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Get all allocations (for admin dashboard)
exports.getAllAllocatedStocks = async (req, res) => {
  try {
    const admins = await User.find({ role: "villageAdmin" }).populate("allocatedStock.stockId", "item unit");

    const allocations = [];
    admins.forEach(admin => {
      admin.allocatedStock.forEach(stock => {
        allocations.push({
          villageAdminId: admin._id,
          villageAdminName: admin.name,
          stockItem: stock.stockId.item,
          quantity: stock.quantity,
          unit: stock.unit,
          allocatedAt: stock.allocatedAt,
        });
      });
    });

    res.json(allocations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch allocations" });
  }
};

