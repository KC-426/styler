import Joi from "joi";

const userValidatorSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Invalid email format",
  }),

  fullname: Joi.string().required().messages({
    "string.empty": "Fullname is required",
  }),

  dob: Joi.date().required().messages({
    "date.empty": "dob is required",
    "date.base": "Invalid dob format",
  }),

  phone: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
    "string.empty": "Phone number is required",
    "string.pattern.base": "Invalid phone number format, it must be 10 digits",
  }),

  address1: Joi.string().required().messages({
    "string.empty": "address line 1 is required",
  }),

  address2: Joi.string().optional().allow('').messages({
    "string.base": "Invalid format for address line 2",
  }),

  landmark: Joi.string().required().messages({
    "string.empty": "landmark is required",  }),

  city: Joi.string().required().messages({
    "string.empty": "city is required",
  }),

  state: Joi.string().required().messages({
    "string.empty": "state is required",
  }),

  pincode: Joi.string().pattern(/^[0-9]{6}$/).required().messages({
    "string.empty": "Pincode is required",
    "string.pattern.base": "Invalid pincode format, it must be 6 digits",
  }),

  country: Joi.string().required().messages({
    "string.empty": "country is required",
  }),

  otp: Joi.string().pattern(/^[0-9]{6}$/).required().messages({
    "string.empty": "OTP is required",
    "string.pattern.base": "Invalid OTP format, it must be 6 digits",
  }),
});

export default userValidatorSchema;
