const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect } = require('../middleware/auth');
const rateUploadController = require('../controllers/rateUpload.controller');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'text/csv', 'application/csv', 'text/comma-separated-values',
      'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/pdf',
    ];
    const allowedExts = ['.csv', '.xls', '.xlsx', '.pdf'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedMimes.includes(file.mimetype) || allowedExts.includes(ext)) cb(null, true);
    else cb(new Error(`Unsupported file type: ${file.mimetype} (${ext}). Allowed: PDF, Excel, CSV.`));
  },
});

router.post('/upload', protect, upload.single('rateFile'), rateUploadController.uploadRates);
router.post('/apply', protect, rateUploadController.applyRates);

module.exports = router;
