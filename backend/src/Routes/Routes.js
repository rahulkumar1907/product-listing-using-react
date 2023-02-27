const express = require('express');
const router = express.Router();
const userController = require("../Controllers/UserController")
const productController = require("../Controllers/ProductController")
const middleWare = require("../Middleware/Middleware")


router.post("/register",userController.createUser)
router.post("/login",userController.loginUser)
router.get("/profileDetail",middleWare.authentication,userController.profileDetail)
router.post("/add-product",middleWare.authentication,productController.createProduct)
router.delete("/delete-product/:productId",middleWare.authentication,middleWare.authorisation,productController.deleteProduct)
router.get("/get-product",productController.getProduct)
router.get("/profiles",userController.profileDetails)
router.get("/get-product/:productId",productController.getProductById)
router.put("/update-product/:productId",middleWare.authentication,middleWare.authorisation,productController.updateProduct)










module.exports = router;