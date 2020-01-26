require('dotenv').config()
const stripe = require('stripe')(process.env.STRIPE_TOKEN);

const payWithStripe = async (token, price, cb) => {
    // Using Express
    const charge = await stripe.charges.create({
        amount: price * 100,
        currency: 'usd',
        description: 'EZbuy charge',
        source: token,
    });

    cb(charge)

};

module.exports = payWithStripe;