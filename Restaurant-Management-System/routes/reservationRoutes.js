
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Reservation = require("../models/Reservation");
const Table = require("../models/Table");

// Get all reservations
router.get("/", async (req, res) => {
  try {
    const reservations = await Reservation.find().sort({ createdAt: -1 });
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a reservation with table availability checking
router.post("/", async (req, res) => {
  try {
    const {
      customerName,
      email,
      phone,
      date,
      time,
      guests,
      tableNumber
    } = req.body;

    if (
      !customerName ||
      !email ||
      !phone ||
      !date ||
      !time ||
      guests == null ||
      tableNumber == null
    ) {
      return res.status(400).json({
        message: "Please provide all reservation details, including table number."
      });
    }

    const guestCount = Number(guests);
    const selectedTableNumber = Number(tableNumber);
    const reservationDate = new Date(date);

    if (!Number.isInteger(guestCount) || guestCount < 1) {
      return res.status(400).json({
        message: "Guests must be a positive whole number."
      });
    }

    if (
      !Number.isInteger(selectedTableNumber) ||
      selectedTableNumber < 1
    ) {
      return res.status(400).json({
        message: "Please provide a valid table number."
      });
    }

    if (Number.isNaN(reservationDate.getTime())) {
      return res.status(400).json({
        message: "Please provide a valid reservation date."
      });
    }

    // Validate time in 24-hour HH:mm format
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) {
      return res.status(400).json({
        message: "Time must be in HH:mm format, for example 19:00."
      });
    }

    const [hours, minutes] = time.split(":").map(Number);
    const bookingDateTime = new Date(reservationDate);
    bookingDateTime.setHours(hours, minutes, 0, 0);

    if (bookingDateTime <= new Date()) {
      return res.status(400).json({
        message: "Please choose a future date and time."
      });
    }

    // Find the selected table
    const table = await Table.findOne({
      tableNumber: selectedTableNumber
    });

    if (!table) {
      return res.status(404).json({
        message: "Table not found. Please choose an existing table."
      });
    }

    if (table.available === false) {
      return res.status(400).json({
        message: "This table is currently unavailable."
      });
    }

    if (guestCount > table.capacity) {
      return res.status(400).json({
        message: `This table can accommodate only ${table.capacity} guests.`
      });
    }

    // Check whether the same table is already booked
    // for the same date and time.
    const startOfDay = new Date(reservationDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(reservationDate);
    endOfDay.setHours(23, 59, 59, 999);

    const existingReservation = await Reservation.findOne({
      tableNumber: selectedTableNumber,
      date: { $gte: startOfDay, $lte: endOfDay },
      time,
      status: { $ne: "Cancelled" }
    });

    if (existingReservation) {
      return res.status(409).json({
        message: "This table is already reserved at that date and time."
      });
    }

    const reservation = new Reservation({
      customerName,
      email,
      phone,
      date: reservationDate,
      time,
      guests: guestCount,
      tableNumber: selectedTableNumber
    });

    const savedReservation = await reservation.save();

    res.status(201).json({
      message: "Table reserved successfully!",
      reservation: savedReservation
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update reservation status
router.patch("/:id/status", async (req, res) => {
  try {
    const allowedStatuses = ["Pending", "Confirmed", "Cancelled"];
    const { status } = req.body;

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid reservation status."
      });
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid reservation ID."
      });
    }

    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!reservation) {
      return res.status(404).json({
        message: "Reservation not found."
      });
    }

    res.status(200).json(reservation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
