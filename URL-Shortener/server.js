const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const urlRoutes = require("./routes/urlRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use("/", urlRoutes);

// Test route
app.get("/", (req, res) => {
res.send("CodeAlpha URL Shortener API is running!");
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => {
console.log("MongoDB Connected Successfully!");


    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
})
.catch((error) => {
    console.error("MongoDB connection failed:", error.message);
});

