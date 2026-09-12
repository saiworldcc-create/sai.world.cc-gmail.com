const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const Admin = require('../models/Admin');
const { protect } = require('../middleware/auth');
const Booking = require('../models/Booking');
const Shipment = require('../models/Shipment');
const ContactMessage = require('../models/ContactMessage');

function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
}

// POST /api/v1/admin/login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email required.'),
    body('password').notEmpty().withMessage('Password required.'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() });
    }

    try {
      const { email, password } = req.body;
      const admin = await Admin.findOne({ email }).select('+password');

      if (!admin || !admin.isActive) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }

      const isMatch = await admin.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }

      admin.lastLogin = new Date();
      await admin.save({ validateBeforeSave: false });

      const token = signToken(admin._id);

      return res.json({
        success: true,
        token,
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
      });
    } catch (err) {
      console.error('Admin login error:', err);
      return res.status(500).json({ success: false, message: 'Server error.' });
    }
  }
);

// GET /api/v1/admin/me — get current admin profile
router.get('/me', protect, (req, res) => {
  res.json({ success: true, admin: req.admin });
});

// GET /api/v1/admin/stats — get dashboard statistics
router.get('/stats', protect, async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const activeShipments = await Shipment.countDocuments({ status: { $ne: 'Delivered' } });
    const totalShipments = await Shipment.countDocuments();
    const unreadMessages = await ContactMessage.countDocuments({ isRead: false });

    // Fetch recent 5 bookings
    const recentBookings = await Booking.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      success: true,
      stats: {
        totalBookings,
        activeShipments,
        totalShipments,
        unreadMessages,
        recentBookings
      }
    });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ success: false, message: 'Server error fetching stats.' });
  }
});

// POST /api/v1/admin/change-password
router.post(
  '/change-password',
  protect,
  [
    body('currentPassword').notEmpty(),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters.'),
  ],
  async (req, res) => {
    try {
      const admin = await Admin.findById(req.admin._id).select('+password');
      const isMatch = await admin.comparePassword(req.body.currentPassword);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
      }
      admin.password = req.body.newPassword;
      await admin.save();
      res.json({ success: true, message: 'Password changed successfully.' });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Server error.' });
    }
  }
);

module.exports = router;
