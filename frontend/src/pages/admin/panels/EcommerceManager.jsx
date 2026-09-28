import { useState, useEffect, useCallback } from 'react';
import {
  getEcomShops, createEcomShop, updateEcomShop, deleteEcomShop,
  getEcomProducts, createEcomProduct, updateEcomProduct, deleteEcomProduct,
  getEcomOrders, updateEcomOrderStatus, markOrdersSeen, uploadMedia
} from '../../../services/api';

// ─── Helpers ──────────────────────────────────────────────────────────────
const STATUS_COLORS = {
  pending: '#D97706',
  confirmed: '#2563EB',
  shipped: '#7C3AED',
  delivered: '#16A34A',
  cancelled: '#DC2626',
};

const STATUS_OPTIONS = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

const fmtDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

// ─── Component ────────────────────────────────────────────────────────────
export default function EcommerceManager() {
  const [tab, setTab] = useState('shops');
  const [shops, setShops] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [search, setSearch] = useState('');

  // Shop form
  const [showShopForm, setShowShopForm] = useState(false);
  const [editingShop, setEditingShop] = useState(null);
  const [shopForm, setShopForm] = useState({ name: '', icon: '🏪', color: '#3CC8C8', isActive: true });

  // Product form
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({ shop: '', name: '', price: '', originalPrice: '', image: '', description: '', tag: '', rating: 4.5, isActive: true });
  const [uploadingImage, setUploadingImage] = useState(false);

  // Order detail
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Filter for products by shop
  const [filterShop, setFilterShop] = useState('');
  // Filter for orders by status
  const [filterStatus, setFilterStatus] = useState('');

  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(''), 4000); };

  // ─── Data Loading ─────────────────────────────────────────────────────
  const loadShops = useCallback(async () => {
    try {
      const res = await getEcomShops();
      setShops(res.data || []);
    } catch { setShops([]); }
  }, []);

  const loadProducts = useCallback(async () => {
    try {
      const res = await getEcomProducts(filterShop || undefined);
      setProducts(res.data || []);
    } catch { setProducts([]); }
  }, [filterShop]);

  const loadOrders = useCallback(async () => {
    try {
      const res = await getEcomOrders(filterStatus || undefined);
      setOrders(res.data || []);
    } catch { setOrders([]); }
  }, [filterStatus]);

  useEffect(() => {
    setLoading(true);
    Promise.all([loadShops(), loadProducts(), loadOrders()]).finally(() => setLoading(false));
  }, [loadShops, loadProducts, loadOrders]);

  // Mark orders as seen when switching to orders tab
  useEffect(() => {
    if (tab === 'orders') {
      markOrdersSeen().catch(() => {});
    }
  }, [tab]);

  // ─── Shops CRUD ───────────────────────────────────────────────────────
  const openNewShop = () => {
    setEditingShop(null);
    setShopForm({ name: '', icon: '🏪', color: '#3CC8C8', isActive: true });
    setShowShopForm(true);
  };

  const openEditShop = (shop) => {
    setEditingShop(shop);
    setShopForm({ name: shop.name, icon: shop.icon, color: shop.color, isActive: shop.isActive });
    setShowShopForm(true);
  };

  const saveShop = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingShop) {
        await updateEcomShop(editingShop._id, shopForm);
        flash('✅ Shop updated successfully!');
      } else {
        await createEcomShop(shopForm);
        flash('✅ Shop created successfully!');
      }
      setShowShopForm(false);
      await loadShops();
    } catch (err) {
      flash(`❌ ${err.message}`);
    } finally { setSaving(false); }
  };

  const handleDeleteShop = async (id) => {
    try {
      await deleteEcomShop(id);
      flash('✅ Shop and its products deleted.');
      setDeleteConfirm(null);
      await Promise.all([loadShops(), loadProducts()]);
    } catch (err) { flash(`❌ ${err.message}`); }
  };

  // ─── Products CRUD ────────────────────────────────────────────────────
  const openNewProduct = () => {
    setEditingProduct(null);
    setProductForm({ shop: shops[0]?._id || '', name: '', price: '', originalPrice: '', image: '', description: '', tag: '', rating: 4.5, isActive: true });
    setShowProductForm(true);
  };

  const openEditProduct = (p) => {
    setEditingProduct(p);
    setProductForm({
      shop: p.shop?._id || p.shop || '',
      name: p.name,
      price: p.price,
      originalPrice: p.originalPrice || '',
      image: p.image || '',
      description: p.description || '',
      tag: p.tag || '',
      rating: p.rating || 4.5,
      isActive: p.isActive,
    });
    setShowProductForm(true);
  };

  const handleProductImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await uploadMedia(formData);
      setProductForm(prev => ({ ...prev, image: res.data.url }));
      flash('✅ Image uploaded successfully!');
    } catch (err) {
      flash('❌ Image upload failed: ' + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const saveProduct = async (e) => {
    e.preventDefault();
    // Image validation removed
    setSaving(true);
    try {
      const data = { ...productForm, price: Number(productForm.price), originalPrice: Number(productForm.originalPrice) || 0, rating: Number(productForm.rating) };
      if (editingProduct) {
        await updateEcomProduct(editingProduct._id, data);
        flash('✅ Product updated successfully!');
      } else {
        await createEcomProduct(data);
        flash('✅ Product created successfully!');
      }
      setShowProductForm(false);
      await loadProducts();
    } catch (err) {
      flash(`❌ ${err.message}`);
    } finally { setSaving(false); }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await deleteEcomProduct(id);
      flash('✅ Product deleted.');
      setDeleteConfirm(null);
      await loadProducts();
    } catch (err) { flash(`❌ ${err.message}`); }
  };

  // ─── Orders ───────────────────────────────────────────────────────────
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await updateEcomOrderStatus(orderId, { status: newStatus });
      flash(`✅ Order status updated to ${newStatus}.`);
      await loadOrders();
      if (selectedOrder?._id === orderId) {
        setSelectedOrder(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) { flash(`❌ ${err.message}`); }
  };

  const handleUpdateOrderNotes = async (orderId, notes) => {
    try {
      await updateEcomOrderStatus(orderId, { notes });
      flash('✅ Notes saved.');
      await loadOrders();
    } catch (err) { flash(`❌ ${err.message}`); }
  };

  // ─── Filtered data ────────────────────────────────────────────────────
  const filteredShops = shops.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));
  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.shopName?.toLowerCase().includes(search.toLowerCase()));
  const filteredOrders = orders.filter(o =>
    o.orderNumber?.toLowerCase().includes(search.toLowerCase()) ||
    o.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
    o.customer?.phone?.includes(search)
  );

  // ─── Render ───────────────────────────────────────────────────────────
  const tabStyle = (t) => ({
    padding: '0.6rem 1.2rem',
    border: 'none',
    borderBottom: tab === t ? '3px solid #3CC8C8' : '3px solid transparent',
    background: 'none',
    color: tab === t ? '#1E3446' : '#8BA3B8',
    fontWeight: tab === t ? '800' : '600',
    cursor: 'pointer',
    fontSize: '0.95rem',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  });

  const newOrdersCount = orders.filter(o => !o.seen).length;

  return (
    <div className="admin-panel-content">
      <div className="admin-editor-header">
        <h2 className="admin-editor-title">E-Commerce Management</h2>
      </div>

      {msg && <div className={`admin-save-msg ${msg.startsWith('✅') ? 'success' : 'error'}`}>{msg}</div>}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.25rem', borderBottom: '1px solid #E8EDF2', marginBottom: '1.25rem' }}>
        <button style={tabStyle('shops')} onClick={() => setTab('shops')}>
          Shops
        </button>
        <button style={tabStyle('products')} onClick={() => setTab('products')}>
          Products
        </button>
        <button style={tabStyle('orders')} onClick={() => setTab('orders')}>
          Orders
          {newOrdersCount > 0 && (
            <span style={{
              background: '#EF4444', color: '#FFF', borderRadius: '10px', padding: '1px 7px',
              fontSize: '0.7rem', fontWeight: '800', marginLeft: '0.25rem', animation: 'pulse 2s infinite',
            }}>{newOrdersCount}</span>
          )}
        </button>
      </div>

      {/* Search + Action bar */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
          <i className="fa-solid fa-search" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748B', fontSize: '0.85rem' }}></i>
          <input
            type="text"
            placeholder={`Search ${tab}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-field-input"
            style={{ paddingLeft: '2.2rem', fontSize: '0.9rem' }}
          />
        </div>

        {tab === 'products' && (
          <select className="admin-field-input" style={{ width: 'auto', minWidth: '160px' }} value={filterShop} onChange={e => setFilterShop(e.target.value)}>
            <option value="">All Shops</option>
            {shops.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
          </select>
        )}

        {tab === 'orders' && (
          <select className="admin-field-input" style={{ width: 'auto', minWidth: '160px' }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
        )}

        {tab === 'shops' && (
          <button className="admin-btn admin-btn-primary" onClick={openNewShop}>
            <i className="fa-solid fa-plus"></i> Add Shop
          </button>
        )}
        {tab === 'products' && (
          <button className="admin-btn admin-btn-primary" onClick={openNewProduct} disabled={shops.length === 0}>
            <i className="fa-solid fa-plus"></i> Add Product
          </button>
        )}
        {tab === 'orders' && (
          <button className="admin-btn admin-btn-outline" onClick={loadOrders}>
            <i className="fa-solid fa-arrows-rotate"></i> Refresh
          </button>
        )}
      </div>

      {loading ? (
        <div className="admin-loading"><i className="fa-solid fa-circle-notch fa-spin"></i> Loading...</div>
      ) : (
        <>
          {/* ─── SHOPS TAB ──────────────────────────────────────────── */}
          {tab === 'shops' && (
            <div className="admin-table-wrapper">
              {filteredShops.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#8BA3B8' }}>
                  <i className="fa-solid fa-shop" style={{ fontSize: '2.5rem', marginBottom: '1rem', display: 'block', opacity: 0.4 }}></i>
                  <p>No shops yet. Create your first shop to get started!</p>
                </div>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Shop Name</th>
                      <th>Color</th>
                      <th>Products</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredShops.map(shop => (
                      <tr key={shop._id}>
                        <td><strong>{shop.name}</strong></td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: '20px', height: '20px', borderRadius: '4px', background: shop.color, border: '1px solid rgba(255,255,255,0.2)' }}></div>
                            <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>{shop.color}</span>
                          </div>
                        </td>
                        <td>
                          <span className="admin-status-badge" style={{ background: 'rgba(60,200,200,0.15)', color: '#3CC8C8' }}>
                            {shop.productCount || 0} items
                          </span>
                        </td>
                        <td>
                          <span className="admin-status-badge" style={{
                            background: shop.isActive ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                            color: shop.isActive ? '#22C55E' : '#EF4444',
                          }}>
                            {shop.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button className="admin-btn admin-btn-sm admin-btn-outline" onClick={() => openEditShop(shop)}>
                              <i className="fa-solid fa-pen"></i> Edit
                            </button>
                            <button className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => setDeleteConfirm({ type: 'shop', id: shop._id, name: shop.name })}>
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* ─── PRODUCTS TAB ───────────────────────────────────────── */}
          {tab === 'products' && (
            <div className="admin-table-wrapper">
              {filteredProducts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#8BA3B8' }}>
                  <i className="fa-solid fa-box-open" style={{ fontSize: '2.5rem', marginBottom: '1rem', display: 'block', opacity: 0.4 }}></i>
                  <p>{shops.length === 0 ? 'Create a shop first, then add products.' : 'No products found. Add your first product!'}</p>
                </div>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Product Name</th>
                      <th>Shop</th>
                      <th>Price</th>
                      <th>Tag</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map(p => (
                      <tr key={p._id}>
                        <td style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          {p.image ? (
                            <img src={p.image} alt="" style={{ width: '32px', height: '32px', borderRadius: '6px', objectFit: 'cover' }} />
                          ) : (
                            <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: '#F8FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <i className="fa-solid fa-box-open" style={{ color: '#D5DEE5', fontSize: '0.8rem' }}></i>
                            </div>
                          )}
                          <strong>{p.name}</strong>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.85rem', color: '#8BA3B8' }}>
                            {p.shop?.icon || ''} {p.shopName || p.shop?.name || '-'}
                          </span>
                        </td>
                        <td>
                          <strong style={{ color: '#3CC8C8' }}>₹{p.price}</strong>
                          {p.originalPrice > 0 && p.originalPrice !== p.price && (
                            <span style={{ textDecoration: 'line-through', color: '#64748B', marginLeft: '0.4rem', fontSize: '0.8rem' }}>₹{p.originalPrice}</span>
                          )}
                        </td>
                        <td>
                          {p.tag ? (
                            <span className="admin-status-badge" style={{ background: 'rgba(217,119,6,0.15)', color: '#D97706' }}>{p.tag}</span>
                          ) : '-'}
                        </td>
                        <td>
                          <span className="admin-status-badge" style={{
                            background: p.isActive ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                            color: p.isActive ? '#22C55E' : '#EF4444',
                          }}>
                            {p.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button className="admin-btn admin-btn-sm admin-btn-outline" onClick={() => openEditProduct(p)}>
                              <i className="fa-solid fa-pen"></i> Edit
                            </button>
                            <button className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => setDeleteConfirm({ type: 'product', id: p._id, name: p.name })}>
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* ─── ORDERS TAB ─────────────────────────────────────────── */}
          {tab === 'orders' && (
            <div className="admin-table-wrapper">
              {filteredOrders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#8BA3B8' }}>
                  <i className="fa-solid fa-receipt" style={{ fontSize: '2.5rem', marginBottom: '1rem', display: 'block', opacity: 0.4 }}></i>
                  <p>No orders yet. Orders will appear here when customers place them.</p>
                </div>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order #</th>
                      <th>Customer</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map(o => (
                      <tr key={o._id} style={{ background: !o.seen ? 'rgba(59,130,246,0.08)' : 'transparent' }}>
                        <td>
                          <strong style={{ color: '#D97706' }}>{o.orderNumber}</strong>
                          {!o.seen && <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444', marginLeft: '6px' }}></span>}
                        </td>
                        <td>
                          <div><strong>{o.customer?.name}</strong></div>
                          <div style={{ fontSize: '0.8rem', color: '#8BA3B8' }}>{o.customer?.phone}</div>
                        </td>
                        <td>{o.items?.length || 0} items</td>
                        <td><strong style={{ color: '#3CC8C8' }}>₹{o.total?.toFixed(2)}</strong></td>
                        <td>
                          <span className="admin-status-badge" style={{
                            background: `${STATUS_COLORS[o.status] || '#888'}20`,
                            color: STATUS_COLORS[o.status] || '#888',
                          }}>
                            {o.status?.charAt(0).toUpperCase() + o.status?.slice(1)}
                          </span>
                        </td>
                        <td style={{ fontSize: '0.8rem', color: '#8BA3B8' }}>{fmtDate(o.createdAt)}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button className="admin-btn admin-btn-sm admin-btn-outline" onClick={() => setSelectedOrder(o)}>
                              <i className="fa-solid fa-eye"></i> View
                            </button>
                            {o.status === 'pending' && (
                              <button className="admin-btn admin-btn-sm admin-btn-primary" onClick={() => handleUpdateOrderStatus(o._id, 'confirmed')}>
                                <i className="fa-solid fa-check"></i> Confirm
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* MODALS                                                           */}
      {/* ═══════════════════════════════════════════════════════════════════ */}

      {/* Shop Form Modal */}
      {showShopForm && (
        <div className="admin-modal-overlay" onClick={() => setShowShopForm(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="admin-modal-header">
              <h3>{editingShop ? 'Edit Shop' : 'Create New Shop'}</h3>
              <button onClick={() => setShowShopForm(false)}><i className="fa-solid fa-xmark"></i></button>
            </div>
            <form onSubmit={saveShop} className="admin-modal-body">
              <div className="admin-field">
                <label className="admin-field-label">Shop Name *</label>
                <input type="text" className="admin-field-input" required value={shopForm.name} onChange={e => setShopForm({ ...shopForm, name: e.target.value })} placeholder="e.g. NRI Groceries" />
              </div>
              <div className="admin-field">
                <label className="admin-field-label">Brand Color</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input type="color" value={shopForm.color} onChange={e => setShopForm({ ...shopForm, color: e.target.value })} style={{ width: '40px', height: '36px', border: 'none', cursor: 'pointer', borderRadius: '4px' }} />
                  <input type="text" className="admin-field-input" value={shopForm.color} onChange={e => setShopForm({ ...shopForm, color: e.target.value })} style={{ flex: 1 }} />
                </div>
              </div>
              <div className="admin-field">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#B4CCE0', cursor: 'pointer' }}>
                  <input type="checkbox" checked={shopForm.isActive} onChange={e => setShopForm({ ...shopForm, isActive: e.target.checked })} />
                  Active (visible to customers)
                </label>
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="admin-btn admin-btn-outline" onClick={() => setShowShopForm(false)}>Cancel</button>
                <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
                  {saving ? 'Saving…' : editingShop ? 'Update Shop' : 'Create Shop'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Product Form Modal */}
      {showProductForm && (
        <div className="admin-modal-overlay" onClick={() => setShowProductForm(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div className="admin-modal-header">
              <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <button onClick={() => setShowProductForm(false)}><i className="fa-solid fa-xmark"></i></button>
            </div>
            <form onSubmit={saveProduct} className="admin-modal-body">
              <div className="admin-field">
                <label className="admin-field-label">Shop *</label>
                <select className="admin-field-input" required value={productForm.shop} onChange={e => setProductForm({ ...productForm, shop: e.target.value })}>
                  <option value="">Select a shop</option>
                  {shops.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                </select>
              </div>
              <div className="admin-field">
                <label className="admin-field-label">Product Name *</label>
                <input type="text" className="admin-field-input" required value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} placeholder="e.g. Andhra Pickle Mix" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="admin-field">
                  <label className="admin-field-label">Selling Price (₹) *</label>
                  <input type="number" className="admin-field-input" required min="0" step="0.01" value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} placeholder="499" />
                </div>
                <div className="admin-field">
                  <label className="admin-field-label">Original Price (₹)</label>
                  <input type="number" className="admin-field-input" min="0" step="0.01" value={productForm.originalPrice} onChange={e => setProductForm({ ...productForm, originalPrice: e.target.value })} placeholder="699 (optional, for discount)" />
                </div>
              </div>
              <div className="admin-field">
                <label className="admin-field-label">Product Image</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <input type="file" accept="image/*" onChange={handleProductImageUpload} style={{ flex: 1 }} />
                  {uploadingImage && <i className="fa-solid fa-spinner fa-spin" style={{ color: '#3CC8C8' }}></i>}
                  {productForm.image && <img src={productForm.image} alt="Preview" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />}
                </div>
              </div>
              <div className="admin-field">
                <label className="admin-field-label">Description</label>
                <textarea className="admin-field-input" rows={3} value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })} placeholder="Brief product description..." style={{ resize: 'vertical' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="admin-field">
                  <label className="admin-field-label">Tag / Badge</label>
                  <input type="text" className="admin-field-input" value={productForm.tag} onChange={e => setProductForm({ ...productForm, tag: e.target.value })} placeholder="e.g. Best Seller, New" />
                </div>
                <div className="admin-field">
                  <label className="admin-field-label">Rating (0–5)</label>
                  <input type="number" className="admin-field-input" min="0" max="5" step="0.1" value={productForm.rating} onChange={e => setProductForm({ ...productForm, rating: e.target.value })} />
                </div>
              </div>
              <div className="admin-field">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#B4CCE0', cursor: 'pointer' }}>
                  <input type="checkbox" checked={productForm.isActive} onChange={e => setProductForm({ ...productForm, isActive: e.target.checked })} />
                  Active (visible to customers)
                </label>
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="admin-btn admin-btn-outline" onClick={() => setShowProductForm(false)}>Cancel</button>
                <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
                  {saving ? 'Saving…' : editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="admin-modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '650px' }}>
            <div className="admin-modal-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <i className="fa-solid fa-receipt" style={{ color: '#D97706' }}></i>
                Order {selectedOrder.orderNumber}
              </h3>
              <button onClick={() => setSelectedOrder(null)}><i className="fa-solid fa-xmark"></i></button>
            </div>
            <div className="admin-modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              {/* Status */}
              <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span className="admin-status-badge" style={{
                  background: `${STATUS_COLORS[selectedOrder.status]}20`,
                  color: STATUS_COLORS[selectedOrder.status],
                  fontSize: '0.9rem',
                  padding: '0.4rem 1rem',
                }}>
                  {selectedOrder.status?.charAt(0).toUpperCase() + selectedOrder.status?.slice(1)}
                </span>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {STATUS_OPTIONS.filter(s => s !== selectedOrder.status).map(s => (
                    <button key={s} className="admin-btn admin-btn-sm admin-btn-outline" onClick={() => handleUpdateOrderStatus(selectedOrder._id, s)}
                      style={{ fontSize: '0.75rem', borderColor: STATUS_COLORS[s], color: STATUS_COLORS[s] }}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer */}
              <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
                <h4 style={{ margin: '0 0 0.75rem 0', color: '#B4CCE0', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  <i className="fa-solid fa-user" style={{ marginRight: '0.4rem' }}></i> Customer
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.9rem' }}>
                  <div><span style={{ color: '#64748B' }}>Name:</span> <strong>{selectedOrder.customer?.name}</strong></div>
                  <div><span style={{ color: '#64748B' }}>Phone:</span> <a href={`tel:${selectedOrder.customer?.phone}`} style={{ color: '#3CC8C8' }}>{selectedOrder.customer?.phone}</a></div>
                  {selectedOrder.customer?.email && <div><span style={{ color: '#64748B' }}>Email:</span> {selectedOrder.customer?.email}</div>}
                  <div style={{ gridColumn: '1 / -1' }}><span style={{ color: '#64748B' }}>Address:</span> {selectedOrder.customer?.address}</div>
                </div>
              </div>

              {/* International Delivery Details */}
              {selectedOrder.sendAbroad && selectedOrder.receiver && (
                <div style={{ background: 'rgba(59,200,200,0.08)', border: '1px solid rgba(60,200,200,0.3)', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
                  <h4 style={{ margin: '0 0 0.75rem 0', color: '#3CC8C8', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    <i className="fa-solid fa-plane-departure" style={{ marginRight: '0.4rem' }}></i> International Delivery
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.9rem' }}>
                    <div><span style={{ color: '#64748B' }}>Country:</span> <strong style={{ color: '#FFF' }}>{selectedOrder.receiver?.country}</strong></div>
                    <div><span style={{ color: '#64748B' }}>Receiver Name:</span> <strong>{selectedOrder.receiver?.name}</strong></div>
                    <div><span style={{ color: '#64748B' }}>Receiver Phone:</span> <a href={`tel:${selectedOrder.receiver?.phone}`} style={{ color: '#3CC8C8' }}>{selectedOrder.receiver?.phone}</a></div>
                    <div style={{ gridColumn: '1 / -1' }}><span style={{ color: '#64748B' }}>Receiver Address:</span> {selectedOrder.receiver?.address}</div>
                  </div>
                </div>
              )}

              {/* Items */}
              <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
                <h4 style={{ margin: '0 0 0.75rem 0', color: '#B4CCE0', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  <i className="fa-solid fa-cart-shopping" style={{ marginRight: '0.4rem' }}></i> Items ({selectedOrder.items?.length})
                </h4>
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: idx < selectedOrder.items.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                    <div>
                      <strong>{item.name}</strong>
                      {item.shopName && <span style={{ color: '#64748B', fontSize: '0.8rem', marginLeft: '0.5rem' }}>({item.shopName})</span>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ color: '#8BA3B8' }}>×{item.qty}</span>
                      <strong style={{ color: '#3CC8C8' }}>₹{(item.price * item.qty).toFixed(2)}</strong>
                    </div>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.75rem', marginTop: '0.5rem', borderTop: '2px solid rgba(255,255,255,0.1)' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#3CC8C8' }}>
                    Total: ₹{selectedOrder.total?.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Notes */}
              <div style={{ marginBottom: '0.5rem' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#B4CCE0', fontSize: '0.85rem' }}>
                  <i className="fa-solid fa-sticky-note" style={{ marginRight: '0.4rem' }}></i> Admin Notes
                </h4>
                <textarea
                  className="admin-field-input"
                  rows={3}
                  defaultValue={selectedOrder.notes || ''}
                  placeholder="Add internal notes about this order..."
                  style={{ resize: 'vertical' }}
                  onBlur={e => {
                    if (e.target.value !== (selectedOrder.notes || '')) {
                      handleUpdateOrderNotes(selectedOrder._id, e.target.value);
                    }
                  }}
                />
              </div>

              <div style={{ fontSize: '0.8rem', color: '#64748B', textAlign: 'right' }}>
                Ordered on {fmtDate(selectedOrder.createdAt)}
              </div>
            </div>
            <div className="admin-modal-footer">
              <a href={`tel:${selectedOrder.customer?.phone}`} className="admin-btn admin-btn-primary" style={{ textDecoration: 'none' }}>
                <i className="fa-solid fa-phone"></i> Call Customer
              </a>
              <a href={`https://wa.me/${selectedOrder.customer?.phone?.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="admin-btn" style={{ background: '#25D366', color: '#FFF', textDecoration: 'none' }}>
                <i className="fa-brands fa-whatsapp"></i> WhatsApp
              </a>
              <button className="admin-btn admin-btn-outline" onClick={() => setSelectedOrder(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="admin-modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '420px' }}>
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <i className="fa-solid fa-trash" style={{ fontSize: '1.3rem', color: '#EF4444' }}></i>
              </div>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#FFF' }}>Delete {deleteConfirm.type}?</h3>
              <p style={{ color: '#8BA3B8', marginBottom: '1.5rem' }}>
                Are you sure you want to delete <strong>"{deleteConfirm.name}"</strong>?
                {deleteConfirm.type === 'shop' && ' This will also delete all products in this shop.'}
                {' '}This cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                <button className="admin-btn admin-btn-outline" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                <button className="admin-btn admin-btn-danger" onClick={() => deleteConfirm.type === 'shop' ? handleDeleteShop(deleteConfirm.id) : handleDeleteProduct(deleteConfirm.id)}>
                  <i className="fa-solid fa-trash"></i> Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
