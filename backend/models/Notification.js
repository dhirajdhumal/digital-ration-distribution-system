const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    notificationId: {
        type: String, 
        required: true, 
        unique: true,
        default: () => Date.now().toString()
    },
    notificationTitle: {
        type: String, 
        required: true 
    },
    notificationBody: { 
        type: String, 
        required: true
    }
})

module.exports = mongoose.model('Notification', NotificationSchema);