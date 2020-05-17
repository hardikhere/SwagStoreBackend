const express = require('express');
const router = express.Router();
const {getProductById
    ,showProductById
    ,createProduct,
    updateProduct,
    showAllProducts,
    deleteProduct,
    photo,
    getAllCategories
} = require('../controllers/product');
const {isAdmin,isAuthenticated,isSignedIn} = require('../controllers/auth');
 const {getUserById}=require("../controllers/user");
 const {getCategoryById}=require("../controllers/category");
//params middleware
router.param("categoryId",getCategoryById);
router.param("userId",getUserById);
router.param("productId",getProductById);
//routes

router.get("/product/:productId",showProductById);
router.get("/product/photo/:productId",photo);
router.get("/products",showAllProducts);
router.get("/categories",getAllCategories);

router.post("/user/:userId/createProduct",isAdmin,createProduct);

router.put("/user/:userId/updateProduct/:productId",isAdmin,isSignedIn,isAuthenticated,updateProduct);
router.delete("/user/:userId/deleteProduct/:productId",isAdmin,isSignedIn,isAuthenticated,deleteProduct);
module.exports = router;
