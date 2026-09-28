const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const Admin = require('../models/Admin');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Shipment = require('../models/Shipment');
const ContactMessage = require('../models/ContactMessage');
const Notification = require('../models/Notification');
const AppSetting = require('../models/AppSetting');
const { sendShipmentCreatedEmail } = require('../services/emailService');
const fs = require('fs');
const path = require('path');

function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
}

exports.loginAdmin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ success: false, errors: errors.array() });

  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin || !admin.isActive) return res.status(401).json({ success: false, message: 'Invalid email or password.' });

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid email or password.' });

    admin.lastLogin = new Date();
    await admin.save({ validateBeforeSave: false });

    const token = signToken(admin._id);
    return res.json({ success: true, token, admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role } });
  } catch (err) {
    console.error('Admin login error:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

exports.getMe = (req, res) => {
  res.json({ success: true, admin: req.admin });
};

exports.getStats = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const activeShipments = await Shipment.countDocuments({ status: { $ne: 'Delivered' } });
    const totalShipments = await Shipment.countDocuments();
    const unreadMessages = await ContactMessage.countDocuments({ isRead: false });
    const recentBookings = await Booking.find().sort({ createdAt: -1 }).limit(5);

    res.json({ success: true, stats: { totalBookings, activeShipments, totalShipments, unreadMessages, recentBookings } });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ success: false, message: 'Server error fetching stats.' });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    let notifications = await Notification.find().sort({ createdAt: -1 }).limit(20);
    notifications = notifications.map(n => {
      const doc = n.toObject();
      doc.isRead = doc.readBy && doc.readBy.some(id => id.toString() === req.admin._id.toString());
      return doc;
    });
    const unreadCount = notifications.filter(n => !n.isRead).length;
    res.json({ success: true, notifications, unreadCount });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.markNotificationsRead = async (req, res) => {
  try {
    await Notification.updateMany({ readBy: { $ne: req.admin._id } }, { $push: { readBy: req.admin._id } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.changePassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ success: false, errors: errors.array() });

  try {
    const admin = await Admin.findById(req.admin._id).select('+password');
    const isMatch = await admin.comparePassword(req.body.currentPassword);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Current password is incorrect.' });

    admin.password = req.body.newPassword;
    await admin.save();
    res.json({ success: true, message: 'Password changed successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

exports.getCustomers = async (req, res) => {
  try {
    const customers = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, customers });
  } catch (err) {
    console.error('Fetch customers error:', err);
    res.status(500).json({ success: false, message: 'Server error fetching customers.' });
  }
};

exports.getStaff = async (req, res) => {
  try {
    const staff = await Admin.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, staff });
  } catch (err) {
    console.error('Fetch staff error:', err);
    res.status(500).json({ success: false, message: 'Server error fetching staff.' });
  }
};

exports.createStaff = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ success: false, errors: errors.array() });

  try {
    const { name, email, password, role, customRoleName } = req.body;
    const existingUser = await Admin.findOne({ email });
    if (existingUser) return res.status(400).json({ success: false, message: 'Email already exists.' });

    const newStaff = await Admin.create({ name, email, password, role, customRoleName, displayPassword: password });
    newStaff.password = undefined;

    res.status(201).json({ success: true, message: 'Staff member created successfully.', staff: newStaff });
  } catch (err) {
    console.error('Create staff error:', err);
    res.status(500).json({ success: false, message: 'Server error creating staff.' });
  }
};

exports.updateStaff = async (req, res) => {
  try {
    const { name, email, role, customRoleName, password } = req.body;
    const staffId = req.params.id;
    const staff = await Admin.findById(staffId).select('+password');
    if (!staff) return res.status(404).json({ success: false, message: 'Staff member not found.' });

    if (email && email !== staff.email) {
      const existingUser = await Admin.findOne({ email });
      if (existingUser) return res.status(400).json({ success: false, message: 'Email already exists.' });
      staff.email = email;
    }

    if (name) staff.name = name;
    if (role) staff.role = role;
    if (customRoleName !== undefined) staff.customRoleName = customRoleName;
    if (password) { staff.password = password; staff.displayPassword = password; }

    await staff.save();
    staff.password = undefined;
    res.json({ success: true, message: 'Staff member updated.', staff });
  } catch (err) {
    console.error('Update staff error:', err);
    res.status(500).json({ success: false, message: 'Server error updating staff.' });
  }
};

exports.deleteStaff = async (req, res) => {
  try {
    const staffId = req.params.id;
    if (staffId === req.admin.id) return res.status(400).json({ success: false, message: 'You cannot delete your own account.' });
    await Admin.findByIdAndDelete(staffId);
    res.json({ success: true, message: 'Staff member deleted.' });
  } catch (err) {
    console.error('Delete staff error:', err);
    res.status(500).json({ success: false, message: 'Server error deleting staff.' });
  }
};

exports.getTempRates = async (req, res) => {
  try {
    const ratesPath = path.join(__dirname, '../data/carrierRates.json');
    const ratesData = fs.readFileSync(ratesPath, 'utf8');
    res.json({ success: true, rates: JSON.parse(ratesData) });
  } catch (err) {
    console.error('TEMP RATES ERROR:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getRates = async (req, res) => {
  try {
    const ratesPath = path.join(__dirname, '../data/carrierRates.json');
    const ratesData = fs.readFileSync(ratesPath, 'utf8');
    res.json({ success: true, rates: JSON.parse(ratesData) });
  } catch (err) {
    console.error('Rates GET error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateRates = async (req, res) => {
  try {
    const ratesPath = path.join(__dirname, '../data/carrierRates.json');
    fs.writeFileSync(ratesPath, JSON.stringify(req.body, null, 2), 'utf8');
    res.json({ success: true, message: 'Rates updated successfully' });
  } catch (err) {
    console.error('Rates GET error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getSettings = async (req, res) => {
  try {
    const settings = await AppSetting.find();
    res.json({ success: true, settings });
  } catch (err) {
    console.error('Fetch settings error:', err);
    res.status(500).json({ success: false, message: 'Server error fetching settings.' });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const { key, value } = req.body;
    await AppSetting.findOneAndUpdate({ key }, { value }, { upsert: true, new: true });
    res.json({ success: true, message: 'Setting updated successfully.' });
  } catch (err) {
    console.error('Update settings error:', err);
    res.status(500).json({ success: false, message: 'Server error updating settings.' });
  }
};

exports.getShipments = async (req, res) => {
  try {
    const shipments = await Shipment.find().sort({ createdAt: -1 });
    res.json({ success: true, shipments });
  } catch (err) {
    console.error('Fetch shipments error:', err);
    res.status(500).json({ success: false, message: 'Server error fetching shipments.' });
  }
};

exports.createShipment = async (req, res) => {
  try {
    const { awb, senderName, senderEmail, receiverName, receiverEmail, items, carrier, weight, length, width, height, destination, originHub } = req.body;
    const newShipment = await Shipment.create({
      awb, status: 'In Transit', stage: 1, sender: senderName || 'Unknown Sender', receiver: receiverName || 'Unknown Receiver',
      contents: items || 'General Goods', carrier: carrier || 'Sai Express', deadWeight: weight || '0 kg', volWeight: `${length || 0}x${width || 0}x${height || 0}`,
      chargeableWeight: weight || '0 kg', origin: originHub || 'Kadapa Hub (Main)', destination: destination || 'Unknown Destination', eta: '4-7 Business Days',
      history: [{ status: 'Shipment Created', time: new Date().toLocaleString(), location: originHub || 'Kadapa Hub', completed: true, active: true }]
    });

    await Notification.create({ type: 'order', title: 'New Shipment Created', message: `Shipment ${awb} was successfully created for ${senderName}.`, link: '/admin/shipments' });
    if (senderEmail || receiverEmail) sendShipmentCreatedEmail(newShipment, senderEmail, receiverEmail);
    res.status(201).json({ success: true, data: newShipment });
  } catch (err) {
    console.error('Create shipment error:', err);
    res.status(500).json({ success: false, message: 'Server error creating shipment.' });
  }
};

exports.updateShipment = async (req, res) => {
  try {
    const awb = req.params.awb;
    const { status, stage, location, newLog, exception } = req.body;
    const shipment = await Shipment.findOne({ awb });
    if (!shipment) return res.status(404).json({ success: false, message: 'Shipment not found' });

    if (status) shipment.status = status;
    if (stage) shipment.stage = Number(stage);
    if (exception) shipment.exception = { ...shipment.exception, ...exception };

    if (newLog) {
      shipment.history.forEach(log => { log.active = false; });
      shipment.history.unshift({ status: newLog, time: new Date().toLocaleString(), location: location || shipment.destination, completed: true, active: true });
    }

    await shipment.save();
    res.json({ success: true, message: 'Shipment updated successfully', data: shipment });
  } catch (err) {
    console.error('Update shipment error:', err);
    res.status(500).json({ success: false, message: 'Server error updating shipment.' });
  }
};

exports.getDeliveryPartners = async (req, res) => {
  try {
    const partners = await User.find({ role: 'delivery_partner' }).select('-password');
    res.json({ success: true, data: partners });
  } catch (err) {
    console.error('Fetch delivery partners error:', err);
    res.status(500).json({ success: false, message: 'Server error fetching partners.' });
  }
};

exports.assignDriver = async (req, res) => {
  try {
    const { driverId } = req.body;
    const shipment = await Shipment.findByIdAndUpdate(req.params.id, { assignedTo: driverId }, { new: true });
    if (!shipment) return res.status(404).json({ success: false, message: 'Shipment not found' });
    res.json({ success: true, data: shipment });
  } catch (err) {
    console.error('Assign driver error:', err);
    res.status(500).json({ success: false, message: 'Server error assigning driver.' });
  }
};
