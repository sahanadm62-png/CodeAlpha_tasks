const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const menuRoutes = require("./routes/menuRoutes");
const orderRoutes = require("./routes/orderRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const tableRoutes = require("./routes/tableRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/tables", tableRoutes);
app.use("/api/inventory", inventoryRoutes);

app.get("/", (req, res) => {
res.send("Restaurant Management System Backend is Running!");
});

const PORT = process.env.PORT || 5000;

async function startServer() {
try {
await mongoose.connect(process.env.MONGO_URI);


    console.log("MongoDB Connected Successfully!");

    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
} catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    process.exit(1);
}

}

startServer();
