const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: {
    type: String,
    enum: ['order', 'pickup', 'quote', 'contact', 'delivery', 'other'],
    default: 'other'
  },
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }],
  link: { type: String, default: '' }, // e.g. frontend path to view the detail
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
