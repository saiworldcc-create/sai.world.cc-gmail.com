const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  collectionName: { type: String, required: true },
  documentId: { type: mongoose.Schema.Types.ObjectId, required: true },
  actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Who made the change
  action: { type: String, enum: ['CREATE', 'UPDATE', 'DELETE'], required: true },
  changes: { type: mongoose.Schema.Types.Mixed }, // Snapshot of changes (diff)
  ipAddress: { type: String },
  timestamp: { type: Date, default: Date.now }
});

// Index for fast audit lookups by document
auditLogSchema.index({ collectionName: 1, documentId: 1 });
auditLogSchema.index({ timestamp: -1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
