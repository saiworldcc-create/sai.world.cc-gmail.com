// Enterprise Caching Layer for GPS Streams
// In production, this connects to a Redis cluster.
// For local development on Windows, it gracefully falls back to an in-memory queue.

let useRedis = false;
let redisClient = null;

// In-memory fallback queue for local development without Redis
const memoryQueue = new Map();

try {
  // Attempt to load redis if installed
  const redis = require('redis');
  
  if (process.env.REDIS_URL) {
    redisClient = redis.createClient({ url: process.env.REDIS_URL });
    redisClient.on('error', (err) => console.log('Redis Client Error', err));
    redisClient.connect().then(() => {
      console.log('📦 Redis Cache Layer Connected');
      useRedis = true;
    }).catch(() => {
      console.log('⚠️ Redis connection failed. Falling back to in-memory queue for dev.');
    });
  } else {
    console.log('⚠️ REDIS_URL not found. Using in-memory queue for GPS streaming.');
  }
} catch (error) {
  console.log('⚠️ Redis module not installed. Using in-memory queue for GPS streaming.');
}

const cacheLiveLocation = async (awb, lat, lng) => {
  const payload = JSON.stringify({ lat, lng, timestamp: new Date().toISOString() });
  
  if (useRedis && redisClient) {
    // Overwrite the latest location in Redis (key expires in 1 hour)
    await redisClient.setEx(`gps_stream:${awb}`, 3600, payload);
  } else {
    // In-memory fallback
    memoryQueue.set(`gps_stream:${awb}`, payload);
  }
};

const getCachedLocation = async (awb) => {
  if (useRedis && redisClient) {
    const data = await redisClient.get(`gps_stream:${awb}`);
    return data ? JSON.parse(data) : null;
  } else {
    const data = memoryQueue.get(`gps_stream:${awb}`);
    return data ? JSON.parse(data) : null;
  }
};

module.exports = {
  cacheLiveLocation,
  getCachedLocation
};
