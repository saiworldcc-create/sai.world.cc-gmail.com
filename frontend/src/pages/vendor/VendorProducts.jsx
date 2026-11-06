import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useUser } from '../../context/UserContext';

export default function VendorProducts() {
  const { user } = useUser();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  
  const initialFormState = {
    name: '', price: '', originalPrice: '', sku: '', stock: 100,
    lowStockThreshold: 10, moq: 1, weight: 1, size: '', description: '', image: ''
  };
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/vendor/products');
      setProducts(res.products || []);
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Image is too large. Please upload an image smaller than 2MB.');
        return;
      }
      
      const uploadData = new FormData();
      uploadData.append('file', file);
      
      try {
        setLoading(true);
        const res = await api.post('/imagekit/vendor-upload', uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setFormData({ ...formData, image: res.data.url });
      } catch (err) {
        alert('Failed to upload image securely.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProductId) {
        await api.put(`/vendor/products/${editingProductId}`, formData);
      } else {
        await api.post('/vendor/products', formData);
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || `Failed to ${editingProductId ? 'update' : 'create'} product`);
    }
  };

  const handleBulkUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target.result;
        const lines = text.split('\n').filter(line => line.trim());
        if (lines.length < 2) return alert('CSV is empty or missing headers');

        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        
        const products = [];
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim());
          if (values.length < headers.length) continue;
          
          const product = {};
          headers.forEach((header, index) => {
            product[header] = values[index];
          });
          
          products.push({
            name: product.name,
            sku: product.sku || '',
            price: Number(product.price) || 0,
            originalPrice: Number(product.originalprice) || 0,
            stock: Number(product.stock) || 0,
            lowStockThreshold: Number(product.lowstockthreshold) || 10,
            moq: Number(product.moq) || 1,
            weight: Number(product.weight) || 1,
            size: product.size || '',
            description: product.description || ''
          });
        }

        if (products.length === 0) return alert('No valid products found in CSV');
        
        setLoading(true);
        const res = await api.post('/vendor/products/bulk', { products });
        alert(`Success: ${res.message || 'Products imported'}`);
        fetchProducts();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to process CSV');
        setLoading(false);
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input
  };

  const openAddModal = () => {
    setEditingProductId(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProductId(product._id);
    setFormData({
      name: product.name || '',
      price: product.price || '',
      originalPrice: product.originalPrice || '',
      sku: product.sku || '',
      stock: product.stock || 0,
      lowStockThreshold: product.lowStockThreshold || 10,
      moq: product.moq || 1,
      weight: product.weight || 1,
      size: product.size || '',
      description: product.description || '',
      image: product.image && product.image !== '📦' ? product.image : ''
    });
    setIsModalOpen(true);
  };

  const deleteProduct = async (id) => {
    if(!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/vendor/products/${id}`);
      fetchProducts();
    } catch (err) {
      alert('Failed to delete product');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="vendor-fade-in" style={{ width: '100%', color: '#0F172A', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #E2E8F0' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700', color: '#0F172A' }}>Catalog & Inventory</h2>
          <p style={{ margin: '0.2rem 0 0 0', color: '#64748B', fontSize: '0.9rem' }}>Manage your B2B products and track stock levels.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <label style={{ background: '#F8FAFC', color: '#0F172A', border: '1px solid #CBD5E1', padding: '0.6rem 1.2rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600', transition: 'all 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            <i className="fa-solid fa-file-csv" style={{ color: '#10B981' }}></i> Bulk Import CSV
            <input type="file" accept=".csv" onChange={handleBulkUpload} style={{ display: 'none' }} />
          </label>
          <button onClick={openAddModal} style={{ background: '#0F172A', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600', transition: 'background 0.2s', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <i className="fa-solid fa-plus"></i> Add Product
          </button>
        </div>
      </div>

      {error && <div style={{ background: '#FEF2F2', color: '#EF4444', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #FECACA' }}><i className="fa-solid fa-circle-exclamation" style={{marginRight:'0.5rem'}}></i> {error}</div>}

      <div style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', border: '1px solid #E2E8F0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0' }}>
            <tr>
              <th style={{ padding: '1rem 1.5rem', color: '#475569', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Product Name</th>
              <th style={{ padding: '1rem 1.5rem', color: '#475569', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>SKU</th>
              <th style={{ padding: '1rem 1.5rem', color: '#475569', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Size</th>
              <th style={{ padding: '1rem 1.5rem', color: '#475569', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Price (B2B)</th>
              <th style={{ padding: '1rem 1.5rem', color: '#475569', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Stock Level</th>
              <th style={{ padding: '1rem 1.5rem', color: '#475569', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>MOQ</th>
              <th style={{ padding: '1rem 1.5rem', color: '#475569', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ padding: '3rem 1.5rem', textAlign: 'center', color: '#64748B' }}>
                  <div style={{ fontSize: '2.5rem', color: '#CBD5E1', marginBottom: '1rem' }}><i className="fa-solid fa-box-open"></i></div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '500', color: '#334155' }}>No products in your catalog yet</div>
                  <div style={{ marginTop: '0.5rem' }}>Click "Add Product" to start selling to B2B buyers.</div>
                </td>
              </tr>
            ) : (
              products.map(p => (
                <tr key={p._id} style={{ borderBottom: '1px solid #E2E8F0', transition: 'background 0.2s', ':hover': { background: '#F8FAFC' } }}>
                  <td style={{ padding: '1rem 1.5rem', color: '#0F172A', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {p.image && p.image !== '📦' ? (
                      <img src={p.image} alt={p.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #E2E8F0' }} />
                    ) : (
                      <div style={{ width: '40px', height: '40px', background: '#F1F5F9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', color: '#94A3B8' }}>📦</div>
                    )}
                    {p.name}
                  </td>
                  <td style={{ padding: '1rem 1.5rem', color: '#64748B', fontFamily: 'monospace' }}>{p.sku || 'N/A'}</td>
                  <td style={{ padding: '1rem 1.5rem', color: '#334155' }}>{p.size || '-'}</td>
                  <td style={{ padding: '1rem 1.5rem', color: '#10B981', fontWeight: '700' }}>${p.price}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ 
                      padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600',
                      background: p.stock <= p.lowStockThreshold ? '#FEF2F2' : '#ECFDF5',
                      color: p.stock <= p.lowStockThreshold ? '#EF4444' : '#10B981',
                      border: `1px solid ${p.stock <= p.lowStockThreshold ? '#FECACA' : '#A7F3D0'}`
                    }}>
                      <i className={`fa-solid ${p.stock <= p.lowStockThreshold ? 'fa-triangle-exclamation' : 'fa-check'}`} style={{marginRight:'4px'}}></i>
                      {p.stock} units
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', color: '#334155', fontWeight: '500' }}>{p.moq}</td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button onClick={() => openEditModal(p)} style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', color: '#3B82F6', cursor: 'pointer', width: '32px', height: '32px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} title="Edit Product">
                        <i className="fa-solid fa-pen"></i>
                      </button>
                      <button onClick={() => deleteProduct(p._id)} style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#EF4444', cursor: 'pointer', width: '32px', height: '32px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} title="Delete Product">
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: '#fff', borderRadius: '20px', width: '100%', maxWidth: '600px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow: 'hidden' }}>
            
            <div style={{ padding: '1.5rem 2rem', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, color: '#0F172A', fontSize: '1.4rem', fontWeight: '700' }}>{editingProductId ? 'Edit Product' : 'Add New Product'}</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', color: '#94A3B8', cursor: 'pointer' }}>&times;</button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', padding: '2rem', maxHeight: '70vh', overflowY: 'auto' }}>
              
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                <div style={{ width: '100px', height: '100px', borderRadius: '12px', border: '2px dashed #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC', overflow: 'hidden', position: 'relative', cursor: 'pointer', flexShrink: 0 }}>
                  {formData.image ? (
                    <img src={formData.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ textAlign: 'center', color: '#94A3B8' }}>
                      <i className="fa-solid fa-cloud-arrow-up" style={{ fontSize: '1.5rem' }}></i>
                      <div style={{ fontSize: '0.7rem', marginTop: '0.4rem', fontWeight: '600' }}>UPLOAD</div>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageUpload} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} title="Upload Product Image" />
                </div>
                
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>Product Name *</label>
                    <input type="text" name="name" value={formData.name} placeholder="Enter product name" onChange={handleChange} required style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#fff', color: '#0F172A', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }} />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>SKU / Batch Number</label>
                    <input type="text" name="sku" value={formData.sku} placeholder="E.g. ITEM-1234" onChange={handleChange} style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#fff', color: '#0F172A', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '1.2rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>B2B Price ($) *</label>
                  <input type="number" name="price" value={formData.price} placeholder="0.00" step="0.01" onChange={handleChange} required style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#fff', color: '#0F172A', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>MSRP ($) (Optional)</label>
                  <input type="number" name="originalPrice" value={formData.originalPrice} placeholder="0.00" step="0.01" onChange={handleChange} style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#fff', color: '#0F172A', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '1.2rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>Initial Stock *</label>
                  <input type="number" name="stock" value={formData.stock} placeholder="100" onChange={handleChange} required style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#fff', color: '#0F172A', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>Minimum Order Qty *</label>
                  <input type="number" name="moq" value={formData.moq} placeholder="1" onChange={handleChange} required style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#fff', color: '#0F172A', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '1.2rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>Weight (kg) per unit *</label>
                  <input type="number" name="weight" value={formData.weight} placeholder="1" step="0.1" onChange={handleChange} required style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#fff', color: '#0F172A', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>Size / Variant</label>
                  <input type="text" name="size" value={formData.size} placeholder="e.g. L, XL, 1kg pack" onChange={handleChange} style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#fff', color: '#0F172A', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>Description</label>
                <textarea name="description" value={formData.description} placeholder="Product details..." onChange={handleChange} style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#fff', color: '#0F172A', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }}></textarea>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', paddingTop: '1.5rem', borderTop: '1px solid #E2E8F0' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '0.8rem', background: '#fff', border: '1px solid #CBD5E1', color: '#475569', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: '0.8rem', background: '#0F172A', border: 'none', color: '#fff', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>{editingProductId ? 'Update Product' : 'Save Product'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
