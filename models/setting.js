const mongoose = require('mongoose')
const settingSchema = mongoose.Schema({
    type: { type: String },
    price: { type: Number},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
})

module.exports = mongoose.model('Setting', settingSchema)