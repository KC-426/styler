import NewsletterSignup from "../models/newsletterSignupModel.js";

export async function newsletterSignup(req, res) {
    try {
      const { email } = req.body;
  
      const user = new NewsletterSignup({
        email
      })  
      await user.save();
  
      return res
        .status(200)
        .json({ message: "Newsletter Signup successful !", user });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal Server Error !" });
    }
  }

  