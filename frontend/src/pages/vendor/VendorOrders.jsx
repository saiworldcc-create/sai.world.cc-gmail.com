import React, { useEffect, useState } from 'react';
import api from '../../services/api';

export default function VendorOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/vendor/orders');
      setOrders(res.orders || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const markAsPacked = async (id) => {
    if (!window.confirm('Mark this B2B order as packed? This will automatically schedule a pickup with Sai Couriers.')) return;
    try {
      await api.patch(`/vendor/orders/${id}/status`, { status: 'Packed' });
      fetchOrders();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const acceptOrder = async (id) => {
    try {
      await api.patch(`/vendor/orders/${id}/status`, { status: 'Confirmed' });
      fetchOrders();
    } catch (err) {
      alert('Failed to confirm order');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="vendor-fade-in" style={{ padding: '0', maxWidth: '1200px', margin: '0 auto', fontFamily: "'Inter', sans-serif", color: '#0F172A' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '700' }}>Order Fulfillment</h2>
          <p style={{ margin: '0.3rem 0 0 0', color: '#64748B' }}>Manage and fulfill incoming B2B purchase orders.</p>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', overflow: 'hidden', border: '1px solid #E2E8F0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0' }}>
            <tr>
              <th style={{ padding: '1rem 1.5rem', color: '#475569', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>PO Number</th>
              <th style={{ padding: '1rem 1.5rem', color: '#475569', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Date</th>
              <th style={{ padding: '1rem 1.5rem', color: '#475569', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Buyer</th>
              <th style={{ padding: '1rem 1.5rem', color: '#475569', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Grand Total</th>
              <th style={{ padding: '1rem 1.5rem', color: '#475569', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</th>
              <th style={{ padding: '1rem 1.5rem', color: '#475569', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: '3rem 1.5rem', textAlign: 'center', color: '#64748B' }}>
                  <div style={{ fontSize: '2.5rem', color: '#CBD5E1', marginBottom: '1rem' }}><i className="fa-solid fa-receipt"></i></div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '500', color: '#334155' }}>No purchase orders received yet</div>
                </td>
              </tr>
            ) : (
              orders.map(order => (
                <tr key={order._id} style={{ borderBottom: '1px solid #E2E8F0', transition: 'background 0.2s', ':hover': { background: '#F8FAFC' } }}>
                  <td style={{ padding: '1.2rem 1.5rem', color: '#0F172A', fontWeight: '700', fontFamily: 'monospace', fontSize: '1.05rem' }}>{order.poNumber}</td>
                  <td style={{ padding: '1.2rem 1.5rem', color: '#475569' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '1.2rem 1.5rem' }}>
                    <div style={{ fontWeight: '600', color: '#0F172A' }}>{order.buyer?.name}</div>
                    <div style={{ fontSize: '0.85rem', color: '#64748B' }}>{order.buyer?.email}</div>
                  </td>
                  <td style={{ padding: '1.2rem 1.5rem', color: '#10B981', fontWeight: '700', fontSize: '1.1rem' }}>${order.financials?.grandTotal}</td>
                  <td style={{ padding: '1.2rem 1.5rem' }}>
                    <span style={{ 
                      padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '700',
                      background: order.status === 'Packed' ? '#E0F2FE' : order.status === 'Confirmed' ? '#FEF3C7' : order.status === 'Pending Approval' ? '#FEE2E2' : '#F1F5F9',
                      color: order.status === 'Packed' ? '#0369A1' : order.status === 'Confirmed' ? '#92400E' : order.status === 'Pending Approval' ? '#991B1B' : '#475569',
                      border: `1px solid ${order.status === 'Packed' ? '#BAE6FD' : order.status === 'Confirmed' ? '#FDE68A' : order.status === 'Pending Approval' ? '#FECACA' : '#E2E8F0'}`
                    }}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{ padding: '1.2rem 1.5rem', textAlign: 'center' }}>
                    <button onClick={() => setSelectedOrder(order)} style={{ background: '#F1F5F9', color: '#0F172A', border: '1px solid #CBD5E1', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '0.85rem', transition: 'all 0.2s' }}>
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: '#fff', borderRadius: '20px', width: '100%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            
            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC', borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.3rem', color: '#0F172A', fontWeight: '700' }}>Order #{selectedOrder.poNumber}</h3>
                <p style={{ margin: '0.2rem 0 0 0', color: '#64748B', fontSize: '0.9rem' }}>Placed on {new Date(selectedOrder.createdAt).toLocaleString()}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} style={{ background: 'transparent', border: 'none', fontSize: '1.5rem', color: '#94A3B8', cursor: 'pointer' }}>&times;</button>
            </div>

            <div style={{ padding: '2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                <div style={{ background: '#F8FAFC', padding: '1.2rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <h4 style={{ margin: '0 0 0.8rem 0', color: '#475569', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}><i className="fa-solid fa-user"></i> Buyer Information</h4>
                  <div style={{ fontWeight: '700', color: '#0F172A', fontSize: '1.1rem' }}>{selectedOrder.buyer?.name}</div>
                  <div style={{ color: '#64748B', marginTop: '0.2rem' }}>{selectedOrder.buyer?.email}</div>
                  <div style={{ color: '#64748B' }}>{selectedOrder.shippingAddress?.phone}</div>
                </div>

                <div style={{ background: '#F8FAFC', padding: '1.2rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <h4 style={{ margin: '0 0 0.8rem 0', color: '#475569', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}><i className="fa-solid fa-location-dot"></i> Shipping Address</h4>
                  <div style={{ color: '#0F172A', lineHeight: '1.5' }}>
                    <strong>{selectedOrder.shippingAddress?.name}</strong><br/>
                    {selectedOrder.shippingAddress?.address}<br/>
                    {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.zipCode}<br/>
                    {selectedOrder.shippingAddress?.country}
                  </div>
                </div>
              </div>

              <h4 style={{ margin: '0 0 1rem 0', color: '#0F172A', fontSize: '1.1rem', borderBottom: '2px solid #E2E8F0', paddingBottom: '0.5rem' }}>Order Items</h4>
              <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden', marginBottom: '2rem' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                    <tr>
                      <th style={{ padding: '0.8rem 1rem', textAlign: 'left', color: '#475569', fontSize: '0.85rem' }}>Item</th>
                      <th style={{ padding: '0.8rem 1rem', textAlign: 'center', color: '#475569', fontSize: '0.85rem' }}>Qty</th>
                      <th style={{ padding: '0.8rem 1rem', textAlign: 'right', color: '#475569', fontSize: '0.85rem' }}>Price</th>
                      <th style={{ padding: '0.8rem 1rem', textAlign: 'right', color: '#475569', fontSize: '0.85rem' }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items?.map((item, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #E2E8F0' }}>
                        <td style={{ padding: '1rem', color: '#0F172A', fontWeight: '500' }}>
                          {item.name} <span style={{ color: '#94A3B8', fontSize: '0.85rem', marginLeft: '0.5rem' }}>({item.sku})</span>
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'center', color: '#0F172A' }}>{item.quantity}</td>
                        <td style={{ padding: '1rem', textAlign: 'right', color: '#64748B' }}>${item.unitPrice}</td>
                        <td style={{ padding: '1rem', textAlign: 'right', color: '#0F172A', fontWeight: '600' }}>${item.totalPrice}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC', padding: '1.5rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <div>
                  <div style={{ fontSize: '0.9rem', color: '#64748B' }}>Platform Fee: <span style={{ color: '#EF4444' }}>-${selectedOrder.financials?.platformFee}</span></div>
                  <div style={{ fontSize: '0.9rem', color: '#64748B' }}>Your Net Earnings: <span style={{ color: '#10B981', fontWeight: 'bold' }}>${selectedOrder.financials?.vendorEarnings}</span></div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.85rem', color: '#64748B', textTransform: 'uppercase', fontWeight: '700' }}>Gross Total</div>
                  <div style={{ fontSize: '1.8rem', color: '#0F172A', fontWeight: '800' }}>${selectedOrder.financials?.grandTotal}</div>
                </div>
              </div>

              <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end', paddingTop: '1.5rem', borderTop: '1px solid #E2E8F0' }}>
                <button onClick={() => setSelectedOrder(null)} style={{ padding: '0.8rem 1.5rem', background: '#fff', border: '1px solid #CBD5E1', color: '#475569', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Close</button>
                
                {selectedOrder.status === 'Pending Approval' && (
                  <button onClick={() => { acceptOrder(selectedOrder._id); setSelectedOrder(null); }} style={{ padding: '0.8rem 1.5rem', background: '#10B981', border: 'none', color: '#fff', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <i className="fa-solid fa-check"></i> Accept Order
                  </button>
                )}
                
                {selectedOrder.status === 'Confirmed' && (
                  <button onClick={() => { markAsPacked(selectedOrder._id); setSelectedOrder(null); }} style={{ padding: '0.8rem 1.5rem', background: '#0284C7', border: 'none', color: '#fff', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <i className="fa-solid fa-box"></i> Mark as Packed
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
