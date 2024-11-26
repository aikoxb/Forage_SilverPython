const express = require("express");
const { check } = require("express-validator");
const ordersControllers = require("../controllers/orders-controllers");

const router = express.Router();

//get order by id
router.get("/:orderId", ordersControllers.getOrderById);

//create order
router.post("/",
    [
        check("orderStatus").notEmpty(),
        check("deliveryName").notEmpty(),
        check("deliveryAddress").notEmpty(),
        check("paymentMethod").notEmpty(),
        check("paymentStatus").notEmpty(),
    ],
    ordersControllers.createOrder
);

//update order
router.patch("/:orderId",
    [
        check("status").optional(),
        check("paymentStatus").optional(),
    ],
    ordersControllers.updateOrder
);

//delete order
router.delete("/:orderId", ordersControllers.deleteOrder);

module.exports = router;