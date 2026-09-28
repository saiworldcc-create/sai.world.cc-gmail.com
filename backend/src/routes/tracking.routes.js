const express = require('express');
const router = express.Router();
const trackingController = require('../controllers/tracking.controller');

// @route   GET /api/v1/tracking/:awb
router.get('/:awb', trackingController.getTracking);

// @route   PUT /api/v1/tracking/preferences/:awb
router.put('/preferences/:awb', trackingController.updatePreferences);

// @route   PUT /api/v1/tracking/documents/:awb
router.put('/documents/:awb', trackingController.uploadDocuments);

module.exports = router;
