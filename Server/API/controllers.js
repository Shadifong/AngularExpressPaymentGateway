var request = require('request');
const productsFunctions = require("../service/products");
require('dotenv').config()

const controllers = {
  getProductsFromArrayOfIds: ({ body: arrayOfIds }, res) => {
    res.send(productsFunctions.getProductsFromArrayOfIds(arrayOfIds));
  },
  getProducts: (req, res) => {
    res.send(productsFunctions.getProducts());
  },
  Pay: (req, res) => {
    var orderId = req.body.orderID;
    var payerID = req.body.payerID;
    var totalPrice = req.body.total;
    request.post(`${process.env.paypal_api}checkout/orders/${orderId}/capture`,
      {
        auth:
        {
          user: process.env.ID_KEY,
          pass: process.env.SECRET_KEY
        },
        body:
        {
          payer_id: payerID,
          transactions: [
            {
              amount:
              {
                total: totalPrice,
                currency: 'USD'
              }
            }]
        },
        json: true
      },
      function (err, response) {
        if (err) {
          console.error(err);
          return res.sendStatus(500);
        }
        res.send(
          response);
      });

  }
};

module.exports = controllers;
