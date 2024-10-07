import Partner from "../models/partnerModel.js";
import KYC from "../models/kycModel.js";
import { kycSchemaValidator } from "../validator/partnerKycValidator.js";

export const uploadKyc = async (req, res) => {
  try {
    const partner = req.partner;

    const {
      nameOnDocument,
      documentType,
      documentNumber,
      frontImage,
      backImage,
    } = req.body;

    const { error } = kycSchemaValidator.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const existingKycEntry = await KYC.findOne({ partnerDocId: partner._id });

    if (existingKycEntry) {
      existingKycEntry.nameOnDocument = nameOnDocument;
      existingKycEntry.documentType = documentType;
      existingKycEntry.documentNumber = documentNumber;
      existingKycEntry.frontImage = frontImage;
      existingKycEntry.backImage = backImage;

      await existingKycEntry.save();
      return res.status(200).json({
        success: true,
        message: `${documentType} updated successfully`,
        existingKycEntry,
      });
    } else {
      const kycData = new KYC({
        partnerDocId: partner._id,
        nameOnDocument,
        documentType,
        documentNumber,
        frontImage,
        backImage,
      });
      await kycData.save();
      return res.status(201).json({
        success: true,
        message: `${documentType} updated successfully`,
        kycData,
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

export const kycStatus = async (req, res) => {
  try {
    const partner = req.partner;
    console.log(partner);
    const dbPartner = await Partner.findById(partner._id);

    return res
      .status(200)
      .json({ success: true, kycStatus: dbPartner.isKycVerified });
  } catch (err) {
    console.log(err);
    return res.status(200).json({
      success: true,
      data: "Internal Server Error",
    });
  }
};

export const fetchPartnerKyc = async (req, res) => {
  try {
    const partner = req.partner;
    console.log(partner);
    const response = await KYC.find({ partnerDocId: partner._id }).sort({ createdAt: 1 });
    if (!response) {
      return res.status(400).json({
        success: false,
        msg: "Not Found",
      });
    }
    return res.status(200).json({
      success: true,
      data: response,
    });
  } catch (err) {
    console.log(err);
    return res.status(200).json({
      success: true,
      data: "Internal Server Error",
    });
  }
};

export const getKycDetails = async (req, res) => {
  const { kycDocId } = req.params;
  try {
    const details = await KYC.findById(kycDocId);
    if (!details) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "KYC details fetched !", details });
  } catch (err) {
    console.log(err);
    return res.status(200).json({
      success: true,
      data: "Internal Server Error",
    });
  }
};

export const kycVerification = async (req, res) => {
  const { kycDocId } = req.params;
  try {

  } catch (err) {
    console.log(err);
    return res.status(200).json({
      success: true,
      data: "Internal Server Error",
    });
  }
};
