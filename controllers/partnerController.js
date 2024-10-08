import Partner from "../models/partnerModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config({ path: "config/.env" });
import nodemailer from "nodemailer";
import { uploadUserProfileImageToFirebaseStorage } from "../utils/helperFunctions.js";
import partnerValidatorSchema from "../validator/partnerValidator.js";
import Otp from "../models/otpModel.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

export async function partnerSignup(req, res) {
  try {
    const { error } = partnerValidatorSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password } = req.body;

    const findExistingPartner = await Partner.findOne({ email });
    if (findExistingPartner) {
      return res
        .status(400)
        .json({ message: "Partner already exist, please login !" });
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
      });
    }

    const hashedPwd = await bcrypt.hash(password, 12);

    const partner = new Partner({
      email,
      password: hashedPwd,
    });

    await partner.save();
    return res.status(201).json({ message: "Sign up successful !", partner });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error !" });
  }
}

export async function partnerLogin(req, res) {
  try {
    const { error } = partnerValidatorSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password } = req.body;

    const partner = await Partner.findOne({ email });
    if (!partner) {
      return res
        .status(400)
        .json({ message: "No partner found, please signup !" });
    }

    const isMatchPassword = await bcrypt.compare(password, partner.password);
    if (!isMatchPassword) {
      return res.status(400).json({ message: "Incorrect password !" });
    }

    const token = jwt.sign(
      { _id: partner._id, email: partner.email },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );
    res.cookie("jwt", token, {
      strict: true,
      secure: true,
      httpOnly: true,
      sameSite: "Strict",
    });

    return res.status(200).json({ message: "Login successful !", token });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error !" });
  }
}

export async function completePartnerProfile(req, res) {
  const { partnerId } = req.params;
  try {
    const trimmedBody = Object.fromEntries(
      Object.entries(req.body).map(([key, value]) => [key.trim(), value])
    );

    const { error } = partnerValidatorSchema.validate(trimmedBody);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const {
      prefix,
      fullname,
      email,
      dob,
      phone,
      gender,
      address1,
      address2,
      landmark,
      city,
      state,
      pincode,
      country,
    } = trimmedBody;

    // const imageFile = req.file;
    // if (!imageFile) {
    //   return res.status(400).json({ message: "Image is required !" });
    // }

    const partner = await Partner.findById(partnerId);
    if (!partner) {
      return res.status(400).json({ message: "partner not found !" });
    }

    if (email !== partner.email) {
      return res
        .status(400)
        .json({ message: "Please fill the correct email !" });
    }

    // const imageUrl = await uploadUserProfileImageToFirebaseStorage(req, res);

    partner.prefix = prefix;
    partner.fullname = fullname;
    partner.email = email;
    partner.dob = dob;
    partner.phone = phone;
    partner.gender = gender;
    partner.address1 = address1;
    partner.address2 = address2;
    partner.landmark = landmark;
    partner.city = city;
    partner.state = state;
    partner.pincode = pincode;
    partner.country = country;
    // partner.image = imageUrl;

    const otp = generateOtp();

    const mailOptions = {
      to: email,
      from: process.env.GMAIL_USER,
      subject: "Email verification code !",
      text: `Please verify your email, Otp for verification is ${otp}`,
    };

    await transporter.sendMail(mailOptions);

    const otpRecord = new Otp({
      otp,
      partnerId: partner._id,
    });
    await otpRecord.save();

    await partner.save();

    return res
      .status(200)
      .json({ message: "Profile completed successfully !", partner });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error !" });
  }
}

export async function getAllPartners(req, res) {
  try {
    const partners = await Partner.find();

    if (!partners || partners.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No partner found !" });
    }

    return res
      .status(200)
      .json({
        success: true,
        message: "Partners fetched successful!",
        partners,
      });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
}

export async function verifyEmail(req, res) {
  try {
    const { error } = partnerValidatorSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { otp } = req.body;
    const partner = req.partner;

    const dbOtp = await Otp.findOne({ partnerId: partner._id });

    if (!dbOtp) {
      return res.status(400).json({ message: "OTP not found or expired!" });
    }

    if (otp !== dbOtp.otp) {
      return res.status(400).json({ message: "Invalid OTP!" });
    }

    await partner.save();
    await Otp.deleteOne({ partnerId: partner._id });

    return res.status(200).json({ message: "Email verification successful!" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
}

export async function sendOtp(req, res) {
  try {
    const partner = req.partner;
    console.log(partner);

    const otp = generateOtp();

    const mailOptions = {
      to: partner.email,
      from: process.env.GMAIL_USER,
      subject: "Email verification code !",
      text: `Please verify your email, Otp for verification is ${otp}`,
    };

    await transporter.sendMail(mailOptions);

    const otpRecord = new Otp({
      otp,
      partnerId: partner._id,
    });
    await otpRecord.save();

    return res
      .status(200)
      .json({ message: "Otp sent successfully on your mail !", otpRecord });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error !" });
  }
}

export async function changepassword(req, res) {
  try {
    const partner = req.partner;
    console.log(partner);

    const { newPassword, confirmpassword } = req.body;

    if (newPassword !== confirmpassword) {
      return res
        .status(400)
        .json({ message: "confirm password should match !" });
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
      });
    }

    const hashedPwd = await bcrypt.hash(newPassword, 12);

    partner.password = hashedPwd;

    await partner.save();

    return res
      .status(200)
      .json({ message: "Password Changed successfully !", partner });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error !" });
  }
}
