const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')
const {ObjectId} = mongoose.Schema.Types

let userSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: { 
        type : String, 
        unique : true 
    },
    unformatedPhone: String,
    type: String,
    pays: String,
    ville: String,
    adresse: String,
    code: Number,
    idQuartier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quartier'
    },
    image: {
        type: String,
        default: "/images/default-pp.png"
    },
    active: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        select: false
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    latitude: String,
    longitude: String
},{timestamps:true})

userSchema.plugin(passportLocalMongoose, {usernameField: 'phone'})

module.exports = mongoose.model('User', userSchema)