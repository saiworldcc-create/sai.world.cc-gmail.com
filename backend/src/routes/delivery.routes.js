const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/delivery.controller');
const { protectUser, restrictUserTo } = require('../middleware/userAuth');
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB max

// All routes here are protected and restricted to delivery_partner role
router.use(protectUser);
router.use(restrictUserTo('delivery_partner'));

router.get('/tasks', deliveryController.getTasks);

router.put('/status/:awb', deliveryController.handleStatusUpdate);
router.put('/tasks/:awb/status', deliveryController.handleStatusUpdate);

router.post('/live-location', deliveryController.handleLiveLocation);
router.post('/location', deliveryController.handleLiveLocation);

router.post('/pod/:awb', deliveryController.handlePodUpload);

router.post('/pod/:awb/upload', upload.single('image'), deliveryController.handlePodImageUpload);
router.post('/tasks/:awb/upload-pod', upload.single('image'), deliveryController.handlePodImageUpload);

module.exports = router;
