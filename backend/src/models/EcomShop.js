const mongoose = require('mongoose');

const ecomShopSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  icon: { type: String, default: '🏪' },
  color: { type: String, default: '#3CC8C8' },
  isActive: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },
  
  // VMS B2B Fields
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  kycStatus: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  commissionRate: { type: Number, default: 10 },
  gstin: { type: String },
  tradeLicense: { type: String },
  bankDetails: {
    accountName: String,
    accountNumber: String,
    ifscCode: String
  }
}, { timestamps: true });

module.exports = mongoose.model('EcomShop', ecomShopSchema);
