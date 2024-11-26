const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const Order = require('../models/order');

const createOrder = async (req, res, next) => {
    //checking validations
    const errors = validationResult(req);

    //display any error messages if data is invalid
    if(!errors.isEmpty()){
        console.log(errors);
        return next(new HttpError("Invalid Input, Please enter correct data!", 400));
    }

    //get order details from req body
    const { orderStatus, deliveryName, deliveryAddress, paymentMethod, paymentStatus, products } = req.body;

    //set the creation date to current date/time
    const creationDate = new Date();

    //check that the products has at least 1 product in it
    if (!Array.isArray(products) || products.length === 0) {
        return next(new HttpError("Products are required and should be an array.", 400));
    }

    //create an order with all details
    const newOrder = new Order({ 
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

    //assuming the only things to update on an order is the status
    const { orderStatus, paymentStatus } = req.body;

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

    if (orderStatus){
        orderInfo.orderStatus = orderStatus;
    }

    if (paymentStatus){
        orderInfo.paymentStatus = paymentStatus;
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

exports.createOrder = createOrder;
exports.getOrderById = getOrderById;
exports.updateOrder = updateOrder;
exports.deleteOrder = deleteOrder;