const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth');
const { protectUser } = require('../middleware/userAuth');
const ecomController = require('../controllers/ecommerce.controller');

// PUBLIC ENDPOINTS
router.get('/seed', ecomController.seedDb);
router.get('/shops', ecomController.getShops);
router.get('/products', ecomController.getProducts);
router.post('/orders', ecomController.placeOrder);

// ADMIN ENDPOINTS
router.get('/admin/shops', protect, restrictTo('super-admin'), ecomController.getAdminShops);
router.post('/admin/shops', protect, restrictTo('super-admin'), ecomController.createShop);
router.put('/admin/shops/:id', protect, restrictTo('super-admin'), ecomController.updateShop);
router.delete('/admin/shops/:id', protect, restrictTo('super-admin'), ecomController.deleteShop);

router.get('/admin/products', protect, restrictTo('super-admin'), ecomController.getAdminProducts);
router.post('/admin/products', protect, restrictTo('super-admin'), ecomController.createProduct);
router.put('/admin/products/:id', protect, restrictTo('super-admin'), ecomController.updateProduct);
router.delete('/admin/products/:id', protect, restrictTo('super-admin'), ecomController.deleteProduct);

router.get('/admin/orders', protect, restrictTo('super-admin'), ecomController.getAdminOrders);
router.get('/admin/orders/new-count', protect, restrictTo('super-admin'), ecomController.getNewOrdersCount);
router.patch('/admin/orders/mark-seen', protect, restrictTo('super-admin'), ecomController.markOrdersSeen);
router.patch('/admin/orders/:id', protect, restrictTo('super-admin'), ecomController.updateOrderStatus);

// USER ENDPOINTS
router.get('/my-orders', protectUser, ecomController.getMyOrders);
router.patch('/my-orders/:id/cancel', protectUser, ecomController.cancelMyOrder);

module.exports = router;
