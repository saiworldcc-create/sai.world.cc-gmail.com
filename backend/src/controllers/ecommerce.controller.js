const EcomShop = require('../models/EcomShop');
const EcomProduct = require('../models/EcomProduct');
const EcomOrder = require('../models/EcomOrder');
const Notification = require('../models/Notification');
const { sendOrderAlert } = require('../services/emailService');

// ========================== PUBLIC ENDPOINTS ==========================

exports.seedDb = async (req, res) => {
  try {
    const categories = [
      { name: 'Sri Sai Sweets & Bakery', icon: '🍩', color: '#E97856' },
      { name: 'Andhra Pickles Co.', icon: '🥫', color: '#D9634A' },
      { name: 'Guntur Hot Spices', icon: '🌶️', color: '#E74C3C' },
      { name: 'Godavari Authentic Sweets', icon: '🍬', color: '#F1C40F' },
      { name: 'Nellore Dry Fruits', icon: '🥜', color: '#8E44AD' },
      { name: 'Rayalaseema Karam Podi', icon: '🥣', color: '#D35400' },
      { name: 'Hyderabad Masalas', icon: '🥘', color: '#C0392B' },
      { name: 'Tirupati Pooja Stores', icon: '🪔', color: '#F39C12' },
      { name: 'Vizag Cashews & Nuts', icon: '🌰', color: '#7D3C98' }
    ];
    const productsData = [
      { name: 'Special Mysore Pak (1kg)', category: 'Sri Sai Sweets & Bakery', price: 650, originalPrice: 800, image: '/images/mysore_pak.jpg', rating: 4.9, reviews: 512, tag: 'Best Seller', description: 'Melt-in-mouth pure ghee Mysore Pak made traditional way.' },
      { name: 'Assorted Laddu Box', category: 'Sri Sai Sweets & Bakery', price: 450, originalPrice: 600, image: '🧆', rating: 4.8, reviews: 320, tag: '', description: 'Mix of Motichoor, Besan, and Dry Fruit laddus.' },
      { name: 'Crispy Jalebi (500g)', category: 'Sri Sai Sweets & Bakery', price: 250, originalPrice: 350, image: '🥨', rating: 4.7, reviews: 189, tag: 'Fresh', description: 'Hot and crispy jalebis packed in special syrup-safe boxes.' },
      { name: 'Avakaya (Mango) Pickle - 1Kg', category: 'Andhra Pickles Co.', price: 550, originalPrice: 700, image: '/images/mango_pickle.jpg', rating: 4.9, reviews: 890, tag: '🔥 Hot', description: 'Authentic Andhra style spicy mango pickle with garlic.' },
      { name: 'Gongura Pachadi (500g)', category: 'Andhra Pickles Co.', price: 350, originalPrice: 450, image: '/images/gongura_pickle.jpg', rating: 4.8, reviews: 450, tag: 'Popular', description: 'Traditional sorrel leaves pickle, a true Telugu classic.' },
      { name: 'Tomato Garlic Pickle (500g)', category: 'Andhra Pickles Co.', price: 300, originalPrice: 400, image: '🍅', rating: 4.7, reviews: 310, tag: '', description: 'Tangy and spicy tomato pickle perfectly paired with rice.' },
      { name: 'Guntur Red Chilli Powder (1Kg)', category: 'Guntur Hot Spices', price: 400, originalPrice: 550, image: '/images/red_chilli_powder.jpg', rating: 4.9, reviews: 670, tag: 'Export Quality', description: 'Premium grade extra hot red chilli powder from Guntur.' },
      { name: 'Turmeric Powder - Haldi (500g)', category: 'Guntur Hot Spices', price: 150, originalPrice: 200, image: '🟡', rating: 4.8, reviews: 290, tag: '', description: 'Pure organic turmeric powder with high curcumin content.' },
      { name: 'Pootharekulu (Paper Sweets)', category: 'Godavari Authentic Sweets', price: 450, originalPrice: 600, image: '📜', rating: 4.9, reviews: 890, tag: 'Famous', description: 'Atreyapuram special dry fruit and jaggery Pootharekulu.' },
      { name: 'Kaja (Tapeswaram) - 1Kg', category: 'Godavari Authentic Sweets', price: 500, originalPrice: 650, image: '🥐', rating: 4.8, reviews: 410, tag: '', description: 'Juicy and layered Tapeswaram Kaja.' },
      { name: 'Premium Cashews (W320) - 1Kg', category: 'Nellore Dry Fruits', price: 950, originalPrice: 1200, image: '/images/cashews.jpg', rating: 4.9, reviews: 540, tag: 'Top Grade', description: 'Whole, crispy, and premium quality cashew nuts.' },
      { name: 'California Almonds (1Kg)', category: 'Nellore Dry Fruits', price: 850, originalPrice: 1100, image: '🌰', rating: 4.8, reviews: 420, tag: '', description: 'High-quality imported almonds packed with nutrition.' },
      { name: 'Idli / Dosa Karam Podi (250g)', category: 'Rayalaseema Karam Podi', price: 150, originalPrice: 200, image: '🥣', rating: 4.8, reviews: 380, tag: 'Daily Essential', description: 'Spicy gun powder (Karam podi) for idli and dosa.' },
      { name: 'Karivepaku (Curry Leaf) Podi', category: 'Rayalaseema Karam Podi', price: 180, originalPrice: 250, image: '🍃', rating: 4.7, reviews: 210, tag: 'Healthy', description: 'Healthy and aromatic curry leaf spice powder.' },
      { name: 'Authentic Biryani Masala', category: 'Hyderabad Masalas', price: 200, originalPrice: 300, image: '🥘', rating: 4.9, reviews: 760, tag: 'Chef Choice', description: 'Secret spice blend for the perfect Hyderabadi Dum Biryani.' },
      { name: 'Mutton Curry Masala', category: 'Hyderabad Masalas', price: 180, originalPrice: 250, image: '🍲', rating: 4.7, reviews: 290, tag: '', description: 'Rich and flavorful spice mix for non-veg curries.' },
      { name: 'Complete Pooja Kit', category: 'Tirupati Pooja Stores', price: 550, originalPrice: 750, image: '🪔', rating: 4.8, reviews: 410, tag: 'Festival Ready', description: 'Includes Agarbatti, Kumkum, Turmeric, Camphor, and wicks.' },
      { name: 'Premium Sandalwood Powder', category: 'Tirupati Pooja Stores', price: 300, originalPrice: 450, image: '🪵', rating: 4.9, reviews: 180, tag: '', description: 'Pure Mysore sandalwood powder for pooja rituals.' },
      { name: 'Salted Pistachios (500g)', category: 'Vizag Cashews & Nuts', price: 750, originalPrice: 950, image: '🥜', rating: 4.8, reviews: 340, tag: 'Snack', description: 'Lightly roasted and salted Iranian pistachios.' }
    ];
    await EcomShop.deleteMany({});
    await EcomProduct.deleteMany({});
    const shopMap = {};
    for (const cat of categories) {
      const shop = await EcomShop.create({ name: cat.name, icon: cat.icon, color: cat.color, isActive: true });
      shopMap[cat.name] = shop._id;
    }
    for (const p of productsData) {
      await EcomProduct.create({ shop: shopMap[p.category], shopName: p.category, name: p.name, price: p.price, originalPrice: p.originalPrice, image: p.image, description: p.description, tag: p.tag, rating: p.rating, isActive: true });
    }
    res.json({ success: true, message: 'DB Seeded' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getShops = async (req, res) => {
  try {
    const shops = await EcomShop.find({ isActive: true }).sort({ sortOrder: 1, name: 1 });
    res.json({ success: true, data: shops });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const filter = { isActive: true };
    if (req.query.shop) filter.shop = req.query.shop;
    const products = await EcomProduct.find(filter).sort({ sortOrder: 1, name: 1 });
    res.json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.placeOrder = async (req, res) => {
  try {
    const { customer, items, total, sendAbroad, receiver, paymentMethod } = req.body;
    if (!customer?.name || !customer?.phone || !customer?.address) {
      return res.status(400).json({ success: false, message: 'Customer name, phone, and address are required.' });
    }
    if (!items || !items.length) {
      return res.status(400).json({ success: false, message: 'At least one item is required.' });
    }

    const order = await EcomOrder.create({ customer, items, total, sendAbroad, receiver, paymentMethod: paymentMethod || 'COD' });

    sendOrderAlert(order).catch(err => console.error('Order alert email failed:', err.message));
    Notification.create({
      title: 'New Store Order', message: `${customer.name} placed an order for ₹${total}`,
      type: 'order', link: '/admin/ecommerce'
    }).catch(err => console.error('Failed to create notification:', err));

    res.status(201).json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ========================== ADMIN ENDPOINTS ==========================

exports.getAdminShops = async (req, res) => {
  try {
    const shops = await EcomShop.find().sort({ sortOrder: 1, name: 1 });
    const data = await Promise.all(shops.map(async (s) => {
      const count = await EcomProduct.countDocuments({ shop: s._id });
      return { ...s.toObject(), productCount: count };
    }));
    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.createShop = async (req, res) => {
  try {
    const shop = await EcomShop.create(req.body);
    res.status(201).json({ success: true, data: shop });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ success: false, message: 'A shop with this name already exists.' });
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateShop = async (req, res) => {
  try {
    const shop = await EcomShop.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!shop) return res.status(404).json({ success: false, message: 'Shop not found.' });
    if (req.body.name) await EcomProduct.updateMany({ shop: shop._id }, { shopName: req.body.name });
    res.json({ success: true, data: shop });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.deleteShop = async (req, res) => {
  try {
    const shop = await EcomShop.findByIdAndDelete(req.params.id);
    if (!shop) return res.status(404).json({ success: false, message: 'Shop not found.' });
    await EcomProduct.deleteMany({ shop: req.params.id });
    res.json({ success: true, message: 'Shop and its products deleted.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getAdminProducts = async (req, res) => {
  try {
    const filter = {};
    if (req.query.shop) filter.shop = req.query.shop;
    const products = await EcomProduct.find(filter).populate('shop', 'name icon color').sort({ sortOrder: 1, name: 1 });
    res.json({ success: true, data: products });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.createProduct = async (req, res) => {
  try {
    if (req.body.shop) {
      const shop = await EcomShop.findById(req.body.shop);
      if (!shop) return res.status(400).json({ success: false, message: 'Invalid shop ID.' });
      req.body.shopName = shop.name;
    }
    const product = await EcomProduct.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.updateProduct = async (req, res) => {
  try {
    if (req.body.shop) {
      const shop = await EcomShop.findById(req.body.shop);
      if (shop) req.body.shopName = shop.name;
    }
    const product = await EcomProduct.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    res.json({ success: true, data: product });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await EcomProduct.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    res.json({ success: true, message: 'Product deleted.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getAdminOrders = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    const orders = await EcomOrder.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getNewOrdersCount = async (req, res) => {
  try {
    const count = await EcomOrder.countDocuments({ seen: false });
    res.json({ success: true, count });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.markOrdersSeen = async (req, res) => {
  try {
    await EcomOrder.updateMany({ seen: false }, { seen: true });
    res.json({ success: true, message: 'All orders marked as seen.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const update = {};
    if (status) update.status = status;
    if (notes !== undefined) update.notes = notes;
    const order = await EcomOrder.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    res.json({ success: true, data: order });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getMyOrders = async (req, res) => {
  try {
    const userPhoneBase = req.user.phone ? req.user.phone.replace(/\D/g, '').slice(-10) : '';
    const query = { $or: [] };
    if (userPhoneBase) query.$or.push({ 'customer.phone': { $regex: userPhoneBase, $options: 'i' } });
    if (req.user.email) query.$or.push({ 'customer.email': req.user.email });
    
    if (query.$or.length === 0) return res.json({ success: true, data: [] });

    const orders = await EcomOrder.find(query).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.cancelMyOrder = async (req, res) => {
  try {
    const order = await EcomOrder.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });

    const userPhoneBase = req.user.phone ? req.user.phone.replace(/\D/g, '').slice(-10) : '';
    const orderPhoneBase = order.customer.phone ? order.customer.phone.replace(/\D/g, '').slice(-10) : '';
    const isOwner = (userPhoneBase && orderPhoneBase && orderPhoneBase.includes(userPhoneBase)) || (req.user.email && order.customer.email === req.user.email);

    if (!isOwner) return res.status(403).json({ success: false, message: 'Not authorized.' });
    if (order.status !== 'pending' && order.status !== 'confirmed') return res.status(400).json({ success: false, message: 'Cannot cancel an order that has already been shipped.' });

    order.status = 'cancelled';
    await order.save();
    res.json({ success: true, message: 'Order cancelled successfully', data: order });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
