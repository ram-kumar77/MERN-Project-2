const express = require("express");
const app = express();
const cors = require('cors');
const path = require("path");
require('dotenv').config();

const dbConnection = require('./db');
const carsRoute = require('./routes/carsRoute');
const usersRoute = require('./routes/usersRoute');
const bookingsRoute = require('./routes/bookingsRoute');
const paymentsRoute = require('./routes/paymentsRoute');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/cars', carsRoute);

// CORS middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: err.message 
  });
});

// Routes
app.use("/api/cars", carsRoute);
app.use("/api/users", usersRoute);
app.use("/api/bookings", bookingsRoute);
app.use("/api/payments", paymentsRoute);

// Set __dirname
__dirname = path.resolve();

const port = process.env.PORT || 5000;

// Production setup
if(process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/build")));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running.");
  });
}

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
