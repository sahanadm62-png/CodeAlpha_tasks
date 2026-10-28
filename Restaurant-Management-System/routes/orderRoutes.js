
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Order = require("../models/Order");
const Menu = require("../models/Menu");
const Inventory = require("../models/Inventory");

// Get all orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Place a new order and update inventory

router.post("/", async (req, res) => {
  const deductedStocks = [];

  try {
    const { customerName, customerPhone, items, deliveryAddress } = req.body;

    if (
      !customerName ||
      !customerPhone ||
      !Array.isArray(items) ||
      items.length === 0 ||
      !deliveryAddress
    ) {
      return res.status(400).json({
        message: "Please provide all required order details."
      });
    }

    const requestedItems = new Map();

    for (const item of items) {
      if (!mongoose.isValidObjectId(item.menuItem)) {
        return res.status(400).json({
          message: "Invalid menu item ID."
        });
      }

      const quantity = Number(item.quantity);

      if (!Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({
          message: "Quantity must be at least 1."
        });
      }

      const id = String(item.menuItem);
      requestedItems.set(
        id,
        (requestedItems.get(id) || 0) + quantity
      );
    }

    let totalAmount = 0;
    const orderItems = [];
    const stockRequirements = [];

    // Check menu items and stock before deducting anything
    for (const [menuItemId, quantity] of requestedItems) {
      const menuItem = await Menu.findById(menuItemId);

      if (!menuItem || !menuItem.available) {
        return res.status(400).json({
          message: "A selected menu item is unavailable."
        });
      }

      const inventoryItem = await Inventory.findOne({
        itemName: menuItem.name
      });

      if (!inventoryItem) {
        return res.status(400).json({
          message: `No inventory item matches "${menuItem.name}".`
        });
      }

      if (inventoryItem.quantity < quantity) {
        return res.status(400).json({
          message: `Not enough stock for ${menuItem.name}.`
        });
      }

      stockRequirements.push({
        inventoryId: inventoryItem._id,
        quantity
      });

      orderItems.push({
        menuItem: menuItem._id,
        name: menuItem.name,
        quantity,
        price: menuItem.price
      });

      totalAmount += menuItem.price * quantity;
    }

    // Deduct stock without using a MongoDB transaction
    for (const stock of stockRequirements) {
      const updatedInventory = await Inventory.findOneAndUpdate(
        {
          _id: stock.inventoryId,
          quantity: { $gte: stock.quantity }
        },
        {
          $inc: { quantity: -stock.quantity }
        },
        {
          new: true,
          runValidators: true
        }
      );

      if (!updatedInventory) {
        throw new Error(
          "Stock changed while placing the order. Please try again."
        );
      }

      deductedStocks.push(stock);
    }

    // Save the order
    const order = new Order({
      customerName,
      customerPhone,
      items: orderItems,
      totalAmount,
      deliveryAddress
    });

    await order.save();

    return res.status(201).json({
      message: "Order placed and inventory updated successfully!",
      order
    });
  } catch (error) {
    // Restore deducted stock if saving the order fails
    for (const stock of deductedStocks) {
      try {
        await Inventory.updateOne(
          { _id: stock.inventoryId },
          { $inc: { quantity: stock.quantity } }
        );
      } catch (restoreError) {
        console.error("Could not restore stock:", restoreError.message);
      }
    }

    return res.status(500).json({
      message: error.message
    });
  }
});


// Update order status
router.patch("/:id/status", async (req, res) => {
  try {
    const allowedStatuses = [
      "Pending",
      "Preparing",
      "Ready",
      "Delivered",
      "Cancelled"
    ];

    const { status } = req.body;

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status."
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found."
      });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
