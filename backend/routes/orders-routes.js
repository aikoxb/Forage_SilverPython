const express = require("express");
const { check } = require("express-validator");
const ordersControllers = require("../controllers/orders-controllers");
const router = express.Router();
const checkAuth = require("../middleware/check-auth")

//get order by id
router.get("/:orderId", ordersControllers.getOrderById);

//use the token for auth
router.use(checkAuth)

//create order
router.post("/",
    [
        check("userId").not().isEmpty().withMessage("User ID is required."),
        check("orderStatus").not().isEmpty().withMessage("Order status is required."),
        check("deliveryName").not().isEmpty().withMessage("Delivery name is required."),
        check("deliveryAddress").not().isEmpty().withMessage("Delivery address is required."),
        check("paymentMethod").not().isEmpty().withMessage("Payment method is required."),
        check("paymentStatus").not().isEmpty().withMessage("Payment status is required."),
        check("products").isArray().withMessage("Products must be an array."),
    ],
    ordersControllers.createOrder
);

//update order
router.patch("/:orderId",
    [
        check("userId").notEmpty(),
        check("status").optional(),
        check("deliveryName").optional(),
        check("deliveryAddress").optional(),
        check("paymentMethod").optional(),
        check("paymentStatus").optional(),
        check("products").optional()
    ],
    ordersControllers.updateOrder
);

//delete order
router.delete("/:orderId", ordersControllers.deleteOrder);

//get orders by userId
router.get("/:userId", ordersControllers.getOrdersByUserId);

module.exports = router;