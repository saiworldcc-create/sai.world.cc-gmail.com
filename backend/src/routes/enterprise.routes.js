const express = require('express');
const router = express.Router();
const enterpriseController = require('../controllers/enterprise.controller');
const { protect, restrictTo } = require('../middleware/auth');

// Phase 6: Enterprise Operations Route
router.post('/awb/generate', protect, restrictTo('super-admin', 'branch-manager'), enterpriseController.generateEnterpriseAWB);

module.exports = router;
