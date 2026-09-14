const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const Admin = require('../models/Admin');
const User = require('../models/User');
const { protect, restrictTo } = require('../middleware/auth');
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

// ==========================
// CUSTOMERS MANAGEMENT ROUTES
// ==========================

// GET /api/v1/admin/customers — fetch all customers (super-admin only)
router.get('/customers', protect, restrictTo('super-admin'), async (req, res) => {
  try {
    const customers = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, customers });
  } catch (err) {
    console.error('Fetch customers error:', err);
    res.status(500).json({ success: false, message: 'Server error fetching customers.' });
  }
});

// ==========================
// STAFF MANAGEMENT ROUTES
// ==========================

// GET /api/v1/admin/staff — fetch all staff members (super-admin only)
router.get('/staff', protect, restrictTo('super-admin'), async (req, res) => {
  try {
    const staff = await Admin.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, staff });
  } catch (err) {
    console.error('Fetch staff error:', err);
    res.status(500).json({ success: false, message: 'Server error fetching staff.' });
  }
});

// POST /api/v1/admin/staff — create a new staff member (super-admin only)
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
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() });
    }

    try {
      const { name, email, password, role, customRoleName } = req.body;
      const existingUser = await Admin.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Email already exists.' });
      }

      const newStaff = await Admin.create({ name, email, password, role, customRoleName, displayPassword: password });
      newStaff.password = undefined; // Don't send back the hashed password

      res.status(201).json({ success: true, message: 'Staff member created successfully.', staff: newStaff });
    } catch (err) {
      console.error('Create staff error:', err);
      res.status(500).json({ success: false, message: 'Server error creating staff.' });
    }
  }
);

// PUT /api/v1/admin/staff/:id — update a staff member (super-admin only)
router.put('/staff/:id', protect, restrictTo('super-admin'), async (req, res) => {
  try {
    const { name, email, role, customRoleName, password } = req.body;
    const staffId = req.params.id;
    
    const staff = await Admin.findById(staffId).select('+password');
    if (!staff) {
      return res.status(404).json({ success: false, message: 'Staff member not found.' });
    }

    if (email && email !== staff.email) {
      const existingUser = await Admin.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Email already exists.' });
      }
      staff.email = email;
    }

    if (name) staff.name = name;
    if (role) staff.role = role;
    if (customRoleName !== undefined) staff.customRoleName = customRoleName;
    
    if (password) {
      staff.password = password;
      staff.displayPassword = password;
    }

    await staff.save();
    staff.password = undefined;

    res.json({ success: true, message: 'Staff member updated.', staff });
  } catch (err) {
    console.error('Update staff error:', err);
    res.status(500).json({ success: false, message: 'Server error updating staff.' });
  }
});

// DELETE /api/v1/admin/staff/:id — delete a staff member (super-admin only)
router.delete('/staff/:id', protect, restrictTo('super-admin'), async (req, res) => {
  try {
    const staffId = req.params.id;
    if (staffId === req.admin.id) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own account.' });
    }
    
    await Admin.findByIdAndDelete(staffId);
    res.json({ success: true, message: 'Staff member deleted.' });
  } catch (err) {
    console.error('Delete staff error:', err);
    res.status(500).json({ success: false, message: 'Server error deleting staff.' });
  }
});

module.exports = router;
