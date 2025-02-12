import express from 'express';
import User from '../models/user.model.js';
const checkOut = express.Router();

checkOut.get('/', async (req, res) => {
    const userId = req.query.userId; // Get the userId from the query string
  
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
  
    try {
      const user = await User.findById(userId);  // Use the userId from the request to fetch user data
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Send user data excluding sensitive information
      res.json({
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        address: user.address,
        phonenumber: user.phonenumber,
        location: user.location,
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user data', error });
    }
  });



// Update user details (address, pickup location, and phone number)
checkOut.put('/user/:userId', async (req, res) => {
  const { userId } = req.params;
  const { address, location, phonenumber } = req.body;  // Destructure the new data from the request body

  try {
    // Find the user by their ID
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user's details
    if (address) user.address = address;
    if (location) user.location = location;
    if (phonenumber) user.phonenumber = phonenumber;

    // Save the updated user data
    const updatedUser = await user.save();

    res.status(200).json({
      message: 'User details updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    console.error('Error updating user details:', error);
    res.status(500).json({ message: 'Error updating user details. Please try again later.' });
  }
});




export default checkOut;