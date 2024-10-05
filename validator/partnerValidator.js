import Joi from "joi";

const partnerValidatorSchema = Joi.object({
    email: Joi.string().email().optional().messages({
        "string.email": "Invalid email format"
    }),

    prefix: Joi.string().valid("Mr.", "Miss", "Mrs.").optional().messages({
       "any.only": "Prefix must be any of 'Mr.', 'Miss', 'Mrs.'"
    }),

    gender: Joi.string().valid('Male', "Female", "Others").optional().messages({
        "any.only": "Gender must be one of 'Male', 'Female', or 'Others'",
    }),

    fullname: Joi.string().optional().allow('').messages({
        "string.empty": "Full name cannot be empty "
    }),

    dob: Joi.date().optional().messages({
        'date.base': "Invalid date format"
    }),

    phone: Joi.string().pattern(/^[0-9]{10}$/).optional().messages({
        "string.pattern.base": "Invalid phone number format, it must be 10 digits",
    }),

    address1: Joi.string().optional().allow("").messages({
        'string.base': "Invalid format for address line 1"
    }),

    address2: Joi.string().optional().allow('').messages({
        "string.base": "Invalid format for address line 2"
    }),

    landmark: Joi.string().optional().allow("").messages({
        "string.base": "Invalid landmark format"
    }),

    city: Joi.string().optional().allow('').messages({
        "string.empty": "City is required",
    }),
    
    state: Joi.string().optional().allow('').messages({
        "string.empty": "State is required",
    }),
    
    pincode: Joi.string().pattern(/^[0-9]{6}$/).optional().messages({
        "string.pattern.base": "Invalid pincode format, it must be 6 digits",
    }),
    
    country: Joi.string().optional().allow('').messages({
        "string.empty": "Country is required",
    }),
    
    otp: Joi.string().pattern(/^[0-9]{6}$/).optional().messages({
        "string.empty": "OTP is required",
        "string.pattern.base": "Invalid OTP format, it must be 6 digits",
    }),
    
    password: Joi.string().min(6).optional().allow('').messages({
        "string.min": "Password must be at least 6 characters long",
    }),
});

export default partnerValidatorSchema;
