const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

let userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: {
      type: String,
      unique: true,
    },
    unformatedPhone: String,
    type: String,
    pays: String,
    ville: String,
    adresse: String,
    code: Number,
    idQuartier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quartier",
    },
    image: {
      type: String,
      default: "/images/default-pp.png",
    },
    active: {
      type: Boolean,
      default: false,
    },
    isSaller: {
      type: Boolean,
      default: false,
    },
    becomeSallerAt: Date,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    latitude: String,
    longitude: String,
    description: String,
    domaines: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Category",
    },
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vip",
    },
    isVip: {
      type: Boolean,
      default: false,
    },
    subscriptionDate: Date,
    saller_pay_token: String,
    vip_pay_token: String,
    in_mission: {
      type: Boolean,
      default: false,
    },
    note: Number,
  },
  { timestamps: true }
);

userSchema.plugin(passportLocalMongoose, { usernameField: "phone" });

module.exports = mongoose.model("User", userSchema);
