import { useState, useEffect } from 'react';
import api from '../../../services/api';

export default function BookingsManager() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a full implementation, add GET /api/v1/bookings (admin protected)
    // For now show a placeholder with info
    setLoading(false);
  }, []);

  return (
    <div className="admin-panel-content">
      <div className="admin-editor-header">
        <h2 className="admin-editor-title"><i className="fa-solid fa-calendar-check"></i> Pickup Booking Requests</h2>
      </div>
      <div className="admin-info-box">
        <i className="fa-solid fa-circle-info"></i>
        <div>
          Pickup booking requests submitted via the <strong>Book Pickup</strong> page are saved to MongoDB. To view them here, add <code>GET /api/v1/bookings</code> (admin-protected) to the backend and connect it to this panel.
        </div>
      </div>
      <div className="admin-coming-soon">
        <i className="fa-solid fa-calendar-check" style={{ fontSize: '3rem', color: 'var(--accent-teal)', marginBottom: '1rem' }}></i>
        <h3>Bookings Manager</h3>
        <p>All pickup bookings from the website are stored in MongoDB. Connect the admin list API to view, approve, and manage them here.</p>
      </div>
    </div>
  );
}
