const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    category: { type: String, required: true },
    vehicles: [{
        name: { type: String, required: true },
        image: { type: String, required: true },
        capacity: { type: Number, required: true },
        fuelType: { type: String, required: true },
        transmission: { type: String, required: true },
        rentPerHour: { type: Number, required: true },
        bookedTimeSlots: [{
            from: { type: String },
            to: { type: String }
        }]
    }]
});

const Car = mongoose.model('cars', carSchema);
module.exports = Car;
