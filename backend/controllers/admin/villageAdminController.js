const User = require('../../models/User');


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