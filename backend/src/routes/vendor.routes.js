const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendor.controller');
const { protectUser, restrictUserTo } = require('../middleware/userAuth');
const { protect, restrictTo } = require('../middleware/auth');
const audit = require('../middleware/audit');

// Vendor Auth (Public)
router.post('/register', vendorController.registerVendor);

// Vendor Portal (Vendor only)
router.get('/me', protectUser, restrictUserTo('vendor'), vendorController.getVendorProfile);

// Vendor Catalog/WMS (Vendor only)
router.get('/products', protectUser, restrictUserTo('vendor'), vendorController.getVendorProducts);
router.post('/products/bulk', protectUser, restrictUserTo('vendor'), vendorController.bulkUploadVendorProducts);
router.post('/products', protectUser, restrictUserTo('vendor'), audit('EcomProduct'), vendorController.createVendorProduct);
router.put('/products/:id', protectUser, restrictUserTo('vendor'), audit('EcomProduct'), vendorController.updateVendorProduct);
router.delete('/products/:id', protectUser, restrictUserTo('vendor'), audit('EcomProduct'), vendorController.deleteVendorProduct);

// Vendor Orders/Fulfillment (Vendor only)
router.get('/orders', protectUser, restrictUserTo('vendor'), vendorController.getVendorOrders);
router.patch('/orders/:id/status', protectUser, restrictUserTo('vendor'), vendorController.updateVendorOrderStatus);

// Vendor Financials & Ledgers (Vendor only)
router.get('/financials', protectUser, restrictUserTo('vendor'), vendorController.getVendorFinancials);

// Vendor Support & Analytics (Vendor only)
router.get('/analytics', protectUser, restrictUserTo('vendor'), vendorController.getVendorAnalytics);
router.get('/tickets', protectUser, restrictUserTo('vendor'), vendorController.getVendorTickets);
router.post('/tickets', protectUser, restrictUserTo('vendor'), vendorController.createVendorTicket);

// Vendor API Keys (Vendor only)
router.get('/api-keys', protectUser, restrictUserTo('vendor'), vendorController.getVendorApiKeys);
router.post('/api-keys', protectUser, restrictUserTo('vendor'), vendorController.createVendorApiKey);
router.delete('/api-keys/:keyId', protectUser, restrictUserTo('vendor'), vendorController.deleteVendorApiKey);

// Admin Portal (Super Admin only)
router.get('/all', protect, restrictTo('super-admin', 'admin'), vendorController.getAllVendors);
router.post('/admin-create', protect, restrictTo('super-admin', 'admin'), vendorController.adminCreateVendor);
router.put('/:shopId/status', protect, restrictTo('super-admin', 'admin'), vendorController.updateVendorStatus);
router.delete('/:shopId', protect, restrictTo('super-admin', 'admin'), vendorController.deleteVendor);
router.post('/:shopId/create-login', protect, restrictTo('super-admin', 'admin'), vendorController.createVendorLogin);

module.exports = router;
