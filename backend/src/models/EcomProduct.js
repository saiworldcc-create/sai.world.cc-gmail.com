const mongoose = require('mongoose');
const { updateIfCurrentPlugin } = require('mongoose-update-if-current');

const ecomProductSchema = new mongoose.Schema({
  shop: { type: mongoose.Schema.Types.ObjectId, ref: 'EcomShop', required: true },
  shopName: { type: String, required: true },
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number, default: 0 },
  image: { type: String, default: '📦' },
  rating: { type: Number, default: 4.5, min: 0, max: 5 },
  reviews: { type: Number, default: 0 },
  tag: { type: String, default: '' },
  description: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },

  // WMS & B2B Inventory Fields
  sku: { type: String },
  stock: { type: Number, default: 100 },
  lowStockThreshold: { type: Number, default: 10 },
  moq: { type: Number, default: 1 }, // Minimum Order Quantity
  tieredPricing: [{
    minQuantity: Number,
    price: Number
  }],
  weight: { type: Number, default: 1 }, // Weight in kg
  size: { type: String, default: '' },
}, { timestamps: true });

// Optimistic Concurrency Control (OCC) to prevent over-selling
ecomProductSchema.plugin(updateIfCurrentPlugin);

// Index for fast shop-based queries
ecomProductSchema.index({ shop: 1, isActive: 1 });

module.exports = mongoose.model('EcomProduct', ecomProductSchema);
