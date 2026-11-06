const Shipment = require('../models/Shipment');
const Notification = require('../models/Notification');
const crypto = require('crypto');

// Enterprise AWB Generation Engine (Phase 6)
exports.generateEnterpriseAWB = async (req, res) => {
  try {
    const { 
      senderName, receiverName, items, weight, length, width, height, 
      destination, originHub, provider, ewayBillNumber, insuranceValue, 
      corporateWalletId, aisle, bin 
    } = req.body;

    // 1. Dynamic Volumetric Engine
    const volWeightCalc = (length * width * height) / 5000;
    const deadWeightNum = parseFloat(weight);
    const chargeableWeight = Math.max(volWeightCalc, deadWeightNum).toFixed(2);

    // 2. AWB Generation (Smart Prefix based on Provider)
    const prefix = provider === 'FedEx' ? 'FDX' : provider === 'DHL' ? 'DHL' : 'SAI';
    const awb = `${prefix}${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    // 3. 3PL Routing Logic
    let externalAwb = null;
    if (provider !== 'SaiNetwork') {
      // Mocking 3PL API Call
      externalAwb = `EXT-${crypto.randomBytes(5).toString('hex').toUpperCase()}`;
    }

    // 4. Create the Enterprise Shipment Record
    const newShipment = await Shipment.create({
      awb,
      status: 'Manifest Generated',
      stage: 1,
      sender: senderName || 'Corporate Sender',
      receiver: receiverName || 'Enterprise Receiver',
      contents: items || 'General Goods',
      carrier: provider || 'SaiNetwork',
      deadWeight: `${deadWeightNum} kg`,
      volWeight: `${volWeightCalc.toFixed(2)} kg`,
      chargeableWeight: `${chargeableWeight} kg`,
      origin: originHub || 'Kadapa Global Hub',
      destination: destination || 'Unknown Destination',
      eta: provider !== 'SaiNetwork' ? '2-3 Business Days' : '4-7 Business Days',
      
      // Enterprise Fields
      thirdPartyLogistics: {
        provider: provider || 'SaiNetwork',
        externalAwb: externalAwb
      },
      wms: {
        aisle: aisle || 'A1',
        bin: bin || 'B05'
      },
      finance: {
        ewayBillNumber: ewayBillNumber || `EWAY-${crypto.randomBytes(3).toString('hex').toUpperCase()}`,
        insuranceValue: insuranceValue || 0,
        corporateWalletId: corporateWalletId || null
      },
      franchiseHub: originHub || 'Kadapa Global Hub',
      
      history: [{ 
        status: 'Manifest Generated (Enterprise)', 
        time: new Date().toLocaleString(), 
        location: originHub || 'Kadapa Global Hub', 
        completed: true, 
        active: true 
      }]
    });

    // 5. Fire Kafka Event (Mocked as Notification for now)
    await Notification.create({ 
      type: 'system', 
      title: `🏢 Enterprise AWB Generated: ${awb}`, 
      message: `Chargeable Weight: ${chargeableWeight}kg | Route: ${provider}`, 
      link: '/admin/shipments' 
    });

    res.status(201).json({ 
      success: true, 
      message: 'Enterprise AWB successfully generated',
      data: newShipment 
    });

  } catch (err) {
    console.error('Enterprise AWB Error:', err);
    res.status(500).json({ success: false, message: 'Enterprise Routing Engine Failed' });
  }
};
