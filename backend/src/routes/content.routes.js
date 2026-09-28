const express = require('express');
const router = express.Router();
const contentController = require('../controllers/content.controller');
const { protect } = require('../middleware/auth');

router.get('/:page', contentController.getPageContent);
router.get('/', protect, contentController.getAllPages);
router.put('/:page', protect, contentController.updatePageContent);
router.patch('/:page', protect, contentController.patchPageContent);

module.exports = router;
