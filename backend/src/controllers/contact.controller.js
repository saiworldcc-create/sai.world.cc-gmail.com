const { validationResult } = require('express-validator');
const ContactMessage = require('../models/ContactMessage');
const Notification = require('../models/Notification');
const { sendContactAlert } = require('../services/emailService');

exports.createContactMessage = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ success: false, errors: errors.array() });

  try {
    const { name, phone, email, branch, destCountry, shipmentCategory, parcelWeight, pickupAddress, message, source } = req.body;
    const contactMsg = await ContactMessage.create({
      name, phone, email: email || '', branch: branch || 'Kadapa Main', destCountry: destCountry || '',
      shipmentCategory: shipmentCategory || '', parcelWeight: parcelWeight || '', pickupAddress: pickupAddress || '',
      message: message || '', source: source || 'contact',
    });

    sendContactAlert(contactMsg).catch(err => console.error('Contact email alert error:', err.message));

    Notification.create({
      title: source === 'quote' ? 'New Quote Request' : 'New Inquiry',
      message: `${name} (${phone}) requested information for ${destCountry || 'General'}`,
      type: source === 'quote' ? 'quote' : 'contact', link: '/admin/contacts'
    }).catch(err => console.error('Failed to create notification:', err));

    return res.status(201).json({ success: true, message: `Thank you, ${name}! Your inquiry has been received. We'll call you at ${phone} shortly.` });
  } catch (err) {
    console.error('Contact error:', err);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

exports.getAllContacts = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    return res.json({ success: true, data: messages });
  } catch (err) {
    console.error('Fetch contacts error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateContactReadStatus = async (req, res) => {
  try {
    const msg = await ContactMessage.findById(req.params.id);
    if (!msg) return res.status(404).json({ success: false, message: 'Message not found' });
    msg.read = req.body.read;
    await msg.save();
    return res.json({ success: true, data: msg });
  } catch (err) {
    console.error('Update contact error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.deleteContact = async (req, res) => {
  try {
    const msg = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!msg) return res.status(404).json({ success: false, message: 'Message not found' });
    return res.json({ success: true, message: 'Message deleted' });
  } catch (err) {
    console.error('Delete contact error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
