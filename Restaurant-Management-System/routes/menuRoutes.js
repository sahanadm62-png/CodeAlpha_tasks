const express = require("express");
const router = express.Router();
const Menu = require("../models/Menu");

// Get all menu items
router.get("/", async (req, res) => {
try {
const menuItems = await Menu.find();
res.status(200).json(menuItems);
} catch (error) {
res.status(500).json({ message: error.message });
}
});

// Add a new menu item
// Add a new menu item
router.post("/", async (req, res) => {
    try {
        console.log("Received body:", req.body);

        const newItem = new Menu(req.body);
        const savedItem = await newItem.save();

        res.status(201).json({
            message: "Menu item added successfully!",
            menuItem: savedItem
        });
    } catch (error) {
        console.log("Menu Error:", error.message);

        res.status(400).json({
            message: error.message
        });
    }
});

// Delete a menu item
router.delete("/:id", async (req, res) => {
try {
const deletedItem = await Menu.findByIdAndDelete(req.params.id);


    if (!deletedItem) {
        return res.status(404).json({ message: "Menu item not found" });
    }

    res.status(200).json({ message: "Menu item deleted successfully" });
} catch (error) {
    res.status(400).json({ message: error.message });
}


});

module.exports = router;
