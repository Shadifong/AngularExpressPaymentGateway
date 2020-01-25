const productsFunctions = require("../service/products");
const payWithPaypal = require("../service/paypal")

const controllers = {
  getProductsFromArrayOfIds: ({ body: arrayOfIds }, res) => {
    res.send(productsFunctions.getProductsFromArrayOfIds(arrayOfIds));
  },
  getProducts: (req, res) => {
    res.send(productsFunctions.getProducts());
  },
  pay: ({ body: { total, payerID, orderID } }, res) => {
    payWithPaypal(orderID, payerID, total, (err, response) => {
      if (err) res.sendstatus(500)
      else res.send(response)
    })
  }
};

module.exports = controllers;
