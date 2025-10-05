const Complaint = require('../models/Complaint');
const User = require('../models/User');
const Notification = require('../models/Notification');

// 🧾 Submit a new complaint
// @route   POST /api/user/complaints
// @access  Private
exports.createComplaint = async (req, res) => {
  const { title, description } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const complaint = new Complaint({
      user: userId,
      title,
      description,
    });

    await complaint.save();
    res.status(201).json(complaint);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// 🔔 Get a single notification by ID
// @route   GET /api/user/notifications/:id
// @access  Private
exports.getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.status(200).json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📋 Get all complaints of the logged-in user
// @route   GET /api/user/complaints/my
// @access  Private
exports.getComplaintsByUser = async (req, res) => {
  const userId = req.user.id;

  try {
    const complaints = await Complaint.find({ user: userId });
    res.status(200).json(complaints);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
