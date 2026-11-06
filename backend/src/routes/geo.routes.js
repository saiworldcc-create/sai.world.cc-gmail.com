const express = require('express');
const router = express.Router();
const geoService = require('../services/geoService');

// @route   GET /api/v1/geo/lookup?address=Kadapa
router.get('/lookup', async (req, res) => {
  try {
    const { address } = req.query;
    if (!address) {
      return res.status(400).json({ success: false, message: 'Address query parameter is required.' });
    }
    const location = await geoService.geocode(address);
    res.json({ success: true, data: location });
  } catch (err) {
    console.error('Geo lookup error:', err);
    res.status(500).json({ success: false, message: 'Geocoding service unavailable' });
  }
});

// @route   GET /api/v1/geo/transit?origin=Kadapa&dest=USA
router.get('/transit', async (req, res) => {
  try {
    const { origin = 'Kadapa Main Hub', dest = 'USA' } = req.query;
    const metrics = await geoService.calculateTransitMetrics(origin, dest);
    res.json({ success: true, data: metrics });
  } catch (err) {
    console.error('Transit calculation error:', err);
    res.status(500).json({ success: false, message: 'Transit metrics unavailable' });
  }
});

module.exports = router;

