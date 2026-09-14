import { useUser } from '../../context/UserContext';
import { useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getUserShipments } from '../../services/api';

export default function UserDashboard() {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      getUserShipments()
        .then(res => {
          if (res.success) setShipments(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="section" style={{ minHeight: 'calc(100vh - 80px)', paddingTop: '120px' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ color: 'var(--text-slate-dark)' }}>Welcome back, {user.name}</h1>
          <button onClick={handleLogout} className="btn btn-outline">Sign Out</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <div style={{ background: 'var(--bg-card-tint)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-light)', gridColumn: '1 / -1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, color: 'var(--accent-teal)' }}><i className="fa-solid fa-box-open"></i> Shipment History</h3>
              <button className="btn btn-primary btn-sm" onClick={() => navigate('/book-pickup')}><i className="fa-solid fa-plus"></i> New Pickup</button>
            </div>
            
            {loading ? (
              <p style={{ color: 'var(--text-slate-muted)' }}><i className="fa-solid fa-spinner fa-spin"></i> Loading your shipments...</p>
            ) : shipments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', background: 'var(--bg-body)', borderRadius: '8px', border: '1px dashed var(--border-light)' }}>
                <div style={{ fontSize: '3rem', color: 'var(--border-light)', marginBottom: '1rem' }}><i className="fa-solid fa-box-archive"></i></div>
                <h4 style={{ color: 'var(--text-slate-dark)', marginBottom: '0.5rem' }}>No active shipments yet</h4>
                <p style={{ color: 'var(--text-slate-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Book your first international parcel pickup today.</p>
                <button className="btn btn-coral" onClick={() => navigate('/book-pickup')}>Schedule Pickup Now</button>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border-light)', textAlign: 'left', color: 'var(--text-slate-muted)' }}>
                      <th style={{ padding: '1rem 0.5rem' }}>AWB Track ID</th>
                      <th style={{ padding: '1rem 0.5rem' }}>Date Booked</th>
                      <th style={{ padding: '1rem 0.5rem' }}>Route</th>
                      <th style={{ padding: '1rem 0.5rem' }}>Logistics Status</th>
                      <th style={{ padding: '1rem 0.5rem' }}>Payment</th>
                      <th style={{ padding: '1rem 0.5rem', textAlign: 'right' }}>Invoice</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shipments.map((s) => (
                      <tr key={s._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                        <td style={{ padding: '1rem 0.5rem', fontWeight: 'bold' }}>
                          <Link to={`/tracking?awb=${s.awb}`} style={{ color: 'var(--accent-teal)' }}>{s.awb}</Link>
                        </td>
                        <td style={{ padding: '1rem 0.5rem', color: 'var(--text-slate-dark)' }}>
                          {new Date(s.createdAt).toLocaleDateString('en-GB')}
                        </td>
                        <td style={{ padding: '1rem 0.5rem' }}>
                          🇮🇳 AP ➔ {s.destCountry === 'USA' ? '🇺🇸' : s.destCountry === 'UK' ? '🇬🇧' : s.destCountry === 'Canada' ? '🇨🇦' : s.destCountry === 'Australia' ? '🇦🇺' : s.destCountry === 'UAE' ? '🇦🇪' : '🌍'} {s.destCountry}
                        </td>
                        <td style={{ padding: '1rem 0.5rem' }}>
                          <span style={{ 
                            background: s.status === 'Delivered' ? '#D1FAE5' : s.status === 'Pending' ? '#FEF3C7' : '#DBEAFE', 
                            color: s.status === 'Delivered' ? '#065F46' : s.status === 'Pending' ? '#92400E' : '#1E40AF', 
                            padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 
                          }}>
                            {s.status}
                          </span>
                        </td>
                        <td style={{ padding: '1rem 0.5rem' }}>
                          <span style={{ 
                            background: s.paymentStatus === 'Paid' ? '#D1FAE5' : '#FEE2E2', 
                            color: s.paymentStatus === 'Paid' ? '#065F46' : '#991B1B', 
                            padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 
                          }}>
                            {s.paymentStatus || 'Unpaid'}
                          </span>
                        </td>
                        <td style={{ padding: '1rem 0.5rem', textAlign: 'right' }}>
                          <button 
                            onClick={() => {
                              // Minimal print window hack for invoice
                              const printWindow = window.open('', '_blank');
                              printWindow.document.write(`
                                <html>
                                <head><title>Invoice - ${s.awb}</title></head>
                                <body style="font-family: Arial, sans-serif; padding: 40px; color: #333;">
                                  <h1 style="color: #3C9290;">SAI INTERNATIONAL COURIERS</h1>
                                  <h2>Commercial Invoice / Receipt</h2>
                                  <hr/>
                                  <p><strong>AWB Number:</strong> ${s.awb}</p>
                                  <p><strong>Date:</strong> ${new Date(s.createdAt).toLocaleString()}</p>
                                  <p><strong>Sender:</strong> ${s.senderName} (${s.senderPhone})</p>
                                  <p><strong>Receiver:</strong> ${s.receiverName} (${s.receiverPhone}) - ${s.destCountry}</p>
                                  <p><strong>Category:</strong> ${s.itemCategory} (${s.estimatedWeight})</p>
                                  <br/>
                                  <p><strong>Status:</strong> ${s.status}</p>
                                  <p><strong>Payment Status:</strong> ${s.paymentStatus || 'Unpaid'}</p>
                                  <hr/>
                                  <p style="font-size: 12px; color: #777;">Thank you for choosing Sai International Couriers. This is a computer generated document.</p>
                                </body>
                                </html>
                              `);
                              printWindow.document.close();
                              printWindow.focus();
                              setTimeout(() => { printWindow.print(); printWindow.close(); }, 500);
                            }}
                            className="btn btn-outline btn-sm" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                          >
                            <i className="fa-solid fa-file-pdf"></i> PDF
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div style={{ background: 'var(--bg-card-tint)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--accent-teal)' }}><i className="fa-solid fa-address-book"></i> Address Book</h3>
            <p style={{ color: 'var(--text-slate-muted)' }}>No saved addresses.</p>
            <button className="btn btn-outline" style={{ marginTop: '1rem' }}>+ Add Address</button>
          </div>

        </div>
      </div>
    </div>
  );
}
