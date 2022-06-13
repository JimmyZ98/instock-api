const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const warehousesRoute = require('./routes/warehouses');
const inventoryRoute = require('./routes/inventory');
const port = process.env.PORT || 8000;

app.use(cors());

app.use(express.json());

app.use(express.static('public'));

app.use('/warehouses', warehousesRoute);
app.use('/inventory', inventoryRoute);

app.listen(port, () => console.log(`Server is listening on ${port}`));