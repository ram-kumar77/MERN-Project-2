const mongoose = require("mongoose");
const User = require('../models/userModel');


const userSchema = new mongoose.Schema({
     username : {type:String , required: true},
     password : {type:String , required: true}
})

exports.loginUser = async (req, res) => {
     try {
         const { username, password } = req.body;
         const user = await User.findOne({ username, password });
         
         if (!user) {
             return res.status(400).json({ message: 'Invalid credentials' });
         }
 
         res.status(200).json(user);
     } catch (error) {
         res.status(500).json({ message: 'Login failed', error: error.message });
     }
 };

const userModel = mongoose.model('users' , userSchema)

module.exports = userModel