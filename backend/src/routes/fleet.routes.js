const express = require('express');
const router = express.Router();
const fleetController = require('../controllers/fleet.controller');
const { protect, restrictTo } = require('../middleware/auth');

// Enterprise Fleet Management Routes (Phase 12) - Protected Operations
router.use(protect);
router.use(restrictTo('super-admin', 'branch-manager'));

router.get('/', fleetController.getFleet);
router.post('/', fleetController.addVehicle);
router.post('/:id/fuel', fleetController.addFuelLog);

module.exports = router;
