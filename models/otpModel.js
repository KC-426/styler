import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  otp: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    // required: true,
  },
  partnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Partner",
    // required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, 
  },
});

export default mongoose.model("Otp", otpSchema);
