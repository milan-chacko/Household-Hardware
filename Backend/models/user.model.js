import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
  {
    firstname: {
      type: String,
      require: true,
    },
    lastname: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    address: {
      type: String,
    },
    location: {
      type: String, 
    },
    phonenumber: {
      type: String,
      require: true,
    },
    role: {
      type: String,
      default: "user",
    },
    status: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.statics.findUser =async function(email,password){
  const user = await User.findOne({email});
  console.log(user);

if(!user){
  console.log('User not found');
  return;
}

const isMatch = await bcrypt.compare (password,user.password);
console.log('Password match:', isMatch); // Log the result of password comparison

if(!isMatch){
  console.log('Invalid password');
  return;
}
  return user;
};

userSchema.pre('save',async function(next){
  const user = this;
  if(user.isModified('password')){
    user.password =await bcrypt.hashSync(user.password,8);
  }
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
