require('dotenv').config();
const config = require('./config/env');
const path = require('path');
const costService = require('./services/costService');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const connectDB = require('./config/db');
const http = require('http');
const { initSocket } = require('./services/socketService');

// Route imports
const trackingRoutes = require('./routes/tracking.routes');
const bookingRoutes = require('./routes/booking.routes');
const contactRoutes = require('./routes/contact.routes');
const ratesRoutes = require('./routes/rates.routes');
const contentRoutes = require('./routes/content.routes');
const adminRoutes = require('./routes/admin.routes');
const imagekitRoutes = require('./routes/imagekit.routes');
const userRoutes = require('./routes/user.routes');
const paymentRoutes = require('./routes/payment.routes');
const aiRoutes = require('./routes/ai.routes');
const ecommerceRoutes = require('./routes/ecommerce.routes');
const deliveryRoutes = require('./routes/delivery.routes');
const vendorRoutes = require('./routes/vendor.routes');
const rfqRoutes = require('./routes/rfq.routes');
const enterpriseRoutes = require('./routes/enterprise.routes');
const analyticsRoutes = require('./routes/analytics.routes'); // Phase 9
const fleetRoutes = require('./routes/fleet.routes'); // Phase 12
const pdfRoutes = require('./routes/pdf.routes'); // Phase 13
const externalRoutes = require('./routes/external.routes'); // Phase 14
const geoRoutes = require('./routes/geo.routes'); // Free Geo Service

// Initialize Enterprise Workers
require('./workers/logisticsWorker');

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

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
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
  credentials: true,
}));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// Data Sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data Sanitization against XSS
app.use(xss());

// ── Health Check ──────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Sai International Couriers API',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
  });
});

// ── Free Tier Cost Audit & Quota Monitoring ──────────────────────────────
app.get('/api/v1/cost-audit', (req, res) => {
  res.json({ success: true, ...costService.getCostAuditSummary() });
});

// ── Static File Uploads (Local Storage Fallback) ─────────────────────────
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// ── API Routes ────────────────────────────────────────────────────────────
app.use('/api/v1/tracking', trackingRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/contact', contactRoutes);
app.use('/api/v1/rates', ratesRoutes);
app.use('/api/v1/content', contentRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/imagekit', imagekitRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/ecommerce', ecommerceRoutes);
app.use('/api/v1/delivery', deliveryRoutes);
app.use('/api/v1/vendor', vendorRoutes);
app.use('/api/v1/rfq', rfqRoutes);
app.use('/api/v1/enterprise', enterpriseRoutes);
app.use('/api/v1/analytics', analyticsRoutes); // Phase 9
app.use('/api/v1/fleet', fleetRoutes); // Phase 12
app.use('/api/v1/pdf', pdfRoutes); // Phase 13
app.use('/api/v2/external', externalRoutes); // Phase 14 (Headless)
app.use('/api/v1/geo', geoRoutes); // Free Geo Service

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
  server.listen(PORT, () => {
    console.log(`\n🚀 Sai Couriers API v2.0 running on http://localhost:${PORT}`);
    console.log(`   Health:   http://localhost:${PORT}/api/health`);
    console.log(`   Tracking: http://localhost:${PORT}/api/v1/tracking/:awb`);
    console.log(`   Content:  http://localhost:${PORT}/api/v1/content/:page`);
    console.log(`   Admin:    http://localhost:${PORT}/api/v1/admin/login\n`);
  });
});

// Trigger nodemon

// Trigger nodemon for Phase 2
