const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'EcomProduct' },
  name: { type: String, required: true },
  shopName: { type: String, default: '' },
  price: { type: Number, required: true },
  qty: { type: Number, required: true, min: 1 },
  image: { type: String, default: '' },
}, { _id: false });

const ecomOrderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true },
  customer: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, default: '' },
    address: { type: String, required: true },
  },
  sendAbroad: { type: Boolean, default: false },
  receiver: {
    country: { type: String, default: '' },
    name: { type: String, default: '' },
    phone: { type: String, default: '' },
    address: { type: String, default: '' }
  },
  items: [orderItemSchema],
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  notes: { type: String, default: '' },
  seen: { type: Boolean, default: false },
  paymentMethod: { type: String, enum: ['COD', 'Card', 'UPI'], default: 'COD' },
}, { timestamps: true });

// Auto-generate order number before saving
ecomOrderSchema.pre('save', async function (next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('EcomOrder').countDocuments();
    const date = new Date();
    const prefix = `SAI${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}`;
    this.orderNumber = `${prefix}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

// Index for quick status-based and date-based queries
ecomOrderSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('EcomOrder', ecomOrderSchema);
