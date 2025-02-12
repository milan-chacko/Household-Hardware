import express from "express";
import User from '../models/user.model.js';
const getUserById = express.Router();

getUserById.get('/:id',async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Failed to fetch user' });
  }
});

getUserById.put('/:id',async (req,res) => {

  try{
    const { firstname, lastname, phonenumber, address, location } = req.body;

    // Ensure email cannot be updated
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { firstname, lastname, phonenumber, address, location },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  }catch(error) {
    res.status(500).json({ message: "Error updating user", error });
  }

});

export default getUserById;