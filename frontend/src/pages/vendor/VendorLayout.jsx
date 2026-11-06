import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import '../../styles/vendor.css';

export default function VendorLayout() {
  const { user, logout } = useUser();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  const [sidebarOpen, setSidebarOpen] = useState(typeof window !== 'undefined' ? window.innerWidth >= 768 : true);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar on mobile route change
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  const menuItems = [
    { path: '/vendor', icon: 'fa-table-columns', label: 'Dashboard' },
    { path: '/vendor/products', icon: 'fa-box-open', label: 'Catalog' },
    { path: '/vendor/orders', icon: 'fa-cart-flatbed', label: 'Orders' },
    { path: '/vendor/rfq', icon: 'fa-handshake', label: 'Negotiations' },
    { path: '/vendor/financials', icon: 'fa-wallet', label: 'Financials' },
    { path: '/vendor/api', icon: 'fa-code', label: 'API Keys' },
    { path: '/vendor/support', icon: 'fa-headset', label: 'Support' }
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC', fontFamily: "'Inter', sans-serif", position: 'relative' }}>
      
      {/* Mobile Backdrop Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(2, 6, 23, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 999
          }}
        />
      )}

      {/* Sidebar */}
      <aside style={{ 
        width: isMobile ? '280px' : (sidebarOpen ? '260px' : '80px'), 
        background: 'linear-gradient(180deg, #020617 0%, #0F172A 100%)', 
        color: '#fff', 
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
        display: 'flex', 
        flexDirection: 'column',
        position: isMobile ? 'fixed' : 'sticky',
        top: 0,
        left: isMobile ? (sidebarOpen ? 0 : '-290px') : 0,
        bottom: isMobile ? 0 : 'auto',
        height: '100vh',
        zIndex: isMobile ? 1000 : 100,
        overflow: 'hidden',
        boxShadow: isMobile && sidebarOpen ? '0 20px 40px rgba(0,0,0,0.5)' : 'none'
      }}>
        {/* Brand */}
        <div style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <img src="/assets/images/sai_logo_transparent.png" alt="Sai" style={{ width: '38px', height: '38px', objectFit: 'contain' }} />
            {(sidebarOpen || isMobile) && (
              <div style={{ whiteSpace: 'nowrap' }}>
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '800', letterSpacing: '-0.5px' }}>Sai Vendor</h3>
                <span style={{ fontSize: '0.72rem', color: '#0EA5E9', fontWeight: '600', textTransform: 'uppercase' }}>Enterprise</span>
              </div>
            )}
          </div>
          {isMobile && (
            <button 
              onClick={() => setSidebarOpen(false)}
              style={{ background: 'transparent', border: 'none', color: '#94A3B8', fontSize: '1.2rem', cursor: 'pointer', padding: '0.4rem' }}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav style={{ padding: '1.25rem 0.85rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem', overflowY: 'auto' }}>
          {menuItems.map(item => {
            const isActive = location.pathname === item.path || (item.path !== '/vendor' && location.pathname.startsWith(item.path));
            return (
              <Link key={item.path} to={item.path} style={{ textDecoration: 'none' }}>
                <div style={{ 
                  display: 'flex', alignItems: 'center', gap: '1rem', 
                  padding: (sidebarOpen || isMobile) ? '0.75rem 1rem' : '1rem', 
                  borderRadius: '12px', 
                  color: isActive ? '#fff' : '#94A3B8', 
                  background: isActive ? 'linear-gradient(90deg, rgba(14,165,233,0.15) 0%, rgba(14,165,233,0) 100%)' : 'transparent',
                  borderLeft: isActive ? '3px solid #0EA5E9' : '3px solid transparent',
                  transition: 'all 0.2s',
                  justifyContent: (sidebarOpen || isMobile) ? 'flex-start' : 'center',
                }}
                onMouseEnter={e => { if(!isActive) e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { if(!isActive) e.currentTarget.style.color = '#94A3B8'; }}
                >
                  <i className={`fa-solid ${item.icon}`} style={{ fontSize: '1.1rem', color: isActive ? '#0EA5E9' : 'inherit' }}></i>
                  {(sidebarOpen || isMobile) && <span style={{ fontWeight: '600', fontSize: '0.92rem' }}>{item.label}</span>}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Desktop Collapse Toggle */}
        {!isMobile && (
          <div style={{ padding: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <div onClick={() => setSidebarOpen(!sidebarOpen)} style={{ cursor: 'pointer', padding: '0.75rem', display: 'flex', justifyContent: 'center', color: '#94A3B8', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = '#94A3B8'}>
              <i className={`fa-solid ${sidebarOpen ? 'fa-chevron-left' : 'fa-chevron-right'}`}></i>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, height: '100vh', overflowY: 'auto' }}>
        
        {/* Top Header */}
        <header style={{ background: '#fff', padding: isMobile ? '0.75rem 1rem' : '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', position: 'sticky', top: 0, zIndex: 90 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button 
              type="button" 
              className="vendor-mobile-toggle" 
              onClick={() => setSidebarOpen(prev => !prev)}
              aria-label="Toggle vendor navigation"
            >
              <i className="fa-solid fa-bars"></i>
            </button>
            <div style={{ background: '#F1F5F9', padding: '0.5rem 0.85rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#64748B', maxWidth: isMobile ? '160px' : '300px', width: '100%' }}>
              <i className="fa-solid fa-magnifying-glass"></i>
              <input type="text" placeholder="Search..." style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.85rem', color: '#0F172A' }} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '0.75rem' : '1.5rem' }}>
            <div style={{ position: 'relative', cursor: 'pointer', color: '#64748B' }} title="Notifications">
              <i className="fa-regular fa-bell" style={{ fontSize: '1.1rem' }}></i>
              <span style={{ position: 'absolute', top: '-5px', right: '-5px', width: '8px', height: '8px', background: '#EF4444', borderRadius: '50%' }}></span>
            </div>
            <div style={{ width: '1px', height: '24px', background: '#E2E8F0' }}></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {!isMobile && (
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: '#0F172A', fontWeight: '600', fontSize: '0.9rem' }}>{user?.name || 'Vendor'}</div>
                  <div style={{ color: '#94A3B8', fontSize: '0.8rem' }}>Vendor Role</div>
                </div>
              )}
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #0EA5E9 0%, #3B82F6 100%)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.9rem' }}>
                {user?.name ? user.name.charAt(0) : 'V'}
              </div>
              <i onClick={logout} className="fa-solid fa-arrow-right-from-bracket" style={{ color: '#EF4444', cursor: 'pointer', marginLeft: '0.25rem' }} title="Logout"></i>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div style={{ padding: isMobile ? '1rem 0.85rem' : '2rem', flex: 1 }}>
          <Outlet />
        </div>
        
      </main>
    </div>
  );
}
