const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const Order = require('../models/order');
const User = require("../models/users");

const createOrder = async (req, res, next) => {
    //checking validations
    const errors = validationResult(req);

    //display any error messages if data is invalid
    if(!errors.isEmpty()){
        console.log(errors);
        return next(new HttpError("Invalid Input, Please enter correct data!", 400));
    }

    //get order details from req body
    const { userId, orderStatus, deliveryName, deliveryAddress, paymentMethod, paymentStatus, products } = req.body;
    
    console.log("Received Data:", req.body);

    //check if user exists for order
    let existingUserId;
    try {
        existingUserId = await User.findById(userId);
    } catch (err) {
        return next(new HttpError("Cannot find user, Please try again later.", 500));
    }

    if (existingUserId.length == 0) {
        return next(new HttpError("User does not exist, please create order with a valid user", 422));
    }

    //set the creation date to current date/time
    const creationDate = new Date();

    //check that the products has at least 1 product in it
    if (!Array.isArray(products) || products.length === 0) {
        return next(new HttpError("Products are required and should be an array.", 400));
    }

    //auto-calculate the product totals so we don't have to enter it each time
    for (let i = 0; i < products.length; i++) {
        let product = products[i];
        product.total = product.quantity * product.price;
    }

    //create an order with all details
    const newOrder = new Order({ 
        userId,
        orderStatus, 
        deliveryName, 
        deliveryAddress, 
        paymentMethod, 
        paymentStatus, 
        creationDate, 
        products
    });
    
    //save order to mongodb
    try{
        await newOrder.save();
    }catch(err){
        return next(new HttpError("Failed to create order. Please try again.", 500));
    }

    res.status(201).json({order: newOrder.toObject({ getters : true })});
}

const getOrderById = async (req, res, next) => {
    //get order id from query
    const orderId = req.params.orderId;

    //get order information from mongodb
    let orderInfo;
    try{
        orderInfo = await Order.findById(orderId);
    }catch(err){
        return next(new HttpError("Fetching order failed, please try again.", 500));
    }

    //display error message if order doesnt exist
    if(!orderInfo){
        return next(new HttpError("Order not found.", 404));
    }

    res.json({ order: orderInfo.toObject({ getters: true })});
}

const updateOrder = async (req, res, next) => {
    //checking validations
    const errors = validationResult(req);

    //display any error messages if data is invalid
    if(!errors.isEmpty()){
        console.log(errors);
        return next(new HttpError("Invalid Input, Please enter correct data!", 400));
    }

    //assuming the only things to update on an order
    const { orderStatus, deliveryName, deliveryAddress, paymentMethod, paymentStatus, products } = req.body;

    //get order id from query
    const orderId = req.params.orderId;

    //check if order exist 
    let orderInfo;
    try{
        orderInfo = await Order.findById(orderId);
    }catch(err){
        return next(new HttpError("Fetching order failed, please try again.", 500));
    }

    //display error message if order doesnt exist
    if(!orderInfo){
        return next(new HttpError("Order not found.", 404));
    }

    if (userId){
        orderInfo.userId = userId;
    }

    if (orderStatus){
        orderInfo.orderStatus = orderStatus;
    }

    if (deliveryName){
        orderInfo.deliveryName = deliveryName;
    }

    if (deliveryAddress){
        orderInfo.deliveryAddress = deliveryAddress;
    }

    if (paymentMethod){
        orderInfo.paymentMethod = paymentMethod;
    }

    if (paymentStatus){
        orderInfo.paymentStatus = paymentStatus;
    }

    if (products && Array.isArray(products)) {
        orderInfo.products = [...orderInfo.products, ...products];
    }

    //update information into mongodb
    try{
        await orderInfo.save();
    }catch(err){
        return next(new HttpError("Something went wrong, could not update the order.", 500));
    }

    res.status(200).json({order: orderInfo.toObject({ getters : true })});
}

const deleteOrder = async (req, res, next) => {
    //get order id from query
    const orderId = req.params.orderId;

    //check if that order exist
    let orderInfo;
    try{
        orderInfo = await Order.findById(orderId);
    }catch(err){
        return next(new HttpError("Fetching order failed, please try again.", 500));
    }

    //display error message if order doesnt exist
    if(!orderInfo){
        return next(new HttpError("Order not found.", 404));
    }

    //detele the order if it exist
    try{
        await orderInfo.deleteOne();
    }catch(err){
        return next(new HttpError("Something went wrong, could not delete order.", 500));
    }

    res.status(200).json({ message: "Deleted the order successfully."});
}

const getOrdersByUserId = async (req, res, next) => {
    const userId = req.params.userId; 
  
    try {
      const orders = await Order.find({ userId });
  
      if (!orders || orders.length === 0) {
        return res.status(404).json({ message: "No orders found for this user." });
      }
  
      res.status(200).json({ orders: orders }); 
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Fetching orders failed, please try again." });
    }
};

exports.createOrder = createOrder;
exports.getOrderById = getOrderById;
exports.updateOrder = updateOrder;
exports.deleteOrder = deleteOrder;
exports.getOrdersByUserId = getOrdersByUserId;