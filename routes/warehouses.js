const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const { body, validationResult } = require('express-validator');


const warehousesData = JSON.parse(fs.readFileSync('data/warehouses.json'));

router.get('/', (_req, res) => {
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

router.post(
    '/',
    // contactEmail must be valid email address
    body('contactEmail').isEmail(),
    // contactPhone must be valid phone number
    body('contactPhone').isMobilePhone(),
    (req, res) => {
        let { name, address, city, country, contactName, contactPosition, contactPhone, contactEmail } = req.body;
        const errors = validationResult(req);

        // check if all fields are filled
        if (!name || !address || !city || !country || !contactName || !contactPosition || !contactPhone || !contactEmail ) {
            return res.status(400).json("Error: at least one field is empty");
        }
        else if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const newWarehouse = {
            ...req.body,
            id: uuidv4(),
            name,
            address,
            city,
            country,
            contactName,
            contactPosition,
            contactPhone,
            contactEmail
        };

        const allWarehouses = [...warehousesData, newWarehouse];

        fs.writeFileSync('./data/warehouses.json', JSON.stringify(allWarehouses));

        res.status(201).json(newWarehouse);
    })

module.exports = router;