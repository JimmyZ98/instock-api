const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

router.get('/', (_req, res) => {
  const warehousesData = JSON.parse(fs.readFileSync('data/warehouses.json'));
  res.json(warehousesData.map(warehouse => {
    return {
      name: warehouse.name,
      address: warehouse.address,
      city: warehouse.city,
      country: warehouse.country,
      contactName: warehouse.contact.name,
      contactPhone: warehouse.contact.phone,
      contactEmail: warehouse.contact.email,
      id: warehouse.id
    }
  }));
});

module.exports = router;