import Joi from "joi"

const testimonialValidatorSchema = Joi.object({
    about: Joi.string().about().required().messages({
        "string.empty": "About the testimonial is required",
        "string.about": "Invalid about format of about"
    })
})

export default testimonialValidatorSchema