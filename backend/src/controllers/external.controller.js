const Shipment = require('../models/Shipment');

// B2B Headless API: Create Shipment via API
exports.createExternalShipment = async (req, res) => {
  try {
    const { receiverName, receiverPhone, destination, contents, weight, carrier, origin } = req.body;

    if (!receiverName || !destination || !contents) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: receiverName, destination, contents'
      });
    }

    // Auto generate AWB
    const awb = 'SAI' + Date.now().toString().slice(-6) + Math.floor(100 + Math.random() * 900);

    const weightVal = parseFloat(weight) || 1.0;
    const weightStr = `${weightVal.toFixed(1)} kg`;

    const etaDate = new Date();
    etaDate.setDate(etaDate.getDate() + 5);
    const etaStr = etaDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    const senderDisplayName = req.vendor?.name || 'Authorized B2B Vendor';
    const originCity = origin || req.vendor?.city || 'Kadapa Main Hub, AP';

    const newShipment = await Shipment.create({
      awb,
      status: 'Manifest Created',
      stage: 1,
      sender: senderDisplayName,
      receiver: receiverName.trim(),
      contents: contents.trim(),
      carrier: carrier || 'SAI International Express',
      deadWeight: weightStr,
      volWeight: weightStr,
      chargeableWeight: weightStr,
      origin: originCity,
      destination: destination.trim(),
      eta: etaStr,
      history: [{
        status: 'Manifest Created (API Gateway)',
        location: originCity,
        time: new Date().toLocaleString(),
        completed: true,
        active: true
      }]
    });

    res.status(201).json({
      success: true,
      message: 'Shipment created successfully via Headless B2B API',
      awb: newShipment.awb,
      eta: newShipment.eta,
      trackingUrl: `/tracking?awb=${newShipment.awb}`,
      labelUrl: `/api/v1/pdf/awb/${newShipment.awb}`
    });

  } catch (err) {
    console.error('External API Create Error:', err);
    res.status(500).json({ success: false, message: 'Failed to process API request', error: err.message });
  }
};

// B2B Headless API: Track Shipment
exports.trackExternalShipment = async (req, res) => {
  try {
    const { awb } = req.params;
    const shipment = await Shipment.findOne({ awb: awb.toUpperCase() }).select('awb status stage history destination eta carrier chargeableWeight origin');
    
    if (!shipment) {
      return res.status(404).json({ success: false, message: 'Shipment not found' });
    }

    res.json({
      success: true,
      shipment
    });
  } catch (err) {
    console.error('External API Track Error:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve tracking details' });
  }
};
