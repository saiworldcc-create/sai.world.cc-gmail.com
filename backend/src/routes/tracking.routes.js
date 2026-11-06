const express = require('express');
const router = express.Router();
const trackingController = require('../controllers/tracking.controller');
const { trackingLimiter } = require('../middleware/rateLimiter');

// @route   GET /api/v1/tracking/:awb
router.get('/:awb', trackingLimiter, trackingController.getTracking);

// @route   PUT /api/v1/tracking/preferences/:awb
router.put('/preferences/:awb', trackingController.updatePreferences);

// @route   PUT /api/v1/tracking/documents/:awb
router.put('/documents/:awb', trackingController.uploadDocuments);

module.exports = router;
