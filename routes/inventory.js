const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

router.post('/', (req, res) => {
  const { itemName, description, category, status, quantity, warehouseID, warehouseName } = req.body;

  if (!itemName || !description || !category || !status || !quantity || !warehouseID || !warehouseName) {
    return res.status(400)
      .send("Error! One or more of the required request fields are empty");
  }
  else {
    const newItem = {
      id: uuidv4(),
      warehouseID,
      warehouseName,
      itemName,
      description,
      category,
      status,
      quantity
    };
    const oldInventoryList = JSON.parse(fs.readFileSync('data/inventories.json'));
    let newInventoryList = [...oldInventoryList, newItem]; 
    fs.writeFileSync('data/inventories.json', JSON.stringify(newInventoryList));
    res.status(201).send(newItem.id);
  };
});

module.exports = router;