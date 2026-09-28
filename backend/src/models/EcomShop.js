const mongoose = require('mongoose');

const ecomShopSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  icon: { type: String, default: '🏪' },
  color: { type: String, default: '#3CC8C8' },
  isActive: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('EcomShop', ecomShopSchema);
