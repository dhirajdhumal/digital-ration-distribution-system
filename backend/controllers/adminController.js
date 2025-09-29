// controllers/userController.js
const User = require('../models/User');
const Notification = require('../models/Notification');
const Stock = require('../models/Stock');
const Complaint = require('../models/Complaint');

// @desc    Create a new notification
exports.createNotification = async (req, res) => {
    try {
        const { notificationTitle, notificationBody } = req.body;

        const newNotification = new Notification({
            notificationTitle,
            notificationBody
        });

        const savedNotification = await newNotification.save();
        res.status(201).json(savedNotification);
    }catch (err) {
        res.status(500).json({error: err.message});
    }
};

// Get all notifications
exports.getAllNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find();
        res.status(200).json(notifications);
    }catch (err) {
        res.status(500).json({error: err.message});
    }
}


//Update a notification
exports.updateNotification = async (req, res) => {
    try {
        const updatedNotification = await Notification.findOneAndUpdate(
            { notificationId: req.params.id },
            req.body,
            { new: true, runValidators: true } // Return the updated document
        )
        res.status(200).json(updatedNotification);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}

// Delete a notification
exports.deleteNotification = async (req, res) => {
    try {
        const deletedNotification = await Notification.findOneAndDelete({
            notificationId: req.params.id
        })

        if(!deletedNotification) {
            return res.status(404).json({message: 'Notification not found'});
        }

        res.status(200).json({message: 'Notification deleted successfully'});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}

// Change User role to village-admin
exports.makeVillageAdmin = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Only change if role is "user"
    if (user.role !== 'user') {
      return res.status(400).json({ message: 'Only normal users can be made village admins' });
    }

    user.role = 'villageAdmin';
    await user.save();

    res.status(200).json({
      message: 'User promoted to Village Admin successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all Village Admins
// @desc    Get all Village Admins with allocated stock
exports.getVillageAdmins = async (req, res) => {
  try {
    const villageAdmins = await User.find({ role: 'villageAdmin' })
      .select('-password') // hide password
      .populate('allocatedStock.stockId', 'item unit price'); 
      // populate stock details: item, unit, price

    res.status(200).json(villageAdmins);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// @desc    Get all complaints (admin only)
exports.getAllComplaints = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }
        const complaints = await Complaint.find().populate('user', 'name email');
        res.status(200).json(complaints);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Create Stock (admin only)

exports.createStock = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }
        const { item, quantity, unit, price } = req.body;

        const newStock = new Stock({ item, quantity, unit, price });
        const savedStock = await newStock.save();
        res.status(201).json(savedStock);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
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

    const qtyToAdd = Number(quantity); // Ensure it's numeric

    // 1️⃣ Check stock exists
    const stock = await Stock.findById(stockId);
    if (!stock) return res.status(404).json({ message: "Stock item not found" });

    // 2️⃣ Check enough stock available
    if (stock.quantity < qtyToAdd) {
      return res.status(400).json({ message: "Not enough stock available" });
    }

    // 3️⃣ Find admin
    const admin = await User.findById(VillageAdminId);
    if (!admin || admin.role !== "villageAdmin") {
      return res.status(404).json({ message: "Village admin not found" });
    }

    // 4️⃣ Check if the stock is already allocated
    const existingAllocation = admin.allocatedStock.find(
      (s) => s.stockId.toString() === stockId
    );

    if (existingAllocation) {
      // ✅ Add new quantity to existing allocation
      existingAllocation.quantity += qtyToAdd;
      existingAllocation.unit = unit; // optional: update unit
    } else {
      // Add new allocation if not exists
      admin.allocatedStock.push({ stockId, quantity: qtyToAdd, unit });
    }

    // 5️⃣ Deduct from stock
    stock.quantity -= qtyToAdd;
    await stock.save();

    // 6️⃣ Save admin allocation
    await admin.save();

    res.status(200).json({
      message: "Stock allocated successfully",
      allocatedStock: existingAllocation || { stockId, quantity: qtyToAdd, unit },
      remainingStock: stock.quantity
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




