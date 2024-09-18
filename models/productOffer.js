const mongoose = require('mongoose')
const productOfferSchema = mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    saller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    price: { type: Number },
    is_pay: { type: Boolean, default: false },
    pay_date: { type: Date },
    pay_token: { type: String },
    status: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('ProductOffer', productOfferSchema)