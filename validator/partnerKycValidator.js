import Joi from 'joi'

export const kycSchemaValidator = Joi.object({
  nameOnDocument: Joi.string().required(),
  documentType: Joi.string().required(),
  documentNumber: Joi.string().required(),
  frontImage: Joi.string().uri().required(),
  backImage: Joi.string().uri().required(),
});

export const verifyKycSchemaValidator = Joi.object({
  kycDocId: Joi.string().required(),
  isVerified: Joi.boolean().required(),
  rejectionReason: Joi.string().when("isVerified", {
    is: false,
    then: Joi.required(),
    otherwise: Joi.optional().allow(null),
  }),
});
