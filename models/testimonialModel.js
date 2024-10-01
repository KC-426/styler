import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema({
  about: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, { timestamps: true });

export default mongoose.model("Testimonial", testimonialSchema);
