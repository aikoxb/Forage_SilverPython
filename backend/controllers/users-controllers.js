const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const HttpError = require("../models/http-error");
const User = require("../models/users");

//get all users
const getAllUsers = async (req, res, next) => {
    let users;
    try {
        users = await User.find({}, "-password");
    } catch (err) {
        return next(new HttpError("Fetching users failed, Please try again later.", 500));
    }

    res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

//signup 
const signup = async (req, res, next) => {
    //validate the info 
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors);
        return next(new HttpError("Invalid input passed, please check your data.", 422));
    }

    //take info from req body
    const { name, email, phone, address, password } = req.body;

    //check if user exist already
    let existingUser;
    try {
        existingUser = await User.find({ email: email });
    } catch (err) {
        return next(new HttpError("Signing up failed, Please try again later.", 500));
    }

    if (existingUser.length > 0) {
        return next(new HttpError("User already exist, please login instead", 422));
    }

    //hash the password
    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 10);
    } catch (err) {
        return next(new HttpError("Could not create user, please try again.", 500));
    }

    //create the new user
    const createdUser = new User({
        name,
        email,
        phone, 
        address,
        password: hashedPassword,
    });

    //save user to mongodb
    try {
        await createdUser.save();
    } catch (err) {
        return next(new HttpError("Signing up failed, please try again", 500));
    }

    //handle token
    let token;
    try {
        token = jwt.sign(
        { userId: createdUser.id, email: createdUser.email },
        "something-random",
        { expiresIn: "1h" }
        );
    } catch (err) {
        return next(new HttpError("Signing up failed, please try again", 500));
    }

    res.status(201).json({ userId: createdUser.id, email: createdUser.email, token: token });
};

//login
const login = async (req, res, next) => {
    //get login info from req body
    const { email, password } = req.body;

    //check if user exist
    let existingUser;
    try {
        existingUser = await User.find({ email: email });
    } catch (err) {
        return next(new HttpError("Logging in failed, Please try again later.", 500));
    }

    if (existingUser.length === 0) {
        return next(new HttpError("Invalid Credentials, Could not log you in!", 403));
    }

    //validate password
    let isValidPassword = false;
    try {
        isValidPassword = await bcrypt.compare(password, existingUser[0].password);
    } catch (err) {
        return next(new HttpError("Could not log you in, please check your credentials and try again.", 500));
    }

    if (!isValidPassword) {
        return next(new HttpError("Invalid Credentials, Could not log you in!", 403));
    }

    //handle token
    let token;
    try {
        token = jwt.sign(
        { userId: existingUser[0].id, email: existingUser[0].email },
        "something-random",
        { expiresIn: "1h" }
        );
    } catch (err) {
        const error = new HttpError("Logging in failed, please try again", 500);
        return next(error);
    }

    res.json({ userId: existingUser[0].id, email: existingUser[0].email, token: token });
};

//get user details by ID
const getUserById = async (req, res, next) => {
    const userId = req.params.userId;

    try {
        const user = await User.findById(userId).select("-password"); 
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        res.json({ user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Fetching user failed, please try again later." });
    }
};

//update user details
const updateUserById = async (req, res, next) => {
    const { name, email, phone, address } = req.body;
    const userId = req.params.userId;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { name, email, phone, address },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found." });
        }

        res.json({ user: updatedUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Updating user failed, please try again later." });
    }
};


exports.getAllUsers = getAllUsers;
exports.signup = signup;
exports.login = login;
exports.getUserById = getUserById;
exports.updateUserById = updateUserById;