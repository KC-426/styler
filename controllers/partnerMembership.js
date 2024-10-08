import PartnerMembership from "../models/partnerMembershipModel.js";
import Razorpay from "razorpay";
import verifyRazorPay from "../utils/verifyPayment.js";

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

export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      partnerId,
    } = req.body;

    // Verify the Razorpay signature using the helper function
    const isValidSignature = verifyRazorPay(
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature
    );

    if (isValidSignature) {
      // Update membership payment to completed status
      const membershipPayment = await PartnerMembership.findOneAndUpdate(
        { partnerId, status: "Pending" },
        {
          transactionId: razorpay_payment_id,
          paidAt: new Date(),
          status: "Completed",
        },
        { new: true }
      );

      if (!membershipPayment) {
        return res.status(404).json({
          success: false,
          message: "Membership payment record not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Payment verification successful!",
        membershipPayment,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Verification failed due to invalid signature!",
      });
    }
  } catch (error) {
    console.error("Error verifying the payment:", error);
    res.status(500).json({
      success: false,
      message: "Payment verification failed",
      error: error.message,
    });
  }
};


export const paymentFailed = async (req, res) => {
  try {
    const { partnerMembershipId } = req.body;

    const membershipPayment = await PartnerMembership.findOneAndUpdate(
      { _id: partnerMembershipId, status: "Pending" },
      { status: "Failed" },
      { news: true }
    );

    if (!membershipPayment) {
      return res
        .status(404)
        .json({ success: false, maessage: "Payment record not found !" });
    }

    res.status(200).json({
      success: false,
      message: "Payment marked as failed ",
      membershipPayment,
    });
  } catch (e) {
    console.error("Error marking payment as failed:", e);
    res.status(500).json({
      success: false,
      message: "Failed to mark payment as failed",
      error: e.message,
    });
  }
};

export const getpaymentstatus = async (req, res) => {
  try {
    const {partnerId} = req.params;
    const paymentStatus = await PartnerMembership.find({ partnerId })
      .sort({ createdAt: -1 })
      .exec();
    if (!paymentStatus) {
      return res
        .status(404)
        .json({
          success: false,
          message: "No payment record found for this partner",
        });
    }

    res
      .status(200)
      .json({
        success: true,
        message: "Payment status recieved successfully",
        data: paymentStatus
      });
  } catch (error) {
    console.error("Error retrieving payment status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve payment status",
      error: error.message,
    });
  }
};
