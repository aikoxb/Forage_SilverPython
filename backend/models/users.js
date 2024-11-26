//import mongoose
const mongoose = require("mongoose");

//define schema
const Schema = mongoose.Schema;

//define user schema
const userSchema = new Schema({
    name: { type: String, required : true },
    email: { type: String, required : true, unique: true },
    phone: { type: String, required: true},
    address: { type: String, required: true},
    password: { type: String, required: true, minlength: 6}
});

//export the user model
module.exports = mongoose.model('User', userSchema);