const express = require("express");
const router = express.Router();
const controller = require("./controllers");

router.get("/getproducts", controller.getProducts);
router.post("/pay", controller.pay);
router.post("/getProductsFromArrayOfIds", controller.getProductsFromArrayOfIds);

module.exports = router;
