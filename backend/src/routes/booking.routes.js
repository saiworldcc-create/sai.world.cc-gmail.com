const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const User = require('../models/User');
const { sendBookingAlert, sendBookingInvoice } = require('../services/emailService');
const { protect } = require('../middleware/auth');
const jwt = require('jsonwebtoken');

function generateAWB(destCountry) {
  const rand = Math.floor(10000 + Math.random() * 90000);
  const code = (destCountry || 'EXP').substring(0, 3).toUpperCase().replace(/\s/g, '');
  return `SAI-${rand}-${code}`;
}

// POST /api/v1/bookings
router.post(
  '/',
  [
    body('senderName').trim().notEmpty().withMessage('Sender name is required.'),
    body('senderPhone').trim().notEmpty().withMessage('Sender phone is required.'),
    body('senderAddress').trim().notEmpty().withMessage('Pickup address is required.'),
    body('destCountry').trim().notEmpty().withMessage('Destination country is required.'),
    body('receiverName').trim().notEmpty().withMessage('Receiver name is required.'),
    body('receiverPhone').trim().notEmpty().withMessage('Receiver phone is required.'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() });
    }

    try {
      const {
        senderName, senderPhone, senderAddress, branchZone,
        pickupDate, pickupTimeSlot, destCountry, receiverName,
        receiverPhone, itemCategory, estimatedWeight, specialInstructions,
      } = req.body;

      const awb = generateAWB(destCountry);

      const booking = await Booking.create({
        awb,
        senderName,
        senderPhone,
        senderAddress,
        branchZone: branchZone || 'Kadapa Main',
        pickupDate: pickupDate || '',
        pickupTimeSlot: pickupTimeSlot || 'Morning (09:00 AM – 12:00 PM)',
        destCountry,
        receiverName,
        receiverPhone,
        itemCategory: itemCategory || 'NRI Food & Pickles',
        estimatedWeight: estimatedWeight || '5–10 kg',
        specialInstructions: specialInstructions || '',
      });

      // Optionally attach user if token exists, and auto-send invoice to their email
      let userEmail = null;
      if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
          const token = req.headers.authorization.split(' ')[1];
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          booking.user = decoded.id;
          await booking.save();

          // Look up the user's registered email
          const userDoc = await User.findById(decoded.id);
          if (userDoc && userDoc.email) {
            userEmail = userDoc.email;
          }
        } catch (e) {
          console.warn('Booking created without user linkage: Invalid token');
        }
      }

      // Asynchronously send email alert to admin
      sendBookingAlert(booking).catch(err => console.error('Booking email alert error:', err.message));

      // If user is logged in, automatically send booking invoice to their registered email
      if (userEmail) {
        sendBookingInvoice(booking, userEmail).catch(err => console.error('User booking invoice error:', err.message));
      }

      return res.status(201).json({
        success: true,
        message: 'Pickup booking confirmed!',
        data: {
          awb: booking.awb,
          status: booking.status,
          senderName: booking.senderName,
          senderPhone: booking.senderPhone,
          branchZone: booking.branchZone,
          destCountry: booking.destCountry,
        },
      });
    } catch (err) {
      console.error('Booking error:', err);
      return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
    }
  }
);

// GET /api/v1/bookings (Admin only)
router.get('/', protect, async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (err) {
    console.error('Fetch bookings error:', err);
    res.status(500).json({ success: false, message: 'Server error fetching bookings.' });
  }
});

// PATCH /api/v1/bookings/:id (Admin only) - Update status
router.patch('/:id', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    booking.status = status;
    await booking.save();
    
    // In a full implementation, this could also create a Shipment record or add a milestone to the Shipment
    // based on the admin's action.

    res.json({ success: true, message: `Booking status updated to ${status}.`, booking });
  } catch (err) {
    console.error('Update booking error:', err);
    res.status(500).json({ success: false, message: 'Server error updating booking.' });
  }
});

// POST /api/v1/bookings/email-invoice - Send booking invoice to customer email
router.post(
  '/email-invoice',
  [
    body('awb').trim().notEmpty().withMessage('AWB is required.'),
    body('email').isEmail().withMessage('Valid email is required.'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() });
    }

    try {
      const { awb, email } = req.body;

      // Find the booking by AWB
      const booking = await Booking.findOne({ awb });
      if (!booking) {
        return res.status(404).json({ success: false, message: 'Booking not found for this AWB.' });
      }

      // Send the invoice email
      await sendBookingInvoice(booking, email);

      return res.json({
        success: true,
        message: `Invoice email sent successfully to ${email}`,
      });
    } catch (err) {
      console.error('Email invoice error:', err);
      return res.status(500).json({ success: false, message: 'Failed to send invoice email. Please try again.' });
    }
  }
);

module.exports = router;
