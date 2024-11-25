// Import required libraries
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// Create an Express object
const app = express();

// Middleware to parse incoming JSON requests
app.use(bodyParser.json());

//Connect to MongoDB