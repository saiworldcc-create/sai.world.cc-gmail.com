const express = require('express');
const router = express.Router();
const Shipment = require('../models/Shipment');

// Generic fallback data for unknown AWBs
function buildGenericShipment(awbCode) {
  return {
    awb: awbCode.toUpperCase(),
    status: 'In Transit (Express Cargo)',
    stage: 3,
    sender: 'Verified Sender (Andhra Pradesh)',
    receiver: 'Overseas Consignee',
    contents: 'International Courier Parcel',
    carrier: 'Sai Global Express Air Network',
    deadWeight: '5.0 kg',
    volWeight: '5.4 kg',
    chargeableWeight: '5.4 kg',
    origin: 'Kadapa Main Hub Depot',
    destination: 'International Gateway',
    eta: '3–4 Business Days Remaining',
    history: [
      { status: 'In Transit on International Connection Flight', time: 'Today, 06:45 AM', location: 'International Cargo Hub', completed: true, active: true },
      { status: 'Departed RGIA Hyderabad Air Cargo Gateway', time: 'Yesterday, 09:20 PM', location: 'Hyderabad Airport', completed: true, active: false },
      { status: 'Export Documentation & KYC Verification Approved', time: 'Yesterday, 03:15 PM', location: 'Kadapa Hub Depot', completed: true, active: false },
      { status: 'Doorstep Picked Up & Vacuum Box Packed', time: '2 Days ago, 11:30 AM', location: 'Andhra Pradesh Service Zone', completed: true, active: false },
    ],
  };
}

// GET /api/v1/tracking/:awb
router.get('/:awb', async (req, res) => {
  try {
    const awbCode = req.params.awb.trim().toUpperCase();

    if (!awbCode || awbCode.length < 3) {
      return res.status(400).json({ success: false, message: 'Invalid AWB number.' });
    }

    const shipment = await Shipment.findOne({ awb: awbCode }).lean();

    if (!shipment) {
      // Return generic demo data instead of 404 to match original behaviour
      const generic = buildGenericShipment(awbCode);
      return res.json({ success: true, data: generic, source: 'demo' });
    }

    return res.json({ success: true, data: shipment, source: 'db' });
  } catch (err) {
    console.error('Tracking error:', err);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

module.exports = router;
