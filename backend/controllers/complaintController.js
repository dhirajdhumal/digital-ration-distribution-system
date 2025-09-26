const Complaint = require('../models/Complaint');
const User = require('../models/User');


// @desc    Submit a new complaint
// @route   POST /api/complaints
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
            description
        });
        await complaint.save();
        res.status(201).json(complaint);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all complaints (admin only)
// @route   GET /api/complaints
// @access  Private/Admin
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