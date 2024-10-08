import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config({ path: "config/.env" });
import nodemailer from "nodemailer";
import { uploadUserProfileImageToFirebaseStorage } from "../utils/helperFunctions.js";
import userValidatorSchema from "../validator/userValidator.js";
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

export async function userSignup(req, res) {
  try {
    const { error } = userValidatorSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password } = req.body;

    const findExistingUser = await User.findOne({ email });
    if (findExistingUser) {
      return res
        .status(400)
        .json({ message: "User already exist, please login !" });
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

    const user = new User({
      email,
      password: hashedPwd,
    });

    await user.save();
    return res.status(201).json({ message: "Sign up successful !", user });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error !" });
  }
}

export async function userLogin(req, res) {
  try {
    const { error } = userValidatorSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "No user found, please signup !" });
    }

    const isMatchPassword = await bcrypt.compare(password, user.password);
    if (!isMatchPassword) {
      return res.status(400).json({ message: "Incorrect password !" });
    }

    const token = jwt.sign(
      { _id: user._id, email: user.email },
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

export async function completeUserProfile(req, res) {
  const { userId } = req.params;
  try {
    const trimmedBody = Object.fromEntries(
      Object.entries(req.body).map(([key, value]) => [key.trim(), value])
    );

    const { error } = userValidatorSchema.validate(trimmedBody);
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

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User not found !" });
    }

    if (email !== user.email) {
      return res
        .status(400)
        .json({ message: "Please fill the correct email !" });
    }

    // const imageUrl = await uploadUserProfileImageToFirebaseStorage(req, res);

    user.prefix = prefix;
    user.fullname = fullname;
    user.email = email;
    user.dob = dob;
    user.phone = phone;
    user.gender = gender;
    user.address1 = address1;
    user.address2 = address2;
    user.landmark = landmark;
    user.city = city;
    user.state = state;
    user.pincode = pincode;
    user.country = country;
    // user.image = imageUrl;

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
      userId: user._id,
    });
    await otpRecord.save();
    await user.save();
    console.log("User saved successfully:", user);

    return res
      .status(200)
      .json({ message: "Profile completed successfully !", user });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error !" });
  }
}

export async function verifyEmail(req, res) {
  try {
    const { error } = userValidatorSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { otp } = req.body;
    const user = req.user;

    const dbOtp = await Otp.findOne({ userId: user._id });

    if (!dbOtp) {
      return res.status(400).json({ message: "OTP not found or expired!" });
    }

    if (otp !== dbOtp.otp) {
      return res.status(400).json({ message: "Invalid OTP!" });
    }

    await user.save();
    await Otp.deleteOne({ userId: user._id });

    return res.status(200).json({ message: "Email verification successful!" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
}

export async function sendOtp(req, res) {
  try {
    const user = req.user;

    const otp = generateOtp();

    const mailOptions = {
      to: user.email,
      from: process.env.GMAIL_USER,
      subject: "Email verification code !",
      text: `Please verify your email, Otp for verification is ${otp}`,
    };

    await transporter.sendMail(mailOptions);

    const otpRecord = new Otp({
      otp,
      userId: user._id,
    });
    await otpRecord.save();

    return res
      .status(200)
      .json({ message: "Otp sent successfully on your email !", otpRecord });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error !" });
  }
}

export async function changepassword(req, res) {
  try {
    const user = req.user;
    console.log(user);

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

    user.password = hashedPwd;

    await user.save();

    return res
      .status(200)
      .json({ message: "Password Changed successfully !", user });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error !" });
  }
}
