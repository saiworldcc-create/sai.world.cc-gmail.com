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

    // --- Enterprise Admin Rooms ---
    socket.on('admin_join', () => {
      socket.join('admin_global');
      console.log(`👑 Admin joined room: admin_global`);
    });

    // --- Vendor Rooms ---
    socket.on('vendor_join', (vendorId) => {
      socket.join(`vendor_${vendorId}`);
      console.log(`🏢 Vendor joined room: vendor_${vendorId}`);
    });

    // --- Delivery Rooms ---
    socket.on('driver_join_awb', (awb) => {
      socket.join(`track_${awb}`);
      console.log(`🚚 Driver joined room: track_${awb}`);
    });

    socket.on('customer_join_awb', (awb) => {
      socket.join(`track_${awb}`);
      console.log(`👤 Customer joined tracking room: track_${awb}`);
    });

    socket.on('driver_update_location', async (data) => {
      const { awb, lat, lng } = data;
      
      socket.to(`track_${awb}`).emit('live_location_update', {
        lat, lng, timestamp: new Date().toISOString()
      });

      socket.to('admin_global').emit('admin_fleet_update', {
        awb, lat, lng, timestamp: new Date().toISOString()
      });

      await cacheLiveLocation(awb, lat, lng);
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
