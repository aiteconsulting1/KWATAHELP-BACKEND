const mongoose = require('mongoose')
const missionSchema = mongoose.Schema({
    name: { type: String },
    description: { type: String },
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    images: { type: [String] },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
})

module.exports = mongoose.model('Mission', missionSchema)