import ContactUs from "../models/contactUsModel.js";
import contactUsValidationSchema from "../validator/contactUsValidator.js";

export async function contactUs(req, res) {
  try {
    const { error } = contactUsValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email } = req.body;

    const user = new ContactUs({
      email,
    });
    await user.save();

    return res.status(200).json({ message: "Contact save successful !", user });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error !" });
  }
}
