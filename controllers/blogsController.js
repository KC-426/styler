import Blogs from "../models/blogsModel.js";
import { uploadBlogImageToFirebaseStorage } from "../utils/helperFunctions.js";
import blogsValidatorSchema from "../validator/blogsValidator.js";

export async function addBlog(req, res) {
  try {
    const { error } = blogsValidatorSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { title, description } = req.body;
    const imageFile = req.file;
    if (!imageFile) {
      return res.status(400).json({ message: "Image is required !" });
    }

    const user = req.user;
    console.log(user);

    const imageUrl = await uploadBlogImageToFirebaseStorage(req, res);

    const blog = new Blogs({
      title,
      description,
      user,
      image: imageUrl,
    });
    await blog.save();

    return res.status(200).json({ message: "Blog saved successfully !", blog });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error !" });
  }
}

export async function getBlogs(req, res) {
  try {
    const blogs = await Blogs.find().populate("user");

    if (!blogs || blogs.length === 0) {
      return res.status(400).json({ message: "No blogs found " });
    }

    return res
      .status(200)
      .json({ message: "Blogs fetched  successfully !", blogs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error !" });
  }
}
