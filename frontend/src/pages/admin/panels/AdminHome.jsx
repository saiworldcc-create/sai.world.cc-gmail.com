import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllContentPages } from '../../../services/api';

const STAT_CARDS = [
  { icon: 'fa-file-pen', label: 'Editable Pages', color: '#3C9290', value: '11' },
  { icon: 'fa-box-archive', label: 'Demo Shipments', color: '#E97856', value: '3' },
  { icon: 'fa-images', label: 'Media Library', color: '#D5A85F', value: 'Active' },
  { icon: 'fa-shield-check', label: 'System Status', color: '#27AE60', value: 'Live' },
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
  const [pages, setPages] = useState([]);

  useEffect(() => {
    getAllContentPages().then(res => setPages(res.data || [])).catch(() => {});
  }, []);

  return (
    <div className="admin-panel-content">
      {/* Welcome */}
      <div className="admin-welcome-banner">
        <div>
          <h2>Welcome to Sai Couriers CMS</h2>
          <p>Manage all website content, images, shipments, and bookings from this dashboard.</p>
        </div>
        <Link to="/admin/pages/home" className="admin-btn admin-btn-primary">
          <i className="fa-solid fa-pencil"></i> Edit Home Page
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="admin-stats-grid">
        {STAT_CARDS.map(card => (
          <div key={card.label} className="admin-stat-card">
            <div className="admin-stat-icon" style={{ background: `${card.color}18`, color: card.color }}>
              <i className={`fa-solid ${card.icon}`}></i>
            </div>
            <div>
              <div className="admin-stat-value">{card.value}</div>
              <div className="admin-stat-label">{card.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Edit Pages */}
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
    </div>
  );
}
