import React, { useEffect, useState } from 'react';
import { useUser } from '../../context/UserContext';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import VendorProducts from './VendorProducts';

export default function VendorDashboard() {
  const { user, logout } = useUser();
  const [profile, setProfile] = useState(null);
  const [analytics, setAnalytics] = useState({ totalProducts: 0, totalOrders: 0, pendingOrders: 0 });
  const [unreadOrders, setUnreadOrders] = useState(0);
  const [recentNotifications, setRecentNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        const [profileRes, analyticsRes] = await Promise.all([
          api.get('/vendor/me'),
          api.get('/vendor/analytics').catch(() => ({ analytics: {} }))
        ]);
        setProfile(profileRes.user);
        if (analyticsRes.analytics) setAnalytics(analyticsRes.analytics);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchVendorData();
  }, []);

  if (loading) return <div>Loading...</div>;

  const kycStatus = profile?.shopId?.kycStatus || 'Pending';

  return (
    <div className="vendor-fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ margin: 0, fontSize: '2rem', color: '#0F172A', fontWeight: '800', letterSpacing: '-0.5px' }}>Dashboard Overview</h1>
        <p style={{ margin: '0.5rem 0 0 0', color: '#64748B' }}>Welcome back to your Vendor Enterprise Portal.</p>
      </div>

      {/* Shop Profile Details (Premium ID Card Style) */}
      <div style={{ background: '#fff', padding: '2rem 2.5rem', borderRadius: '20px', boxShadow: '0 8px 30px rgba(0,0,0,0.04)', marginBottom: '2.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', border: '1px solid #F1F5F9' }}>
        <div>
          <span style={{ color: '#94A3B8', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700' }}>Store Name</span>
          <div style={{ fontWeight: '700', fontSize: '1.2rem', color: '#0F172A', marginTop: '0.4rem' }}>{profile?.shopId?.name || 'N/A'}</div>
        </div>
        <div>
          <span style={{ color: '#94A3B8', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700' }}>Contact Phone</span>
          <div style={{ fontWeight: '700', fontSize: '1.2rem', color: '#0F172A', marginTop: '0.4rem' }}>{profile?.phone || 'N/A'}</div>
        </div>
        <div>
          <span style={{ color: '#94A3B8', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700' }}>GSTIN / License</span>
          <div style={{ fontWeight: '700', fontSize: '1.2rem', color: '#0F172A', marginTop: '0.4rem', fontFamily: 'monospace' }}>{profile?.shopId?.gstin || profile?.shopId?.tradeLicense || 'Not provided'}</div>
        </div>
        <div>
          <span style={{ color: '#94A3B8', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700' }}>Account Status</span>
          <div style={{ fontWeight: '700', fontSize: '1.2rem', marginTop: '0.4rem', color: kycStatus === 'Approved' ? '#10B981' : kycStatus === 'Pending' ? '#F59E0B' : '#EF4444', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {kycStatus === 'Approved' && <i className="fa-solid fa-shield-check"></i>}
            {kycStatus === 'Pending' && <i className="fa-solid fa-hourglass-half"></i>}
            {kycStatus === 'Rejected' && <i className="fa-solid fa-ban"></i>}
            {kycStatus}
          </div>
        </div>
      </div>

      {/* Warning Banners */}
      {kycStatus === 'Pending' && (
        <div style={{ background: 'linear-gradient(to right, #FFFBEB, #FEF3C7)', color: '#92400E', padding: '1.5rem', borderRadius: '16px', marginBottom: '2.5rem', display: 'flex', alignItems: 'flex-start', gap: '1.2rem', border: '1px solid #FDE68A', boxShadow: '0 4px 15px rgba(245, 158, 11, 0.05)' }}>
          <div style={{ background: '#F59E0B', color: '#fff', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '0.2rem' }}>
            <i className="fa-solid fa-bell"></i>
          </div>
          <div>
            <h4 style={{ margin: '0 0 0.4rem 0', fontWeight: '700', fontSize: '1.1rem' }}>Account Under Review</h4>
            <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.5' }}>You can add products to your catalog and prepare your store right now. However, your store and products will not be visible to buyers until your KYC documents (GSTIN/Trade License) are verified by the admin.</p>
          </div>
        </div>
      )}

      {kycStatus === 'Rejected' && (
        <div style={{ background: 'linear-gradient(to right, #FEF2F2, #FEE2E2)', color: '#991B1B', padding: '1.5rem', borderRadius: '16px', marginBottom: '2.5rem', display: 'flex', alignItems: 'flex-start', gap: '1.2rem', border: '1px solid #FECACA' }}>
          <div style={{ background: '#EF4444', color: '#fff', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '0.2rem' }}>
            <i className="fa-solid fa-triangle-exclamation"></i>
          </div>
          <div>
            <h4 style={{ margin: '0 0 0.4rem 0', fontWeight: '700', fontSize: '1.1rem' }}>Account Rejected</h4>
            <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.5' }}>Unfortunately, your vendor application was rejected. Please contact support for more details.</p>
          </div>
        </div>
      )}

      {/* Quick Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div style={{ background: '#fff', padding: '1.5rem 2rem', borderRadius: '20px', boxShadow: '0 8px 30px rgba(0,0,0,0.03)', border: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: '1.5rem', transition: 'transform 0.2s', cursor: 'default' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: '#E0E7FF', color: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
            <i className="fa-solid fa-box-open"></i>
          </div>
          <div>
            <h4 style={{ margin: '0 0 0.3rem 0', color: '#64748B', fontSize: '0.9rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Products</h4>
            <h2 style={{ margin: 0, color: '#0F172A', fontSize: '2rem', fontWeight: '800' }}>{analytics.totalProducts}</h2>
          </div>
        </div>
        
        <div style={{ background: '#fff', padding: '1.5rem 2rem', borderRadius: '20px', boxShadow: '0 8px 30px rgba(0,0,0,0.03)', border: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: '#ECFDF5', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
            <i className="fa-solid fa-cart-shopping"></i>
          </div>
          <div>
            <h4 style={{ margin: '0 0 0.3rem 0', color: '#64748B', fontSize: '0.9rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Orders</h4>
            <h2 style={{ margin: 0, color: '#0F172A', fontSize: '2rem', fontWeight: '800' }}>{analytics.totalOrders}</h2>
          </div>
        </div>

        <div style={{ background: '#fff', padding: '1.5rem 2rem', borderRadius: '20px', boxShadow: '0 8px 30px rgba(0,0,0,0.03)', border: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: '#FEF2F2', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
            <i className="fa-solid fa-truck-fast"></i>
          </div>
          <div>
            <h4 style={{ margin: '0 0 0.3rem 0', color: '#64748B', fontSize: '0.9rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pending Fulfillments</h4>
            <h2 style={{ margin: 0, color: '#0F172A', fontSize: '2rem', fontWeight: '800' }}>{analytics.pendingOrders}</h2>
          </div>
        </div>
      </div>

      {/* Catalog / Products Component always rendered so they can prepare it */}
      <div style={{ background: '#fff', borderRadius: '20px', padding: '1rem', boxShadow: '0 10px 40px rgba(0,0,0,0.04)', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <VendorProducts />
      </div>

      {/* Action Grid (Financials, RFQ, Support) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
        <Link to="/vendor/orders" style={{ textDecoration: 'none' }}>
          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: '1rem', transition: 'all 0.2s' }}>
             <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#F8FAFC', color: '#0284C7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}><i className="fa-solid fa-list-check"></i></div>
             <div style={{ flex: 1 }}>
               <h4 style={{ margin: '0 0 0.2rem 0', color: '#0F172A', fontSize: '1rem' }}>Order Management</h4>
               <p style={{ margin: 0, color: '#64748B', fontSize: '0.85rem' }}>View and fulfill B2B orders.</p>
             </div>
             <i className="fa-solid fa-chevron-right" style={{ color: '#CBD5E1' }}></i>
          </div>
        </Link>
        <Link to="/vendor/financials" style={{ textDecoration: 'none' }}>
          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: '1rem', transition: 'all 0.2s' }}>
             <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#F8FAFC', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}><i className="fa-solid fa-wallet"></i></div>
             <div style={{ flex: 1 }}>
               <h4 style={{ margin: '0 0 0.2rem 0', color: '#0F172A', fontSize: '1rem' }}>Financial Ledger</h4>
               <p style={{ margin: 0, color: '#64748B', fontSize: '0.85rem' }}>Track your payouts and earnings.</p>
             </div>
             <i className="fa-solid fa-chevron-right" style={{ color: '#CBD5E1' }}></i>
          </div>
        </Link>
        <Link to="/vendor/rfq" style={{ textDecoration: 'none' }}>
          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: '1rem', transition: 'all 0.2s' }}>
             <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#F8FAFC', color: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}><i className="fa-solid fa-handshake"></i></div>
             <div style={{ flex: 1 }}>
               <h4 style={{ margin: '0 0 0.2rem 0', color: '#0F172A', fontSize: '1rem' }}>Negotiations (RFQ)</h4>
               <p style={{ margin: 0, color: '#64748B', fontSize: '0.85rem' }}>Manage bulk custom quotes.</p>
             </div>
             <i className="fa-solid fa-chevron-right" style={{ color: '#CBD5E1' }}></i>
          </div>
        </Link>
      </div>

    </div>
  );
}
