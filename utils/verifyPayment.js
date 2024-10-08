import crypto from 'crypto';
import dotenv from "dotenv";
dotenv.config({ path: "config/.env" });

const verifyRazorPay = (razorpay_payment_id, razorpay_order_id, razorpay_signature) => {
  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = crypto
  .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
  .update(body.toString())
  .digest("hex");

console.log("Expected Signature: ", expectedSignature);
console.log("Received Signature: ", razorpay_signature);


  return expectedSignature === razorpay_signature;
};

export default verifyRazorPay;
