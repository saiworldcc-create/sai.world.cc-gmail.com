const path = require('path');
const fs = require('fs');
const { parseCSV, parseExcel, parsePDF } = require('../utils/rateParsers');

exports.uploadRates = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded.' });

    const carrier = (req.body.carrier || '').toLowerCase();
    if (!['dhl', 'ups', 'self'].includes(carrier)) return res.status(400).json({ success: false, message: 'Invalid carrier. Must be dhl, ups, or self.' });

    const ext = path.extname(req.file.originalname).toLowerCase();
    const buffer = req.file.buffer;
    let parsedData;

    if (ext === '.csv' || req.file.mimetype.includes('csv')) parsedData = parseCSV(buffer);
    else if (ext === '.xlsx' || ext === '.xls' || req.file.mimetype.includes('spreadsheet') || req.file.mimetype.includes('excel')) parsedData = parseExcel(buffer);
    else if (ext === '.pdf' || req.file.mimetype === 'application/pdf') parsedData = await parsePDF(buffer, carrier);
    else return res.status(400).json({ success: false, message: `Unsupported file format: ${ext}` });

    const zoneCount = parsedData.zones.length;
    const firstZoneRates = parsedData.rates[parsedData.zones[0]] || {};
    const weightCount = Object.keys(firstZoneRates).length;

    return res.json({
      success: true, message: `Successfully parsed ${zoneCount} zones with ${weightCount} weight brackets.`,
      fileName: req.file.originalname, fileSize: req.file.size, carrier, parsed: parsedData,
      summary: { zones: zoneCount, weights: weightCount, zoneNames: parsedData.zones, sampleWeights: Object.keys(firstZoneRates).slice(0, 10) },
    });
  } catch (err) {
    console.error('Rate upload parse error:', err);
    return res.status(422).json({ success: false, message: err.message || 'Failed to parse rate file.' });
  }
};

exports.applyRates = async (req, res) => {
  try {
    const { carrier, parsedRates } = req.body;

    if (!carrier || !['dhl', 'ups', 'self'].includes(carrier)) return res.status(400).json({ success: false, message: 'Invalid carrier.' });
    if (!parsedRates || !parsedRates.zones || !parsedRates.rates) return res.status(400).json({ success: false, message: 'No parsed rate data provided.' });

    const ratesPath = path.join(__dirname, '../data/carrierRates.json');
    const currentData = JSON.parse(fs.readFileSync(ratesPath, 'utf8'));

    currentData.carriers[carrier].rates = parsedRates.rates;
    if (parsedRates.regions) currentData.carriers[carrier].regions = parsedRates.regions;

    fs.writeFileSync(ratesPath, JSON.stringify(currentData, null, 2), 'utf8');

    return res.json({ success: true, message: `${carrier.toUpperCase()} rates updated successfully with ${parsedRates.zones.length} zones.` });
  } catch (err) {
    console.error('Rate apply error:', err);
    return res.status(500).json({ success: false, message: err.message || 'Failed to apply rates.' });
  }
};
