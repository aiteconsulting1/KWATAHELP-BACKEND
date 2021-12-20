const mongoose = require('mongoose')

const categorySchema = mongoose.Schema({
    name: { type: String },
    description: { type: String },
    parentId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Category' 
    },
    totalOffer: { type: Number, default: 0 },
    totalPrestataire: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
})

categorySchema.methods.addPrestataire = function(action){
    if(action=='add') this.totalPrestataire++
    else if(this.totalPrestataire > 0){
        this.totalPrestataire--
    }
    return this.save().then(() => { return true }).catch(() => { return false })
}

categorySchema.methods.addOffer = function(action){
    if(action=='add') this.totalOffer++
    else if(this.totalOffer > 0){
        this.totalOffer--
    }
    return this.save().then(() => { return true }).catch(() => { return false })
}

module.exports =  mongoose.model('Category', categorySchema)