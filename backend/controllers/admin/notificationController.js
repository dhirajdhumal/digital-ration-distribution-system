const Notification = require('../../models/Notification');


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