import mongoose from "mongoose";

const contactUsSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
  },
}, { timestamps: true });

export default mongoose.model("ContactUs", contactUsSchema);
