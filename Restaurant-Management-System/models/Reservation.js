const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
{
customerName: {
type: String,
required: true,
trim: true
},


    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },

    phone: {
        type: String,
        required: true,
        trim: true
    },

    date: {
        type: Date,
        required: true
    },

    time: {
        type: String,
        required: true
    },

    guests: {
        type: Number,
        required: true,
        min: 1
    },
    tableNumber: {
      type: Number,
      required: true,
      min: 1
    },

    status: {
        type: String,
        enum: ["Pending", "Confirmed", "Cancelled"],
        default: "Pending"
    }
},
{ timestamps: true }


);

module.exports = mongoose.model("Reservation", reservationSchema);
