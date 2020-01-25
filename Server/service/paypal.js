require('dotenv').config()
const request = require('request');

const payWithPaypal = (orderId, payer_id, total, cb) => {
    request.post(`${process.env.paypal_api}checkout/orders/${orderId}/capture`,
        {
            auth:
            {
                user: process.env.ID_KEY,
                pass: process.env.SECRET_KEY
            },
            body:
            {
                payer_id,
                transactions: [
                    {
                        amount:
                        {
                            total,
                            currency: 'USD'
                        }
                    }]
            },
            json: true
        },
        (err, response) => err ? cb(err) : cb(null, response));
};

module.exports = payWithPaypal