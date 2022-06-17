const express = require("express");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const router = express.Router();

const warehousesData = JSON.parse(fs.readFileSync("data/warehouses.json"));

const regexPhone = new RegExp(
  /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
  "im"
);
const regexEmail = new RegExp(
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  "i"
);

router.get("/", (_req, res) => {
  res.json(
    warehousesData.map((warehouse) => {
      return {
        name: warehouse.name,
        address: warehouse.address,
        city: warehouse.city,
        country: warehouse.country,
        contactName: warehouse.contact.name,
        contactPhone: warehouse.contact.phone,
        contactEmail: warehouse.contact.email,
        id: warehouse.id,
      };
    })
  );
});

router.post("/", (req, res) => {
  console.log(req.body);
  let {
    name,
    address,
    city,
    country,
    contact: { position, phone, email },
  } = req.body;

  // check if all fields are filled
  if (!name || !address || !city || !country || !position || !phone || !email) {
    return res.status(400).json("Error: at least one field is empty");
  }
  // check for valid phone number
  else if (!regexPhone.test(phone)) {
    return res.status(400).json("Invalid phone number");
  }
  //check for valid email address
  else if (!regexEmail.test(email)) {
    return res.status(400).json("Invalid email address");
  } else {
    const newWarehouse = {
      ...req.body,
      id: uuidv4(),
      name,
      address,
      city,
      country,
      contact: {
        name: req.body.contact.name,
        position,
        phone,
        email,
      },
    };

    console.log(newWarehouse);

    const allWarehouses = [...warehousesData, newWarehouse];

    fs.writeFileSync("./data/warehouses.json", JSON.stringify(allWarehouses));

    res.status(201).json(newWarehouse);
  }
});

router.put("/:id", (req, res) => {
  const data = JSON.parse(fs.readFileSync("data/warehouses.json"));
  const chosenWarehouse = data.find(
    (warehouse) => warehouse.id === req.params.id
  );

  let {
    name,
    address,
    city,
    country,
    contact: { position, phone, email },
  } = req.body;

  // check if all fields are filled
  if (!name || !address || !city || !country || !position || !phone || !email) {
    return res.status(400).json("Error: at least one field is empty");
  }
  // check for valid phone number
  else if (!regexPhone.test(phone)) {
    return res.status(400).json("Invalid phone number");
  }
  //check for valid email address
  else if (!regexEmail.test(email)) {
    return res.status(400).json("Invalid email address");
  } else {
    chosenWarehouse.name = name;
    chosenWarehouse.address = address;
    chosenWarehouse.city = city;
    chosenWarehouse.country = country;
    chosenWarehouse.contact = {
      name: req.body.contact.name,
      position,
      phone,
      email,
    };

    fs.writeFileSync("./data/warehouses.json", JSON.stringify(data));

    res.status(200).json(data);
  }
});

module.exports = router;
