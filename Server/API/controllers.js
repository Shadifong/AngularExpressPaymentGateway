const properties = require("../package.json");
var paypal = require("paypal-rest-sdk");
const productsFunctions = require("../service/products");

const controllers = {
  getProductsFromArrayOfIds: ({ body: arrayOfIds }, res) => {
    res.send(productsFunctions.getProductsFromArrayOfIds(arrayOfIds));
  },
  getProducts: (req, res) => {
    res.send(productsFunctions.getProducts());
  },
  Pay: (req, res) => {
    const payerId = req.body.payerID;
    const orderID = req.body.orderID;

  }
};

module.exports = controllers;
