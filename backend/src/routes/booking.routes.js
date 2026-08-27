const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const { sendBookingAlert } = require('../services/emailService');

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

      // Asynchronously send email alert to admin
      sendBookingAlert(booking).catch(err => console.error('Booking email alert error:', err.message));

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

module.exports = router;
