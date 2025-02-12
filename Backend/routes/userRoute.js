import express from 'express';
import User from '../models/user.model.js'
const userRouter = express.Router();

//user insert
userRouter.post("/", async (request, response) => {
  try {
    if (
      !request.body.firstname ||
      !request.body.lastname||
      !request.body.email ||
      !request.body.password ||
      !request.body.phonenumber
    ) {
      return response.status(4000).send({
        message: "Send all required fields: name, email, password, phone",
      });
    }
    const newUser = {
      firstname: request.body.firstname,
      lastname: request.body.lastname,
      email: request.body.email,
      password: request.body.password,
      phonenumber: request.body.phonenumber,
      address: request.body.address,
    };
    const user = await User.create(newUser);
    return response.status(200).send(user);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});


// //user all data
userRouter.get('/',async(request,response)=>{
  try{
      const users = await User.find({ role: "user" });
      return response.status(200).json(users);
  }catch(error){
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

userRouter.post('/id:',async(res,req)=>{
  const { id } = req.params;
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update password", error });
  }
});

export default userRouter;