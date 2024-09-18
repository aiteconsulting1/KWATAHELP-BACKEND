const mongoose = require("mongoose");
const publiciteSchema = mongoose.Schema({
  name: { type: String },
  description: { type: String },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  quartiers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quartier",
    },
  ],
  number_user: Number,
  affected: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  image: { type: String },
  status: { type: Number, default: 0 },
  is_pay: { type: Boolean, default: false },
  pay_date: { type: Date },
  pay_token: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

publiciteSchema.methods.addUser = function (userId) {
    
  this.affected.push(userId);
  return this.save()
    .then((res) => {
      return true;
    })
    .catch((error) => {
      return false;
    });
};
module.exports = mongoose.model("Publicite", publiciteSchema);
