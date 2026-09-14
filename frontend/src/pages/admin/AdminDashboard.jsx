import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import AdminHome from './panels/AdminHome';
import PageEditor from './panels/PageEditor';
import ShipmentsManager from './panels/ShipmentsManager';
import BookingsManager from './panels/BookingsManager';
import MessagesManager from './panels/MessagesManager';
import MediaLibrary from './panels/MediaLibrary';
import BrandingManager from './panels/BrandingManager';
import ContactManager from './panels/ContactManager';
import AdminSettings from './panels/AdminSettings';
import StaffManager from './panels/StaffManager';
import CustomersManager from './panels/CustomersManager';
import AdminCreateShipment from './AdminCreateShipment';

const getNavItems = (role) => {
  const isSuper = role === 'super-admin';
  return [
    { path: '/admin/dashboard', icon: 'fa-gauge-high', label: 'Dashboard' },
    ...(isSuper ? [{ path: '/admin/branding', icon: 'fa-palette', label: 'Branding & Logo' }] : []),
    ...(isSuper ? [{ path: '/admin/pages', icon: 'fa-file-pen', label: 'Page Editor' }] : []),
    ...(isSuper ? [{ path: '/admin/customers', icon: 'fa-users', label: 'Customers Data' }] : []),
    { path: '/admin/shipments', icon: 'fa-box-archive', label: 'Shipments' },
    { path: '/admin/create-shipment', icon: 'fa-truck-fast', label: 'Create Shipment' },
    { path: '/admin/bookings', icon: 'fa-calendar-check', label: 'Bookings' },
    { path: '/admin/messages', icon: 'fa-envelope', label: 'Messages' },
    ...(isSuper ? [{ path: '/admin/media', icon: 'fa-images', label: 'Media Library' }] : []),
    ...(isSuper ? [{ path: '/admin/contact-settings', icon: 'fa-address-book', label: 'Contact & Branches' }] : []),
    ...(isSuper ? [{ path: '/admin/staff', icon: 'fa-users-gear', label: 'Staff Management' }] : []),
    { path: '/admin/settings', icon: 'fa-gear', label: 'Settings' },
  ];
};
export default function AdminDashboard() {
  const { admin, logout } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && showLogoutModal) {
        setShowLogoutModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showLogoutModal]);

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className={`admin-layout${sidebarOpen ? ' sidebar-open' : ' sidebar-collapsed'}`}>
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <Link to="/admin/dashboard" className="admin-sidebar-logo" title="SAI International Couriers">
            <div className="admin-sidebar-logo-box">
              <img 
                src="/assets/images/sai_logo_transparent.png" 
                alt="SAI International Couriers" 
                className="admin-sidebar-logo-img" 
              />
            </div>
          </Link>
          <button className="admin-sidebar-toggle" onClick={() => setSidebarOpen(p => !p)} title={sidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}>
            <i className={`fa-solid fa-chevron-${sidebarOpen ? 'left' : 'right'}`}></i>
          </button>
        </div>

        <nav className="admin-sidebar-nav">
          {getNavItems(admin?.role).map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`admin-nav-link${location.pathname.startsWith(item.path) ? ' active' : ''}`}
              title={!sidebarOpen ? item.label : ''}
            >
              <i className={`fa-solid ${item.icon}`}></i>
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <Link to="/" target="_blank" className="admin-nav-link" title="View Site">
            <i className="fa-solid fa-arrow-up-right-from-square"></i>
            {sidebarOpen && <span>View Site</span>}
          </Link>
          <button 
            type="button" 
            onClick={() => setShowLogoutModal(true)} 
            className="admin-nav-link admin-logout-btn" 
            title="Logout"
          >
            <i className="fa-solid fa-right-from-bracket"></i>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="admin-main">
        {/* Topbar */}
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button className="admin-mobile-toggle" onClick={() => setSidebarOpen(p => !p)}>
              <i className="fa-solid fa-bars"></i>
            </button>
            <h2 className="admin-page-title">
              {getNavItems(admin?.role).find(n => location.pathname.startsWith(n.path))?.label || 'Admin'}
            </h2>
          </div>
          <div className="admin-topbar-right" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="admin-user-badge">
              <div className="admin-user-avatar">{admin?.name?.[0] || 'A'}</div>
              <div>
                <div className="admin-user-name">{admin?.name}</div>
                <div className="admin-user-role">{admin?.role}</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowLogoutModal(true)}
              className="admin-btn admin-btn-sm admin-btn-outline"
              title="Sign Out"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <i className="fa-solid fa-right-from-bracket" style={{ color: '#E74C3C' }}></i>
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="admin-content">
          <Routes>
            <Route path="dashboard" element={<AdminHome />} />
            <Route path="pages" element={<PageEditor />} />
            <Route path="pages/:page" element={<PageEditor />} />
            <Route path="shipments" element={<ShipmentsManager />} />
            <Route path="create-shipment" element={<AdminCreateShipment />} />
            <Route path="bookings" element={<BookingsManager />} />
            <Route path="messages" element={<MessagesManager />} />
            <Route path="media" element={<MediaLibrary />} />
            <Route path="branding" element={<BrandingManager />} />
            <Route path="contact-settings" element={<ContactManager />} />
            <Route path="customers" element={<CustomersManager />} />
            <Route path="staff" element={<StaffManager />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
          </Routes>
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div 
          className="admin-modal-overlay" 
          onClick={() => setShowLogoutModal(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-modal-title"
        >
          <div 
            className="admin-modal admin-logout-modal" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-logout-icon-wrap">
              <i className="fa-solid fa-right-from-bracket"></i>
            </div>
            <h3 id="logout-modal-title" className="admin-logout-title">Confirm Logout</h3>
            <p className="admin-logout-desc">
              Are you sure you want to sign out of the SAI Admin Portal? Any unsaved changes in the page editor will be discarded.
            </p>
            <div className="admin-logout-actions">
              <button 
                type="button" 
                className="admin-btn admin-btn-outline" 
                onClick={() => setShowLogoutModal(false)}
                autoFocus
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="admin-btn admin-btn-danger" 
                onClick={handleConfirmLogout}
              >
                <i className="fa-solid fa-arrow-right-from-bracket"></i> Yes, Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
