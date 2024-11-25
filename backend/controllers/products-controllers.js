const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const Product = require('../models/product');
const product = require('../models/product');

const createProduct = async (req, res, next) => {
    //checking validations
    const errors = validationResult(req);

    //display any error messages if data is invalid
    if(!errors.isEmpty()){
        console.log(errors);
        return next(new HttpError("Invalid Input, Please enter correct data!", 400));
    }

    //get data from req body
    const { name, category, price, stock } = req.body;
    const newProduct = new Product({ name, category, price, stock });
    
    //insert to mongodb
    try{
        await newProduct.save();
    }catch(err){
        return next(new HttpError("Failed to create place. Please try again.", 500));
    }

    res.status(201).json({product: newProduct.toObject({ getters : true })});
}

const deleteProduct = async (req, res, next) => {
    //get product id from query
    const productid = req.params.productid;

    //check if that product exist
    let productInfo;
    try{
        productInfo = await Product.findById(productid);
    }catch(err){
        return next(new HttpError("Something went wrong, could not find product.", 500));
    }

    //display error message if product is doesnt exist
    if(!productInfo){
        return next(new HttpError("Could not find product for the provided product id.", 404));
    }

    //detele the product if it exist
    try{
        await productInfo.deleteOne();
    }catch(err){
        return next(new HttpError("Something went wrong, could not delete product.", 500));
    }

    res.status(200).json({ message: "Deleted the product successfully."});
}

const getProductById = async (req, res, next) => {
    //get product id from query
    const productid = req.params.productid;

    //get product information form mongodb
    let productInfo;
    try{
        productInfo = await Product.findById(productid);
    }catch(err){
        return next(new HttpError("Something went wrong, could not find product.", 500));
    }

    //display error message if product doesnt exist
    if(!productInfo){
        return next(new HttpError("Could not find product for the provided product id.", 404));
    }

    res.json({product: productInfo.toObject({ getters: true })});
}

const updateProduct = async (req, res, next) => {
    //checking validations
    const errors = validationResult(req);

    //display any error messages if data is invalid
    if(!errors.isEmpty()){
        console.log(errors);
        return next(new HttpError("Invalid Input, Please enter correct data!", 400));
    }

    //retrieve info from req body
    const { name, category, price, stock } = req.body;

    //retrieving product id from query
    const productid = req.params.productid;

    //check if product exist 
    let productInfo;
    try{
        productInfo = await Product.findById(productid);
    }catch(err){
        return next(new HttpError("Something went wrong, could not find product.", 500));
    }

    //display error message if product doesnt exist
    if(!productInfo){
        return next(new HttpError("Could not find product for the provided product id.", 404));
    }

    //update the product with new info
    productInfo.name = name;
    productInfo.category = category;
    productInfo.price = price;
    productInfo.stock = stock;

    //update information into mongodb
    try{
        await productInfo.save();
    }catch(err){
        return next(new HttpError("Something went wrong, could not update the product.", 500));
    }

    res.status(200).json({product: productInfo.toObject({ getters : true })});
}

exports.createProduct = createProduct;
exports.deleteProduct = deleteProduct;
exports.getProductById = getProductById;
exports.updateProduct = updateProduct;