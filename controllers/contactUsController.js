import ContactUs from "../models/contactUsModel.js";

export async function contactUs(req, res) {
    try {
      const { email } = req.body;
  
      const user = new ContactUs({
        email
      })  
      await user.save();
  
      return res
        .status(200)
        .json({ message: "Contact save successful !", user });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal Server Error !" });
    }
  }

  