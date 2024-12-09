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
        check("userId").notEmpty(),
        check("status").optional(),
        check("deliveryName").notEmpty(),
        check("deliveryAddress").notEmpty(),
        check("paymentMethod").optional(),
        check("paymentStatus").optional(),
        check("products").notEmpty()
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

module.exports = router;