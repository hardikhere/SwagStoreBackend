const express = require('express');
const router = express.Router();
const {getCategoryById,createCategory,getAllCategory,getCategory,updateCategory,deleteCategory} = require('../controllers/category');
const {getUserById} = require('../controllers/user');
const {isAdmin,isAuthenticated,isSignedIn} = require('../controllers/auth');

router.param("userId",getUserById);
router.param("categoryId",getCategoryById);
router.post("/user/:userId/createCategory",isSignedIn,isAuthenticated,isAdmin,createCategory);
router.put("/user/:userId/updateCategory/:categoryId",isSignedIn,isAuthenticated,isAdmin,updateCategory);
router.delete("/user/:userId/deleteCategory/:categoryId",isSignedIn,isAuthenticated,isAdmin,deleteCategory);
router.get("/getAllCategory",getAllCategory);
router.get("/getCategory/:categoryId",getCategory);

module.exports = router;