const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const bookingController = require('../controllers/booking.controller');
const { protect } = require('../middleware/auth');

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
  bookingController.createBooking
);

router.get('/', protect, bookingController.getAllBookings);
router.patch('/:id', protect, bookingController.updateBookingStatus);

router.post(
  '/email-invoice',
  [
    body('awb').trim().notEmpty().withMessage('AWB is required.'),
    body('email').isEmail().withMessage('Valid email is required.'),
  ],
  bookingController.sendEmailInvoice
);

module.exports = router;
