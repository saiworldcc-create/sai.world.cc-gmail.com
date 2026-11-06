import { useUser } from '../../context/UserContext';
import { useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getUserShipments, getUserEcomOrders, cancelUserEcomOrder } from '../../services/api';

export default function UserDashboard() {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [shipments, setShipments] = useState([]);
  const [ecomOrders, setEcomOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      Promise.all([
        getUserShipments().catch(() => ({ success: false, data: [] })),
        getUserEcomOrders().catch(() => ({ success: false, data: [] }))
      ])
        .then(([shipmentsRes, ordersRes]) => {
          if (shipmentsRes && shipmentsRes.success) setShipments(shipmentsRes.data || []);
          if (ordersRes && ordersRes.success) setEcomOrders(ordersRes.data || []);
          setLoading(false);
        })
        .catch(err => {
          console.error('Failed to load dashboard data:', err);
          setLoading(false);
        });
    }
  }, [user]);

  const handleLogout = () => {
    logout();
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      const res = await cancelUserEcomOrder(orderId);
      if (res && res.success) {
        setEcomOrders(ecomOrders.map(o => o._id === orderId ? { ...o, status: 'cancelled' } : o));
      }
    } catch {
      alert('Failed to cancel order.');
    }
  };

  if (!user) return null;

  return (
    <div className="section" style={{ minHeight: 'calc(100vh - 80px)', paddingTop: '120px' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ color: 'var(--text-slate-dark)', margin: 0, fontSize: '1.75rem' }}>Welcome, {user.name}</h1>
            <p style={{ color: 'var(--text-slate-muted)', margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>Account ID: {user.email}</p>
          </div>
          <button onClick={handleLogout} className="btn btn-outline-slate btn-sm">Sign Out</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1.5rem' }}>
          {/* Shipments Section */}
          <div style={{ background: 'var(--bg-card-tint)', padding: 'clamp(1rem, 3vw, 2rem)', borderRadius: '12px', border: '1px solid var(--border-light)', gridColumn: '1 / -1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h3 style={{ margin: 0, color: 'var(--accent-teal)' }}>
                <i className="fa-solid fa-box-archive" style={{ marginRight: '8px' }}></i> Shipment History
              </h3>
              <button className="btn btn-primary btn-sm" onClick={() => navigate('/book-pickup')}>
                <i className="fa-solid fa-plus"></i> New Pickup Request
              </button>
            </div>
            
            {loading ? (
              <p style={{ color: 'var(--text-slate-muted)' }}>Loading consignment records...</p>
            ) : shipments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', background: '#F8FAFC', borderRadius: '8px', border: '1px dashed var(--border-light)' }}>
                <h4 style={{ color: 'var(--text-slate-dark)', marginBottom: '0.5rem' }}>No active consignments found</h4>
                <p style={{ color: 'var(--text-slate-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Book your first international shipment or doorstep pickup online.</p>
                <button className="btn btn-coral" onClick={() => navigate('/book-pickup')}>Schedule Pickup Now</button>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border-light)', textAlign: 'left', color: 'var(--text-slate-muted)' }}>
                      <th style={{ padding: '0.85rem 0.5rem' }}>AWB Track ID</th>
                      <th style={{ padding: '0.85rem 0.5rem' }}>Date Booked</th>
                      <th style={{ padding: '0.85rem 0.5rem' }}>Route</th>
                      <th style={{ padding: '0.85rem 0.5rem' }}>Consignment Status</th>
                      <th style={{ padding: '0.85rem 0.5rem' }}>Payment</th>
                      <th style={{ padding: '0.85rem 0.5rem', textAlign: 'right' }}>Official Documents</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shipments.map((s) => (
                      <tr key={s._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                        <td style={{ padding: '0.85rem 0.5rem', fontWeight: 'bold' }}>
                          <Link to={`/tracking?awb=${s.awb}`} style={{ color: 'var(--accent-teal)' }}>{s.awb}</Link>
                        </td>
                        <td style={{ padding: '0.85rem 0.5rem', color: 'var(--text-slate-dark)' }}>
                          {new Date(s.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                        <td style={{ padding: '0.85rem 0.5rem' }}>
                          AP (India) &rarr; {s.destCountry}
                        </td>
                        <td style={{ padding: '0.85rem 0.5rem' }}>
                          <span style={{ 
                            background: s.status === 'Delivered' ? '#D1FAE5' : s.status === 'Pending' ? '#FEF3C7' : '#DBEAFE', 
                            color: s.status === 'Delivered' ? '#065F46' : s.status === 'Pending' ? '#92400E' : '#1E40AF', 
                            padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 
                          }}>
                            {s.status}
                          </span>
                        </td>
                        <td style={{ padding: '0.85rem 0.5rem' }}>
                          {s.paymentStatus === 'Paid' ? (
                            <span style={{ background: '#D1FAE5', color: '#065F46', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>
                              Paid (₹{s.paymentAmount || 0})
                            </span>
                          ) : (
                            <Link to={`/pay-online?awb=${s.awb}&amount=${s.paymentAmount || 5400}`} style={{ background: '#FEE2E2', color: '#991B1B', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none' }}>
                              Pay Online
                            </Link>
                          )}
                        </td>
                        <td style={{ padding: '0.85rem 0.5rem', textAlign: 'right' }}>
                          <a 
                            href={`http://localhost:5000/api/v1/pdf/awb/${s.awb}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="btn btn-outline-slate btn-sm" 
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                          >
                            <i className="fa-solid fa-file-pdf"></i> Download AWB
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Store Orders Section */}
          <div style={{ background: 'var(--bg-card-tint)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-light)', gridColumn: '1 / -1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h3 style={{ margin: 0, color: 'var(--accent-teal)' }}>
                <i className="fa-solid fa-cart-shopping" style={{ marginRight: '8px' }}></i> Store Orders & Procurements
              </h3>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button className="btn btn-secondary btn-sm" onClick={() => navigate('/dashboard/rfq')}>
                  <i className="fa-solid fa-file-invoice-dollar"></i> My RFQs
                </button>
                <button className="btn btn-primary btn-sm" onClick={() => navigate('/ecommerce-logistics')}>
                  <i className="fa-solid fa-store"></i> Browse Catalog
                </button>
              </div>
            </div>

            {loading ? (
              <p style={{ color: 'var(--text-slate-muted)' }}>Loading store orders...</p>
            ) : ecomOrders.length === 0 ? (
              <p style={{ color: 'var(--text-slate-muted)' }}>No wholesale or retail orders placed yet.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border-light)', textAlign: 'left', color: 'var(--text-slate-muted)' }}>
                      <th style={{ padding: '0.85rem 0.5rem' }}>Order ID</th>
                      <th style={{ padding: '0.85rem 0.5rem' }}>Date Placed</th>
                      <th style={{ padding: '0.85rem 0.5rem' }}>Items</th>
                      <th style={{ padding: '0.85rem 0.5rem' }}>Order Status</th>
                      <th style={{ padding: '0.85rem 0.5rem' }}>Total Amount</th>
                      <th style={{ padding: '0.85rem 0.5rem', textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ecomOrders.map((order) => (
                      <tr key={order._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                        <td style={{ padding: '0.85rem 0.5rem', fontWeight: 'bold' }}>
                          <Link to={`/tracking?awb=${order.orderNumber}`} style={{ color: 'var(--accent-teal)' }}>{order.orderNumber}</Link>
                        </td>
                        <td style={{ padding: '0.85rem 0.5rem', color: 'var(--text-slate-dark)' }}>
                          {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                        <td style={{ padding: '0.85rem 0.5rem', color: 'var(--text-slate-dark)' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                            {(order.items || []).map((item, idx) => (
                              <span key={idx} style={{ fontSize: '0.8rem' }}>{item.qty || item.quantity}x {item.name}</span>
                            ))}
                          </div>
                        </td>
                        <td style={{ padding: '0.85rem 0.5rem' }}>
                          <span style={{ 
                            background: order.status === 'delivered' ? '#D1FAE5' : order.status === 'cancelled' ? '#FEE2E2' : '#DBEAFE', 
                            color: order.status === 'delivered' ? '#065F46' : order.status === 'cancelled' ? '#991B1B' : '#1E40AF', 
                            padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600, textTransform: 'capitalize' 
                          }}>
                            {order.status}
                          </span>
                        </td>
                        <td style={{ padding: '0.85rem 0.5rem', color: 'var(--text-slate-dark)', fontWeight: 'bold' }}>
                          ₹{order.total}
                        </td>
                        <td style={{ padding: '0.85rem 0.5rem', textAlign: 'right' }}>
                          {(order.status === 'pending' || order.status === 'confirmed') ? (
                            <button onClick={() => handleCancelOrder(order._id)} className="btn btn-outline-slate btn-sm" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', borderColor: '#EF4444', color: '#EF4444' }}>
                              Cancel Order
                            </button>
                          ) : (
                            <span style={{ color: 'var(--text-slate-muted)', fontSize: '0.8rem' }}>-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
