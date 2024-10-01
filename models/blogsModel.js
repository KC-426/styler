import mongoose from "mongoose";

const blogsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }, 
  image: {
    name: {
        type: String
    },
    path: {
        type: String
    },
    url: {
        type: String
    },
  }
}, { timestamps: true });

export default mongoose.model("Blogs", blogsSchema);
