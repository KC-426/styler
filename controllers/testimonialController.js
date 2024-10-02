import Testimonial from "../models/testimonialModel.js";
import testimonialValidatorSchema from "../validator/testimonialValidator.js";

export async function addTestimonial(req, res) {
  try {
    const { error } = testimonialValidatorSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { about } = req.body;
    const user = req.user;
    console.log(user);

    const testimonial = new Testimonial({
      about,
      user,
    });
    await testimonial.save();

    return res
      .status(200)
      .json({ message: "Testimonial saved successfully !", testimonial });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error !" });
  }
}

export async function getTestimonial(req, res) {
  try {
    const testimonial = await Testimonial.find().populate("user");

    if (!testimonial || testimonial.length === 0) {
      return res.status(400).json({ message: "No testimonial found !" });
    }

    return res
      .status(200)
      .json({ message: "Testimonial fetched  successfully !", testimonial });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error !" });
  }
}
