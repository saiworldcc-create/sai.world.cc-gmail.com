const express = require('express');
const router = express.Router();
const Shipment = require('../models/Shipment');
const Booking = require('../models/Booking');
const EcomOrder = require('../models/EcomOrder');
const Notification = require('../models/Notification');
const { getIo } = require('../services/socketService');
const { protectUser, restrictUserTo } = require('../middleware/userAuth');
const multer = require('multer');
const ImageKit = require('imagekit');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB max

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// All routes here are protected and restricted to delivery_partner role
router.use(protectUser);
router.use(restrictUserTo('delivery_partner'));

// GET /api/v1/delivery/tasks
router.get('/tasks', async (req, res) => {
  try {
    const driverId = req.user._id;

    const shipments = await Shipment.find({
      $or: [
        { assignedTo: driverId },
        { assignedTo: { $exists: false } },
        { assignedTo: null }
      ]
    }).sort({ updatedAt: -1 }).lean();

    const bookings = await Booking.find({
      status: { $nin: ['Cancelled', 'Failed'] }
    }).sort({ updatedAt: -1 }).limit(30).lean();

    const ecomOrders = await EcomOrder.find({
      status: { $nin: ['cancelled'] }
    }).sort({ updatedAt: -1 }).limit(30).lean();

    const taskMap = new Map();

    shipments.forEach(s => {
      if (s.awb) {
        taskMap.set(s.awb.toUpperCase(), {
          _id: s._id,
          awb: s.awb,
          receiver: s.receiverName || s.receiver || 'Recipient',
          receiverPhone: s.receiverPhone || '',
          destination: s.destination || s.receiverAddress || 'Destination',
          sender: s.senderName || s.sender || 'Sai International Hub',
          senderPhone: s.senderPhone || '',
          senderAddress: s.senderAddress || s.origin || '',
          status: s.status || 'In Transit',
          contents: s.contents || 'Express Parcel',
          updatedAt: s.updatedAt || s.createdAt || new Date(),
          source: 'shipment'
        });
      }
    });

    bookings.forEach(b => {
      if (b.awb && !taskMap.has(b.awb.toUpperCase())) {
        taskMap.set(b.awb.toUpperCase(), {
          _id: b._id,
          awb: b.awb,
          receiver: b.receiverName || 'Recipient',
          receiverPhone: b.receiverPhone || '',
          destination: [b.destCity, b.destCountry].filter(Boolean).join(', ') || b.destCountry || 'Destination Address',
          sender: b.senderName || 'Sender',
          senderPhone: b.senderPhone || '',
          senderAddress: b.senderAddress || b.branchZone || '',
          status: b.status || 'Booking Confirmed',
          contents: b.itemCategory || 'Courier Cargo',
          updatedAt: b.updatedAt || b.createdAt || new Date(),
          source: 'booking'
        });
      }
    });

    ecomOrders.forEach(eo => {
      const orderAwb = eo.orderNumber || eo._id.toString();
      if (orderAwb && !taskMap.has(orderAwb.toUpperCase())) {
        const destStr = [
          eo.receiver?.address,
          eo.receiver?.city,
          eo.receiver?.country
        ].filter(Boolean).join(', ') || 'Customer Address';

        let formattedStatus = 'Ready for Pickup';
        if (eo.status === 'shipped') formattedStatus = 'In Transit';
        if (eo.status === 'delivered') formattedStatus = 'Delivered';

        taskMap.set(orderAwb.toUpperCase(), {
          _id: eo._id,
          awb: orderAwb,
          receiver: eo.receiver?.name || eo.customer?.name || 'Customer',
          receiverPhone: eo.receiver?.phone || eo.customer?.phone || '',
          destination: destStr,
          sender: 'Sai E-Commerce Store',
          senderPhone: '+91 90599 49365',
          senderAddress: 'Sai Fulfillment Center',
          status: formattedStatus,
          contents: eo.items?.map(i => `${i.qty}x ${i.name}`).join(', ') || 'E-Commerce Order',
          updatedAt: eo.updatedAt || eo.createdAt || new Date(),
          source: 'ecom'
        });
      }
    });

    const unifiedTasks = Array.from(taskMap.values()).sort((a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    res.json({ success: true, count: unifiedTasks.length, data: unifiedTasks });
  } catch (err) {
    console.error('Fetch delivery tasks error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Status Update Handler Function
const handleStatusUpdate = async (req, res) => {
  try {
    const { status, location } = req.body;
    if (!status || !location) {
      return res.status(400).json({ success: false, message: 'Status and location are required' });
    }

    const rawAwb = req.params.awb.trim().toUpperCase();
    let shipment = await Shipment.findOne({ awb: rawAwb });

    const time = new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

    if (shipment) {
      shipment.assignedTo = req.user._id;

      if (!shipment.history) shipment.history = [];
      shipment.history.push({ status, location, time, completed: true, active: true });

      shipment.history.forEach((h, idx) => {
        if (idx !== shipment.history.length - 1) h.active = false;
      });

      shipment.status = status;

      if (status.toLowerCase().includes('picked up')) shipment.stage = 2;
      if (status.toLowerCase().includes('in transit')) shipment.stage = 3;
      if (status.toLowerCase().includes('out for delivery')) shipment.stage = 4;
      if (status.toLowerCase().includes('delivered')) shipment.stage = 5;

      await shipment.save();
    } else {
      const booking = await Booking.findOne({ awb: rawAwb });
      if (booking) {
        booking.status = status;
        await booking.save();

        shipment = await Shipment.create({
          awb: rawAwb,
          senderName: booking.senderName,
          senderPhone: booking.senderPhone,
          senderAddress: booking.senderAddress || booking.branchZone,
          receiverName: booking.receiverName,
          receiverPhone: booking.receiverPhone,
          receiverAddress: [booking.destCity, booking.destCountry].filter(Boolean).join(', '),
          destination: booking.destCountry,
          contents: booking.itemCategory,
          status: status,
          assignedTo: req.user._id,
          stage: status.toLowerCase().includes('picked up') ? 2 : 3,
          history: [{ status, location, time, completed: true, active: true }]
        }).catch(err => console.error('Auto create shipment error:', err));
      }
    }

    const ecomOrder = await EcomOrder.findOne({ orderNumber: rawAwb });
    if (ecomOrder) {
      if (status.toLowerCase().includes('delivered')) {
        ecomOrder.status = 'delivered';
      } else if (status.toLowerCase().includes('picked up') || status.toLowerCase().includes('transit')) {
        ecomOrder.status = 'shipped';
      }
      await ecomOrder.save();
    }

    const driverName = req.user?.name || 'Delivery Executive';
    const isPickup = status.toLowerCase().includes('picked up') || status.toLowerCase().includes('pickup');

    const notifTitle = isPickup
      ? `📦 Order Picked Up Confirmed - ${rawAwb}`
      : `🚚 Shipment Status Updated: ${status} - ${rawAwb}`;

    const notifMsg = isPickup
      ? `Delivery Partner "${driverName}" has confirmed order pickup for ${rawAwb} at ${location}.`
      : `Delivery Partner "${driverName}" updated status of ${rawAwb} to "${status}" at ${location}.`;

    const newNotif = await Notification.create({
      title: notifTitle,
      message: notifMsg,
      type: isPickup ? 'pickup' : 'delivery',
      link: '/admin/shipments'
    }).catch(err => console.error('Failed to save notification:', err));

    try {
      const io = getIo();
      if (io) {
        if (newNotif) io.emit('new_notification', newNotif);
        io.emit('pickup_confirmed', {
          awb: rawAwb,
          driverName,
          status,
          location,
          timestamp: new Date().toISOString()
        });
      }
    } catch (e) {}

    res.json({ success: true, message: 'Status updated and notification dispatched', data: shipment });
  } catch (err) {
    console.error('Update status error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

router.put('/status/:awb', handleStatusUpdate);
router.put('/tasks/:awb/status', handleStatusUpdate);

const handleLiveLocation = async (req, res) => {
  try {
    const { lat, lng } = req.body;
    if (!lat || !lng) return res.status(400).json({ success: false, message: 'Lat/Lng required' });

    await Shipment.updateMany(
      { assignedTo: req.user._id, stage: 4 },
      {
        $set: {
          'liveLocation.lat': lat,
          'liveLocation.lng': lng,
          'liveLocation.timestamp': new Date()
        }
      }
    );

    res.json({ success: true, message: 'Location updated' });
  } catch (err) {
    console.error('Live location update error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

router.post('/live-location', handleLiveLocation);
router.post('/location', handleLiveLocation);

const handlePodUpload = async (req, res) => {
  try {
    const { signatureUrl, photoUrl } = req.body;
    const rawAwb = req.params.awb.trim().toUpperCase();

    let shipment = await Shipment.findOne({ awb: rawAwb });
    if (shipment) {
      if (!shipment.pod) shipment.pod = {};
      if (signatureUrl) shipment.pod.signatureUrl = signatureUrl;
      if (photoUrl) shipment.pod.photoUrl = photoUrl;
      await shipment.save();
    }

    const driverName = req.user?.name || 'Delivery Executive';
    await Notification.create({
      title: `📸 POD Uploaded - ${rawAwb}`,
      message: `Delivery Partner "${driverName}" uploaded Proof of Delivery for shipment ${rawAwb}.`,
      type: 'delivery',
      link: '/admin/shipments'
    }).catch(err => console.error(err));

    res.json({ success: true, message: 'POD saved successfully', pod: shipment?.pod });
  } catch (err) {
    console.error('POD update error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

router.post('/pod/:awb', handlePodUpload);

const handlePodImageUpload = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded.' });

    const rawAwb = req.params.awb.trim().toUpperCase();

    const result = await imagekit.upload({
      file: req.file.buffer,
      fileName: `pod_${rawAwb}_${Date.now()}.jpg`,
      folder: '/sai_logistics/pods'
    });

    const shipment = await Shipment.findOneAndUpdate(
      { awb: rawAwb },
      { 'pod.photoUrl': result.url, status: 'Delivered', stage: 5 },
      { new: true }
    );

    const driverName = req.user?.name || 'Delivery Executive';
    const newNotif = await Notification.create({
      title: `📸 POD Uploaded & Delivered - ${rawAwb}`,
      message: `Delivery Partner "${driverName}" uploaded POD photo for shipment ${rawAwb}.`,
      type: 'delivery',
      link: '/admin/shipments'
    }).catch(err => console.error(err));

    try {
      const io = getIo();
      if (io && newNotif) {
        io.emit('new_notification', newNotif);
      }
    } catch (e) {}

    res.json({ success: true, message: 'POD Uploaded Successfully', data: shipment });
  } catch (err) {
    console.error('POD upload error:', err);
    res.status(500).json({ success: false, message: 'Failed to upload POD.' });
  }
};

router.post('/pod/:awb/upload', upload.single('image'), handlePodImageUpload);
router.post('/tasks/:awb/upload-pod', upload.single('image'), handlePodImageUpload);

module.exports = router;
