const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load environment variables for DB connection
require('dotenv').config({ path: '../../backend/.env' });

// Define Models to avoid requiring the full app
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: { type: String, select: false },
  phone: String,
  role: { type: String, enum: ['user', 'admin', 'vendor'], default: 'user' }
});
const User = mongoose.model('User', userSchema);

const vendorOrgSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  companyName: String,
  gstin: String,
  tradeLicense: String,
  isVerified: { type: Boolean, default: false }
});
const VendorOrganization = mongoose.model('VendorOrganization', vendorOrgSchema);

async function seedVendors() {
  try {
    const mongoUri = 'mongodb+srv://userOne:userOne123@cluster0.xatyxzv.mongodb.net/sai_international?retryWrites=true&w=majority';
    await mongoose.connect(mongoUri);
    console.log('Connected to DB');

    const passwordHash = await bcrypt.hash('vendor123', 10);

    // Vendor 1: Verified
    const v1 = await User.findOneAndUpdate(
      { email: 'vendor1@test.com' },
      { name: 'Tech Solutions India', email: 'vendor1@test.com', password: passwordHash, phone: '9876543211', role: 'vendor' },
      { upsert: true, new: true }
    );
    await VendorOrganization.findOneAndUpdate(
      { user: v1._id },
      { user: v1._id, companyName: 'Tech Solutions India', gstin: '22AAAAA0000A1Z1', isVerified: true },
      { upsert: true }
    );

    // Vendor 2: Unverified (Pending KYC)
    const v2 = await User.findOneAndUpdate(
      { email: 'vendor2@test.com' },
      { name: 'Global Traders', email: 'vendor2@test.com', password: passwordHash, phone: '9876543212', role: 'vendor' },
      { upsert: true, new: true }
    );
    await VendorOrganization.findOneAndUpdate(
      { user: v2._id },
      { user: v2._id, companyName: 'Global Traders', gstin: '22BBBBB0000B2Y2', isVerified: false },
      { upsert: true }
    );

    console.log('✅ Test vendors created successfully!');
    console.log('1. Verified Vendor: vendor1@test.com / vendor123');
    console.log('2. Unverified Vendor: vendor2@test.com / vendor123');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedVendors();
