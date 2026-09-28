const mongoose = require('mongoose');

const trackingHistorySchema = new mongoose.Schema({
  status: { type: String, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  completed: { type: Boolean, default: true },
  active: { type: Boolean, default: false },
});

const shipmentSchema = new mongoose.Schema(
  {
    awb: { type: String, required: true, unique: true, uppercase: true, trim: true },
    status: { type: String, required: true, default: 'In Transit' },
    stage: { type: Number, required: true, default: 1, min: 1, max: 5 },
    sender: { type: String, required: true },
    receiver: { type: String, required: true },
    contents: { type: String, required: true },
    carrier: { type: String, required: true },
    deadWeight: { type: String, required: true },
    volWeight: { type: String, required: true },
    chargeableWeight: { type: String, required: true },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    eta: { type: String, required: true },
    history: [trackingHistorySchema],
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    liveLocation: {
      lat: { type: Number },
      lng: { type: Number },
      timestamp: { type: Date }
    },
    pod: {
      signatureUrl: { type: String },
      photoUrl: { type: String }
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Shipment', shipmentSchema);
