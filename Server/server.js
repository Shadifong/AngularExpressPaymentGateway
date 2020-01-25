const express = require("express");
require('dotenv').config({ path: __dirname + '/.env' })
var cors = require("cors");
const app = express();
const port = 7425 || process.env.PORT;
const routes = require("./api/router");

app.use(express.json());
app.disable("x-powered-by");
app.use(cors());

app.listen(port, () => console.log(`Server is on ${port}`));
app.use(routes);
