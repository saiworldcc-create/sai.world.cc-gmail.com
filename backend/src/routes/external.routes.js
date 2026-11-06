const express = require('express');
const router = express.Router();
const externalController = require('../controllers/external.controller');
const { requireApiKey } = require('../middleware/apiAuth');

// Phase 14: V2 Multi-Tenant Headless APIs
// Protected by x-api-key header

// Create a shipment from external system (Shopify/WooCommerce)
router.post('/shipments', requireApiKey, externalController.createExternalShipment);

// Track a shipment via API
router.get('/shipments/:awb', requireApiKey, externalController.trackExternalShipment);

module.exports = router;
