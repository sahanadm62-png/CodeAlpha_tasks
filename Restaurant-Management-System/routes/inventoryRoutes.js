
const express = require("express");
const router = express.Router();
const Inventory = require("../models/Inventory");

// Get all inventory items
router.get("/", async (req, res) => {
  try {
    const items = await Inventory.find().sort({ itemName: 1 });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a new inventory item
router.post("/", async (req, res) => {
  try {
    const { itemName, quantity, unit, lowStockThreshold } = req.body;

    if (!itemName || quantity == null) {
      return res.status(400).json({
        message: "Please provide item name and quantity."
      });
    }

    const stockQuantity = Number(quantity);
    const threshold = lowStockThreshold == null
      ? 5
      : Number(lowStockThreshold);

    if (!Number.isFinite(stockQuantity) || stockQuantity < 0) {
      return res.status(400).json({
        message: "Quantity must be zero or greater."
      });
    }

    if (!Number.isFinite(threshold) || threshold < 0) {
      return res.status(400).json({
        message: "Low-stock threshold must be zero or greater."
      });
    }

    const item = new Inventory({
      itemName,
      quantity: stockQuantity,
      unit: unit || "pieces",
      lowStockThreshold: threshold
    });

    const savedItem = await item.save();

    res.status(201).json({
      message: "Inventory item added successfully!",
      item: savedItem
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "This inventory item already exists."
      });
    }

    res.status(400).json({ message: error.message });
  }
});

// Update inventory quantity
router.patch("/:id", async (req, res) => {
  try {
    const { quantity } = req.body;

    if (
      quantity == null ||
      !Number.isFinite(Number(quantity)) ||
      Number(quantity) < 0
    ) {
      return res.status(400).json({
        message: "Please provide a valid quantity of zero or greater."
      });
    }

    const item = await Inventory.findByIdAndUpdate(
      req.params.id,
      { quantity: Number(quantity) },
      { new: true, runValidators: true }
    );

    if (!item) {
      return res.status(404).json({
        message: "Inventory item not found."
      });
    }

    res.status(200).json({
      message: "Inventory updated successfully!",
      item
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
