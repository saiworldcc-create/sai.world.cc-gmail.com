const express = require('express');
const router = express.Router();
const rfqController = require('../controllers/rfq.controller');
const { protectUser, restrictUserTo } = require('../middleware/userAuth');
const audit = require('../middleware/audit');

// --- BUYER ROUTES (Users without vendor role acting as enterprise buyers) ---
// Note: restrictUserTo('user') assumes a regular user is a buyer. Adjust if 'buyer' is a specific role.
router.post('/', protectUser, audit('RFQ'), rfqController.createRFQ);
router.get('/my-rfqs', protectUser, rfqController.getBuyerRFQs);
router.patch('/:id/buyer-accept', protectUser, audit('RFQ'), rfqController.acceptVendorCounter);

// --- VENDOR ROUTES ---
router.get('/vendor-rfqs', protectUser, restrictUserTo('vendor'), rfqController.getVendorRFQs);
router.patch('/:id/vendor-counter', protectUser, restrictUserTo('vendor'), audit('RFQ'), rfqController.vendorCounterOffer);
router.patch('/:id/vendor-accept', protectUser, restrictUserTo('vendor'), audit('RFQ'), rfqController.vendorAccept);

module.exports = router;
