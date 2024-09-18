const mongoose = require('mongoose')
const vipSchema = mongoose.Schema({
    name: { type: String },
    description: { type: String },
    description_en: { type: String },
    duration: { type: Number},
    price: { type: Number},
    abonnes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
})
vipSchema.methods.addAbonne = function(action){
    if(action && !this.abonnes.includes(action)) this.abonnes.push(action);
    return this.save().then(() => { return true }).catch(() => { return false })
}

module.exports = mongoose.model('Vip', vipSchema)