const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const userController = require('../controllers/user.controller');
const { protectUser } = require('../middleware/userAuth');

// @route   POST /api/v1/users/register
router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  userController.registerUser
);

// @route   POST /api/v1/users/login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password required'),
  ],
  userController.loginUser
);

// @route   POST /api/v1/users/google
router.post('/google', userController.googleLogin);

// @route   GET /api/v1/users/me
router.get('/me', protectUser, userController.getMe);

// @route   GET /api/v1/users/shipments (Customer portal history)
router.get('/shipments', protectUser, userController.getUserShipments);

module.exports = router;
