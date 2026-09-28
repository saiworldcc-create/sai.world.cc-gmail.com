const socketIo = require('socket.io');
const { cacheLiveLocation } = require('./redisService');

let io;

const initSocket = (server) => {
  io = socketIo(server, {
    cors: {
      origin: '*', // For development. In production, restrict to your domain.
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
    }
  });

  io.on('connection', (socket) => {
    console.log(`🔌 New client connected: ${socket.id}`);

    // Delivery Boy joins a room for a specific AWB to broadcast their location
    socket.on('driver_join_awb', (awb) => {
      socket.join(`track_${awb}`);
      console.log(`🚚 Driver joined room: track_${awb}`);
    });

    // Customer joins a room to listen for live location updates
    socket.on('customer_join_awb', (awb) => {
      socket.join(`track_${awb}`);
      console.log(`👤 Customer joined tracking room: track_${awb}`);
    });

    // Driver sends live location
    socket.on('driver_update_location', async (data) => {
      const { awb, lat, lng } = data;
      
      // 1. Instantly broadcast to customer's screen
      socket.to(`track_${awb}`).emit('live_location_update', {
        lat,
        lng,
        timestamp: new Date().toISOString()
      });

      // 2. Cache in Redis/Memory for high-frequency buffering
      await cacheLiveLocation(awb, lat, lng);
      
      // Note: A background worker (Phase 3) will flush Redis cache to MongoDB every 2-5 minutes
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);
    });
  });
};

const getIo = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

module.exports = { initSocket, getIo };
