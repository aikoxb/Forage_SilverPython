// Import Mongoose for MongoDB interaction
const mongoose = require("mongoose");

// Access the Schema constructor from Mongoose for defining data structure
const Schema = mongoose.Schema;

// Define schema for Order model
const orderSchema = new Schema({
    userId: {type: String, required: true },
    orderStatus: { type: String, required: true },
    deliveryName: { type: String, required: true },
    deliveryAddress: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    paymentStatus: { type: String, required: true },
    creationDate: { type: Date, required: true },
    products: [ {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        total: { type: Number, required: true },
    },],
});

//Export the Order model for use in controller
module.exports = mongoose.model('Order', orderSchema);