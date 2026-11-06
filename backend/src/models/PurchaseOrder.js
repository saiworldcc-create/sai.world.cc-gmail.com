const mongoose = require('mongoose');

const purchaseOrderSchema = new mongoose.Schema({
  poNumber: { type: String, required: true, unique: true },
  shop: { type: mongoose.Schema.Types.ObjectId, ref: 'EcomShop', required: true },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'EcomProduct', required: true },
      name: String,
      sku: String,
      quantity: { type: Number, required: true },
      unitPrice: { type: Number, required: true },
      totalPrice: { type: Number, required: true }
    }
  ],
  
  status: {
    type: String,
    enum: ['Pending Approval', 'Confirmed', 'Packed', 'Dispatched', 'Delivered', 'Cancelled'],
    default: 'Pending Approval'
  },
  
  shippingAddress: {
    name: String,
    address: String,
    city: String,
    state: String,
    country: String,
    zipCode: String,
    phone: String
  },
  
  financials: {
    subTotal: { type: Number, required: true },
    shippingCost: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    platformFee: { type: Number, default: 0 },
    vendorEarnings: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true },
  },

  paymentStatus: {
    type: String,
    enum: ['Unpaid', 'Paid', 'Refunded'],
    default: 'Unpaid'
  },
  paymentTerms: {
    type: String,
    enum: ['Prepaid', 'Net-15', 'Net-30', 'Net-60'],
    default: 'Prepaid'
  },
  
  awbNumber: { type: String }, // Auto-generated when packed
}, { timestamps: true });

// Indexes for fast lookups
purchaseOrderSchema.index({ shop: 1, status: 1 });
purchaseOrderSchema.index({ buyer: 1 });

module.exports = mongoose.model('PurchaseOrder', purchaseOrderSchema);
