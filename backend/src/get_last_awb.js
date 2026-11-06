require('dotenv').config();
const mongoose = require('mongoose');
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
const Booking = require('./models/Booking');
const Shipment = require('./models/Shipment');

async function getLastAWB() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const lastBooking = await Booking.findOne().sort({ createdAt: -1 });
  if (lastBooking) console.log('Last Booking AWB:', lastBooking.awb);
  else console.log('No bookings found.');

  const lastShipment = await Shipment.findOne().sort({ createdAt: -1 });
  if (lastShipment) console.log('Last Shipment AWB:', lastShipment.awb);
  else console.log('No shipments found.');

  await mongoose.disconnect();
}

getLastAWB().catch(console.error);
