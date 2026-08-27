const express = require('express');
const router = express.Router();

const COUNTRY_BASE_RATES = {
  USA: { ratePerKg: 780, transit: '4–5 Days', minCharge: 1800, foodHandling: 250 },
  UK: { ratePerKg: 690, transit: '4–5 Days', minCharge: 1600, foodHandling: 200 },
  Canada: { ratePerKg: 820, transit: '4–5 Days', minCharge: 1900, foodHandling: 250 },
  Australia: { ratePerKg: 850, transit: '4–5 Days', minCharge: 2000, foodHandling: 300 },
  UAE: { ratePerKg: 490, transit: '3–4 Days', minCharge: 1200, foodHandling: 150 },
  Germany: { ratePerKg: 740, transit: '4–5 Days', minCharge: 1750, foodHandling: 220 },
  Singapore: { ratePerKg: 520, transit: '3–4 Days', minCharge: 1300, foodHandling: 180 },
  'New Zealand': { ratePerKg: 890, transit: '5–6 Days', minCharge: 2100, foodHandling: 300 },
  Other: { ratePerKg: 790, transit: '4–6 Days', minCharge: 1850, foodHandling: 250 },
};

// GET /api/v1/rates          — returns all countries
// GET /api/v1/rates?country=USA — returns single country rate
router.get('/', (req, res) => {
  const { country } = req.query;
  if (country) {
    const rate = COUNTRY_BASE_RATES[country] || COUNTRY_BASE_RATES['Other'];
    return res.json({ success: true, country: country || 'Other', data: rate });
  }
  return res.json({ success: true, data: COUNTRY_BASE_RATES });
});

module.exports = router;
