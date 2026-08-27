require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');

// Route imports
const trackingRoutes = require('./routes/tracking.routes');
const bookingRoutes = require('./routes/booking.routes');
const contactRoutes = require('./routes/contact.routes');
const ratesRoutes = require('./routes/rates.routes');
const contentRoutes = require('./routes/content.routes');
const adminRoutes = require('./routes/admin.routes');
const imagekitRoutes = require('./routes/imagekit.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Security & Middleware ──────────────────────────────────────────────────
app.use(helmet({
  crossOriginEmbedderPolicy: false, // allow iframe embeds for maps
}));
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin or any local network / localhost device
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Health Check ──────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Sai International Couriers API',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
  });
});

// ── API Routes ────────────────────────────────────────────────────────────
app.use('/api/v1/tracking', trackingRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/contact', contactRoutes);
app.use('/api/v1/rates', ratesRoutes);
app.use('/api/v1/content', contentRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/imagekit', imagekitRoutes);

// ── 404 Handler ───────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` });
});

// ── Global Error Handler ──────────────────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error('Unhandled error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error.',
  });
});

// ── Start ─────────────────────────────────────────────────────────────────
const { verifySMTP } = require('./services/emailService');

connectDB().then(() => {
  verifySMTP();
  app.listen(PORT, () => {
    console.log(`\n🚀 Sai Couriers API v2.0 running on http://localhost:${PORT}`);
    console.log(`   Health:   http://localhost:${PORT}/api/health`);
    console.log(`   Tracking: http://localhost:${PORT}/api/v1/tracking/:awb`);
    console.log(`   Content:  http://localhost:${PORT}/api/v1/content/:page`);
    console.log(`   Admin:    http://localhost:${PORT}/api/v1/admin/login\n`);
  });
});
