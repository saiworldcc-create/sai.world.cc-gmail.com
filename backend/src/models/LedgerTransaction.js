const mongoose = require('mongoose');

const ledgerTransactionSchema = new mongoose.Schema({
  shop: { type: mongoose.Schema.Types.ObjectId, ref: 'EcomShop', required: true },
  purchaseOrder: { type: mongoose.Schema.Types.ObjectId, ref: 'PurchaseOrder' },
  
  type: {
    type: String,
    enum: ['Credit', 'Debit', 'Payout', 'Fee'],
    required: true
  },
  
  amount: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  
  description: { type: String, required: true },
  
  status: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed'],
    default: 'Completed'
  },
  
  referenceId: { type: String }, // Payment gateway Ref ID or Bank Transaction ID
}, { timestamps: true });

// Indexes for calculating balances quickly
ledgerTransactionSchema.index({ shop: 1, type: 1, status: 1 });
ledgerTransactionSchema.index({ purchaseOrder: 1 });

module.exports = mongoose.model('LedgerTransaction', ledgerTransactionSchema);
