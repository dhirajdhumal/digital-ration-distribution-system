const User = require('../../models/User');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    // Extract unique roles from users
    const roles = [...new Set(users.map((u) => u.role))].map((r) => ({ name: r }));

    res.status(200).json({
      users,
      roles
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// controllers/adminController.js
exports.makeVillageAdmin = async (req, res) => {
  const { userId, role } = req.body;  // receive role from frontend

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = role;  // assign role dynamically
    await user.save();

    res.status(200).json({ message: `User promoted to ${role}`, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
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