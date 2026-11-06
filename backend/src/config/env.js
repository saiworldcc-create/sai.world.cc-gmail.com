/**
 * Enterprise Central Environment Configuration & Validation Module
 * Sai International Couriers & Cargo - Core Architecture
 * 
 * Rules:
 * - Validates essential runtime configuration on startup.
 * - Enforces zero secret leakage in logs or exceptions.
 * - Provides non-blocking fallbacks for optional cloud integrations in local development.
 */

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });
require('dotenv').config(); // Fallback to local process cwd

const nodeEnv = process.env.NODE_ENV || 'development';
const isProd = nodeEnv === 'production';
const isTest = nodeEnv === 'test';

// Configuration Object
const config = {
  env: nodeEnv,
  isProduction: isProd,
  isDevelopment: !isProd && !isTest,
  isTest: isTest,

  server: {
    port: parseInt(process.env.PORT || '5000', 10),
    appName: 'Sai International Couriers & Cargo API',
    apiVersion: '2.0.0',
    apiPrefix: '/api/v1',
  },

  db: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/sai_international',
    serverSelectionTimeoutMS: 10000,
  },

  auth: {
    jwtSecret: process.env.JWT_SECRET || (isProd ? null : 'sai_dev_jwt_super_secret_fallback_key_2026'),
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    adminSeedEmail: process.env.ADMIN_EMAIL || 'sai.world.cc@gmail.com',
    adminSeedPassword: process.env.ADMIN_PASSWORD || 'SaiAdmin@2026',
    googleClientId: process.env.GOOGLE_CLIENT_ID || '',
  },

  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  },

  redis: {
    url: process.env.REDIS_URL || '',
    enabled: !!process.env.REDIS_URL,
  },

  payments: {
    razorpay: {
      keyId: process.env.RAZORPAY_KEY_ID || '',
      keySecret: process.env.RAZORPAY_KEY_SECRET || '',
      enabled: !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET),
    },
    stripe: {
      secretKey: process.env.STRIPE_SECRET_KEY || '',
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
      enabled: !!process.env.STRIPE_SECRET_KEY,
    },
  },

  storage: {
    imagekit: {
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY || '',
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY || '',
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || '',
      enabled: !!(process.env.IMAGEKIT_PUBLIC_KEY && process.env.IMAGEKIT_PRIVATE_KEY && process.env.IMAGEKIT_URL_ENDPOINT),
    },
  },

  email: {
    smtp: {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '465', 10),
      secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465',
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
      from: process.env.EMAIL_FROM || '"Sai International Couriers & Cargo" <info@sai-couriers.com>',
      alertEmail: process.env.ALERT_EMAIL || 'info@sai-couriers.com',
      enabled: !!(process.env.SMTP_USER && process.env.SMTP_PASS),
    },
  },

  ai: {
    gemini: {
      apiKey: process.env.GEMINI_API_KEY || '',
      model: 'gemini-2.5-flash',
      enabled: !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'dummy_gemini_key',
    },
  },

  costControl: {
    enablePaidServices: process.env.ENABLE_PAID_SERVICES === 'true',
    carrierMode: process.env.CARRIER_MODE || 'sandbox',
    storageProvider: process.env.STORAGE_PROVIDER || 'imagekit',
    smtpProvider: process.env.SMTP_PROVIDER || 'gmail',
  },
};

/**
 * Startup Validation Routine
 * Halts startup in production if mandatory variables are missing.
 * Logs non-destructive warnings in development.
 */
function validateEnv() {
  const missingCritical = [];

  if (!process.env.MONGODB_URI) {
    missingCritical.push('MONGODB_URI');
  }

  if (isProd && (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32)) {
    missingCritical.push('JWT_SECRET (must be >= 32 characters in production)');
  }

  if (missingCritical.length > 0) {
    if (isProd) {
      console.error(`\n❌ [FATAL CONFIG ERROR] Missing critical production environment variables:`);
      missingCritical.forEach((varName) => console.error(`   - ${varName}`));
      console.error(`Application startup aborted for security.\n`);
      process.exit(1);
    } else {
      console.warn(`\n⚠️  [DEV CONFIG WARNING] Missing configuration for: ${missingCritical.join(', ')}`);
    }
  }

  return true;
}

// Run basic validation immediately
validateEnv();

module.exports = config;

