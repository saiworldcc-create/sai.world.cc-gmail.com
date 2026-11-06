const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');
const { protect, restrictTo } = require('../middleware/auth');

// Enterprise Analytics Routes (Phase 9) - Protected for Super Admin only
router.use(protect);
router.use(restrictTo('super-admin'));

router.get('/revenue', analyticsController.getRevenueAnalytics);
router.get('/shipments', analyticsController.getShipmentAnalytics);

module.exports = router;
