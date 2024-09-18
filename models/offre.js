const mongoose = require('mongoose')
const offreSchema = mongoose.Schema({
    name: { type: String },
    range: { type: String },
    price: { type: Number },
    description: { type: String },
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    requester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    attachment: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
    is_accept: { type: Number },
    status: { type: Number }
})

module.exports = mongoose.model('Offre', offreSchema)