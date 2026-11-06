const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./src/models/User');

async function fix() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const vendors = await User.find({ role: 'vendor' });
    
    for (const vendor of vendors) {
      // The pre('save') hook will automatically hash 'vendor123' properly.
      vendor.password = 'vendor123';
      await vendor.save();
      console.log(`Reset password for vendor ${vendor.email} to 'vendor123'`);
    }
    
    console.log('All vendor passwords have been reset successfully.');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
fix();
