const mongoose = require('mongoose');
const Car = require('../models/carModel');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

async function updateCars() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGOURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('Finding valid cars to update...');
    const validCars = await Car.find({
      name: { $exists: true, $ne: null },
      image: { $exists: true, $ne: null }
    });
    
    console.log(`Found ${validCars.length} valid cars`);
    
    const updatePromises = validCars.map(async (car) => {
      if (!car.bookedTimeSlots) {
        car.bookedTimeSlots = [];
        await car.save();
      }
    });
    
    await Promise.all(updatePromises);
    
    console.log('Successfully updated all valid cars');
    process.exit(0);
  } catch (error) {
    console.error('Error updating cars:', error);
    process.exit(1);
  }
}

updateCars();