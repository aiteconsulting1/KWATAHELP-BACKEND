const mongoose = require('mongoose')
const notificationSchema = mongoose.Schema({
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: Boolean,
        default: true
    },
    type: { type: String },
    message: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Notification', notificationSchema)