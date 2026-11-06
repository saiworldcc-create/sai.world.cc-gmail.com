const mongoose = require('mongoose');

const supportTicketSchema = new mongoose.Schema({
  ticketId: { type: String, required: true, unique: true },
  shop: { type: mongoose.Schema.Types.ObjectId, ref: 'EcomShop', required: true },
  purchaseOrder: { type: mongoose.Schema.Types.ObjectId, ref: 'PurchaseOrder' },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // The buyer or vendor who opened it
  
  subject: { type: String, required: true },
  issueType: {
    type: String,
    enum: ['Damaged Goods', 'Missing Items', 'Delayed Delivery', 'RTO Request', 'Payment Dispute', 'Other'],
    required: true
  },
  
  status: {
    type: String,
    enum: ['Open', 'Investigating', 'Action Required', 'Resolved', 'Closed'],
    default: 'Open'
  },
  
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },

  messages: [
    {
      sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      senderRole: { type: String, enum: ['vendor', 'customer', 'super-admin'] },
      message: { type: String, required: true },
      attachments: [String],
      timestamp: { type: Date, default: Date.now }
    }
  ],
  
  rtoStatus: {
    type: String,
    enum: ['Not Applicable', 'RTO Requested', 'RTO Approved', 'In Transit', 'Returned to Vendor'],
    default: 'Not Applicable'
  }
}, { timestamps: true });

supportTicketSchema.index({ shop: 1, status: 1 });
supportTicketSchema.index({ purchaseOrder: 1 });

module.exports = mongoose.model('SupportTicket', supportTicketSchema);
