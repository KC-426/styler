import crypto from "crypto";

const razorpay_order_id = 'order_P6YISvBBTxABdi'; 
const razorpay_payment_id = 'pay_29QQoUBi66xm2f';
const secret = '06r0x5Sl4VtiJfVqlC0hVnvp'; 

// Adjust the function to accept parameters in the correct order
const generateSignature = (razorpay_order_id, razorpay_payment_id, secretKey) => {
  const body = `${razorpay_order_id}|${razorpay_payment_id}`; 
  const expectedSignature = crypto
    .createHmac('sha256', secretKey) // Using sha256 algorithm
    .update(body) // Update the HMAC with the correct body string
    .digest('hex'); // Convert to hexadecimal format
  return expectedSignature;
};

// Generating the signature using correct order of parameters
const razorpay_signature = generateSignature(razorpay_order_id, razorpay_payment_id, secret);

console.log('Order ID:', razorpay_order_id);
console.log('Payment ID:', razorpay_payment_id);
console.log('Generated Razorpay Signature:', razorpay_signature);
