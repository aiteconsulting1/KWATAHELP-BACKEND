const mongoose = require('mongoose')
const infoSchema = mongoose.Schema({
    name: { type: String },
    description: { type: String },
    requester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    idQuartier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quartier'
    },
    attachment: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
})

module.exports = mongoose.model('Info', infoSchema)