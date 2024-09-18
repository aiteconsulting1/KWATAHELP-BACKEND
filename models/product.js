const mongoose = require('mongoose')
const productSchema = mongoose.Schema({
    name: { type: String },
    description: { type: String },
    saller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    pays: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pays'
    },
    idQuartier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quartier'
    },
    price: {type: Number },
    images: { type: [String] },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
})

module.exports = mongoose.model('Product', productSchema)