const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Car = require("../models/carModel");


router.get('/cars', async (req, res) => {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/addcar", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      throw new Error('MongoDB not connected. Current state: ' + mongoose.connection.readyState);
    }
    const newcar = new Car(req.body);
    await newcar.save();
    res.json({ message: "Car added successfully" });
  } catch (error) {
    console.error('Error in addcar:', error);
    return res.status(400).json({
      message: 'Failed to add car',
      error: error.message,
      stack: error.stack,
      mongoState: mongoose.connection.readyState
    });
  }
});

router.post("/editcar", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      throw new Error('MongoDB not connected. Current state: ' + mongoose.connection.readyState);
    }
    const car = await Car.findOne({ _id: req.body._id });
    if (!car) {
      throw new Error('Car not found');
    }
    car.name = req.body.name;
    car.image = req.body.image;
    car.fuelType = req.body.fuelType;
    car.rentPerHour = req.body.rentPerHour;
    car.capacity = req.body.capacity;

    await car.save();
    res.json({ message: "Car details updated successfully" });
  } catch (error) {
    console.error('Error in editcar:', error);
    return res.status(400).json({
      message: 'Failed to update car',
      error: error.message,
      stack: error.stack,
      mongoState: mongoose.connection.readyState
    });
  }
});

router.post("/deletecar", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      throw new Error('MongoDB not connected. Current state: ' + mongoose.connection.readyState);
    }
    const result = await Car.findOneAndDelete({ _id: req.body.carid });
    if (!result) {
      throw new Error('Car not found');
    }
    res.json({ message: "Car deleted successfully" });
  } catch (error) {
    console.error('Error in deletecar:', error);
    return res.status(400).json({
      message: 'Failed to delete car',
      error: error.message,
      stack: error.stack,
      mongoState: mongoose.connection.readyState
    });
  }
});

module.exports = router;