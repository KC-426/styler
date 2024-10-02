import Joi from "joi"

const newsletterSignupValidatorSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.empty": "Email is required",
        "string.email": "Invalid email format"
    })
})

export default newsletterSignupValidatorSchema