const express = require('express');
const router = express.Router();
const pdfController = require('../controllers/pdf.controller');

// Phase 13: Automated PDF Label Generation
router.get('/awb/:awb', pdfController.generateAWB);

module.exports = router;
