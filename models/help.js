const mongoose = require('mongoose')
const helpSchema = mongoose.Schema({
    description: { type: String },
    description_en: { type: String },
    type: { type: String }
}, { timestamps: true })

module.exports = mongoose.model('Help', helpSchema)