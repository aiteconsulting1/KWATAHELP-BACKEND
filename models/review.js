const mongoose = require('mongoose')
const reviewSchema = mongoose.Schema({
    description: { type: String },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    note: { type: Number, default: 1 }
}, { timestamps: true })

module.exports = mongoose.model('Review', reviewSchema)