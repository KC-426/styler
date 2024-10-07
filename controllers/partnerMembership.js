import { CostOptimizationHub } from "aws-sdk";
import PartnerMembership from "../models/partnerMembershipModel.js";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createMembershipPayment = async (req, res) => {
  try {
    const { partnerId, amount } = req.body;
    if (!amount || isNaN(amount) || amount <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid amount" });
    }

    const membershipPayment = new PartnerMembership({
      partnerId,
      amount,
      status: "Pending",
      PaidAt: null,
    });

    await membershipPayment.save();
    razorpay.orders.create(
      {
        amount: amount * 100,
        currency: "INR",
      },
      (err, order) => {
        if (err) {
          console.error("Order creation error", err);
          return res.status(400).json({
            success: false,
            message: "Order creation failed",
            error: err,
          });
        }
        // If order creation is successful, send order details to the client

        console.log("Membership Order Created Successfully");

        return res.status(200).json({
          success: true,
          message: "Membership created successfully",
          order,
          membershipPayment,
        });
      }
    );
  } catch (error) {
    console.error("Error creating membership payment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create membership order",
      error: error.message,
    });
  }
};
