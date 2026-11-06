const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  registrationNumber: { type: String, required: true, unique: true },
  vehicleType: { type: String, enum: ['Van', 'Truck', 'Bike'], default: 'Van' },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['Active', 'In Maintenance', 'Retired'], default: 'Active' },
  odometer: { type: Number, default: 0 },
  insuranceExpiry: { type: Date },
  fuelLogs: [
    {
      date: { type: Date, default: Date.now },
      liters: Number,
      cost: Number,
      receiptUrl: String
    }
  ],
  maintenanceAlerts: [
    {
      title: String,
      resolved: { type: Boolean, default: false },
      createdAt: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);
