const Shipment = require('../models/Shipment');
const LedgerTransaction = require('../models/LedgerTransaction');

// Phase 9: Complex Aggregation Pipeline for Revenue over the last 30 days
exports.getRevenueAnalytics = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const revenueData = await LedgerTransaction.aggregate([
      {
        $match: {
          type: 'Credit',
          status: 'Completed',
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          revenue: { $sum: '$amount' }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    const formattedData = revenueData.map(item => ({
      date: item._id,
      revenue: item.revenue
    }));

    // If there's no data, let's supply some realistic mock data for the enterprise demo
    if (formattedData.length === 0) {
      const mockData = [];
      let currentAmount = 5000;
      for(let i=30; i>=0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        currentAmount += Math.floor(Math.random() * 2000) - 500; // random walk
        mockData.push({
          date: d.toISOString().split('T')[0],
          revenue: currentAmount > 0 ? currentAmount : 1000
        });
      }
      return res.json({ success: true, data: mockData, isMock: true });
    }

    res.json({ success: true, data: formattedData });
  } catch (err) {
    console.error('Revenue analytics error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Phase 9: Shipment Volume by Status
exports.getShipmentAnalytics = async (req, res) => {
  try {
    const volumeData = await Shipment.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    let formattedData = volumeData.map(item => ({
      name: item._id || 'Pending',
      value: item.count
    }));

    if (formattedData.length === 0) {
      formattedData = [
        { name: 'In Transit', value: 450 },
        { name: 'Delivered', value: 800 },
        { name: 'Pending Pickup', value: 120 },
        { name: 'Exception', value: 30 }
      ];
    }

    res.json({ success: true, data: formattedData });
  } catch (err) {
    console.error('Shipment analytics error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
