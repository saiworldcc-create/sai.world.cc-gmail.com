require('dotenv').config();
const mongoose = require('mongoose');
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
const Booking = require('./models/Booking');

async function fixDB() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to DB');
  
  // Clear old bookings that have the old format
  const result = await Booking.deleteMany({});
  console.log('Deleted bookings:', result.deletedCount);
  
  await mongoose.disconnect();
  console.log('Done');
}

fixDB().catch(console.error);
