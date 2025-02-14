const express = require("express");
const router = express.Router();
const Booking = require("../models/bookingModel");
const Car = require("../models/carModel");
const { v4: uuidv4 } = require("uuid");
const stripe = require("stripe")(process.env.BACK_END_STRIPE_KEY);
router.post("/bookcar", async (req, res) => {
  try {
    console.log("Received booking request:", req.body);
    
    // For dummy payments, skip Stripe processing
    if (!process.env.BACK_END_STRIPE_KEY) {
      // Add dummy transaction ID if not present
      req.body.transactionId = req.body.transactionId || `dummy_${Date.now()}`;
      
      const newbooking = new Booking(req.body);
      try {
        await newbooking.save();
      } catch (saveError) {
        console.error("Booking save error:", saveError);
        throw saveError;
      }
      
      console.log("Searching for car with ID:", req.body.car);
      const carCategory = await Car.findOne({ _id: req.body.car });
      if (!carCategory) {
        console.error("Car category not found for ID:", req.body.car);
        throw new Error("Car category not found");
      }
      
      // Validate vehicles array exists
      if (!carCategory.vehicles || !Array.isArray(carCategory.vehicles)) {
        console.error("Invalid vehicles array in car category:", carCategory);
        throw new Error("No vehicles available");
      }
      
      // Find the first valid vehicle
      const vehicle = carCategory.vehicles.find(v => 
        v && v.name && v.image && v.rentPerHour && v.capacity && v.fuelType && v.transmission
      );
      
      if (!vehicle) {
        console.error("No valid vehicle found in category:", carCategory);
        throw new Error("No valid vehicle available");
      }
      
      console.log("Found valid vehicle:", vehicle);
      
      // Initialize bookedTimeSlots if it doesn't exist
      if (!vehicle.bookedTimeSlots) {
        vehicle.bookedTimeSlots = [];
      }
      
      console.log("Adding time slots:", req.body.bookedTimeSlots);
      vehicle.bookedTimeSlots.push(req.body.bookedTimeSlots);
      
      // Save the updated car category
      await carCategory.save();
      console.log("Car category updated successfully");
      
      return res.status(200).json({ message: "Booking successful" });
    } else {
      // Handle real Stripe payments
      const { token } = req.body;
      const customer = await stripe.customers.create({
        email: token.email,
        source: token.id,
      });

      const payment = await stripe.charges.create(
        {
          amount: req.body.totalAmount * 100,
          currency: "inr",
          customer: customer.id,
          receipt_email: token.email
        },
        {
          idempotencyKey: uuidv4(),
        }
      );

      if (payment) {
        req.body.transactionId = payment.source.id;
        const newbooking = new Booking(req.body);
        await newbooking.save();
        
        const car = await Car.findOne({ _id: req.body.car });
        car.bookedTimeSlots.push(req.body.bookedTimeSlots);
        await car.save();
        
        return res.status(200).json({ message: "Booking successful" });
      } else {
        throw new Error("Payment processing failed");
      }
    }
  } catch (error) {
    console.error("Booking error:", error);
    return res.status(400).json({ 
      message: "Booking failed",
      error: error.message 
    });
  }
});


router.get("/getallbookings", async(req, res) => {

    try {
        console.log("Fetching all bookings...");
        const bookings = await Booking.find()
          .populate('car')
          .populate('user', 'name email');
          
        if (!bookings || bookings.length === 0) {
          console.log("No bookings found");
          return res.status(200).json({ message: "No bookings found" });
        }
        
        console.log("Successfully fetched bookings:", bookings.length);
        return res.status(200).json(bookings);
        
    } catch (error) {
        console.error("Error fetching bookings:", {
          message: error.message,
          stack: error.stack,
          fullError: error
        });
        return res.status(400).json({ 
          message: "Failed to fetch bookings",
          error: error.message,
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
  
});


module.exports = router;