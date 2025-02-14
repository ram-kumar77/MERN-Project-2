const mongoose = require('mongoose');
const Car = require('../models/carModel');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

async function fixCars() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGOURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('Finding incomplete cars...');
    const incompleteCars = await Car.find({
      $or: [
        { name: { $exists: false } },
        { image: { $exists: false } },
        { rentPerHour: { $exists: false } }
      ]
    });
    
    console.log(`Found ${incompleteCars.length} incomplete cars`);
    
    const updatePromises = incompleteCars.map(async (car) => {
      if (!car.name) car.name = 'Unknown Car';
      if (!car.image) car.image = 'default-car.jpg';
      if (!car.rentPerHour) car.rentPerHour = 0;
      if (!car.transmission) car.transmission = 'Automatic';
      if (!car.fuelType) car.fuelType = 'Petrol';
      if (!car.capacity) car.capacity = 4;
      await car.save();
    });
    
    await Promise.all(updatePromises);
    
    console.log('Successfully fixed all incomplete cars');
    process.exit(0);
  } catch (error) {
    console.error('Error fixing cars:', error);
    process.exit(1);
  }
}

fixCars();
