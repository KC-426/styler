import Partner from "../models/partnerModel.js"
import KYC from "../models/kycModel.js"
import { kycSchemaValidator } from "../validator/partnerKycValidator.js";

export const uploadKYC = async (req, res) => {
    try {
      const partnerId = req.partnerId;
  
      // Validate the request body against the schema
      const validateReqBody = await kycSchemaValidator.validateAsync(req.body);
      const {
        nameOnDocument,
        documentType,
        documentNumber,
        frontImage,
        backImage,
      } = validateReqBody;
  
      // Check if a KYC entry already exists for the partnerDocId
      const existingEntry = await KYC.findOne({ partnerDocId: partnerId });
  
      if (existingEntry) {
        // Update the existing KYC entry
        existingEntry.nameOnDocument = nameOnDocument;
        existingEntry.documentType = documentType;
        existingEntry.documentNumber = documentNumber;
        existingEntry.frontImage = frontImage;
        existingEntry.backImage = backImage;
        await existingEntry.save();
  
        return res.status(200).json({
          success: true,
          message: `${documentType} updated successfully!`,
        });
      } else {
        // Create a new KYC entry
        const createEntry = await KYC.create({
          partnerDocId: partnerId,
          nameOnDocument,
          documentType,
          documentNumber,
          frontImage,
          backImage,
        });
  
        return res.status(200).json({
          success: true,
          message: `${documentType} verification will take some time!`,
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  };
  
  // ################################## KYC status  ##################################
 export const kycStatus = async (req, res) => {
    try {
      const partnerId = req.partnerId;
      const partner = await Partner.findById(partnerId);
  
      return res.status(200).json({
        success: true,
        kycStatus: partner.isKycVerified,
      });
    } catch (err) {
      console.log(err);
      return res.status(200).json({
        success: true,
        data: "Internal Server Error",
      });
    }
  };