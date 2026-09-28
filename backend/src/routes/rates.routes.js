const express = require('express');
const router = express.Router();
const ratesController = require('../controllers/rates.controller');

router.get('/', ratesController.legacyGet);
router.get('/countries', ratesController.getCountries);
router.post('/calculate', ratesController.calculateRates);

module.exports = router;
