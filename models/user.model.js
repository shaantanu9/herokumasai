const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    mobile: {type: Number, required: true},
    tc: {type: Boolean, required: true},
    role: {type: String, required: true, default: 'user'},
    canstaken: [{type: Date,default:Date.now, required: true}],
    // cansgiven: {type: Number, required: true},
    address: {type: String, required: true},
    advancedTaken: {type: Number, required: true},
    advancedGivenBacktoUser: {type: Number, required: true},
    dateAdvanceTaken: {type: Date, default: Date.now,required: true},
    dateAdvanceGivenBack: {type: Date}
},{timestamps: true, versionKey: false});

const User = mongoose.model('user', userSchema);

module.exports = User;
