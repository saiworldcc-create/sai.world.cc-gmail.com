const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const EcomShop = require('./src/models/EcomShop');
const User = require('./src/models/User');

async function fixVendors() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');

    const allShops = await EcomShop.find();
    const passwordHash = await bcrypt.hash('vendor123', 10);

    for (const shop of allShops) {
      if (!shop.ownerId) {
        const email = shop.name.toLowerCase().replace(/[^a-z0-9]/g, '') + '@vendor.com';
        
        let user = await User.findOne({ email });
        if (!user) {
          user = await User.create({
            name: shop.name + ' Owner',
            email: email,
            password: passwordHash,
            phone: '9999999999',
            role: 'vendor',
            shopId: shop._id
          });
        }
        
        shop.ownerId = user._id;
        await shop.save();
        console.log(`Created user ${email} (Password: vendor123) for shop ${shop.name}`);
      }
    }
    console.log('Done!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

fixVendors();
