import mongoose from "mongoose";

const partnerMembershipSchema = new mongoose.Schema(
  {
    partnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Partner",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    transactionId: {
      type: String,
    },
    paidAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("PartnerMembership", partnerMembershipSchema);
