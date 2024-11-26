// Import required libraries
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ordersRoutes = require("./routes/orders-routes");
const userRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");
require('dotenv').config()

// Create an Express object
const app = express();

// Middleware to parse incoming JSON requests
app.use(bodyParser.json());

//routes for orders
app.use("/api/orders", ordersRoutes);

//routes for users
app.use("/api/users", userRoutes);

app.use((req, res, next) => {
    throw new HttpError("The requested URL was not found on this server.", 404);
});

//middleware to handle errors
app.use((error, req, res, next) => {
    if(res.headerSent){
        return next(error);
    }

    res.status(error.code || 500);
    res.json({message: error.message} || "An unknown error occured!");
});

//Connect to MongoDB
mongoose
    .connect(process.env.MONGODB_KEY)
    .then(() => {
        app.listen(8080);
    })
    .catch(err => {
        console.log(err);
    });