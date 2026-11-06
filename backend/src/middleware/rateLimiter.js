/**
 * In-Memory Sliding Window Rate Limiting Middleware
 * Protects endpoints, safeguards free API quotas (e.g. Gemini 15 RPM),
 * and prevents abuse without requiring an external paid Redis instance.
 */

const requestBuckets = new Map();

// Periodic sweep to remove stale IP buckets every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of requestBuckets.entries()) {
    if (now - bucket.resetTime > 60000) {
      requestBuckets.delete(key);
    }
  }
}, 300000);

/**
 * Factory for rate limiting middleware
 * @param {Object} options
 * @param {number} options.windowMs - Time window in milliseconds (default 1 min)
 * @param {number} options.max - Maximum requests allowed per IP within the window
 * @param {string} options.message - Error message when limit is exceeded
 */
function createRateLimiter(options = {}) {
  const windowMs = options.windowMs || 60 * 1000;
  const maxRequests = options.max || 60;
  const message = options.message || 'Too many requests from this IP, please try again shortly.';

  return (req, res, next) => {
    // Determine client identifier (IP address or fallback)
    const clientIp = req.headers['x-forwarded-for']?.split(',')[0].trim() ||
      req.connection?.remoteAddress ||
      req.socket?.remoteAddress ||
      'unknown_client';

    const routeKey = `${options.name || 'general'}_${clientIp}`;
    const now = Date.now();

    let bucket = requestBuckets.get(routeKey);

    if (!bucket || now > bucket.resetTime) {
      bucket = {
        count: 1,
        resetTime: now + windowMs,
      };
      requestBuckets.set(routeKey, bucket);
      res.setHeader('X-RateLimit-Limit', maxRequests);
      res.setHeader('X-RateLimit-Remaining', maxRequests - 1);
      return next();
    }

    bucket.count++;
    const remaining = Math.max(0, maxRequests - bucket.count);
    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', remaining);

    if (bucket.count > maxRequests) {
      const retryAfterSeconds = Math.ceil((bucket.resetTime - now) / 1000);
      res.setHeader('Retry-After', retryAfterSeconds);
      return res.status(429).json({
        success: false,
        error: 'RATE_LIMIT_EXCEEDED',
        message: message,
        retryAfterSeconds: retryAfterSeconds,
      });
    }

    return next();
  };
}

module.exports = {
  // General API protection: 120 req/min
  generalLimiter: createRateLimiter({
    name: 'api_general',
    windowMs: 60 * 1000,
    max: 120,
    message: 'Too many API requests. Please slow down.'
  }),

  // AI chat quota safeguard: 15 req/min (aligned with Gemini free tier)
  aiChatLimiter: createRateLimiter({
    name: 'ai_chat',
    windowMs: 60 * 1000,
    max: 15,
    message: 'AI Assistant rate limit reached (Free Tier quota: 15 requests/min). Please wait a moment before sending another message.'
  }),

  // Tracking endpoint: 60 req/min
  trackingLimiter: createRateLimiter({
    name: 'tracking',
    windowMs: 60 * 1000,
    max: 60,
    message: 'Too many tracking lookups. Please retry in a few moments.'
  }),

  // Authentication endpoints: 15 attempts / 5 mins
  authLimiter: createRateLimiter({
    name: 'auth_login',
    windowMs: 5 * 60 * 1000,
    max: 15,
    message: 'Too many login attempts. Please wait 5 minutes before trying again.'
  }),

  createRateLimiter,
};

