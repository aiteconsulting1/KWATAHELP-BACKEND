const mongoose = require('mongoose')
const messageSchema = mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    discussion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Discussion'
    },
    message: { type: String },
    image: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Message', messageSchema)