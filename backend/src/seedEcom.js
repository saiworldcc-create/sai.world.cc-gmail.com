const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

const EcomShop = require('./models/EcomShop.js');
const EcomProduct = require('./models/EcomProduct.js');

dotenv.config({ path: path.join(__dirname, '../.env') });

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
  // Sri Sai Sweets & Bakery
  { name: 'Special Mysore Pak (1kg)', category: 'Sri Sai Sweets & Bakery', price: 650, originalPrice: 800, image: '/images/mysore_pak.jpg', rating: 4.9, reviews: 512, tag: 'Best Seller', description: 'Melt-in-mouth pure ghee Mysore Pak made traditional way.' },
  { name: 'Assorted Laddu Box', category: 'Sri Sai Sweets & Bakery', price: 450, originalPrice: 600, image: '🧆', rating: 4.8, reviews: 320, tag: '', description: 'Mix of Motichoor, Besan, and Dry Fruit laddus.' },
  { name: 'Crispy Jalebi (500g)', category: 'Sri Sai Sweets & Bakery', price: 250, originalPrice: 350, image: '🥨', rating: 4.7, reviews: 189, tag: 'Fresh', description: 'Hot and crispy jalebis packed in special syrup-safe boxes.' },

  // Andhra Pickles Co.
  { name: 'Avakaya (Mango) Pickle - 1Kg', category: 'Andhra Pickles Co.', price: 550, originalPrice: 700, image: '/images/mango_pickle.jpg', rating: 4.9, reviews: 890, tag: '🔥 Hot', description: 'Authentic Andhra style spicy mango pickle with garlic.' },
  { name: 'Gongura Pachadi (500g)', category: 'Andhra Pickles Co.', price: 350, originalPrice: 450, image: '/images/gongura_pickle.jpg', rating: 4.8, reviews: 450, tag: 'Popular', description: 'Traditional sorrel leaves pickle, a true Telugu classic.' },
  { name: 'Tomato Garlic Pickle (500g)', category: 'Andhra Pickles Co.', price: 300, originalPrice: 400, image: '🍅', rating: 4.7, reviews: 310, tag: '', description: 'Tangy and spicy tomato pickle perfectly paired with rice.' },

  // Guntur Hot Spices
  { name: 'Guntur Red Chilli Powder (1Kg)', category: 'Guntur Hot Spices', price: 400, originalPrice: 550, image: '/images/red_chilli_powder.jpg', rating: 4.9, reviews: 670, tag: 'Export Quality', description: 'Premium grade extra hot red chilli powder from Guntur.' },
  { name: 'Turmeric Powder - Haldi (500g)', category: 'Guntur Hot Spices', price: 150, originalPrice: 200, image: '🟡', rating: 4.8, reviews: 290, tag: '', description: 'Pure organic turmeric powder with high curcumin content.' },

  // Godavari Authentic Sweets
  { name: 'Pootharekulu (Paper Sweets)', category: 'Godavari Authentic Sweets', price: 450, originalPrice: 600, image: '📜', rating: 4.9, reviews: 890, tag: 'Famous', description: 'Atreyapuram special dry fruit and jaggery Pootharekulu.' },
  { name: 'Kaja (Tapeswaram) - 1Kg', category: 'Godavari Authentic Sweets', price: 500, originalPrice: 650, image: '🥐', rating: 4.8, reviews: 410, tag: '', description: 'Juicy and layered Tapeswaram Kaja.' },

  // Nellore Dry Fruits
  { name: 'Premium Cashews (W320) - 1Kg', category: 'Nellore Dry Fruits', price: 950, originalPrice: 1200, image: '/images/cashews.jpg', rating: 4.9, reviews: 540, tag: 'Top Grade', description: 'Whole, crispy, and premium quality cashew nuts.' },
  { name: 'California Almonds (1Kg)', category: 'Nellore Dry Fruits', price: 850, originalPrice: 1100, image: '🌰', rating: 4.8, reviews: 420, tag: '', description: 'High-quality imported almonds packed with nutrition.' },

  // Rayalaseema Karam Podi
  { name: 'Idli / Dosa Karam Podi (250g)', category: 'Rayalaseema Karam Podi', price: 150, originalPrice: 200, image: '🥣', rating: 4.8, reviews: 380, tag: 'Daily Essential', description: 'Spicy gun powder (Karam podi) for idli and dosa.' },
  { name: 'Karivepaku (Curry Leaf) Podi', category: 'Rayalaseema Karam Podi', price: 180, originalPrice: 250, image: '🍃', rating: 4.7, reviews: 210, tag: 'Healthy', description: 'Healthy and aromatic curry leaf spice powder.' },

  // Hyderabad Masalas
  { name: 'Authentic Biryani Masala', category: 'Hyderabad Masalas', price: 200, originalPrice: 300, image: '🥘', rating: 4.9, reviews: 760, tag: 'Chef Choice', description: 'Secret spice blend for the perfect Hyderabadi Dum Biryani.' },
  { name: 'Mutton Curry Masala', category: 'Hyderabad Masalas', price: 180, originalPrice: 250, image: '🍲', rating: 4.7, reviews: 290, tag: '', description: 'Rich and flavorful spice mix for non-veg curries.' },

  // Tirupati Pooja Stores
  { name: 'Complete Pooja Kit', category: 'Tirupati Pooja Stores', price: 550, originalPrice: 750, image: '🪔', rating: 4.8, reviews: 410, tag: 'Festival Ready', description: 'Includes Agarbatti, Kumkum, Turmeric, Camphor, and wicks.' },
  { name: 'Premium Sandalwood Powder', category: 'Tirupati Pooja Stores', price: 300, originalPrice: 450, image: '🪵', rating: 4.9, reviews: 180, tag: '', description: 'Pure Mysore sandalwood powder for pooja rituals.' },

  // Vizag Cashews & Nuts
  { name: 'Salted Pistachios (500g)', category: 'Vizag Cashews & Nuts', price: 750, originalPrice: 950, image: '🥜', rating: 4.8, reviews: 340, tag: 'Snack', description: 'Lightly roasted and salted Iranian pistachios.' }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    await EcomShop.deleteMany({});
    await EcomProduct.deleteMany({});
    console.log('🗑️ Cleared existing shops and products');

    const shopMap = {};

    // 1. Create Shops
    for (const cat of categories) {
      const shop = await EcomShop.create({
        name: cat.name,
        icon: cat.icon,
        color: cat.color,
        isActive: true
      });
      shopMap[cat.name] = shop._id;
      console.log(`Created shop: ${shop.name}`);
    }

    // 2. Create Products
    for (const p of productsData) {
      const shopId = shopMap[p.category];
      if (!shopId) {
        console.error(`Shop not found for category: ${p.category}`);
        continue;
      }
      
      await EcomProduct.create({
        shop: shopId,
        shopName: p.category,
        name: p.name,
        price: p.price,
        originalPrice: p.originalPrice,
        image: p.image,
        description: p.description,
        tag: p.tag,
        rating: p.rating,
        isActive: true
      });
      console.log(`Created product: ${p.name}`);
    }

    console.log('🎉 Seeding successful!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

seed();
