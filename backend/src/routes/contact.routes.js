const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const contactController = require('../controllers/contact.controller');
const { protect } = require('../middleware/auth');

router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required.'),
    body('phone').trim().notEmpty().withMessage('Phone number is required.'),
  ],
  contactController.createContactMessage
);

router.get('/', protect, contactController.getAllContacts);
router.patch('/:id', protect, contactController.updateContactReadStatus);
router.delete('/:id', protect, contactController.deleteContact);

module.exports = router;
