import mongoose from "mongoose";

const kycSchema = new mongoose.Schema({
  partnerDocId: {
    type: String,
    required: true,
  },
  nameOnDocument: {
    type: String,
    required: true,
  },
  documentType: {
    type: String,
    required: true,
  },
  documentNumber: {
    type: String,
    required: true,
  },
  frontImage: {
    type: String,
    required: true,
  },
  backImage: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Verified", "Cancel"],
    default: "Pending",
  },
  rejectionReason: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export default mongoose.model("KYC", kycSchema);

