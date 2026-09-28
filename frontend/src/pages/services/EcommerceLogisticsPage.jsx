import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { getPublicEcomShops, getPublicEcomProducts, placePublicEcomOrder } from '../../services/api';
import { useUser } from '../../context/UserContext';

export default function EcommerceLogisticsPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeCategory, setActiveCategory] = useState('');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  
  // Checkout Form State
      const [customerDetails, setCustomerDetails] = useState({
      name: user?.name || '', 
      phone: user?.phone || '', 
      email: user?.email || '', 
      address: '',
      sendAbroad: false, receiverCountry: '', receiverName: '', receiverPhone: '', receiverAddress: '',
      paymentMethod: 'COD'
    });

  // Fetch data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [shopsRes, prodsRes] = await Promise.all([getPublicEcomShops(), getPublicEcomProducts()]);
        if (shopsRes?.data) {
          setCategories(shopsRes.data);
          if (shopsRes.data.length > 0) setActiveCategory(shopsRes.data[0].name);
        }
        if (prodsRes?.data) {
          setProducts(prodsRes.data.map(p => ({
            ...p, id: p._id, category: p.shopName, desc: p.description || ''
          })));
        }
      } catch (err) {
        console.error('Failed to load ecommerce data', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredProducts = products.filter(p => {
    const matchCategory = p.category?.trim().toLowerCase() === activeCategory?.trim().toLowerCase();
    const matchSearch = (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                        (p.desc || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(item => item.id !== id));
  const updateQty = (id, delta) => setCart(prev => prev.map(item => item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item));
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const activeCategoryData = categories.find(c => c.name === activeCategory) || categories[0] || { color: '#3CC8C8', icon: '🏪', name: 'Shop' };

  if (loading) {
    return (
      <main style={{ paddingTop: '130px', minHeight: '100vh', background: '#F8FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#3CC8C8', fontSize: '1.2rem', fontWeight: 600 }}><i className="fa-solid fa-circle-notch fa-spin"></i> Loading store...</div>
      </main>
    );
  }

  return (
    <main style={{ paddingTop: '130px', minHeight: '100vh', background: '#F8FAFB' }}>
      
      {/* Full Page Split Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: 'calc(100vh - 130px)' }}>
        
        {/* LEFT SIDEBAR - SHOPS LIST */}
        <aside style={{ 
          background: '#FFFFFF', borderRight: '1px solid #E8EDF2', padding: '1.5rem 1rem', 
          position: 'sticky', top: '130px', height: 'calc(100vh - 130px)', overflowY: 'auto' 
        }}>
          <h2 style={{ fontSize: '1.2rem', color: '#1E3446', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 800, paddingLeft: '0.5rem' }}>
            SAI Mega Store
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {categories.map(cat => (
              <div 
                key={cat.name} 
                onMouseEnter={() => setActiveCategory(cat.name)}
                style={{
                  padding: '1rem', borderRadius: '12px', cursor: 'pointer',
                  background: activeCategory === cat.name ? cat.color : '#FFFFFF',
                  color: activeCategory === cat.name ? '#FFF' : '#4A6B82',
                  border: `1px solid ${activeCategory === cat.name ? cat.color : '#E8EDF2'}`,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: activeCategory === cat.name ? 'translateX(8px)' : 'translateX(0)',
                  boxShadow: activeCategory === cat.name ? `0 6px 20px ${cat.color}40` : 'none',
                  display: 'flex', alignItems: 'center', gap: '1rem'
                }}
              >
                {/* Shop icon removed */}
                <span style={{ fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.2 }}>{cat.name}</span>
                {activeCategory === cat.name && (
                  <i className="fa-solid fa-chevron-right" style={{ marginLeft: 'auto', fontSize: '0.7rem', opacity: 0.8 }}></i>
                )}
              </div>
            ))}
          </div>

          <div style={{ marginTop: '2rem', padding: '1rem', background: '#F0F7FA', borderRadius: '12px', border: '1px dashed #3CC8C8' }}>
            <i className="fa-solid fa-headset" style={{ fontSize: '1.5rem', color: '#3CC8C8', marginBottom: '0.5rem' }}></i>
            <h4 style={{ fontSize: '0.9rem', color: '#1E3446', marginBottom: '0.2rem' }}>Need Help?</h4>
            <p style={{ fontSize: '0.75rem', color: '#7091A8', marginBottom: '0.5rem' }}>Our support is available 24/7.</p>
            <Link to="/contact" style={{ fontSize: '0.75rem', fontWeight: 700, color: '#3CC8C8', textDecoration: 'none' }}>Contact Us &rarr;</Link>
          </div>
        </aside>

        {/* RIGHT MAIN CONTENT */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          
          {/* Top Header inside E-commerce area */}
          <header style={{ 
            background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', padding: '1.2rem 2.5rem',
            borderBottom: '1px solid #E8EDF2', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <div style={{ position: 'relative', flex: '1', maxWidth: '400px' }}>
              <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#A0B0C0' }}></i>
              <input
                type="text" placeholder={`Search in ${activeCategory}...`} value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                style={{ 
                  width: '100%', padding: '0.8rem 1rem 0.8rem 2.8rem', border: '1.5px solid #D5DEE5', 
                  borderRadius: '12px', fontSize: '0.95rem', outline: 'none', transition: 'border 0.2s', background: '#FAFBFC' 
                }}
                onFocus={e => e.target.style.borderColor = activeCategoryData.color} 
                onBlur={e => e.target.style.borderColor = '#D5DEE5'}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              {/* My Orders Button */}
              <button onClick={() => navigate('/dashboard')}
                style={{
                  background: '#F8FAFB', color: '#4A6B82', border: '1.5px solid #D5DEE5', 
                  borderRadius: '12px', padding: '0.8rem 1.5rem',
                  fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s',
                  display: 'flex', alignItems: 'center', gap: '0.6rem'
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = activeCategoryData.color; e.currentTarget.style.color = activeCategoryData.color; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#D5DEE5'; e.currentTarget.style.color = '#4A6B82'; }}
              >
                <i className="fa-solid fa-box-open"></i>
                My Orders
              </button>

              {/* Top Cart Button */}
              <button onClick={() => setShowCart(true)}
              style={{
                background: cartCount > 0 ? activeCategoryData.color : '#F8FAFB', 
                color: cartCount > 0 ? '#FFF' : '#4A6B82', 
                border: cartCount > 0 ? 'none' : '1.5px solid #D5DEE5', 
                borderRadius: '12px', padding: '0.8rem 1.5rem',
                fontSize: '1rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s',
                display: 'flex', alignItems: 'center', gap: '0.8rem',
                boxShadow: cartCount > 0 ? `0 8px 24px ${activeCategoryData.color}40` : 'none'
              }}
              onMouseEnter={e => cartCount > 0 && (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={e => cartCount > 0 && (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <i className="fa-solid fa-cart-shopping"></i>
              {cartCount > 0 ? `${cartCount} items • ₹${cartTotal}` : 'My Cart (0)'}
            </button>
            </div>
          </header>

          {/* Dynamic Products Grid */}
          <div style={{ padding: '2.5rem', background: '#F8FAFB' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2rem' }}>
              <h1 style={{ fontSize: '2rem', color: activeCategoryData.color, margin: 0, fontWeight: 800 }}>
                {activeCategory}
              </h1>
              <p style={{ color: '#7091A8', fontSize: '0.95rem', margin: 0 }}>
                <strong style={{ color: '#1E3446' }}>{filteredProducts.length}</strong> products available
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
              {filteredProducts.map(product => (
                <div key={product.id} style={{
                  background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E8EDF2', overflow: 'hidden',
                  transition: 'all 0.3s ease', cursor: 'pointer', position: 'relative',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                }}
                  onClick={() => {
                    const cartItem = cart.find(item => item.id === product.id);
                    if (!cartItem) addToCart(product);
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = `0 12px 24px ${activeCategoryData.color}20`; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.03)'; }}
                >
                  {/* Product Image Area */}
                  <div style={{ position: 'relative', height: '180px', background: '#F8FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #E8EDF2' }}>
                    {product.image ? (
                      <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <i className="fa-solid fa-box-open" style={{ fontSize: '3rem', color: '#D5DEE5' }}></i>
                    )}
                  </div>
                  {/* Product Info */}
                  <div style={{ padding: '1.5rem' }}>
                    {/* Tag */}
                    {product.tag && (
                      <div style={{
                        display: 'inline-block', marginBottom: '0.8rem',
                        background: activeCategoryData.color,
                        color: '#FFF', padding: '4px 12px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.5px'
                      }}>
                        {product.tag}
                      </div>
                    )}
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1E3446', marginBottom: '0.4rem', lineHeight: 1.3 }}>
                      {product.name}
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: '#7091A8', marginBottom: '1rem', lineHeight: 1.5, height: '36px' }}>
                      {product.desc}
                    </p>

                    {/* Rating */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem' }}>
                      <div style={{ color: '#F1C40F', fontSize: '0.75rem' }}>
                        {'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5 - Math.floor(product.rating))}
                      </div>
                      <span style={{ fontSize: '0.75rem', color: '#7091A8', fontWeight: 600 }}>{product.rating}</span>
                      <span style={{ fontSize: '0.7rem', color: '#A0B0C0' }}>({product.reviews})</span>
                    </div>

                    {/* Price & Add to Cart */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px dashed #E8EDF2', paddingTop: '1rem' }}>
                      <div>
                        <span style={{ fontSize: '1.3rem', fontWeight: 900, color: '#1E3446' }}>₹{product.price}</span>
                        <div style={{ fontSize: '0.7rem', color: '#27AE60', fontWeight: 700, marginTop: '0.1rem' }}>
                          Save ₹{product.originalPrice - product.price}
                        </div>
                      </div>
                      {(() => {
                        const cartItem = cart.find(item => item.id === product.id);
                        return cartItem ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#FFF', border: `1px solid ${activeCategoryData.color}`, borderRadius: '8px', padding: '2px' }}>
                            <button onClick={(e) => { e.stopPropagation(); cartItem.qty <= 1 ? removeFromCart(cartItem.id) : updateQty(cartItem.id, -1); }} style={{ width: '28px', height: '28px', borderRadius: '6px', border: 'none', background: 'transparent', cursor: 'pointer', fontWeight: 700, fontSize: '1.2rem', color: activeCategoryData.color }}>−</button>
                            <span style={{ minWidth: '24px', textAlign: 'center', fontWeight: 700, color: '#1E3446', fontSize: '1rem' }}>{cartItem.qty}</span>
                            <button onClick={(e) => { e.stopPropagation(); updateQty(cartItem.id, 1); }} style={{ width: '28px', height: '28px', borderRadius: '6px', border: 'none', background: 'transparent', cursor: 'pointer', fontWeight: 700, fontSize: '1.2rem', color: activeCategoryData.color }}>+</button>
                          </div>
                        ) : (
                          <button onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                            style={{
                              background: activeCategoryData.color, color: '#FFF', border: 'none',
                              borderRadius: '10px', padding: '0.6rem 1rem', fontSize: '0.85rem', fontWeight: 700,
                              cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.4rem'
                            }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                          >
                            <i className="fa-solid fa-plus"></i> Add
                          </button>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div style={{ textAlign: 'center', padding: '6rem 0', color: '#7091A8' }}>
                <i className="fa-solid fa-box-open" style={{ fontSize: '4rem', marginBottom: '1.5rem', display: 'block', opacity: 0.3, color: activeCategoryData.color }}></i>
                <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>No products found in this shop.</p>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Cart & Checkout Sidebar */}
      {showCart && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', justifyContent: 'flex-end' }}>
          <div onClick={() => setShowCart(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}></div>
          <div style={{
            position: 'relative', width: '450px', maxWidth: '100vw', background: '#FFF', height: '100%',
            boxShadow: '-10px 0 50px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column',
            animation: 'slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}>
            {/* Cart Header */}
            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #E8EDF2', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FAFBFC' }}>
              <h3 style={{ margin: 0, color: '#1E3446', fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '0.8rem', fontWeight: 800 }}>
                <i className="fa-solid fa-bag-shopping" style={{ color: activeCategoryData.color }}></i> Order Checkout
              </h3>
              <button onClick={() => setShowCart(false)} style={{ background: 'none', border: 'none', fontSize: '1.4rem', color: '#7091A8', cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#E74C3C'} onMouseLeave={e => e.currentTarget.style.color = '#7091A8'}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '0', display: 'flex', flexDirection: 'column' }}>
              
              {/* Order Items Section */}
              <div style={{ padding: '1.5rem 2rem', background: '#FFF', flexShrink: 0 }}>
                <h4 style={{ fontSize: '0.9rem', color: '#A0B0C0', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem', fontWeight: 700 }}>Your Items</h4>
                {cart.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem 0', color: '#A0B0C0' }}>
                    <p>Your cart is empty.</p>
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item.id} style={{
                      display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem',
                      background: '#F8FAFB', borderRadius: '12px', marginBottom: '0.8rem', border: '1px solid #E8EDF2'
                    }}>
                      {item.image ? (
                        <img src={item.image} alt={item.name} style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: '#E8EDF2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <i className="fa-solid fa-box-open" style={{ color: '#A0B0C0' }}></i>
                        </div>
                      )}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, color: '#1E3446', fontSize: '0.9rem', marginBottom: '0.2rem' }}>{item.name}</div>
                        <div style={{ fontWeight: 800, color: activeCategoryData.color, fontSize: '1rem' }}>₹{item.price * item.qty}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#FFF', border: '1px solid #D5DEE5', borderRadius: '8px', padding: '2px' }}>
                        <button onClick={() => updateQty(item.id, -1)} style={{ width: '24px', height: '24px', borderRadius: '6px', border: 'none', background: 'transparent', cursor: 'pointer', fontWeight: 700, fontSize: '1rem', color: '#7091A8' }}>−</button>
                        <span style={{ minWidth: '20px', textAlign: 'center', fontWeight: 700, color: '#1E3446', fontSize: '0.9rem' }}>{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)} style={{ width: '24px', height: '24px', borderRadius: '6px', border: 'none', background: 'transparent', cursor: 'pointer', fontWeight: 700, fontSize: '1rem', color: '#7091A8' }}>+</button>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} style={{ background: 'none', border: 'none', color: '#E74C3C', cursor: 'pointer', fontSize: '1.1rem', padding: '0.3rem', marginLeft: '0.5rem' }}>
                        <i className="fa-regular fa-trash-can"></i>
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Customer Details Form */}
              {cart.length > 0 && (
                <div style={{ padding: '2rem', borderTop: '8px solid #F8FAFB', background: '#FFF', flexShrink: 0 }}>
                  <h4 style={{ fontSize: '0.9rem', color: '#A0B0C0', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1.5rem', fontWeight: 700 }}>Customer Details</h4>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#4A6B82', marginBottom: '0.4rem' }}>Full Name *</label>
                      <input type="text" placeholder="John Doe" value={customerDetails.name} onChange={e => setCustomerDetails({...customerDetails, name: e.target.value})} style={{ width: '100%', padding: '0.8rem 1rem', border: '1px solid #D5DEE5', borderRadius: '8px', outline: 'none', background: '#FAFBFC', color: '#1E3446', fontSize: '0.95rem' }} onFocus={e => e.target.style.borderColor = activeCategoryData.color} onBlur={e => e.target.style.borderColor = '#D5DEE5'} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#4A6B82', marginBottom: '0.4rem' }}>Phone *</label>
                        <input type="text" placeholder="+91..." value={customerDetails.phone} onChange={e => setCustomerDetails({...customerDetails, phone: e.target.value})} style={{ width: '100%', padding: '0.8rem 1rem', border: '1px solid #D5DEE5', borderRadius: '8px', outline: 'none', background: '#FAFBFC', color: '#1E3446', fontSize: '0.95rem' }} onFocus={e => e.target.style.borderColor = activeCategoryData.color} onBlur={e => e.target.style.borderColor = '#D5DEE5'} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#4A6B82', marginBottom: '0.4rem' }}>Email</label>
                        <input type="email" placeholder="john@example.com" value={customerDetails.email} onChange={e => setCustomerDetails({...customerDetails, email: e.target.value})} style={{ width: '100%', padding: '0.8rem 1rem', border: '1px solid #D5DEE5', borderRadius: '8px', outline: 'none', background: '#FAFBFC', color: '#1E3446', fontSize: '0.95rem' }} onFocus={e => e.target.style.borderColor = activeCategoryData.color} onBlur={e => e.target.style.borderColor = '#D5DEE5'} />
                      </div>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#4A6B82', marginBottom: '0.4rem' }}>Delivery Address *</label>
                      <textarea placeholder="Enter full delivery address..." rows="3" value={customerDetails.address} onChange={e => setCustomerDetails({...customerDetails, address: e.target.value})} style={{ width: '100%', padding: '0.8rem 1rem', border: '1px solid #D5DEE5', borderRadius: '8px', outline: 'none', background: '#FAFBFC', resize: 'vertical', color: '#1E3446', fontSize: '0.95rem' }} onFocus={e => e.target.style.borderColor = activeCategoryData.color} onBlur={e => e.target.style.borderColor = '#D5DEE5'}></textarea>
                    </div>

                    <div style={{ padding: '1rem', background: '#F0F7FA', borderRadius: '8px', border: '1px solid #D5DEE5' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 700, color: '#1E3446', fontSize: '0.9rem' }}>
                        <input type="checkbox" checked={customerDetails.sendAbroad} onChange={e => setCustomerDetails({...customerDetails, sendAbroad: e.target.checked})} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                        Send Abroad (International Delivery)
                      </label>

                      {customerDetails.sendAbroad && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px dashed #A0B0C0' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4A6B82', marginBottom: '0.3rem' }}>Receiver Country *</label>
                            <input type="text" placeholder="e.g. USA, UK" value={customerDetails.receiverCountry} onChange={e => setCustomerDetails({...customerDetails, receiverCountry: e.target.value})} style={{ width: '100%', padding: '0.6rem 0.8rem', border: '1px solid #D5DEE5', borderRadius: '6px' }} />
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4A6B82', marginBottom: '0.3rem' }}>Receiver Name *</label>
                              <input type="text" placeholder="Name" value={customerDetails.receiverName} onChange={e => setCustomerDetails({...customerDetails, receiverName: e.target.value})} style={{ width: '100%', padding: '0.6rem 0.8rem', border: '1px solid #D5DEE5', borderRadius: '6px' }} />
                            </div>
                            <div>
                              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4A6B82', marginBottom: '0.3rem' }}>Receiver Phone *</label>
                              <input type="text" placeholder="Phone" value={customerDetails.receiverPhone} onChange={e => setCustomerDetails({...customerDetails, receiverPhone: e.target.value})} style={{ width: '100%', padding: '0.6rem 0.8rem', border: '1px solid #D5DEE5', borderRadius: '6px' }} />
                            </div>
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4A6B82', marginBottom: '0.3rem' }}>Receiver Address *</label>
                            <textarea placeholder="Full address" rows="2" value={customerDetails.receiverAddress} onChange={e => setCustomerDetails({...customerDetails, receiverAddress: e.target.value})} style={{ width: '100%', padding: '0.6rem 0.8rem', border: '1px solid #D5DEE5', borderRadius: '6px', resize: 'vertical' }}></textarea>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#4A6B82', marginBottom: '0.6rem' }}>Payment Method *</label>
                      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        {['COD', 'Card', 'UPI'].map(method => (
                          <label key={method} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '0.8rem 1rem', background: customerDetails.paymentMethod === method ? '#E8F5E9' : '#FAFBFC', border: `1px solid ${customerDetails.paymentMethod === method ? '#27AE60' : '#D5DEE5'}`, borderRadius: '8px', flex: 1, minWidth: '100px', transition: 'all 0.2s', fontWeight: 600, color: customerDetails.paymentMethod === method ? '#1E3446' : '#7091A8' }}>
                            <input type="radio" name="paymentMethod" value={method} checked={customerDetails.paymentMethod === method} onChange={e => setCustomerDetails({...customerDetails, paymentMethod: e.target.value})} style={{ cursor: 'pointer' }} />
                            {method === 'COD' ? 'Cash on Delivery' : method}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Cart Footer / Checkout Button */}
            {cart.length > 0 && (
              <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid #E8EDF2', background: '#FAFBFC' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem', color: '#7091A8', fontSize: '0.95rem' }}>
                  <span>Subtotal</span><span style={{ color: '#1E3446', fontWeight: 700 }}>₹{cartTotal}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.2rem', color: '#7091A8', fontSize: '0.95rem' }}>
                  <span>Delivery</span><span style={{ color: '#27AE60', fontWeight: 700 }}>FREE</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', padding: '1rem 0', borderTop: '2px dashed #D5DEE5' }}>
                  <span style={{ fontWeight: 800, color: '#1E3446', fontSize: '1.2rem' }}>Total to Pay</span>
                  <span style={{ fontWeight: 900, color: activeCategoryData.color, fontSize: '1.6rem' }}>₹{cartTotal}</span>
                </div>
                <button onClick={async () => {
                  if(!customerDetails.name || !customerDetails.phone || !customerDetails.address) {
                    alert('Please fill in all required customer details (*)');
                    return;
                  }
                  if (customerDetails.sendAbroad && (!customerDetails.receiverCountry || !customerDetails.receiverName || !customerDetails.receiverPhone || !customerDetails.receiverAddress)) {
                    alert('Please fill in all receiver details for international delivery.');
                    return;
                  }
                  
                  setPlacingOrder(true);
                  try {
                    const result = await placePublicEcomOrder({
                      customer: {
                        name: customerDetails.name,
                        phone: customerDetails.phone,
                        email: customerDetails.email,
                        address: customerDetails.address
                      },
                      sendAbroad: customerDetails.sendAbroad,
                      receiver: customerDetails.sendAbroad ? {
                        country: customerDetails.receiverCountry,
                        name: customerDetails.receiverName,
                        phone: customerDetails.receiverPhone,
                        address: customerDetails.receiverAddress
                      } : undefined,
                      paymentMethod: customerDetails.paymentMethod,
                      items: cart.map(c => ({
                        productId: c.id,
                        name: c.name,
                        shop: c.shop,
                        shopName: c.category,
                        price: c.price,
                        qty: c.qty
                      })),
                      total: cartTotal
                    });
                    
                    const orderData = result?.data || result;
                    setOrderSuccess({
                      orderNumber: orderData?.orderNumber || 'SAI-PENDING',
                      customerName: customerDetails.name,
                      total: cartTotal,
                      itemCount: cart.length,
                      items: cart.map(c => ({ name: c.name, qty: c.qty, price: c.price })),
                      paymentMethod: customerDetails.paymentMethod
                    });
                    setCart([]);
                    setShowCart(false);
                    setCustomerDetails({ 
                      name: '', phone: '', email: '', address: '',
                      sendAbroad: false, receiverCountry: '', receiverName: '', receiverPhone: '', receiverAddress: '' 
                    });
                  } catch (err) {
                    alert('Failed to place order: ' + err.message);
                  } finally {
                    setPlacingOrder(false);
                  }
                }} disabled={placingOrder} style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem',
                  background: placingOrder ? '#A0B0C0' : `linear-gradient(135deg, ${activeCategoryData.color}, ${activeCategoryData.color}dd)`, color: '#FFF', padding: '1.2rem',
                  borderRadius: '12px', border: 'none', fontWeight: 800, fontSize: '1.1rem', cursor: placingOrder ? 'wait' : 'pointer',
                  boxShadow: placingOrder ? 'none' : `0 8px 24px ${activeCategoryData.color}50`, transition: 'transform 0.2s'
                }}
                  onMouseEnter={e => !placingOrder && (e.currentTarget.style.transform = 'translateY(-3px)')}
                  onMouseLeave={e => !placingOrder && (e.currentTarget.style.transform = 'translateY(0)')}
                >
                  {placingOrder ? <><i className="fa-solid fa-circle-notch fa-spin"></i> Processing...</> : <><i className="fa-solid fa-lock"></i> Place Secure Order</>}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══ ORDER SUCCESS OVERLAY ═══ */}
      {orderSuccess && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 10000,
          background: 'rgba(11,22,34,0.75)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'fadeInOverlay 0.4s ease-out'
        }}>
          <div style={{
            background: '#FFFFFF', borderRadius: '24px', maxWidth: '460px', width: '92%',
            boxShadow: '0 30px 80px rgba(0,0,0,0.35)', overflow: 'hidden',
            animation: 'popInSuccess 0.6s cubic-bezier(0.34,1.56,0.64,1)'
          }}>
            {/* Animated Header */}
            <div style={{
              background: 'linear-gradient(135deg, #27AE60 0%, #2ECC71 100%)',
              padding: '2.5rem 2rem 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden'
            }}>
              {/* Floating confetti dots */}
              {[...Array(12)].map((_, i) => (
                <div key={i} style={{
                  position: 'absolute',
                  width: `${6 + Math.random() * 8}px`, height: `${6 + Math.random() * 8}px`,
                  borderRadius: '50%',
                  background: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'][i % 6],
                  top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`,
                  animation: `confettiFall ${1.5 + Math.random() * 2}s ease-in-out ${Math.random() * 0.5}s infinite`,
                  opacity: 0.8
                }} />
              ))}
              <div style={{
                width: '80px', height: '80px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem',
                animation: 'bounceCheck 0.8s ease-out 0.3s both'
              }}>
                <i className="fa-solid fa-check" style={{ fontSize: '2.5rem', color: '#FFF' }}></i>
              </div>
              <h2 style={{ color: '#FFF', fontSize: '1.6rem', fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>Order Placed!</h2>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem', margin: '0.5rem 0 0' }}>Thank you, {orderSuccess.customerName}!</p>
            </div>

            {/* Tracking ID Card */}
            <div style={{ padding: '1.5rem 2rem' }}>
              <div style={{
                background: '#F0FFF4', border: '2px dashed #27AE60', borderRadius: '14px',
                padding: '1.2rem', textAlign: 'center', marginBottom: '1.2rem'
              }}>
                <div style={{ fontSize: '0.75rem', color: '#7091A8', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 700, marginBottom: '0.4rem' }}>
                  <i className="fa-solid fa-barcode" style={{ marginRight: '0.4rem' }}></i> Tracking / Order ID
                </div>
                <div style={{
                  fontSize: '1.5rem', fontWeight: 900, color: '#1E3446', letterSpacing: '2px',
                  fontFamily: 'monospace', animation: 'typeWriter 1s steps(15) 0.5s both',
                  overflow: 'hidden', whiteSpace: 'nowrap', borderRight: '2px solid #27AE60'
                }}>
                  {orderSuccess.orderNumber}
                </div>
              </div>

              {/* Order Summary */}
              <div style={{ background: '#FAFBFC', borderRadius: '12px', padding: '1rem 1.2rem', marginBottom: '1.2rem' }}>
                <div style={{ fontSize: '0.8rem', color: '#7091A8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.8rem' }}>Order Summary</div>
                {orderSuccess.items.map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: i < orderSuccess.items.length - 1 ? '1px solid #E8EDF2' : 'none' }}>
                    <span style={{ color: '#4A6B82', fontSize: '0.9rem' }}>{item.name} × {item.qty}</span>
                    <span style={{ color: '#1E3446', fontWeight: 700, fontSize: '0.9rem' }}>₹{item.price * item.qty}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.8rem', marginTop: '0.5rem', borderTop: '2px dashed #D5DEE5' }}>
                  <span style={{ fontWeight: 800, color: '#1E3446', fontSize: '1.05rem' }}>Total Paid</span>
                  <span style={{ fontWeight: 900, color: '#27AE60', fontSize: '1.2rem' }}>₹{orderSuccess.total}</span>
                </div>
              </div>

              {/* Payment Method Badge */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <span style={{ background: '#E8F4FD', color: '#2980B9', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 }}>
                  <i className={`fa-solid ${orderSuccess.paymentMethod === 'COD' ? 'fa-money-bill-wave' : orderSuccess.paymentMethod === 'UPI' ? 'fa-mobile-screen' : 'fa-credit-card'}`} style={{ marginRight: '0.4rem' }}></i>
                  {orderSuccess.paymentMethod === 'COD' ? 'Cash on Delivery' : orderSuccess.paymentMethod}
                </span>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.8rem' }}>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(orderSuccess.orderNumber);
                    const btn = document.getElementById('copy-tracking-btn');
                    if (btn) { btn.textContent = 'Copied!'; setTimeout(() => { btn.innerHTML = '<i class="fa-regular fa-copy"></i> Copy ID'; }, 2000); }
                  }}
                  id="copy-tracking-btn"
                  style={{
                    flex: 1, padding: '0.85rem', borderRadius: '12px', border: '2px solid #E3EDF3',
                    background: '#FFF', color: '#1E3446', fontWeight: 700, fontSize: '0.9rem',
                    cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                  }}
                >
                  <i className="fa-regular fa-copy"></i> Copy ID
                </button>
                <button
                  onClick={() => setOrderSuccess(null)}
                  style={{
                    flex: 2, padding: '0.85rem', borderRadius: '12px', border: 'none',
                    background: 'linear-gradient(135deg, #27AE60, #2ECC71)', color: '#FFF',
                    fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer',
                    boxShadow: '0 6px 20px rgba(39,174,96,0.35)', transition: 'all 0.2s',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <i className="fa-solid fa-bag-shopping"></i> Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeInOverlay {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes popInSuccess {
          from { transform: scale(0.7) translateY(40px); opacity: 0; }
          to { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes bounceCheck {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.3); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes confettiFall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 0; }
          20% { opacity: 0.8; }
          100% { transform: translateY(120px) rotate(360deg); opacity: 0; }
        }
        @keyframes typeWriter {
          from { max-width: 0; }
          to { max-width: 300px; }
        }
        
        /* Custom scrollbar for sidebar and product grid */
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #D5DEE5; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #A0B0C0; }
      `}</style>
      {/* Sticky Bottom View Order Bar */}
      {cartCount > 0 && (
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000,
          background: '#FFF', padding: '0.6rem 2rem', borderTop: '1px solid #E8EDF2',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          boxShadow: '0 -10px 30px rgba(0,0,0,0.08)',
          animation: 'slideUp 0.3s ease-out'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: '1200px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: `${activeCategoryData.color}15`, color: activeCategoryData.color, width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                <i className="fa-solid fa-bag-shopping"></i>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#7091A8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Your Order</div>
                <div style={{ fontSize: '1.1rem', color: '#1E3446', fontWeight: 900 }}>{cartCount} items • ₹{cartTotal}</div>
              </div>
            </div>
            <button 
              onClick={() => setShowCart(true)}
              style={{
                background: activeCategoryData.color, color: '#FFF', border: 'none',
                borderRadius: '10px', padding: '0.7rem 1.8rem', fontSize: '0.95rem', fontWeight: 800,
                cursor: 'pointer', transition: 'all 0.3s', display: 'flex', alignItems: 'center', gap: '0.6rem',
                boxShadow: `0 6px 16px ${activeCategoryData.color}40`
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              View Order <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>
      )}
    </main>
  );
}