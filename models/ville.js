const mongoose = require('mongoose')

const villeSchema = mongoose.Schema({
    name: { type: String },
    description: { type: String },
    idPays: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pays'
    },
    idRegion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Region'
    },
    totalOffer: { type: Number, default: 0 },
    totalPrestataire: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
})

villeSchema.methods.addPrestataire = function(action){
    if(action=='add') this.totalPrestataire++
    else if(this.totalPrestataire > 0){
        this.totalPrestataire--
    }
    return this.save().then(() => { return true }).catch(() => { return false })
}

villeSchema.methods.addOffer = function(action){
    if(action=='add') this.totalOffer++
    else if(this.totalOffer > 0){
        this.totalOffer--
    }
    return this.save().then(() => { return true }).catch(() => { return false })
}

module.exports = mongoose.model('Ville', villeSchema)