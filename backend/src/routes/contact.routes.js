const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const ContactMessage = require('../models/ContactMessage');
const { sendContactAlert } = require('../services/emailService');

// POST /api/v1/contact
router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required.'),
    body('phone').trim().notEmpty().withMessage('Phone number is required.'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() });
    }

    try {
      const {
        name, phone, email, branch, destCountry,
        shipmentCategory, parcelWeight, pickupAddress, message, source,
      } = req.body;

      const contactMsg = await ContactMessage.create({
        name,
        phone,
        email: email || '',
        branch: branch || 'Kadapa Main',
        destCountry: destCountry || '',
        shipmentCategory: shipmentCategory || '',
        parcelWeight: parcelWeight || '',
        pickupAddress: pickupAddress || '',
        message: message || '',
        source: source || 'contact',
      });

      // Asynchronously send email alert to admin & customer
      sendContactAlert(contactMsg).catch(err => console.error('Contact email alert error:', err.message));

      return res.status(201).json({
        success: true,
        message: `Thank you, ${name}! Your inquiry has been received. We'll call you at ${phone} shortly.`,
      });
    } catch (err) {
      console.error('Contact error:', err);
      return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
    }
  }
);

module.exports = router;
