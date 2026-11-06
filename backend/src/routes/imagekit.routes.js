const express = require('express');
const router = express.Router();
const imagekitController = require('../controllers/imagekit.controller');
const { protect } = require('../middleware/auth');
const { protectUser } = require('../middleware/userAuth');
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB max

// Admin routes
router.get('/auth', protect, imagekitController.getAuthParams);
router.post('/upload', protect, upload.single('file'), imagekitController.uploadImage);
router.get('/files', protect, imagekitController.listFiles);
router.delete('/files/:fileId', protect, imagekitController.deleteFile);

// Vendor/User routes
router.post('/vendor-upload', protectUser, upload.single('file'), imagekitController.uploadImage);

module.exports = router;
