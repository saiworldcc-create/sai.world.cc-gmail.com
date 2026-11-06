const User = require('../models/User');

exports.requireApiKey = async (req, res, next) => {
  try {
    const apiKey = req.header('x-api-key');
    if (!apiKey) {
      return res.status(401).json({ success: false, message: 'API Key missing. Provide x-api-key in headers.' });
    }

    // Find vendor who owns this active API key
    const user = await User.findOne({
      'apiKeys.key': apiKey,
      role: 'vendor'
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid or revoked API Key.' });
    }

    req.vendor = user;
    next();
  } catch (err) {
    console.error('API Auth Error:', err);
    res.status(500).json({ success: false, message: 'API Authentication failed' });
  }
};
