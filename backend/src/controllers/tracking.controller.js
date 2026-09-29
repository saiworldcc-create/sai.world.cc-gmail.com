const Shipment = require('../models/Shipment');
const EcomOrder = require('../models/EcomOrder');
const Booking = require('../models/Booking');

// Generic fallback data for unknown AWBs
function buildGenericShipment(awbCode) {
  return {
    awb: awbCode.toUpperCase(),
    status: 'In Transit (Express Cargo)',
    stage: 3,
    type: 'international',
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

exports.getTracking = async (req, res) => {
  try {
    const awbCode = req.params.awb.trim().toUpperCase();

    if (!awbCode || awbCode.length < 3) {
      return res.status(400).json({ success: false, message: 'Invalid AWB number.' });
    }

    let shipment = await Shipment.findOne({ awb: awbCode }).lean();

    if (shipment) {
      shipment.type = 'international';
      return res.json({ success: true, data: shipment, source: 'db' });
    }

    const ecomOrder = await EcomOrder.findOne({ orderNumber: awbCode }).lean();
    
    if (ecomOrder) {
      const type = ecomOrder.sendAbroad ? 'international' : 'domestic';
      let stage = 1;
      if (ecomOrder.status === 'confirmed') stage = 2;
      if (ecomOrder.status === 'shipped') stage = 3;
      if (ecomOrder.status === 'delivered') stage = 5;
      
      let syntheticHistory = [];
      const baseTime = new Date(ecomOrder.createdAt).getTime();
      
      syntheticHistory.push({ status: 'Order Placed', time: new Date(baseTime).toLocaleString(), location: 'System Update', completed: true, active: stage === 1 });

      if (stage >= 2) syntheticHistory.push({ status: 'Packed & Ready for Dispatch', time: new Date(baseTime + 3600000).toLocaleString(), location: 'SAI Fulfillment Center', completed: true, active: stage === 2 });
      if (stage >= 3) syntheticHistory.push({ status: 'Dispatched in Transit', time: new Date(baseTime + 86400000).toLocaleString(), location: 'Main Logistics Hub', completed: true, active: stage === 3 });
      if (stage >= 5) {
        syntheticHistory.push({ status: 'Out for Delivery', time: new Date(new Date(ecomOrder.updatedAt).getTime() - 14400000).toLocaleString(), location: 'Local Courier Facility', completed: true, active: false });
        syntheticHistory.push({ status: 'Order Delivered Successfully', time: new Date(ecomOrder.updatedAt).toLocaleString(), location: ecomOrder.receiver?.country || 'Destination', completed: true, active: true });
      }
      syntheticHistory = syntheticHistory.reverse();

      const ecomShipment = {
        awb: ecomOrder.orderNumber, status: ecomOrder.status.charAt(0).toUpperCase() + ecomOrder.status.slice(1),
        stage, type, sender: 'SAI E-Commerce Store', receiver: ecomOrder.receiver?.name || ecomOrder.customer.name,
        contents: ecomOrder.items.map(i => `${i.qty}x ${i.name}`).join(', '), carrier: 'SAI Logistics',
        deadWeight: 'N/A', volWeight: 'N/A', chargeableWeight: 'N/A', origin: 'SAI Fulfillment Center', destination: ecomOrder.receiver?.country || 'India',
        eta: ecomOrder.status === 'delivered' ? 'Delivered' : 'Calculating...', history: syntheticHistory
      };
      return res.json({ success: true, data: ecomShipment, source: 'ecom' });
    }

    const booking = await Booking.findOne({ awb: awbCode }).lean();
    if (booking) {
      let progress = 0;
      if (booking.status === 'Confirmed') progress = 1;
      if (booking.status === 'Picked Up') progress = 2;
      if (booking.status === 'In Transit') progress = 3;
      if (booking.status === 'Delivered') progress = 4;

      let stage = 1;
      if (progress >= 2) stage = 2;
      if (progress >= 3) stage = 4;
      if (progress >= 4) stage = 5;

      let syntheticHistory = [];
      const baseTime = new Date(booking.createdAt).getTime();

      syntheticHistory.push({ status: 'Booking Created', time: new Date(baseTime).toLocaleString(), location: booking.branchZone || 'Online', completed: true, active: progress === 0 });
      if (progress >= 1) syntheticHistory.push({ status: 'Booking Confirmed', time: new Date(baseTime + 3600000).toLocaleString(), location: 'Customer Support', completed: true, active: progress === 1 });
      if (progress >= 2) syntheticHistory.push({ status: 'Picked Up Successfully', time: new Date(baseTime + 86400000).toLocaleString(), location: booking.senderAddress || 'Sender Location', completed: true, active: progress === 2 });
      if (progress >= 3) syntheticHistory.push({ status: 'In Transit to Destination', time: new Date(baseTime + 172800000).toLocaleString(), location: 'International Hub', completed: true, active: progress === 3 });
      if (progress >= 4) syntheticHistory.push({ status: 'Delivered', time: new Date(booking.updatedAt || new Date()).toLocaleString(), location: booking.destCountry, completed: true, active: true });

      syntheticHistory = syntheticHistory.reverse();

      const bookingShipment = {
        awb: booking.awb, status: booking.status, stage, type: 'international', sender: booking.senderName, receiver: booking.receiverName,
        contents: booking.itemCategory, carrier: 'SAI Global Network', deadWeight: booking.estimatedWeight, volWeight: 'N/A', chargeableWeight: booking.estimatedWeight,
        origin: booking.branchZone || 'Kadapa Main', destination: booking.destCountry, eta: booking.status === 'Delivered' ? 'Delivered' : 'Pending Schedule', history: syntheticHistory
      };
      return res.json({ success: true, data: bookingShipment, source: 'booking' });
    }

    return res.status(404).json({ success: false, message: 'Shipment not found. Please check your tracking number and try again.' });
  } catch (err) {
    console.error('Tracking error:', err);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

exports.updatePreferences = async (req, res) => {
  try {
    const awbCode = req.params.awb.trim().toUpperCase();
    const { instruction, rescheduleDate, holdAtHub } = req.body;
    const shipment = await Shipment.findOne({ awb: awbCode });
    if (!shipment) return res.status(404).json({ success: false, message: 'Shipment not found' });

    if (instruction !== undefined) shipment.deliveryPreferences.instruction = instruction;
    if (rescheduleDate !== undefined) shipment.deliveryPreferences.rescheduleDate = rescheduleDate;
    if (holdAtHub !== undefined) shipment.deliveryPreferences.holdAtHub = holdAtHub;
    await shipment.save();
    res.json({ success: true, message: 'Delivery preferences updated successfully', data: shipment });
  } catch (err) {
    console.error('Update preferences error:', err);
    res.status(500).json({ success: false, message: 'Server error updating preferences.' });
  }
};

exports.uploadDocuments = async (req, res) => {
  try {
    const awbCode = req.params.awb.trim().toUpperCase();
    const { title, url } = req.body;
    if (!title || !url) return res.status(400).json({ success: false, message: 'Document title and url are required.' });

    const shipment = await Shipment.findOne({ awb: awbCode });
    if (!shipment) return res.status(404).json({ success: false, message: 'Shipment not found' });

    shipment.documents.push({ title, url });
    if (shipment.exception && shipment.exception.isException) {
      shipment.exception.resolved = true;
      shipment.history.unshift({ status: 'Documents Uploaded by Consignee - Pending Review', time: new Date().toLocaleString(), location: 'Online Portal', completed: true, active: true });
    }
    await shipment.save();
    res.json({ success: true, message: 'Document uploaded successfully', data: shipment });
  } catch (err) {
    console.error('Upload document error:', err);
    res.status(500).json({ success: false, message: 'Server error uploading document.' });
  }
};
