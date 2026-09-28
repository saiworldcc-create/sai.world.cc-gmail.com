const express = require('express');
const router = express.Router();
const imagekitController = require('../controllers/imagekit.controller');
const { protect } = require('../middleware/auth');
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB max

router.get('/auth', protect, imagekitController.getAuthParams);
router.post('/upload', protect, upload.single('file'), imagekitController.uploadImage);
router.get('/files', protect, imagekitController.listFiles);
router.delete('/files/:fileId', protect, imagekitController.deleteFile);

module.exports = router;
