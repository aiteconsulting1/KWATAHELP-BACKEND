const mongoose = require('mongoose')

const paysSchema = mongoose.Schema({
    name: { type: String },
    code: { 
        type : String, 
        unique : true 
    },
    description: { type: String },
    totalOffer: { type: Number, default: 0 },
    totalPrestataire: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
})

paysSchema.methods.addPrestataire = function(action){
    if(action=='add') this.totalPrestataire++
    else if(this.totalPrestataire > 0){
        this.totalPrestataire--
    }
    return this.save().then(() => { return true }).catch(() => { return false })
}

paysSchema.methods.addOffer = function(action){
    if(action=='add') this.totalOffer++
    else if(this.totalOffer > 0){
        this.totalOffer--
    }
    return this.save().then(() => { return true }).catch((error) => { 
        return false 
    })
}


module.exports = mongoose.model('Pays', paysSchema)