const productsFunctions = require("../service/products");
const payWithPaypal = require("../service/paypal")
const payWithStripe = require("../service/stripe")

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
  },
  stripe: ({ body: { token, price } }, res) => {
    payWithStripe(token, price, charge => {
      res.send({ charge })
    })
  }
};

module.exports = controllers;
