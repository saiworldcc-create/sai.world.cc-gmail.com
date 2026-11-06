const mongoose = require('mongoose');

const apiKeySchema = new mongoose.Schema({
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'EcomShop', required: true },
  keyName: { type: String, required: true },
  keyValue: { type: String, required: true, unique: true },
  webhookUrl: { type: String }, // For ERP reverse syncing
  isActive: { type: Boolean, default: true },
  lastUsed: { type: Date }
}, { timestamps: true });

apiKeySchema.index({ keyValue: 1 });

module.exports = mongoose.model('ApiKey', apiKeySchema);
