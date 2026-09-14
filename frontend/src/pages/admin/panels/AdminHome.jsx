import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { getAllContentPages } from '../../../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAdminAuth } from '../../../context/AdminAuthContext';

// Mock chart data (since we don't have historical data in the DB yet)
const CHART_DATA = [
  { name: 'Mon', bookings: 4 },
  { name: 'Tue', bookings: 3 },
  { name: 'Wed', bookings: 6 },
  { name: 'Thu', bookings: 2 },
  { name: 'Fri', bookings: 8 },
  { name: 'Sat', bookings: 5 },
  { name: 'Sun', bookings: 7 },
];

const QUICK_PAGES = [
  { key: 'branding', label: 'Branding & Logo', icon: 'fa-palette', link: '/admin/branding' },
  { key: 'home', label: 'Home Page', icon: 'fa-house' },
  { key: 'about', label: 'About Page', icon: 'fa-circle-info' },
  { key: 'services', label: 'Services Page', icon: 'fa-boxes-stacking' },
  { key: 'food-shipping', label: 'Food Shipping', icon: 'fa-jar' },
  { key: 'contact', label: 'Contact Page', icon: 'fa-envelope' },
  { key: 'branches', label: 'Branches Page', icon: 'fa-location-dot' },
  { key: 'tracking', label: 'Tracking Page', icon: 'fa-satellite-dish' },
  { key: 'calculator', label: 'Rate Calculator', icon: 'fa-calculator' },
  { key: 'customs-guide', label: 'Customs Guide', icon: 'fa-file-shield' },
  { key: 'book-pickup', label: 'Book Pickup', icon: 'fa-truck-fast' },
];

export default function AdminHome() {
  const { admin } = useAdminAuth();
  const isSuperAdmin = admin?.role === 'super-admin';
  const [pages, setPages] = useState([]);
  const [stats, setStats] = useState({
    totalBookings: 0,
    activeShipments: 0,
    totalShipments: 0,
    unreadMessages: 0,
    recentBookings: []
  });

  useEffect(() => {
    getAllContentPages().then(res => setPages(res.data || [])).catch(() => {});
    
    // Poll stats every 10 seconds for real-time feel
    const fetchStats = async () => {
      try {
        const res = await axios.get('/api/v1/admin/stats');
        if (res.data.success) {
          setStats(res.data.stats);
        }
      } catch (err) {
        console.error('Failed to fetch stats', err);
      }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="admin-panel-content">
      {/* Welcome */}
      <div className="admin-welcome-banner">
        <div>
          <h2>Welcome to Sai Couriers CMS</h2>
          <p>Manage all website content, images, shipments, and bookings from this dashboard.</p>
        </div>
        {isSuperAdmin && (
          <Link to="/admin/pages/home" className="admin-btn admin-btn-primary">
            <i className="fa-solid fa-pencil"></i> Edit Home Page
          </Link>
        )}
      </div>

      {/* Stat Cards */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-icon" style={{ background: '#3C929018', color: '#3C9290' }}>
            <i className="fa-solid fa-calendar-check"></i>
          </div>
          <div>
            <div className="admin-stat-value">{stats.totalBookings}</div>
            <div className="admin-stat-label">Total Bookings</div>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon" style={{ background: '#E9785618', color: '#E97856' }}>
            <i className="fa-solid fa-truck-fast"></i>
          </div>
          <div>
            <div className="admin-stat-value">{stats.activeShipments}</div>
            <div className="admin-stat-label">Active Shipments</div>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon" style={{ background: '#27AE6018', color: '#27AE60' }}>
            <i className="fa-solid fa-box-archive"></i>
          </div>
          <div>
            <div className="admin-stat-value">{stats.totalShipments}</div>
            <div className="admin-stat-label">Total Shipments</div>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon" style={{ background: '#D5A85F18', color: '#D5A85F' }}>
            <i className="fa-solid fa-envelope"></i>
          </div>
          <div>
            <div className="admin-stat-value">{stats.unreadMessages}</div>
            <div className="admin-stat-label">Unread Messages</div>
          </div>
        </div>
      </div>

      {/* Analytics Chart */}
      <div className="admin-section-title" style={{ marginTop: '2rem' }}>
        <i className="fa-solid fa-chart-line"></i> Analytics Overview
      </div>
      <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-light)', marginBottom: '2rem', height: '300px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={CHART_DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" vertical={false} />
            <XAxis dataKey="name" stroke="var(--text-slate-muted)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="var(--text-slate-muted)" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ background: 'var(--bg-card-tint)', border: '1px solid var(--border-light)', borderRadius: '8px', color: 'var(--text-slate-dark)' }} 
              itemStyle={{ color: 'var(--accent-teal)' }}
            />
            <Line type="monotone" dataKey="bookings" stroke="var(--accent-teal)" strokeWidth={3} dot={{ r: 4, fill: 'var(--accent-teal)', strokeWidth: 2, stroke: 'var(--bg-card)' }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Hotspots / Recent Bookings */}
      <div className="admin-section-title" style={{ marginTop: '2.5rem' }}>
        <i className="fa-solid fa-location-dot"></i> Recent Pickup Hotspots
      </div>
      <div style={{ background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-light)', overflow: 'hidden', marginBottom: '2rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead style={{ background: 'var(--bg-card-tint)', borderBottom: '1px solid var(--border-light)' }}>
            <tr>
              <th style={{ padding: '1rem', color: 'var(--text-slate-muted)' }}>Customer</th>
              <th style={{ padding: '1rem', color: 'var(--text-slate-muted)' }}>AWB / Branch</th>
              <th style={{ padding: '1rem', color: 'var(--text-slate-muted)' }}>Location / Coordinates</th>
              <th style={{ padding: '1rem', color: 'var(--text-slate-muted)' }}>Map Link</th>
            </tr>
          </thead>
          <tbody>
            {stats.recentBookings && stats.recentBookings.length > 0 ? (
              stats.recentBookings.map(b => (
                <tr key={b._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '1rem', color: 'var(--text-slate-dark)' }}>{b.senderName}<br/><span style={{fontSize: '0.8rem', color: 'var(--text-slate-muted)'}}>{b.senderPhone}</span></td>
                  <td style={{ padding: '1rem', color: 'var(--text-slate-dark)' }}>
                    <span style={{ color: 'var(--accent-teal)', fontWeight: 'bold' }}>{b.awb}</span><br/>
                    <span style={{fontSize: '0.8rem', color: 'var(--text-slate-muted)'}}>{b.branchZone}</span>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-slate-dark)' }}>
                    <div style={{ maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={b.senderAddress}>{b.senderAddress}</div>
                    {b.location?.lat && (
                      <span style={{fontSize: '0.75rem', background: '#E9785615', color: '#E97856', padding: '2px 6px', borderRadius: '4px'}}>
                        GPS: {b.location.lat.toFixed(4)}, {b.location.lng.toFixed(4)}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {b.location?.lat ? (
                      <a href={`https://www.google.com/maps/search/?api=1&query=${b.location.lat},${b.location.lng}`} target="_blank" rel="noreferrer" style={{color: 'var(--accent-coral)', textDecoration: 'none', fontWeight: 'bold'}}>
                        <i className="fa-solid fa-map-location-dot"></i> View on Map
                      </a>
                    ) : (
                      <span style={{ color: 'var(--text-slate-muted)', fontSize: '0.85rem' }}>Manual Address</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-slate-muted)' }}>No recent pickup requests found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Quick Edit Pages (Super Admin Only) */}
      {isSuperAdmin && (
        <>
          <div className="admin-section-title">
            <i className="fa-solid fa-file-pen"></i> Quick Page Editor
          </div>
          <div className="admin-pages-grid">
            {QUICK_PAGES.map(page => {
              const dbPage = pages.find(p => p.page === page.key);
              return (
                <Link key={page.key} to={page.link || `/admin/pages/${page.key}`} className="admin-page-card">
                  <div className="admin-page-icon">
                    <i className={`fa-solid ${page.icon}`}></i>
                  </div>
                  <div className="admin-page-info">
                    <div className="admin-page-name">{page.label}</div>
                    <div className="admin-page-updated">
                      {dbPage ? `Updated: ${new Date(dbPage.updatedAt).toLocaleDateString('en-IN')}` : 'Not synced yet'}
                    </div>
                  </div>
                  <i className="fa-solid fa-chevron-right admin-page-arrow"></i>
                </Link>
              );
            })}
          </div>

          {/* Info */}
          <div className="admin-info-box">
            <i className="fa-solid fa-circle-info"></i>
            <div>
              <strong>How it works:</strong> Click any page above to edit its content — text, photos, and all sections. Changes are saved automatically and reflect on the live website immediately.
            </div>
          </div>
        </>
      )}
    </div>
  );
}
