const express = require("express");
const { check } = require("express-validator");
const usersControllers = require("../controllers/users-controllers");
const router = express.Router();

//get all users
router.get("/", usersControllers.getAllUsers);

//signup
router.post(
  "/signup",
  [
    check("name").notEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("phone").notEmpty(),
    check("address").notEmpty(),
    check("password").isLength({ min: 6 }),
  ],
  usersControllers.signup
);

//login after signup
router.post("/login", usersControllers.login);

module.exports = router;