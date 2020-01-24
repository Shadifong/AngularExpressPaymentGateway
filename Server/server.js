const express = require("express");
var paypal = require("paypal-rest-sdk");
var cors = require("cors");
const app = express();
const port = 7425 || process.env.PORT;
const routes = require("./api/router");
const { init } = require("./service/paypal");

init();
app.use(express.json());
app.disable("x-powered-by");
app.use(cors());

app.listen(port, () => console.log(`Server is on ${port}`));
app.use(routes);
