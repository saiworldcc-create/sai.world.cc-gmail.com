const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, default: '' },
    branch: { type: String, default: 'Kadapa Main' },
    destCountry: { type: String, default: '' },
    shipmentCategory: { type: String, default: '' },
    parcelWeight: { type: String, default: '' },
    pickupAddress: { type: String, default: '' },
    message: { type: String, default: '' },
    source: { type: String, enum: ['contact', 'pickup'], default: 'contact' },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ContactMessage', contactMessageSchema);
