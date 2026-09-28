const crypto = require('crypto');
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt = 'receipt_1' } = req.body;

    const options = {
      amount: amount * 100, // amount in smallest currency unit
      currency,
      receipt,
    };

    const order = await razorpay.orders.create(options);

    res.json({ success: true, order });
  } catch (err) {
    console.error('Error creating razorpay order:', err);
    res.status(500).json({ success: false, message: 'Failed to create order' });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // In a real app, update booking/shipment status as paid here
      res.json({ success: true, message: 'Payment verified successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }
  } catch (err) {
    console.error('Error verifying payment:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
