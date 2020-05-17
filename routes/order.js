const express = require('express');
const router = express.Router();
const {isAdmin,isAuthenticated,isSignedIn} = require('../controllers/auth');
const {getUserById,pushOrderPushaseList}=require("../controllers/user");
const {updateStock}= require("../controllers/product");
router.param("userId",getUserById);
const {getOrderById,
    createOrder,
    getAllorders,
    setStatus,
    getStatus
} = require("../controllers/order");
//params
router.param("userId",getUserById);
router.param("orderId",getOrderById);

//routes 
router.post("user/:userId/order/create",
    isSignedIn,
    isAuthenticated,
    pushOrderPushaseList,
    updateStock,
    createOrder
);

//read
router.get("/user/:userId/orders/all",
    isSignedIn,
    isAuthenticated,
    getAllorders
);

router.put("/user/:userId/orders/:orderId/status",
    isSignedIn,
    isAuthenticated,
    isAdmin,
    setStatus
);
router.get("/user/:userId/orders/:orderId/status",
    isSignedIn,
    isAuthenticated,
    isAdmin,
    getStatus
);


module.exports = router;