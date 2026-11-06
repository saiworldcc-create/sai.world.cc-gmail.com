const Vehicle = require('../models/Vehicle');

// Phase 12: Fleet & Maintenance Tracking
exports.getFleet = async (req, res) => {
  try {
    const fleet = await Vehicle.find().populate('driverId', 'name email phone').sort('-createdAt');
    
    // Auto-generate alerts if insurance is expiring within 30 days
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    for (const vehicle of fleet) {
      if (vehicle.insuranceExpiry && vehicle.insuranceExpiry <= thirtyDaysFromNow) {
        const hasAlert = vehicle.maintenanceAlerts.some(a => !a.resolved && a.title.includes('Insurance'));
        if (!hasAlert) {
          vehicle.maintenanceAlerts.push({ title: 'Insurance Expiring Soon!' });
          await vehicle.save();
        }
      }
    }

    res.json({ success: true, count: fleet.length, data: fleet });
  } catch (err) {
    console.error('Fetch fleet error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.addVehicle = async (req, res) => {
  try {
    const newVehicle = await Vehicle.create(req.body);
    res.status(201).json({ success: true, message: 'Vehicle added to fleet', data: newVehicle });
  } catch (err) {
    console.error('Add vehicle error:', err);
    res.status(500).json({ success: false, message: 'Failed to add vehicle' });
  }
};

exports.addFuelLog = async (req, res) => {
  try {
    const { id } = req.params;
    const { liters, cost, receiptUrl } = req.body;
    
    const vehicle = await Vehicle.findById(id);
    if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });

    vehicle.fuelLogs.push({ liters, cost, receiptUrl });
    await vehicle.save();

    res.json({ success: true, message: 'Fuel log recorded', data: vehicle });
  } catch (err) {
    console.error('Fuel log error:', err);
    res.status(500).json({ success: false, message: 'Failed to record fuel log' });
  }
};
