const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { protect } = require('../middleware/auth');
const { parseCSV, parseExcel, parsePDF } = require('../utils/rateParsers');

// Configure multer — store in memory (files are small rate sheets)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'text/csv',
      'application/csv',
      'text/comma-separated-values',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/pdf',
    ];
    const allowedExts = ['.csv', '.xls', '.xlsx', '.pdf'];
    const ext = path.extname(file.originalname).toLowerCase();

    if (allowedMimes.includes(file.mimetype) || allowedExts.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type: ${file.mimetype} (${ext}). Allowed: PDF, Excel, CSV.`));
    }
  },
});

// POST /api/v1/admin/rates/upload
// Accepts a rate sheet file + carrier parameter, parses and returns data for preview
router.post('/upload', protect, upload.single('rateFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    const carrier = (req.body.carrier || '').toLowerCase();
    if (!['dhl', 'ups', 'self'].includes(carrier)) {
      return res.status(400).json({ success: false, message: 'Invalid carrier. Must be dhl, ups, or self.' });
    }

    const ext = path.extname(req.file.originalname).toLowerCase();
    const buffer = req.file.buffer;

    let parsedData;

    if (ext === '.csv' || req.file.mimetype.includes('csv')) {
      parsedData = parseCSV(buffer);
    } else if (ext === '.xlsx' || ext === '.xls' || req.file.mimetype.includes('spreadsheet') || req.file.mimetype.includes('excel')) {
      parsedData = parseExcel(buffer);
    } else if (ext === '.pdf' || req.file.mimetype === 'application/pdf') {
      parsedData = await parsePDF(buffer, carrier);
    } else {
      return res.status(400).json({ success: false, message: `Unsupported file format: ${ext}` });
    }

    // Return parsed data for frontend preview
    const zoneCount = parsedData.zones.length;
    const firstZoneRates = parsedData.rates[parsedData.zones[0]] || {};
    const weightCount = Object.keys(firstZoneRates).length;

    return res.json({
      success: true,
      message: `Successfully parsed ${zoneCount} zones with ${weightCount} weight brackets.`,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      carrier,
      parsed: parsedData,
      summary: {
        zones: zoneCount,
        weights: weightCount,
        zoneNames: parsedData.zones,
        sampleWeights: Object.keys(firstZoneRates).slice(0, 10),
      },
    });
  } catch (err) {
    console.error('Rate upload parse error:', err);
    return res.status(422).json({
      success: false,
      message: err.message || 'Failed to parse rate file.',
    });
  }
});

// POST /api/v1/admin/rates/apply
// Applies the parsed data to the carrier rates JSON
router.post('/apply', protect, async (req, res) => {
  try {
    const { carrier, parsedRates } = req.body;

    if (!carrier || !['dhl', 'ups', 'self'].includes(carrier)) {
      return res.status(400).json({ success: false, message: 'Invalid carrier.' });
    }

    if (!parsedRates || !parsedRates.zones || !parsedRates.rates) {
      return res.status(400).json({ success: false, message: 'No parsed rate data provided.' });
    }

    const ratesPath = path.join(__dirname, '../data/carrierRates.json');
    const currentData = JSON.parse(fs.readFileSync(ratesPath, 'utf8'));

    // Merge or replace the carrier's rates
    // For DHL/UPS: rates are keyed by zone → { weight: price }
    // The parsed data is already in that format
    currentData.carriers[carrier].rates = parsedRates.rates;
    if (parsedRates.regions) {
      currentData.carriers[carrier].regions = parsedRates.regions;
    }

    fs.writeFileSync(ratesPath, JSON.stringify(currentData, null, 2), 'utf8');

    return res.json({
      success: true,
      message: `${carrier.toUpperCase()} rates updated successfully with ${parsedRates.zones.length} zones.`,
    });
  } catch (err) {
    console.error('Rate apply error:', err);
    return res.status(500).json({
      success: false,
      message: err.message || 'Failed to apply rates.',
    });
  }
});

module.exports = router;
