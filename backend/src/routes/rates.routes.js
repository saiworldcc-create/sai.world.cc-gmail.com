const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const AppSetting = require('../models/AppSetting');

const ratesFilePath = path.join(__dirname, '../data/carrierRates.json');
let carrierData = null;
try {
  carrierData = JSON.parse(fs.readFileSync(ratesFilePath, 'utf8'));
} catch (err) {
  console.error('Failed to load carrierRates.json', err);
}

function roundChargeable(weight) {
  return Math.ceil(weight * 2) / 2;
}

router.get('/', (req, res) => {
  // Legacy support
  res.json({ success: true, message: 'Please use POST /api/v1/rates/calculate' });
});

router.get('/countries', (req, res) => {
  try {
    if (!carrierData) {
      return res.status(500).json({ success: false, message: 'Country data unavailable.' });
    }
    const set = new Set();
    if (carrierData.countryMap) {
      carrierData.countryMap.forEach(c => set.add(c.name));
    }
    if (carrierData.carriers?.self?.rates) Object.keys(carrierData.carriers.self.rates).forEach(k => set.add(k));
    if (carrierData.carriers?.dhl?.rates) Object.keys(carrierData.carriers.dhl.rates).forEach(k => set.add(k));
    if (carrierData.carriers?.ups?.rates) Object.keys(carrierData.carriers.ups.rates).forEach(k => set.add(k));
    
    const countries = Array.from(set).sort();
    return res.json({ success: true, countries });
  } catch (err) {
    console.error('Failed to get countries:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/calculate', async (req, res) => {
  try {
    if (!carrierData) {
      return res.status(500).json({ success: false, message: 'Pricing data unavailable.' });
    }

    const { country, actualWeight, length, width, height } = req.body;
    
    if (!country || !actualWeight) {
      return res.status(400).json({ success: false, message: 'Country and actual weight are required.' });
    }

    const l = parseFloat(length) || 0;
    const w = parseFloat(width) || 0;
    const h = parseFloat(height) || 0;
    const aw = parseFloat(actualWeight) || 0;

    const volWeight = (l * w * h) / 5000;
    const chargeableWeight = Math.max(aw, volWeight);
    const weightKey = roundChargeable(chargeableWeight).toString();

    let marginPercent = 15;
    const setting = await AppSetting.findOne({ key: 'profitMargin' });
    if (setting && setting.value !== undefined) {
      const parsed = parseFloat(setting.value);
      if (!isNaN(parsed)) {
        marginPercent = parsed;
      }
    }
    const marginMultiplier = 1 + (marginPercent / 100);

    const countryMap = carrierData.countryMap.find(c => c.name === country) || {};

    const results = [];

    // --- 1. Sai Exp (DHL) ---
    const dhlZone = countryMap.dhl || country;
    const dhlRates = carrierData.carriers.dhl?.rates?.[dhlZone] || carrierData.carriers.dhl?.rates?.[dhlZone + 'Zone'] || carrierData.carriers.dhl?.rates?.[country];
    if (dhlRates) {
      let cost = 0;
      if (dhlRates[weightKey]) {
        cost = dhlRates[weightKey];
      } else if (chargeableWeight > 30) {
        cost = 30000 + ((chargeableWeight - 30) * 900); 
      }
      if (cost > 0) {
        results.push({ brand: 'Sai Exp', tagline: 'Fastest Delivery', poweredBy: 'DHL', transit: '4-5 Business Days', baseCost: cost, totalCost: Math.round(cost * marginMultiplier), icon: 'fa-plane-departure', color: '#D40511' });
      }
    }

    // --- 2. Sai Priority (UPS) ---
    const upsZone = countryMap.ups || country;
    const upsRates = carrierData.carriers.ups?.rates?.[upsZone] || carrierData.carriers.ups?.rates?.[country];
    if (upsRates) {
      let cost = 0;
      if (upsRates[weightKey]) {
        cost = upsRates[weightKey];
      } else if (chargeableWeight > 30) {
        cost = 32000 + ((chargeableWeight - 30) * 950); 
      }
      if (cost > 0) {
        results.push({ brand: 'Sai Priority', tagline: 'Premium & Reliable', poweredBy: 'UPS', transit: '5-7 Business Days', baseCost: cost, totalCost: Math.round(cost * marginMultiplier), icon: 'fa-shield-halved', color: '#F59E0B' });
      }
    }

    // --- 3. Sai Self (SELF) ---
    const selfZone = countryMap.self || country;
    let selfRates = carrierData.carriers.self?.rates?.[selfZone] || carrierData.carriers.self?.rates?.[country];
    if (!selfRates) {
      selfRates = carrierData.carriers.self?.rates?.['Zone-1']; // Fallback so Sai Self always shows
    }
    if (selfRates) {
      let cost = 0;
      if (selfRates["6.0"]) {
        const calcWeight = Math.max(chargeableWeight, 6.0);
        const extraHalfKgs = Math.ceil((calcWeight - 6.0) * 2);
        cost = selfRates["6.0"] + (extraHalfKgs * (selfRates["add0.5"] || 0));
      } else if (selfRates["base1"]) {
        cost = chargeableWeight * selfRates["base1"];
      } else if (selfRates[weightKey]) {
        cost = selfRates[weightKey];
      }
      if (cost > 0) {
        results.push({ brand: 'Sai Self', tagline: 'Most Economical', poweredBy: 'Sai Internal', transit: '8-12 Business Days', baseCost: cost, totalCost: Math.round(cost * marginMultiplier), icon: 'fa-box-open', color: '#3CC8C8' });
      }
    }

    if (results.length === 0) {
      return res.status(404).json({ success: false, message: `Rates not found for ${country}. Please contact support.` });
    }

    results.sort((a, b) => a.totalCost - b.totalCost);

    return res.json({
      success: true,
      chargeableWeight,
      volWeight,
      actualWeight: aw,
      marginApplied: marginPercent,
      options: results
    });

  } catch (err) {
    console.error('Calculate rate error:', err);
    res.status(500).json({ success: false, message: 'Server error calculating rates.' });
  }
});

module.exports = router;
