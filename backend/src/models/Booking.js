const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    // Generated AWB
    awb: { type: String, required: true, unique: true },

    // User Reference
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    // Sender Info (Step 1)
    senderName: { type: String, required: true, trim: true },
    senderPhone: { type: String, required: true, trim: true },
    senderAddress: { type: String, required: true, trim: true },
    branchZone: { type: String, default: 'Kadapa Main' },
    pickupDate: { type: String },
    pickupTimeSlot: { type: String, default: 'Morning (09:00 AM – 12:00 PM)' },
    location: {
      lat: { type: Number },
      lng: { type: Number }
    },

    // Shipment Info (Step 2)
    destCountry: { type: String, required: true },
    receiverName: { type: String, required: true, trim: true },
    receiverPhone: { type: String, required: true, trim: true },
    itemCategory: { type: String, default: 'NRI Food & Pickles' },
    estimatedWeight: { type: String, default: '5–10 kg' },
    specialInstructions: { type: String, default: '' },

    // Status
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Picked Up', 'In Transit', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },

    // Payment Info
    paymentStatus: {
      type: String,
      enum: ['Unpaid', 'Pending', 'Paid'],
      default: 'Unpaid',
    },
    paymentAmount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
