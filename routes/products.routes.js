const productscontroller = require("../controllers/products.controller");
const express = require("express");

const router = express.Router();

router.get("/products", productscontroller.getAllProducts);
router.get("/products/:id", productscontroller.getProductDetails);

module.exports = router;
