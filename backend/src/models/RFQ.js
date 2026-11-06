const mongoose = require('mongoose');

const rfqSchema = new mongoose.Schema({
  shop: { type: mongoose.Schema.Types.ObjectId, ref: 'EcomShop', required: true },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // The enterprise buyer
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'EcomProduct', required: true },
  
  requestedQuantity: { type: Number, required: true },
  targetPricePerUnit: { type: Number, required: true }, // What the buyer wants to pay
  counterPricePerUnit: { type: Number }, // What the vendor counter-offers
  
  status: {
    type: String,
    enum: ['Pending', 'Vendor_Countered', 'Buyer_Accepted', 'Vendor_Accepted', 'Rejected'],
    default: 'Pending'
  },
  
  messages: [{
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    senderRole: { type: String, enum: ['buyer', 'vendor'] },
    text: { type: String },
    timestamp: { type: Date, default: Date.now }
  }],
  
  validUntil: { type: Date } // Expiry date for the quotation
}, { timestamps: true });

rfqSchema.index({ shop: 1, status: 1 });
rfqSchema.index({ buyer: 1, status: 1 });

module.exports = mongoose.model('RFQ', rfqSchema);
