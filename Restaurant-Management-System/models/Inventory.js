
const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    itemName: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },

    quantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },

    unit: {
      type: String,
      required: true,
      default: "pieces",
      trim: true
    },

    lowStockThreshold: {
      type: Number,
      min: 0,
      default: 5
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Inventory", inventorySchema);
