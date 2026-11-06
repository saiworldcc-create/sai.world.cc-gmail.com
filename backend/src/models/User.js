const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    phone: {
      type: String,
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false,
    },
    googleId: {
      type: String,
    },
    avatar: {
      type: String,
    },
    savedAddresses: [
      {
        label: String,
        address: String,
        city: String,
        country: String,
        postalCode: String,
      }
    ],
    role: {
      type: String,
      enum: ['customer', 'delivery_partner', 'vendor'],
      default: 'customer'
    },
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'EcomShop'
    },
    // Phase 14: API Keys for Headless B2B Integrations
    apiKeys: [
      {
        key: String,
        name: String,
        createdAt: { type: Date, default: Date.now },
        lastUsed: Date
      }
    ]
  },
  { timestamps: true }
);

// Encrypt password using bcrypt
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
