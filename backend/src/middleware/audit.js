const AuditLog = require('../models/AuditLog');

const auditMiddleware = (collectionName) => {
  return async (req, res, next) => {
    // Intercept response to only log successful modifications
    const originalSend = res.json;
    
    res.json = async function (data) {
      res.json = originalSend;
      
      if (res.statusCode >= 200 && res.statusCode < 300) {
        let action = 'UPDATE';
        if (req.method === 'POST') action = 'CREATE';
        if (req.method === 'DELETE') action = 'DELETE';
        
        // Try to identify the document ID
        let docId = req.params.id;
        if (action === 'CREATE' && data && data.product) docId = data.product._id;
        if (action === 'CREATE' && data && data.order) docId = data.order._id;
        
        if (docId) {
          try {
            await AuditLog.create({
              collectionName,
              documentId: docId,
              actor: req.user ? req.user._id : null,
              action,
              changes: req.body, // The payload that was sent
              ipAddress: req.ip
            });
          } catch (err) {
            console.error('Audit Log Error:', err.message);
          }
        }
      }
      
      return originalSend.call(this, data);
    };
    
    next();
  };
};

module.exports = auditMiddleware;
