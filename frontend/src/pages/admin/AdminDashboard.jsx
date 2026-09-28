import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
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
import RateManager from './panels/RateManager';
import EcommerceManager from './panels/EcommerceManager';
import DispatchManager from './panels/DispatchManager';
import { getNewOrderCount, getAdminNotifications, markNotificationsRead } from '../../services/api';

const getNavGroups = (role) => {
  const isSuper = role === 'super-admin';
  return [
    {
      group: 'Dashboard',
      icon: 'fa-gauge-high',
      items: [
        { path: '/admin/dashboard', icon: 'fa-chart-line', label: 'Overview' }
      ]
    },
    {
      group: 'Operations',
      icon: 'fa-box-archive',
      items: [
        { path: '/admin/shipments', icon: 'fa-box-open', label: 'Shipments' },
        { path: '/admin/create-shipment', icon: 'fa-truck-fast', label: 'Create Shipment' },
        { path: '/admin/dispatch', icon: 'fa-map-location-dot', label: 'Fleet Dispatch' },
        { path: '/admin/bookings', icon: 'fa-calendar-check', label: 'Bookings' },
        { path: '/admin/rate-manager', icon: 'fa-file-invoice-dollar', label: 'Rate Manager' },
        ...(isSuper ? [{ path: '/admin/customers', icon: 'fa-users', label: 'Customers Data' }] : []),
        ...(isSuper ? [{ path: '/admin/ecommerce', icon: 'fa-store', label: 'E-Commerce' }] : [])
      ]
    },
    {
      group: 'Content & Media',
      icon: 'fa-laptop-file',
      items: [
        ...(isSuper ? [{ path: '/admin/pages', icon: 'fa-file-pen', label: 'Page Editor' }] : []),
        ...(isSuper ? [{ path: '/admin/branding', icon: 'fa-palette', label: 'Branding & Logo' }] : []),
        ...(isSuper ? [{ path: '/admin/media', icon: 'fa-images', label: 'Media Library' }] : [])
      ]
    },
    {
      group: 'Administration',
      icon: 'fa-shield-halved',
      items: [
        { path: '/admin/messages', icon: 'fa-envelope', label: 'Messages' },
        ...(isSuper ? [{ path: '/admin/contact-settings', icon: 'fa-address-book', label: 'Contact & Branches' }] : []),
        ...(isSuper ? [{ path: '/admin/staff', icon: 'fa-users-gear', label: 'Staff Management' }] : []),
        { path: '/admin/settings', icon: 'fa-gear', label: 'Settings' }
      ]
    }
  ].filter(g => g.items.length > 0);
};

const getNavItems = (role) => getNavGroups(role).flatMap(g => g.items);
export default function AdminDashboard() {
  const { admin, logout } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [openGroup, setOpenGroup] = useState('');
  const [newOrderCount, setNewOrderCount] = useState(0);

  // Notifications State
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifs, setUnreadNotifs] = useState(0);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  useEffect(() => {
    const groups = getNavGroups(admin?.role);
    for (const g of groups) {
      if (g.items.some(i => location.pathname.startsWith(i.path))) {
        setOpenGroup(g.group);
        break;
      }
    }
  }, [location.pathname, admin]);

  // Poll for new order count & notifications
  const fetchData = useCallback(async () => {
    try {
      if (admin?.role === 'super-admin') {
        const orderRes = await getNewOrderCount();
        setNewOrderCount(orderRes.count || 0);
      }

      const notifRes = await getAdminNotifications();
      if (notifRes.success) {
        setNotifications(notifRes.notifications || []);
        setUnreadNotifs(notifRes.unreadCount || 0);
      }
    } catch { /* silent */ }
  }, [admin?.role]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 8000); // Live notification update every 8s
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleOpenNotifications = async () => {
    const willOpen = !showNotifDropdown;
    setShowNotifDropdown(willOpen);
    
    if (willOpen) {
      try {
        // Always fetch fresh notifications when opening the dropdown
        const notifRes = await getAdminNotifications();
        if (notifRes.success) {
          setNotifications(notifRes.notifications || []);
          if (notifRes.unreadCount > 0) {
            await markNotificationsRead();
            setUnreadNotifs(0);
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
          }
        }
      } catch (err) { 
        console.error('Failed to fetch/mark notifications read', err); 
      }
    }
  };

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
    // navigate handled by ProtectedRoute
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

        <nav className="admin-sidebar-nav" style={{ padding: '1rem 0.5rem' }}>
          {getNavGroups(admin?.role).map((group, idx) => {
            if (group.group === 'Dashboard') {
              return group.items.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`admin-nav-link${location.pathname.startsWith(item.path) ? ' active' : ''}`}
                  title={!sidebarOpen ? item.label : ''}
                  style={{ marginBottom: '0.5rem' }}
                >
                  <i className={`fa-solid ${item.icon}`}></i>
                  {sidebarOpen && <span>{item.label}</span>}
                </Link>
              ));
            }

            const isActiveGroup = group.items.some(i => location.pathname.startsWith(i.path));
            const isOpen = openGroup === group.group || !sidebarOpen;

            return (
              <div key={idx} className="admin-nav-group-wrapper" style={{ marginBottom: '0.5rem' }}>
                {sidebarOpen && (
                  <button 
                    onClick={() => setOpenGroup(isOpen ? '' : group.group)}
                    className={`admin-nav-link ${(isActiveGroup && !isOpen) ? 'active-group-closed' : ''}`}
                    style={{ 
                      justifyContent: 'space-between', 
                      background: (isActiveGroup && !isOpen) ? 'rgba(255,255,255,0.05)' : 'none',
                      color: isActiveGroup ? '#FFF' : '#B4CCE0'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <i className={`fa-solid ${group.icon}`}></i>
                      <span>{group.group}</span>
                    </div>
                    <i className={`fa-solid fa-chevron-${isOpen ? 'up' : 'down'}`} style={{ fontSize: '0.7rem', opacity: 0.6 }}></i>
                  </button>
                )}
                
                {isOpen && (
                  <div className="admin-group-items" style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '0.15rem',
                    paddingLeft: sidebarOpen ? '2rem' : '0',
                    marginTop: sidebarOpen ? '0.2rem' : '0'
                  }}>
                    {group.items.map(item => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`admin-nav-link${location.pathname.startsWith(item.path) ? ' active' : ''}`}
                        title={!sidebarOpen ? item.label : ''}
                      >
                        <i className={`fa-solid ${item.icon}`}></i>
                        {sidebarOpen && <span>{item.label}</span>}
                        {item.label === 'E-Commerce' && newOrderCount > 0 && (
                          <span style={{
                            background: '#EF4444', color: '#FFF', borderRadius: '10px',
                            padding: '1px 7px', fontSize: '0.65rem', fontWeight: '800',
                            marginLeft: 'auto', minWidth: '18px', textAlign: 'center',
                            animation: 'pulse 2s infinite',
                          }}>{newOrderCount}</span>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          }, document.body)}
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
            {/* Notification Bell */}
            <div style={{ position: 'relative' }}>
              <button 
                onClick={handleOpenNotifications}
                style={{
                  background: 'transparent', border: 'none', fontSize: '1.2rem', color: '#7091A8',
                  cursor: 'pointer', position: 'relative', padding: '0.4rem', transition: 'color 0.2s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
              >
                <i className="fa-regular fa-bell"></i>
                {unreadNotifs > 0 && (
                  <span style={{
                    position: 'absolute', top: '2px', right: '4px', background: '#EF4444',
                    color: '#FFF', fontSize: '0.6rem', fontWeight: 800, padding: '2px 5px',
                    borderRadius: '10px', border: '2px solid #FFF', animation: 'pulse 2s infinite'
                  }}>
                    {unreadNotifs}
                  </span>
                )}
              </button>

              {/* Dropdown */}
              {showNotifDropdown && (
                <>
                  <div style={{ position: 'fixed', inset: 0, zIndex: 998 }} onClick={() => setShowNotifDropdown(false)} />
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 10px)', right: '-10px', width: '360px',
                    background: '#FFF', borderRadius: '14px', boxShadow: '0 12px 48px rgba(0,0,0,0.15)',
                    border: '1px solid #E8EDF2', zIndex: 999, overflow: 'hidden',
                    animation: 'slideInRight 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}>
                    <div style={{ padding: '1rem 1.2rem', background: '#FAFBFC', borderBottom: '1px solid #E8EDF2', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ margin: 0, fontSize: '1rem', color: '#1E3446', fontWeight: 800 }}><i className="fa-solid fa-bell" style={{ marginRight: '0.5rem', color: '#3C9290' }}></i>Notifications</h4>
                      <span style={{ fontSize: '0.75rem', color: '#A0B0C0', fontWeight: 600 }}>{notifications.filter(n => !n.isRead).length} new</span>
                    </div>
                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                      {notifications.length === 0 ? (
                        <div style={{ padding: '2.5rem 1rem', textAlign: 'center', color: '#A0B0C0', fontSize: '0.9rem' }}>
                          <i className="fa-regular fa-bell-slash" style={{ fontSize: '2rem', marginBottom: '0.8rem', opacity: 0.5, display: 'block' }}></i>
                          <p style={{ margin: 0 }}>You're all caught up!</p>
                        </div>
                      ) : (
                        notifications.map(notif => {
                          const isUnread = !notif.isRead;
                          // Relative time
                          const now = Date.now();
                          const created = new Date(notif.createdAt).getTime();
                          const diffSec = Math.floor((now - created) / 1000);
                          let timeAgo;
                          if (diffSec < 60) timeAgo = 'Just now';
                          else if (diffSec < 3600) timeAgo = `${Math.floor(diffSec / 60)} min ago`;
                          else if (diffSec < 86400) timeAgo = `${Math.floor(diffSec / 3600)}h ago`;
                          else if (diffSec < 172800) timeAgo = 'Yesterday';
                          else timeAgo = new Date(notif.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

                          return (
                            <div key={notif._id} style={{
                              padding: '0.9rem 1.2rem', borderBottom: '1px solid #F1F4F7',
                              background: isUnread ? 'linear-gradient(90deg, #E6FAF9 0%, #F4FCFC 30%, #FFF 100%)' : '#FFF',
                              borderLeft: isUnread ? '3px solid #3C9290' : '3px solid transparent',
                              transition: 'all 0.3s', position: 'relative'
                            }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  {isUnread && (
                                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3C9290', display: 'inline-block', flexShrink: 0, boxShadow: '0 0 6px rgba(60,146,144,0.5)' }}></span>
                                  )}
                                  <strong style={{ fontSize: '0.85rem', color: isUnread ? '#1E3446' : '#4A6B82', fontWeight: isUnread ? 800 : 600 }}>{notif.title}</strong>
                                </div>
                                <span style={{ fontSize: '0.7rem', color: isUnread ? '#3C9290' : '#A0B0C0', fontWeight: isUnread ? 600 : 400, whiteSpace: 'nowrap', marginLeft: '0.5rem' }}>
                                  <i className="fa-regular fa-clock" style={{ marginRight: '0.25rem', fontSize: '0.65rem' }}></i>{timeAgo}
                                </span>
                              </div>
                              <p style={{ margin: 0, fontSize: '0.8rem', color: '#7091A8', lineHeight: 1.45, paddingLeft: isUnread ? '1.1rem' : 0 }}>
                                {notif.message}
                              </p>
                              {notif.link && (
                                <Link to={notif.link} onClick={() => setShowNotifDropdown(false)} style={{ display: 'inline-block', marginTop: '0.5rem', fontSize: '0.75rem', color: '#3C9290', fontWeight: 700, textDecoration: 'none', paddingLeft: isUnread ? '1.1rem' : 0 }}>
                                  View Details &rarr;
                                </Link>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
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
            <Route path="dispatch" element={<DispatchManager />} />
            <Route path="bookings" element={<BookingsManager />} />
            <Route path="messages" element={<MessagesManager />} />
            <Route path="media" element={<MediaLibrary />} />
            <Route path="branding" element={<BrandingManager />} />
            <Route path="contact-settings" element={<ContactManager />} />
            <Route path="customers" element={<CustomersManager />} />
            <Route path="staff" element={<StaffManager />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="rate-manager" element={<RateManager />} />
            <Route path="ecommerce" element={<EcommerceManager />} />
            <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
          </Routes>
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && createPortal(
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
        </div>, document.body
      )}
    </div>
  );
}
