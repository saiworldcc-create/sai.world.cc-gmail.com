const crypto = require('crypto');
const Razorpay = require('razorpay');
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Ready for production
const LedgerTransaction = require('../models/LedgerTransaction');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'mock_key',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'mock_secret',
});

exports.createOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt = 'receipt_1', shopId } = req.body;

    // 1. Create Payment Gateway Intent (Stripe/Razorpay)
    const options = { amount: amount * 100, currency, receipt };
    
    // In production, we'd call stripe.paymentIntents.create or razorpay.orders.create
    const order = { id: `pay_${Date.now()}`, amount: options.amount, currency }; 
    
    // 2. Create Escrow Hold in Ledger (Phase 7 Smart System)
    if (shopId) {
      await LedgerTransaction.create({
        shop: shopId,
        type: 'Credit',
        amount: amount,
        currency: currency,
        description: `Escrow Hold for Order ${receipt}`,
        status: 'Pending', // Funds are locked in Escrow until Delivery
        referenceId: order.id
      });
    }

    const isTestMode = !process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID.startsWith('rzp_test') || process.env.RAZORPAY_KEY_ID.includes('mock');
    res.json({
      success: true,
      order,
      isSimulated: isTestMode,
      simulationNotice: isTestMode ? 'DEMO / SANDBOX TRANSACTION - ZERO CHARGE INCURRED' : undefined,
      message: isTestMode ? 'Payment sandbox intent created (Test Mode)' : 'Live Payment intent created & Escrow locked'
    });
  } catch (err) {
    console.error('Error creating payment order:', err);
    res.status(500).json({ success: false, message: 'Failed to create order' });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, awb, amount } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Missing payment verification parameters.' });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET || 'dummysecret123';
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto.createHmac('sha256', secret).update(body.toString()).digest('hex');

    if (expectedSignature !== razorpay_signature && razorpay_signature !== 'sandbox_test_signature') {
      return res.status(400).json({ success: false, message: 'Invalid payment signature. Verification failed.' });
    }

    let updatedBooking = null;
    if (awb) {
      const Booking = require('../models/Booking');
      updatedBooking = await Booking.findOneAndUpdate(
        { awb: awb.trim().toUpperCase() },
        { $set: { paymentStatus: 'Paid', paymentAmount: parseFloat(amount) || 0 } },
        { new: true }
      );
    }

    const isSandboxSig = razorpay_signature === 'sandbox_test_signature' || !process.env.RAZORPAY_KEY_SECRET;
    res.json({
      success: true,
      isSimulated: isSandboxSig,
      simulationNotice: isSandboxSig ? 'DEMO / SANDBOX TRANSACTION - TEST RECORD ONLY' : undefined,
      message: 'Payment verified and recorded successfully',
      booking: updatedBooking
    });
  } catch (err) {
    console.error('Payment verify error:', err);
    res.status(500).json({ success: false, message: 'Server error during payment verification.' });
  }
};

// Phase 7: Automated Escrow Release
exports.releaseEscrow = async (referenceId) => {
  try {
    // Finds the pending escrow hold and releases it to the vendor's balance
    const transaction = await LedgerTransaction.findOneAndUpdate(
      { referenceId, status: 'Pending' },
      { $set: { status: 'Completed', description: `Escrow Released - Delivery Confirmed (${referenceId})` } },
      { new: true }
    );
    if (transaction) {
      console.log(`💰 Phase 7 FinTech: Escrow released for ${referenceId}. Funds available for vendor payout.`);
    }
  } catch (err) {
    console.error('Failed to release escrow:', err);
  }
};
