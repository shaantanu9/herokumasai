// one to one shcema model for the user and the can user is take daily

const mongoose = require("mongoose");

const canSchema = new mongoose.Schema(
  {
    canGivenToUser: { type: Number, required: true },
    canTakenFromUser: { type: Number, required: true },
    dateCanGiven: { type: Date, default: Date.now, required: true },
    totalCanGiven: { type: Number, required: true, default: 0 },
    totalCanTaken: { type: Number, required: true, default: 0 },
    totalRemainingCan: { type: Number, required: true, default: 0 },
    day: { type: Number, default: ((new Date().getDay())+1), required: true },
    date: { type: Number, default: new Date().getDate(), required: true },
    month: { type: Number, default: ((new Date().getMonth())+1), required: true },
    year: { type: Number, default: new Date().getFullYear(), required: true },

    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true, versionKey: false }
);

Can = mongoose.model("Can", canSchema);
module.exports = Can;