const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { OAuth2Client } = require('google-auth-library');
const crypto = require('crypto');
const User = require('../models/User');
const Booking = require('../models/Booking');

function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
}

exports.registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ success: false, errors: errors.array() });

  try {
    const { name, email, password, phone } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ success: false, message: 'Email already registered' });

    const user = await User.create({ name, email, password, phone });
    const token = signToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ success: false, errors: errors.array() });

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const token = signToken(user._id);
    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.googleLogin = async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ success: false, message: 'No token provided' });

  try {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture: avatar } = payload;

    let user = await User.findOne({ email });

    if (user) {
      if (!user.googleId) {
        user.googleId = googleId;
        user.avatar = avatar;
        await user.save();
      }
    } else {
      const randomPassword = crypto.randomBytes(16).toString('hex');
      user = await User.create({
        name,
        email,
        password: randomPassword,
        googleId,
        avatar
      });
    }

    const jwtToken = signToken(user._id);

    res.status(200).json({
      success: true,
      token: jwtToken,
      user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar }
    });
  } catch (err) {
    console.error('Google Auth Error:', err);
    res.status(401).json({ success: false, message: 'Google authentication failed' });
  }
};

exports.getMe = (req, res) => {
  res.json({ success: true, user: req.user });
};

exports.getUserShipments = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: bookings });
  } catch (err) {
    console.error('Fetch user shipments error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
