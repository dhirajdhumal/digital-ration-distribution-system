const User = require('../models/User');

// @desc    Get all Village Admins
exports.getVillageAdmins = async (req, res) => {
  try {
    const villageAdmins = await User.find({ role: 'villageAdmin' }).select('-password');
    res.json(villageAdmins);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

