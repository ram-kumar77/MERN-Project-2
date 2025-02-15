const mongoose = require("mongoose");
require('dotenv').config({ path: __dirname + '/.env' });

// Import and register models in correct order
const Car = require('./models/carModel');
const Booking = require('./models/bookingModel');
const User = require('./models/userModel');

// Register models with Mongoose
mongoose.model('cars', Car.schema);
mongoose.model('bookings', Booking.schema);
mongoose.model('users', User.schema);

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGOURL, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
        console.log('MongoDB Connection Successful');
    } catch (error) {
        console.error('MongoDB Connection Error:', error);
        process.exit(1); // Exit if unable to connect to database
    }
}

// Handle connection errors after initial connection
mongoose.connection.on('error', (error) => {
    console.error('MongoDB Connection Error:', error);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB Disconnected. Attempting to reconnect...');
    connectDB();
});

connectDB();

module.exports = mongoose;
