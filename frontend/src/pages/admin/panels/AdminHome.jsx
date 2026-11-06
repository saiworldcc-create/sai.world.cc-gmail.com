import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api, { getAllContentPages } from '../../../services/api';
import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useAdminAuth } from '../../../context/AdminAuthContext';

const COLORS = ['#3C9290', '#E97856', '#27AE60', '#D5A85F', '#9B59B6', '#E74C3C'];

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

  // React Query for Pages
  const { data: pages = [] } = useQuery({
    queryKey: ['adminPages'],
    queryFn: async () => {
      const res = await getAllContentPages();
      return res.data || [];
    }
  });

  // React Query for Real-time Stats
  const { data: stats = {
    totalBookings: 0,
    activeShipments: 0,
    totalShipments: 0,
    unreadMessages: 0,
    recentBookings: []
  } } = useQuery({
    queryKey: ['adminStats'],
    queryFn: async () => {
      const res = await api.get('/admin/stats');
      return res.success ? res.stats : { totalBookings: 0, activeShipments: 0, totalShipments: 0, unreadMessages: 0, recentBookings: [] };
    },
    refetchInterval: 10000, // Poll every 10 seconds for real-time feel
  });

  // Phase 9: Enterprise Analytics Queries
  const { data: revenueData = [] } = useQuery({
    queryKey: ['adminRevenueAnalytics'],
    queryFn: async () => {
      const res = await api.get('/analytics/revenue');
      return res.data || [];
    }
  });

  const { data: shipmentData = [] } = useQuery({
    queryKey: ['adminShipmentAnalytics'],
    queryFn: async () => {
      const res = await api.get('/analytics/shipments');
      return res.data || [];
    }
  });

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
            <div className="admin-stat-value" style={{ color: '#1E3446' }}>{stats.totalBookings}</div>
            <div className="admin-stat-label" style={{ color: '#3C5B72', fontWeight: 500 }}>Total Bookings</div>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon" style={{ background: '#E9785618', color: '#E97856' }}>
            <i className="fa-solid fa-truck-fast"></i>
          </div>
          <div>
            <div className="admin-stat-value" style={{ color: '#1E3446' }}>{stats.activeShipments}</div>
            <div className="admin-stat-label" style={{ color: '#3C5B72', fontWeight: 500 }}>Active Shipments</div>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon" style={{ background: '#27AE6018', color: '#27AE60' }}>
            <i className="fa-solid fa-box-archive"></i>
          </div>
          <div>
            <div className="admin-stat-value" style={{ color: '#1E3446' }}>{stats.totalShipments}</div>
            <div className="admin-stat-label" style={{ color: '#3C5B72', fontWeight: 500 }}>Total Shipments</div>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon" style={{ background: '#D5A85F18', color: '#D5A85F' }}>
            <i className="fa-solid fa-envelope"></i>
          </div>
          <div>
            <div className="admin-stat-value" style={{ color: '#1E3446' }}>{stats.unreadMessages}</div>
            <div className="admin-stat-label" style={{ color: '#3C5B72', fontWeight: 500 }}>Unread Messages</div>
          </div>
        </div>
      </div>

      {/* Analytics Charts (Phase 9) */}
      <div className="admin-section-title" style={{ marginTop: '2rem' }}>
        <i className="fa-solid fa-chart-line"></i> Enterprise Analytics
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        
        {/* Revenue Area Chart */}
        <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-light)', height: '350px' }}>
          <h4 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#1E3446' }}>30-Day Escrow Revenue Trend</h4>
          <ResponsiveContainer width="100%" height="80%">
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3C9290" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3C9290" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" vertical={false} />
              <XAxis dataKey="date" stroke="var(--text-slate-muted)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(tick) => tick.slice(5)} />
              <YAxis stroke="var(--text-slate-muted)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(tick) => `$${tick}`} />
              <Tooltip 
                contentStyle={{ background: 'var(--bg-card-tint)', border: '1px solid var(--border-light)', borderRadius: '8px', color: '#1E3446' }} 
                itemStyle={{ color: 'var(--accent-teal)' }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#3C9290" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Shipment Volume Pie Chart */}
        <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-light)', height: '350px', display: 'flex', flexDirection: 'column' }}>
          <h4 style={{ marginTop: 0, marginBottom: '0.5rem', color: '#1E3446' }}>Global Shipment Status</h4>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={shipmentData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {shipmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '8px' }} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Hotspots / Recent Bookings */}
      <div className="admin-section-title" style={{ marginTop: '2.5rem' }}>
        <i className="fa-solid fa-location-dot"></i> Recent Pickup Hotspots
      </div>
      <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E3EDF3', overflow: 'hidden', marginBottom: '2rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead style={{ background: '#1E3446', color: '#FFFFFF', borderBottom: '1px solid #E3EDF3' }}>
            <tr>
              <th style={{ padding: '1rem', fontWeight: 600 }}>Customer</th>
              <th style={{ padding: '1rem', fontWeight: 600 }}>AWB / Branch</th>
              <th style={{ padding: '1rem', fontWeight: 600 }}>Location / Coordinates</th>
              <th style={{ padding: '1rem', fontWeight: 600 }}>Map Link</th>
            </tr>
          </thead>
          <tbody>
            {stats.recentBookings && stats.recentBookings.length > 0 ? (
              stats.recentBookings.map(b => (
                <tr key={b._id} style={{ borderBottom: '1px solid #E3EDF3' }}>
                  <td style={{ padding: '1rem', color: '#1E3446', fontWeight: 500 }}>{b.senderName}<br/><span style={{fontSize: '0.8rem', color: '#7091A8', fontWeight: 400}}>{b.senderPhone}</span></td>
                  <td style={{ padding: '1rem', color: '#1E3446' }}>
                    <span style={{ color: 'var(--accent-teal)', fontWeight: 'bold' }}>{b.awb}</span><br/>
                    <span style={{fontSize: '0.8rem', color: '#7091A8'}}>{b.branchZone}</span>
                  </td>
                  <td style={{ padding: '1rem', color: '#4A6B82' }}>
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
                      <span style={{ color: '#7091A8', fontSize: '0.85rem' }}>Manual Address</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: '#7091A8' }}>No recent pickup requests found.</td>
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
