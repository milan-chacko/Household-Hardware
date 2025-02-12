import mongoose from 'mongoose';

const querySchema = new mongoose.Schema({
    email: { type: String, required: true },
    message: { type: String, required: true },
    reply:{type:String},
    status: { type: String, enum: ["pending", "answered"], default: "pending" },
    createdAt: { type: Date, default: Date.now },
  });
  
  const Query = mongoose.model("Query", querySchema);
  export default Query;