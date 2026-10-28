const express = require("express");
const crypto = require("crypto");
const Url = require("../models/Url");

const router = express.Router();

// Create a shortened URL
router.post("/shorten", async (req, res) => {
try {
const { originalUrl } = req.body;


    if (!originalUrl || !/^https?:\/\/\S+$/i.test(originalUrl)) {
        return res.status(400).json({
            error: "Please provide a valid HTTP or HTTPS URL."
        });
    }

    const shortCode = crypto.randomBytes(4).toString("hex");

    const url = await Url.create({
        originalUrl,
        shortCode
    });

    res.status(201).json({
        message: "URL shortened successfully!",
        originalUrl: url.originalUrl,
        shortUrl: `${req.protocol}://${req.get("host")}/${url.shortCode}`,
        shortCode: url.shortCode
    });
} catch (error) {
    console.error("Shorten URL error:", error.message);
    res.status(500).json({
        error: "Could not shorten URL."
    });
}


});

// Redirect to the original URL
router.get("/:shortCode", async (req, res) => {
try {
const url = await Url.findOne({
shortCode: req.params.shortCode
});


    if (!url) {
        return res.status(404).json({
            error: "Short URL not found."
        });
    }

    url.clicks += 1;
    await url.save();

    return res.redirect(url.originalUrl);
} catch (error) {
    console.error("Redirect error:", error.message);
    return res.status(500).json({
        error: "Could not redirect URL."
    });
}


});

module.exports = router;
