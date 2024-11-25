// Import required libraries
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require('dotenv').config()

// Create an Express object
const app = express();

// Middleware to parse incoming JSON requests
app.use(bodyParser.json());

//Connect to MongoDB

mongoose
    .connect(process.env.MONGODB_KEY)
    .then(() => {
        app.listen(8080);
    })
    .catch(err => {
        console.log(err);
    })