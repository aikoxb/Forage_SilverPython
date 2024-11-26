// Import Mongoose for MongoDB interaction
const mongoose = require("mongoose");

// Access the Schema constructor from Mongoose for defining data structure
const Schema = mongoose.Schema;

// Define schema for Order model
const orderSchema = new Schema({
    orderStatus: { type: String, required: true },
    deliveryName: { type: String, required: true },
    deliveryAddress: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    paymentStatus: { type: String, required: true },
    creationDate: { type: Date, required: true }
});

// Define schema for product model
const productSchema = new Schema({
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
});

//Export the Order model for use in controller
module.exports = mongoose.model('Order', orderSchema);
module.exports = mongoose.model('Product', productSchema);