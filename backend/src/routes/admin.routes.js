const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect, restrictTo } = require('../middleware/auth');
const adminController = require('../controllers/admin.controller');
const rateUploadRoutes = require('./rateUpload.routes');

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email required.'),
    body('password').notEmpty().withMessage('Password required.'),
  ],
  adminController.loginAdmin
);

router.get('/me', protect, adminController.getMe);
router.get('/stats', protect, adminController.getStats);

router.get('/notifications', protect, adminController.getNotifications);
router.put('/notifications/mark-read', protect, adminController.markNotificationsRead);

router.post(
  '/change-password',
  protect,
  [
    body('currentPassword').notEmpty(),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters.'),
  ],
  adminController.changePassword
);

router.get('/customers', protect, restrictTo('super-admin'), adminController.getCustomers);
router.get('/staff', protect, restrictTo('super-admin'), adminController.getStaff);

router.post(
  '/staff',
  protect,
  restrictTo('super-admin'),
  [
    body('name').trim().notEmpty().withMessage('Name is required.'),
    body('email').isEmail().withMessage('Valid email required.'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
    body('role').isIn(['super-admin', 'branch-manager', 'customs-officer', 'delivery-agent']).withMessage('Invalid role.'),
  ],
  adminController.createStaff
);

router.put('/staff/:id', protect, restrictTo('super-admin'), adminController.updateStaff);
router.delete('/staff/:id', protect, restrictTo('super-admin'), adminController.deleteStaff);

router.get('/temp-rates', adminController.getTempRates);
router.get('/rates', protect, adminController.getRates);
router.put('/rates', protect, adminController.updateRates);
router.use('/rates', rateUploadRoutes);

router.get('/settings', protect, adminController.getSettings);
router.post('/settings', protect, adminController.updateSettings);

router.get('/shipments', protect, adminController.getShipments);
router.post('/shipments', protect, adminController.createShipment);
router.put('/shipments/:awb', protect, adminController.updateShipment);
router.put('/shipments/:id/assign', protect, adminController.assignDriver);

router.get('/delivery-partners', protect, adminController.getDeliveryPartners);

module.exports = router;
