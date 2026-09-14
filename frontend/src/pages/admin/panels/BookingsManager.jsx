import { useState, useEffect } from 'react';
import { getAdminBookings, updateAdminBooking } from '../../../services/api';
import { useAdminAuth } from '../../../context/AdminAuthContext';

export default function BookingsManager() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { admin } = useAdminAuth();

  const fetchBookings = async () => {
    try {
      const res = await getAdminBookings();
      if (res.success) {
        setBookings(res.bookings);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    // Poll every 10 seconds for real-time feel
    const interval = setInterval(fetchBookings, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await updateAdminBooking(id, { status: newStatus, updatedBy: admin.name });
      if (res.success) {
        fetchBookings(); // Refresh list
      }
    } catch (err) {
      alert(err.message || 'Failed to update status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return { bg: '#FEF3C7', color: '#92400E' }; // Yellow
      case 'Confirmed': return { bg: '#DBEAFE', color: '#1E40AF' }; // Blue
      case 'Picked Up': return { bg: '#E0E7FF', color: '#4338CA' }; // Indigo
      case 'In Transit': return { bg: '#F3E8FF', color: '#7E22CE' }; // Purple
      case 'Delivered': return { bg: '#DCFCE7', color: '#166534' }; // Green
      case 'Cancelled': return { bg: '#FEE2E2', color: '#991B1B' }; // Red
      default: return { bg: '#F1F5F9', color: '#475569' }; // Gray
    }
  };

  return (
    <div className="admin-panel-content">
      <div className="admin-editor-header">
        <h2 className="admin-editor-title"><i className="fa-solid fa-calendar-check"></i> Pickup Booking Requests</h2>
        <button onClick={fetchBookings} className="admin-btn admin-btn-outline admin-btn-sm">
          <i className="fa-solid fa-rotate-right"></i> Refresh
        </button>
      </div>

      <div className="admin-info-box">
        <i className="fa-solid fa-circle-info"></i>
        <div>
          <strong>Live Order Feed:</strong> New customer pickup bookings appear here automatically. You can update their status here, which will immediately reflect on the public Tracking Page!
        </div>
      </div>

      {error && (
        <div style={{ padding: '1rem', background: '#FDEDEC', color: '#E74C3C', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #FADBD8' }}>
          <i className="fa-solid fa-circle-exclamation"></i> {error}
        </div>
      )}

      <div style={{ background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-light)', overflowX: 'auto' }}>
        {loading && bookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-slate-muted)' }}>
            <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2rem', marginBottom: '1rem' }}></i>
            <p>Loading active bookings...</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-light)', textAlign: 'left', background: 'rgba(0,0,0,0.02)' }}>
                <th style={{ padding: '1rem', color: 'var(--text-slate-muted)' }}>AWB / Date</th>
                <th style={{ padding: '1rem', color: 'var(--text-slate-muted)' }}>Sender Details</th>
                <th style={{ padding: '1rem', color: 'var(--text-slate-muted)' }}>Destination</th>
                <th style={{ padding: '1rem', color: 'var(--text-slate-muted)' }}>Category / Weight</th>
                <th style={{ padding: '1rem', color: 'var(--text-slate-muted)' }}>Status Update</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => {
                const statusStyle = getStatusColor(booking.status);
                return (
                  <tr key={booking._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '1rem' }}>
                      <strong style={{ color: 'var(--accent-teal)', fontSize: '1.05rem', display: 'block', marginBottom: '0.25rem' }}>{booking.awb}</strong>
                      <span style={{ color: 'var(--text-slate-muted)', fontSize: '0.8rem' }}>
                        {new Date(booking.createdAt).toLocaleString()}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <strong style={{ color: 'var(--text-slate-dark)' }}>{booking.senderName}</strong><br />
                      <a href={`tel:${booking.senderPhone}`} style={{ color: '#0056B3', textDecoration: 'none' }}>{booking.senderPhone}</a><br />
                      <span style={{ color: 'var(--text-slate-muted)', fontSize: '0.8rem' }}>{booking.branchZone}</span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <strong style={{ color: 'var(--text-slate-dark)', fontSize: '1rem' }}>{booking.destCountry}</strong><br />
                      <span style={{ color: 'var(--text-slate-muted)' }}>To: {booking.receiverName}</span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <strong style={{ color: 'var(--text-slate-dark)' }}>{booking.itemCategory}</strong><br />
                      <span style={{ color: 'var(--text-slate-muted)' }}>{booking.estimatedWeight}</span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <select 
                          className="form-input" 
                          style={{ padding: '0.4rem', fontSize: '0.85rem', width: '130px', background: statusStyle.bg, color: statusStyle.color, border: 'none', fontWeight: 600 }}
                          value={booking.status}
                          onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Picked Up">Picked Up</option>
                          <option value="In Transit">In Transit</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {bookings.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-slate-muted)' }}>
                    No pickup bookings found in the database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
