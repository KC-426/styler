import Joi from "joi"

const blogsValidatorSchema = Joi.object({
    title: Joi.string().required().messages({
        "string.empty": "Title is required",
        "string.title": "Invalid title format"
    }),
    descriptio: Joi.string().required().messages({
        "string.empty": "Description is required",
        "string.description": "Invalid description format"
    })
})

export default blogsValidatorSchema