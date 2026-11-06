const mongoose = require('mongoose');

const vendorOrganizationSchema = new mongoose.Schema({
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'EcomShop', required: true },
  orgName: { type: String, required: true },
  members: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      role: { type: String, enum: ['Admin', 'Finance', 'Operations', 'Picker'], default: 'Picker' },
      status: { type: String, enum: ['Active', 'Suspended'], default: 'Active' }
    }
  ]
}, { timestamps: true });

vendorOrganizationSchema.index({ shopId: 1 });

module.exports = mongoose.model('VendorOrganization', vendorOrganizationSchema);
