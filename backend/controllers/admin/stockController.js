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



//get all stocks details
exports.getAllStocks = async (req, res) => {
    try {
        const stocks = await Stock.find();
        res.status(200).json(stocks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// get in list of stock items
exports.getStockItemsList = async (req, res) => {
    try {
        const items = await Stock.distinct("item");
        const units = await Stock.distinct("unit");
        const prices = await Stock.distinct("price");

        res.status(200).json({ items, units, prices });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.allocateStockToVillageAdmin = async (req, res) => {
  try {
    const { VillageAdminId, stockId, quantity, unit } = req.body;
    const qtyToAdd = Number(quantity); // ensure it's numeric

    // 1️⃣ Check if stock exists
    const stock = await Stock.findById(stockId);
    if (!stock) return res.status(404).json({ message: "Stock item not found" });

    // 2️⃣ Check if enough stock is available
    if (stock.quantity < qtyToAdd) {
      return res.status(400).json({ message: "Not enough stock available" });
    }

    // 3️⃣ Find village admin
    const admin = await User.findById(VillageAdminId);
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
