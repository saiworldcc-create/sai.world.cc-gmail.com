const RFQ = require('../models/RFQ');
const EcomProduct = require('../models/EcomProduct');

// ========================== BUYER ACTIONS ==========================

// Buyer requests a new quote
exports.createRFQ = async (req, res) => {
  try {
    const { productId, requestedQuantity, targetPricePerUnit, message } = req.body;
    
    const product = await EcomProduct.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const rfq = await RFQ.create({
      shop: product.shop,
      buyer: req.user._id,
      product: productId,
      requestedQuantity,
      targetPricePerUnit,
      messages: message ? [{ sender: req.user._id, senderRole: 'buyer', text: message }] : [],
      // Expire in 7 days
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    res.status(201).json({ success: true, rfq });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Buyer gets their active RFQs
exports.getBuyerRFQs = async (req, res) => {
  try {
    const rfqs = await RFQ.find({ buyer: req.user._id })
      .populate('product', 'name image price')
      .populate('shop', 'name')
      .sort({ updatedAt: -1 });
    res.json({ success: true, rfqs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Buyer accepts the Vendor's counter-offer
exports.acceptVendorCounter = async (req, res) => {
  try {
    const rfq = await RFQ.findOne({ _id: req.params.id, buyer: req.user._id });
    if (!rfq) return res.status(404).json({ success: false, message: 'RFQ not found' });
    
    if (rfq.status !== 'Vendor_Countered') {
      return res.status(400).json({ success: false, message: 'Cannot accept. Vendor has not countered.' });
    }

    rfq.status = 'Buyer_Accepted';
    await rfq.save();
    
    // Here we would typically auto-generate a PurchaseOrder 
    // at the counterPricePerUnit for the requestedQuantity.

    res.json({ success: true, rfq, message: 'Offer accepted! You can now proceed to B2B checkout.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ========================== VENDOR ACTIONS ==========================

// Vendor gets all RFQs sent to their shop
exports.getVendorRFQs = async (req, res) => {
  try {
    const rfqs = await RFQ.find({ shop: req.user.shopId })
      .populate('product', 'name image price')
      .populate('buyer', 'name email')
      .sort({ updatedAt: -1 });
    res.json({ success: true, rfqs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Vendor counter-offers the Buyer
exports.vendorCounterOffer = async (req, res) => {
  try {
    const { counterPricePerUnit, message } = req.body;
    
    const rfq = await RFQ.findOne({ _id: req.params.id, shop: req.user.shopId });
    if (!rfq) return res.status(404).json({ success: false, message: 'RFQ not found' });
    
    if (rfq.status === 'Buyer_Accepted' || rfq.status === 'Vendor_Accepted' || rfq.status === 'Rejected') {
      return res.status(400).json({ success: false, message: `Cannot counter an RFQ that is already ${rfq.status}` });
    }

    rfq.counterPricePerUnit = counterPricePerUnit;
    rfq.status = 'Vendor_Countered';
    
    if (message) {
      rfq.messages.push({ sender: req.user._id, senderRole: 'vendor', text: message });
    }

    await rfq.save();
    res.json({ success: true, rfq });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Vendor accepts the Buyer's initial target price
exports.vendorAccept = async (req, res) => {
  try {
    const rfq = await RFQ.findOne({ _id: req.params.id, shop: req.user.shopId });
    if (!rfq) return res.status(404).json({ success: false, message: 'RFQ not found' });

    rfq.status = 'Vendor_Accepted';
    await rfq.save();
    
    res.json({ success: true, rfq });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
