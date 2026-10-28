const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
{
customerName: {
type: String,
required: true,
trim: true
},


    customerPhone: {
        type: String,
        required: true,
        trim: true
    },

    items: [
        {
            menuItem: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Menu",
                required: true
            },

            name: {
                type: String,
                required: true
            },

            quantity: {
                type: Number,
                required: true,
                min: 1
            },

            price: {
                type: Number,
                required: true,
                min: 0
            }
        }
    ],

    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },

    deliveryAddress: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: ["Pending", "Preparing", "Ready", "Delivered", "Cancelled"],
        default: "Pending"
    }
},
{ timestamps: true }


);

module.exports = mongoose.model("Order", orderSchema);
