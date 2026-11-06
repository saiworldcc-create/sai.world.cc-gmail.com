const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');
const { aiChatLimiter } = require('../middleware/rateLimiter');

// Rate limited to safeguard the free 15 RPM quota
router.post('/chat', aiChatLimiter, aiController.chat);

module.exports = router;
