import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  prefix: {
    type: String,
    enum: ["Mr.", "Miss", "Mrs."],
  },
  fullname: {
    type: String,
  },
  dob: {
    type: Date,
  },
  phone: {
    type: String,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Others"],
  },
  // image: {
  //   name: {
  //     type: String,
  //   },
  //   path: {
  //     type: String,
  //   },
  //   url: {
  //     type: String,
  //   },
  // },

  avatar: {
    type: String,
    required: false,
  },

  address1: {
    type: String,
  },
  address2: {
    type: String,
  },
  landmark: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  pincode: {
    type: String,
  },
  country: {
    type: String,
  },
  otp: {
    type: String,
  },

}, { timestamps: true });

export default mongoose.model("User", userSchema);
