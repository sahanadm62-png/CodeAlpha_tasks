const express = require("express");
const router = express.Router();
const Table = require("../models/Table");

// Get all tables
router.get("/", async (req, res) => {
try {
const tables = await Table.find().sort({ tableNumber: 1 });
res.status(200).json(tables);
} catch (error) {
res.status(500).json({ message: error.message });
}
});

// Add a new table
router.post("/", async (req, res) => {
try {
const { tableNumber, capacity } = req.body;


if (!tableNumber || !capacity) {
  return res.status(400).json({
    message: "Please provide table number and capacity."
  });
}

const table = new Table({ tableNumber, capacity });
const savedTable = await table.save();

res.status(201).json({
  message: "Table added successfully!",
  table: savedTable
});


} catch (error) {
res.status(400).json({ message: error.message });
}
});

module.exports = router;
