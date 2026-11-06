const User = require('../models/User');
const EcomShop = require('../models/EcomShop');
const EcomProduct = require('../models/EcomProduct');
const PurchaseOrder = require('../models/PurchaseOrder');
const LedgerTransaction = require('../models/LedgerTransaction');
const SupportTicket = require('../models/SupportTicket');
const eventBus = require('../utils/eventBus');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.registerVendor = async (req, res) => {
  try {
    const { name, email, password, phone, shopName, gstin, tradeLicense } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }
    
    let shop = await EcomShop.findOne({ name: shopName });
    if (shop) {
      return res.status(400).json({ success: false, message: 'Shop name already taken' });
    }

    user = await User.create({
      name, email, password, phone, role: 'vendor'
    });

    shop = await EcomShop.create({
      name: shopName,
      ownerId: user._id,
      gstin,
      tradeLicense,
      kycStatus: 'Pending',
      isActive: false
    });

    user.shopId = shop._id;
    await user.save();

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        shop: shop
      }
    });

  } catch (error) {
    console.error('Vendor registration error:', error);
    res.status(500).json({ success: false, message: 'Server error during vendor registration.' });
  }
};

exports.adminCreateVendor = async (req, res) => {
  try {
    const { name, email, password, phone, shopName, gstin, tradeLicense } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }
    
    let shop = await EcomShop.findOne({ name: shopName });
    if (shop) {
      return res.status(400).json({ success: false, message: 'Shop name already taken' });
    }

    user = await User.create({
      name, email, password, phone, role: 'vendor'
    });

    shop = await EcomShop.create({
      name: shopName,
      ownerId: user._id,
      gstin,
      tradeLicense,
      kycStatus: 'Approved', // Pre-approved by admin
      isActive: true
    });

    user.shopId = shop._id;
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Vendor created and approved successfully',
      vendor: {
        id: user._id,
        name: user.name,
        email: user.email,
        shop: shop
      }
    });

  } catch (error) {
    console.error('Admin vendor creation error:', error);
    res.status(500).json({ success: false, message: 'Server error creating vendor.' });
  }
};

exports.getVendorProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('shopId');
    if (!user || user.role !== 'vendor') {
       return res.status(403).json({ success: false, message: 'Not a vendor' });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// Admin Action: Approve/Reject Vendor
exports.updateVendorStatus = async (req, res) => {
  try {
    const shop = await EcomShop.findById(req.params.shopId);
    if (!shop) return res.status(404).json({ success: false, message: 'Shop not found' });
    
    if (req.body.kycStatus) {
      shop.kycStatus = req.body.kycStatus;
      shop.isActive = (req.body.kycStatus === 'Approved');
    }
    if (req.body.commissionRate !== undefined) {
      shop.commissionRate = req.body.commissionRate;
    }
    await shop.save();
    
    res.json({ success: true, shop });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Admin Action: Get all vendors for approval
exports.getAllVendors = async (req, res) => {
  try {
    const shops = await EcomShop.find().populate('ownerId', 'name email phone');
    const mappedVendors = shops.map(shop => ({
      _id: shop._id,
      shopId: shop._id,
      shopName: shop.name,
      vendorName: shop.ownerId ? shop.ownerId.name : 'Unknown',
      email: shop.ownerId ? shop.ownerId.email : 'Unknown',
      phone: shop.ownerId ? shop.ownerId.phone : '',
      tradeLicense: shop.tradeLicense,
      kycStatus: shop.kycStatus
    }));
    res.json({ success: true, data: mappedVendors });
  } catch(error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Admin Action: Delete a vendor shop and its owner
exports.deleteVendor = async (req, res) => {
  try {
    const shop = await EcomShop.findById(req.params.shopId);
    if (!shop) return res.status(404).json({ success: false, message: 'Shop not found' });
    if (shop.ownerId) {
      const User = require('../models/User');
      await User.findByIdAndDelete(shop.ownerId);
    }
    await EcomShop.findByIdAndDelete(req.params.shopId);
    res.json({ success: true, message: 'Vendor deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Admin Action: Create login details for seeded shop
exports.createVendorLogin = async (req, res) => {
  try {
    const { email, password, vendorName, phone } = req.body;
    const shop = await EcomShop.findById(req.params.shopId);
    if (!shop) return res.status(404).json({ success: false, message: 'Shop not found' });
    
    if (shop.ownerId) {
      return res.status(400).json({ success: false, message: 'Vendor already has login details' });
    }

    const User = require('../models/User');
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ success: false, message: 'Email already in use' });

    const user = await User.create({
      name: vendorName || shop.name,
      email,
      password: password,
      phone: phone || '',
      role: 'vendor',
      shopId: shop._id
    });

    shop.ownerId = user._id;
    await shop.save();

    res.json({ success: true, message: 'Login details created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// --------------------------------------------------------
// WMS & Catalog Management
// --------------------------------------------------------

exports.getVendorProducts = async (req, res) => {
  try {
    const products = await EcomProduct.find({ shop: req.user.shopId }).sort({ sortOrder: 1, createdAt: -1 });
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.createVendorProduct = async (req, res) => {
  try {
    const shop = await EcomShop.findById(req.user.shopId);
    if (!shop) return res.status(404).json({ success: false, message: 'Shop not found' });
    
    if (shop.kycStatus !== 'Approved') {
        return res.status(403).json({ success: false, message: 'Shop is not approved yet' });
    }

    const productData = { ...req.body, shop: shop._id, shopName: shop.name };
    const product = await EcomProduct.create(productData);
    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.bulkUploadVendorProducts = async (req, res) => {
  try {
    const shop = await EcomShop.findById(req.user.shopId);
    if (!shop) return res.status(404).json({ success: false, message: 'Shop not found' });
    
    if (shop.kycStatus !== 'Approved') {
        return res.status(403).json({ success: false, message: 'Shop is not approved yet. Cannot bulk upload.' });
    }

    const { products } = req.body;
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ success: false, message: 'No products provided' });
    }

    const productsToInsert = products.map(p => ({
      ...p,
      shop: shop._id,
      shopName: shop.name
    }));

    const result = await EcomProduct.insertMany(productsToInsert);
    res.status(201).json({ success: true, count: result.length, message: `Successfully imported ${result.length} products.` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.updateVendorProduct = async (req, res) => {
  try {
    const product = await EcomProduct.findOneAndUpdate(
      { _id: req.params.id, shop: req.user.shopId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ success: false, message: 'Product not found or unauthorized' });
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.deleteVendorProduct = async (req, res) => {
  try {
    const product = await EcomProduct.findOneAndDelete({ _id: req.params.id, shop: req.user.shopId });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found or unauthorized' });
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// --------------------------------------------------------
// B2B Procurement & Order Fulfillment
// --------------------------------------------------------

exports.getVendorOrders = async (req, res) => {
  try {
    const orders = await PurchaseOrder.find({ shop: req.user.shopId })
      .populate('buyer', 'name email phone')
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateVendorOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await PurchaseOrder.findOne({ _id: req.params.id, shop: req.user.shopId }).populate('shop');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    
    // Phase 4: Strict State Machine Enforcement
    const validTransitions = {
      'Pending Approval': ['Confirmed', 'Cancelled'],
      'Confirmed': ['Packed', 'Cancelled'],
      'Packed': ['Dispatched'],
      'Dispatched': ['Delivered', 'Cancelled'],
      'Delivered': [],
      'Cancelled': []
    };

    if (!validTransitions[order.status].includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: `Invalid state transition from ${order.status} to ${status}.` 
      });
    }

    order.status = status;

    // Logistics Sync: When vendor marks as packed, generate AWB and Fire Async Event
    if (status === 'Packed' && !order.awbNumber) {
      const generateAWB = () => `SAI-B2B-${Math.floor(100000 + Math.random() * 900000)}`;
      order.awbNumber = generateAWB();
      
      // Fire Async Event to the Message Queue (Logistics Worker will handle it)
      eventBus.emit('ORDER_PACKED', order);
    }

    await order.save();
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// --------------------------------------------------------
// Financials, Invoicing & Payouts (Phase 4)
// --------------------------------------------------------

exports.getVendorFinancials = async (req, res) => {
  try {
    const shopId = req.user.shopId;
    
    // Phase 3: Enterprise Pre-Aggregation (O(1) effectively)
    const aggregatedData = await LedgerTransaction.aggregate([
      { $match: { shop: shopId } },
      {
        $group: {
          _id: null,
          totalEarnings: {
            $sum: {
              $cond: [{ $and: [{ $eq: ["$type", "Credit"] }, { $eq: ["$status", "Completed"] }] }, "$amount", 0]
            }
          },
          pendingPayout: {
            $sum: {
              $cond: [{ $and: [{ $eq: ["$type", "Credit"] }, { $eq: ["$status", "Pending"] }] }, "$amount", 0]
            }
          },
          totalWithdrawn: {
            $sum: {
              $cond: [{ $and: [{ $eq: ["$type", "Payout"] }, { $eq: ["$status", "Completed"] }] }, "$amount", 0]
            }
          }
        }
      }
    ]);

    const summary = aggregatedData.length > 0 ? aggregatedData[0] : { totalEarnings: 0, pendingPayout: 0, totalWithdrawn: 0 };
    summary.pendingPayout = Math.max(0, summary.pendingPayout - summary.totalWithdrawn);

    const transactions = await LedgerTransaction.find({ shop: shopId }).sort({ createdAt: -1 }).limit(50);

    res.json({
      success: true,
      summary: {
        totalEarnings: summary.totalEarnings,
        pendingPayout: summary.pendingPayout,
        totalWithdrawn: summary.totalWithdrawn
      },
      transactions
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// --------------------------------------------------------
// Analytics & Support (Phase 5)
// --------------------------------------------------------

exports.getVendorAnalytics = async (req, res) => {
  try {
    const productsCount = await EcomProduct.countDocuments({ shop: req.user.shopId });
    const ordersCount = await PurchaseOrder.countDocuments({ shop: req.user.shopId });
    
    // Simplistic breakdown
    const pendingOrders = await PurchaseOrder.countDocuments({ shop: req.user.shopId, status: { $in: ['Pending Approval', 'Confirmed'] } });
    
    res.json({
      success: true,
      analytics: {
        totalProducts: productsCount,
        totalOrders: ordersCount,
        pendingOrders
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getVendorTickets = async (req, res) => {
  try {
    const tickets = await SupportTicket.find({ shop: req.user.shopId })
      .populate('purchaseOrder', 'poNumber status')
      .sort({ updatedAt: -1 });
    res.json({ success: true, tickets });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.createVendorTicket = async (req, res) => {
  try {
    const { purchaseOrder, subject, issueType, message } = req.body;
    const ticketId = `TKT-${Math.floor(10000 + Math.random() * 90000)}`;
    
    const ticket = await SupportTicket.create({
      ticketId,
      shop: req.user.shopId,
      purchaseOrder,
      creator: req.user._id,
      subject,
      issueType,
      messages: [{ sender: req.user._id, senderRole: 'vendor', message }]
    });
    
    res.status(201).json({ success: true, ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// --------------------------------------------------------
// B2B Checkout & Commissions (Buyer Side)
// --------------------------------------------------------

exports.placeB2BOrder = async (req, res) => {
  try {
    const { shopId, items, shippingAddress, financials, buyerNotes } = req.body;
    
    const vendor = await EcomShop.findById(shopId);
    if (!vendor) return res.status(404).json({ success: false, message: 'Vendor not found' });
    
    const platformFeePercentage = vendor.commissionRate || 10;
    
    const grossTotal = financials.total;
    const platformFee = (grossTotal * platformFeePercentage) / 100;
    const vendorEarnings = grossTotal - platformFee;

    const order = await PurchaseOrder.create({
      shop: shopId,
      buyer: req.user._id, // Assume buyer is logged in
      items,
      shippingAddress,
      financials: {
        subtotal: financials.subtotal,
        shippingCost: financials.shippingCost,
        tax: financials.tax,
        total: grossTotal,
        platformFee,
        vendorEarnings
      },
      buyerNotes,
      status: 'Pending Approval'
    });

    // Escrow transaction for the vendor
    await LedgerTransaction.create({
      shop: shopId,
      order: order._id,
      type: 'Credit',
      amount: vendorEarnings,
      currency: 'INR',
      status: 'Pending',
      description: `B2B Order #${order._id} (Gross: ₹${grossTotal}, Fee: ₹${platformFee})`
    });

    res.status(201).json({ success: true, order, message: 'B2B PO placed successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --------------------------------------------------------
// Vendor API Keys (Headless B2B Integrations)
// --------------------------------------------------------

exports.getVendorApiKeys = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('apiKeys');
    return res.json({ success: true, apiKeys: user?.apiKeys || [] });
  } catch (err) {
    console.error('Fetch vendor API keys error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch API keys' });
  }
};

exports.createVendorApiKey = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Key name is required' });
    }
    const crypto = require('crypto');
    const newKey = 'sai_live_' + crypto.randomBytes(18).toString('hex');
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'Vendor not found' });

    user.apiKeys = user.apiKeys || [];
    const newKeyObj = {
      key: newKey,
      name: name.trim(),
      createdAt: new Date(),
    };
    user.apiKeys.unshift(newKeyObj);
    await user.save();

    return res.status(201).json({ success: true, message: 'API key generated successfully', apiKey: newKeyObj });
  } catch (err) {
    console.error('Create vendor API key error:', err);
    return res.status(500).json({ success: false, message: 'Failed to generate API key' });
  }
};

exports.deleteVendorApiKey = async (req, res) => {
  try {
    const { keyId } = req.params;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'Vendor not found' });

    user.apiKeys = (user.apiKeys || []).filter(k => k._id?.toString() !== keyId && k.key !== keyId);
    await user.save();

    return res.json({ success: true, message: 'API key revoked successfully' });
  } catch (err) {
    console.error('Delete vendor API key error:', err);
    return res.status(500).json({ success: false, message: 'Failed to revoke API key' });
  }
};
