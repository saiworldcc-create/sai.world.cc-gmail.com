import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Home,
  Package, 
  Search, 
  Calculator, 
  Clock, 
  MapPin, 
  Navigation, 
  ShieldCheck, 
  CheckCircle2, 
  ChevronRight, 
  Phone, 
  ArrowRight, 
  Upload, 
  Sparkles, 
  CreditCard, 
  QrCode, 
  FileText, 
  Plane, 
  Truck, 
  Box, 
  Share2, 
  AlertCircle,
  HelpCircle,
  Calendar,
  Layers,
  Check,
  Bell,
  User,
  LogOut,
  X,
  Lock,
  Mail,
  Fingerprint
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { createBooking, trackShipment } from '../../services/api';
import { COUNTRY_RATES } from '../../constants/appData';
import { AppleSquircleBadge, AppleSaiAppIcon } from '../../components/common/AppleIcons';
import { useUser } from '../../context/UserContext';

const DESTINATION_COUNTRIES = [
  { code: 'USA', name: 'United States', flag: '🇺🇸', transit: '4–5 Days', minDays: 4, ratePerKg: 780 },
  { code: 'UK', name: 'United Kingdom', flag: '🇬🇧', transit: '4–5 Days', minDays: 4, ratePerKg: 690 },
  { code: 'Canada', name: 'Canada', flag: '🇨🇦', transit: '4–5 Days', minDays: 4, ratePerKg: 820 },
  { code: 'Australia', name: 'Australia', flag: '🇦🇺', transit: '4–5 Days', minDays: 4, ratePerKg: 850 },
  { code: 'UAE', name: 'UAE & Dubai', flag: '🇦🇪', transit: '3–4 Days', minDays: 3, ratePerKg: 490 },
  { code: 'Germany', name: 'Germany & Europe', flag: '🇩🇪', transit: '4–5 Days', minDays: 4, ratePerKg: 740 },
  { code: 'Singapore', name: 'Singapore', flag: '🇸🇬', transit: '3–4 Days', minDays: 3, ratePerKg: 520 },
  { code: 'New Zealand', name: 'New Zealand', flag: '🇳🇿', transit: '5–6 Days', minDays: 5, ratePerKg: 890 }
];

const PARCEL_CATEGORIES = [
  { id: 'nri_food', name: 'NRI Pickles & Homemade Food', icon: '🍲', desc: 'Complimentary 5-stage leakproof vacuum packing & spices certification.' },
  { id: 'sweets', name: 'Traditional Sweets & Snacks', icon: '🍬', desc: 'Pootharekulu, Laddu, Halwa with moisture-barrier export sealing.' },
  { id: 'documents', name: 'University Transcripts & Passports', icon: '🎓', desc: 'Tamper-evident waterproof security envelope with priority courier flight.' },
  { id: 'garments', name: 'Textiles & Ready-made Clothes', icon: '👕', desc: 'Proddatur & regional silks, wedding sarees, and export clothing.' },
  { id: 'medicines', name: 'Prescription Healthcare & Medicines', icon: '💊', desc: 'Requires doctor prescription, item invoice & customs medical declaration.' },
  { id: 'general_cargo', name: 'General Commercial Cargo & Samples', icon: '📦', desc: 'Heavy freight, business samples, and e-commerce exports.' }
];

const REGIONAL_HUBS = [
  { id: 'kadapa-ho', name: 'Kadapa Head Office Hub', address: 'Co-operative Colony, Kadapa', phone: '+91 90599 49365' },
  { id: 'hyd-admin', name: 'Hyderabad Administrative & RGIA Hub', address: 'Kushaiguda / RGIA Cargo, Hyderabad', phone: '+91 90000 22821' },
  { id: 'kadapa-b2', name: 'Kadapa Branch 2 (Nagarajupeta)', address: 'Near Visweswaraiah Circle, Kadapa', phone: '+91 90008 67874' },
  { id: 'tirupati', name: 'Tirupati Regional Center', address: 'Bairagi Patteda, Near Babanikethan School', phone: '+91 90599 49365' },
  { id: 'proddatur', name: 'Proddatur Regional Hub', address: 'Bollavaram, Sastry Nagar, Proddatur', phone: '+91 90599 49365' }
];

export default function CustomerApp() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, login, register, logout, isAuth } = useUser();

  // Native Splash Screen State
  const [showSplash, setShowSplash] = useState(true);

  // In-App Notification Center State
  const [showNotifSheet, setShowNotifSheet] = useState(false);
  const [notifications, setNotifications] = useState([
    { 
      id: 1, 
      title: 'Cargo Flight AI-127 En Route', 
      text: 'Consignments for UK & USA cleared RGIA Hyderabad customs and are now in flight.', 
      time: '12m ago', 
      unread: true,
      palette: 'blue'
    },
    { 
      id: 2, 
      title: 'NRI Food Vacuum Sealing Active', 
      text: 'Complimentary 5-layer leakproof vacuum packaging available for all US/UK shipments.', 
      time: '1h ago', 
      unread: true,
      palette: 'orange'
    },
    { 
      id: 3, 
      title: 'Doorstep Pickup Executive', 
      text: 'Calibrated scale & booking kits active across Kadapa, Hyderabad & Tirupati hubs.', 
      time: '3h ago', 
      unread: false,
      palette: 'green'
    }
  ]);

  // Customer Authentication Sheet State
  const [showAuthSheet, setShowAuthSheet] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Active Tab: 'home' | 'book' | 'track' | 'rates' | 'account' | 'passes'
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'home');

  // Booking Flow Wizard State
  const [bookingStep, setBookingStep] = useState(1);
  const [formData, setFormData] = useState({
    senderName: user?.name || '',
    senderPhone: user?.phone || '',
    senderAddress: '',
    pickupDate: new Date().toISOString().split('T')[0],
    pickupSlot: 'Morning (09:00 AM – 12:00 PM)',
    hubZone: 'Kadapa Head Office Hub',
    destCountry: 'USA',
    receiverName: '',
    receiverPhone: '',
    receiverAddress: '',
    receiverCity: '',
    receiverPostal: '',
    category: 'nri_food',
    actualWeight: 5,
    length: 30,
    width: 25,
    height: 20,
    packagingSpecial: true,
    paymentMethod: 'pay_at_doorstep', // 'upi_instant' | 'pay_at_doorstep'
    specialNotes: ''
  });

  const [bookingLoading, setBookingLoading] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Tracking Flow State
  const [trackInput, setTrackInput] = useState(searchParams.get('awb') || '');
  const [trackResult, setTrackResult] = useState(null);
  const [trackLoading, setTrackLoading] = useState(false);
  const [trackError, setTrackError] = useState('');

  // Rate Calculator State
  const [calcCountry, setCalcCountry] = useState('USA');
  const [calcWeight, setCalcWeight] = useState(7);
  const [calcIsFood, setCalcIsFood] = useState(true);

  // Automatically dismiss splash screen after 1.8s
  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 1800);
    return () => clearTimeout(t);
  }, []);

  // Sync user info into sender fields if logged in
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        senderName: prev.senderName || user.name || '',
        senderPhone: prev.senderPhone || user.phone || ''
      }));
    }
  }, [user]);

  // Auto-track if AWB provided in query
  useEffect(() => {
    const awbParam = searchParams.get('awb');
    if (awbParam) {
      setTrackInput(awbParam);
      setActiveTab('track');
      performTrack(awbParam);
    }
  }, [searchParams]);

  // Handle Demo Fill
  const handleAuthDemoFill = () => {
    setAuthEmail('customer@sai.com');
    setAuthPassword('Customer@2026');
    setAuthError('');
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    try {
      if (authMode === 'login') {
        const res = await login(authEmail, authPassword);
        if (res.success) {
          setShowAuthSheet(false);
        } else {
          setAuthError(res.message || 'Login failed. Please verify credentials.');
        }
      } else {
        const res = await register(authName, authEmail, authPassword, authPhone);
        if (res.success) {
          setShowAuthSheet(false);
        } else {
          setAuthError(res.message || 'Registration failed.');
        }
      }
    } catch (err) {
      setAuthError(err.message || 'Authentication error.');
    } finally {
      setAuthLoading(false);
    }
  };

  // Pricing formula computation
  const getSelectedCountryObj = () => DESTINATION_COUNTRIES.find(c => c.code === formData.destCountry) || DESTINATION_COUNTRIES[0];
  const volWeight = Math.ceil((formData.length * formData.width * formData.height) / 5000);
  const chargeableWeight = Math.max(Number(formData.actualWeight) || 1, volWeight);
  const countryObj = getSelectedCountryObj();
  const baseFreight = chargeableWeight * countryObj.ratePerKg;
  const foodPackingFee = formData.packagingSpecial ? 350 : 0;
  const gstTax = Math.round((baseFreight + foodPackingFee) * 0.18);
  const totalAmount = baseFreight + foodPackingFee + gstTax;

  const handleBookingSubmit = async () => {
    setBookingLoading(true);
    try {
      const payload = {
        senderName: formData.senderName,
        senderPhone: formData.senderPhone,
        senderAddress: formData.senderAddress,
        branchZone: formData.hubZone,
        pickupDate: formData.pickupDate,
        pickupTimeSlot: formData.pickupSlot,
        destCountry: formData.destCountry,
        receiverName: formData.receiverName,
        receiverPhone: formData.receiverPhone,
        receiverAddress: `${formData.receiverAddress}, ${formData.receiverCity} ${formData.receiverPostal}`.trim(),
        itemCategory: PARCEL_CATEGORIES.find(p => p.id === formData.category)?.name || 'Express Parcel',
        estimatedWeight: `${chargeableWeight} kg (Vol: ${volWeight}kg / Act: ${formData.actualWeight}kg)`,
        specialInstructions: `${formData.paymentMethod === 'pay_at_doorstep' ? '[Pay on Doorstep Pickup]' : '[Prepaid UPI]'} ${formData.specialNotes || 'Complimentary 5-layer leakproof vacuum packaging'}`
      };

      const res = await createBooking(payload);
      if (res && (res.data || res.success)) {
        const bData = res.data || res;
        setConfirmedBooking({
          ...bData,
          totalAmount,
          chargeableWeight,
          destCountry: formData.destCountry,
          receiverName: formData.receiverName,
          categoryName: PARCEL_CATEGORIES.find(p => p.id === formData.category)?.name
        });
        setBookingStep(5); // Success confirmation view
      }
    } catch (err) {
      alert(err.message || 'Booking submission failed. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  const performTrack = async (awbCode) => {
    if (!awbCode?.trim()) return;
    setTrackLoading(true);
    setTrackError('');
    try {
      const res = await trackShipment(awbCode.trim());
      if (res && res.data) {
        setTrackResult(res.data);
      } else {
        setTrackError('Consignment not found. Please verify the 12-digit AWB number.');
      }
    } catch (err) {
      setTrackError(err.message || 'Shipment not found in live telemetry network.');
    } finally {
      setTrackLoading(false);
    }
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="apple-app-shell">
      {/* =========================================================================
          1. NATIVE APPLE APP SPLASH SCREEN (1.8s Animated Brand Launch)
          ========================================================================= */}
      {showSplash && (
        <div className="apple-splash-screen" onClick={() => setShowSplash(false)}>
          <div className="splash-logo-container">
            <div className="splash-pulse-ring"></div>
            <img src="/assets/images/sai_logo.png" alt="Sai International" className="splash-logo-img" />
          </div>
          <h1 className="splash-title">SAI INTERNATIONAL</h1>
          <p className="splash-subtitle">Worldwide Air Cargo &amp; NRI Logistics</p>
          <div className="splash-loader-bar">
            <div className="splash-loader-fill"></div>
          </div>
          <span className="splash-version">v2.6 iOS 18 • Connecting to Air Hubs...</span>
        </div>
      )}

      {/* =========================================================================
          2. IN-APP NOTIFICATION CENTER SHEET
          ========================================================================= */}
      {showNotifSheet && (
        <div className="apple-notif-backdrop" onClick={() => setShowNotifSheet(false)}>
          <div className="apple-notif-sheet" onClick={e => e.stopPropagation()}>
            <div className="notif-sheet-header">
              <div className="notif-title-row">
                <AppleSquircleBadge palette="blue" size={42}>
                  <Bell size={20} color="#ffffff" strokeWidth={2.4} />
                </AppleSquircleBadge>
                <h3 className="notif-title" style={{ fontSize: '1.05rem', fontWeight: '900' }}>Notifications</h3>
                {unreadCount > 0 && <span className="notif-count-pill">{unreadCount} New</span>}
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  type="button"
                  className="notif-clear-btn"
                  onClick={() => setNotifications(prev => prev.map(n => ({ ...n, unread: false })))}
                >
                  Mark all read
                </button>
                <button
                  type="button"
                  onClick={() => setShowNotifSheet(false)}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                >
                  <X size={22} />
                </button>
              </div>
            </div>

            <div className="notif-items-list">
              {notifications.map(n => (
                <div key={n.id} className={`notif-card-item ${n.unread ? 'unread' : ''}`}>
                  <AppleSquircleBadge palette={n.palette || 'blue'} size={44}>
                    <Plane size={22} color="#ffffff" strokeWidth={2.4} />
                  </AppleSquircleBadge>
                  <div className="notif-card-content">
                    <div className="notif-card-top">
                      <span className="notif-card-title">{n.title}</span>
                      <span className="notif-card-time">{n.time}</span>
                    </div>
                    <p className="notif-card-text">{n.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          3. CUSTOMER AUTHENTICATION MODAL SHEET
          ========================================================================= */}
      {showAuthSheet && (
        <div className="apple-auth-backdrop" onClick={() => setShowAuthSheet(false)}>
          <div className="apple-auth-sheet" onClick={e => e.stopPropagation()}>
            <div className="auth-sheet-top">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img src="/assets/images/sai_logo_transparent.png" alt="Sai Logo" style={{ height: '36px', width: 'auto' }} />
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#ffffff' }}>Customer Account</div>
                  <div style={{ fontSize: '0.72rem', color: '#38bdf8' }}>Sai Doorstep Express</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAuthSheet(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Segmented Control: Login vs Register */}
            <div className="auth-segmented-tabs">
              <button
                type="button"
                className={`auth-tab-btn ${authMode === 'login' ? 'active' : ''}`}
                onClick={() => setAuthMode('login')}
              >
                Sign In
              </button>
              <button
                type="button"
                className={`auth-tab-btn ${authMode === 'register' ? 'active' : ''}`}
                onClick={() => setAuthMode('register')}
              >
                New Account
              </button>
            </div>

            {/* One-Tap Demo Fill */}
            <button
              type="button"
              onClick={handleAuthDemoFill}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '9px 12px',
                borderRadius: '12px',
                backgroundColor: 'rgba(245, 158, 11, 0.12)',
                border: '1px solid rgba(245, 158, 11, 0.35)',
                color: '#fbbf24',
                fontSize: '0.78rem',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              <Sparkles size={14} color="#f59e0b" />
              <span>One-Tap Demo Customer (customer@sai.com)</span>
            </button>

            {authError && (
              <div style={{
                padding: '10px 12px',
                borderRadius: '12px',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#f87171',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <AlertCircle size={16} />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {authMode === 'register' && (
                <>
                  <div className="apple-input-group" style={{ marginBottom: 0 }}>
                    <label className="apple-field-label">Full Name</label>
                    <input
                      type="text"
                      className="apple-text-input"
                      placeholder="e.g. S. Venkata Raman"
                      value={authName}
                      onChange={e => setAuthName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="apple-input-group" style={{ marginBottom: 0 }}>
                    <label className="apple-field-label">Phone / WhatsApp Number</label>
                    <input
                      type="tel"
                      className="apple-text-input"
                      placeholder="+91 90599 49365"
                      value={authPhone}
                      onChange={e => setAuthPhone(e.target.value)}
                      required
                    />
                  </div>
                </>
              )}

              <div className="apple-input-group" style={{ marginBottom: 0 }}>
                <label className="apple-field-label">Email Address</label>
                <input
                  type="email"
                  className="apple-text-input"
                  placeholder="e.g. customer@sai.com"
                  value={authEmail}
                  onChange={e => setAuthEmail(e.target.value)}
                  required
                />
              </div>

              <div className="apple-input-group" style={{ marginBottom: 0 }}>
                <label className="apple-field-label">Password</label>
                <input
                  type="password"
                  className="apple-text-input"
                  placeholder="••••••••••••"
                  value={authPassword}
                  onChange={e => setAuthPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="apple-btn-primary"
                style={{ marginTop: '8px' }}
              >
                {authLoading ? 'Verifying...' : authMode === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <button
              type="button"
              onClick={() => setShowAuthSheet(false)}
              style={{
                background: 'none',
                border: 'none',
                color: '#38bdf8',
                fontSize: '0.8rem',
                fontWeight: '700',
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              Continue as Guest (Instant Self-Booking) →
            </button>
          </div>
        </div>
      )}

      {/* Dynamic Background Mesh Gradients */}
      <div className="apple-ambient-glow-top"></div>
      <div className="apple-ambient-glow-bottom"></div>

      <div className="apple-mobile-device-viewport">
        {/* =========================================================================
            TOP iOS STATUS BAR & OFFICIAL BRAND HEADER
            ========================================================================= */}
        <header className="apple-app-header">
          <div 
            className="apple-brand-pill" 
            onClick={() => setActiveTab('home')}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}
            title="Sai International Home"
          >
            <img 
              src="/assets/images/sai_logo_transparent.png" 
              alt="Sai International Logo" 
              style={{ 
                height: '52px', 
                width: 'auto', 
                objectFit: 'contain',
                filter: 'drop-shadow(0 3px 10px rgba(0, 0, 0, 0.55))'
              }} 
            />
            <div>
              <span className="apple-brand-name" style={{ fontSize: '1.08rem', fontWeight: '900', letterSpacing: '-0.01em', lineHeight: '1.15' }}>SAI INTERNATIONAL</span>
              <span className="apple-brand-sub" style={{ fontSize: '0.74rem', fontWeight: '700', letterSpacing: '0.5px' }}>Worldwide Air Cargo &amp; NRI Logistics</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Notification Bell */}
            <button
              type="button"
              onClick={() => setShowNotifSheet(true)}
              style={{
                position: 'relative',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.16)',
                width: '44px',
                height: '44px',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#ffffff'
              }}
              title="Open Notifications"
            >
              <Bell size={22} color="#ffffff" strokeWidth={2.2} />
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  backgroundColor: '#ff3b30',
                  color: '#ffffff',
                  fontSize: '0.68rem',
                  fontWeight: '900',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 8px #ff3b30'
                }}>
                  {unreadCount}
                </span>
              )}
            </button>

            {/* User Profile Pill or Sign-in Trigger */}
            {isAuth && user ? (
              <div 
                onClick={() => setActiveTab('account')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'rgba(56, 189, 248, 0.16)',
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                  padding: '7px 14px',
                  borderRadius: '16px',
                  color: '#38bdf8',
                  fontSize: '0.82rem',
                  fontWeight: '800',
                  cursor: 'pointer',
                  height: '44px',
                  boxSizing: 'border-box'
                }}
                title="Open My Account"
              >
                <User size={18} strokeWidth={2.4} />
                <span>{user.name?.split(' ')[0] || 'Customer'}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    logout();
                  }}
                  style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: 0 }}
                  title="Sign Out"
                >
                  <LogOut size={15} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setActiveTab('account')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                  backgroundColor: 'rgba(2, 132, 199, 0.22)',
                  border: '1px solid rgba(56, 189, 248, 0.45)',
                  padding: '7px 15px',
                  borderRadius: '16px',
                  color: '#38bdf8',
                  fontSize: '0.84rem',
                  fontWeight: '800',
                  cursor: 'pointer',
                  height: '44px',
                  boxSizing: 'border-box'
                }}
              >
                <User size={18} strokeWidth={2.4} />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </header>

        {/* Dynamic Main App Screen */}
        <main className="apple-screen-body">
          {/* =========================================================================
              TAB 0: APPLE HOME & EXPLORE DASHBOARD (DEFAULT APPLICATION SCREEN)
              ========================================================================= */}
          {activeTab === 'home' && (
            <div className="apple-view-content fade-in apple-home-container">
              {/* 1. Apple Hero Banner */}
              <div className="apple-hero-banner">
                <div className="apple-hero-tag">
                  <Plane size={13} />
                  <span>Daily Air Cargo • Hyderabad RGIA to 195+ Countries</span>
                </div>
                <h2 className="apple-hero-title">
                  Send Homemade Food &amp; Express Cargo <span>Worldwide</span>
                </h2>
                <p className="apple-hero-desc">
                  Free 5-stage leakproof vacuum packing for Andhra pickles &amp; sweets. Calibrated electronic scale &amp; booking kit brought straight to your doorstep.
                </p>
                <button 
                  type="button" 
                  className="apple-hero-cta"
                  onClick={() => {
                    setActiveTab('book');
                    setBookingStep(1);
                  }}
                >
                  <Package size={18} />
                  <span>Book Doorstep Pickup Now</span>
                  <ArrowRight size={16} />
                </button>
              </div>

              {/* 2. Quick Actions Grid */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <h3 style={{ fontSize: '0.86rem', fontWeight: '800', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>
                    Quick Services
                  </h3>
                  <span style={{ fontSize: '0.7rem', color: '#38bdf8', fontWeight: '700' }}>Express Desk</span>
                </div>

                <div className="apple-quick-grid">
                  <div 
                    className="apple-quick-card"
                    onClick={() => {
                      setActiveTab('book');
                      setBookingStep(1);
                    }}
                  >
                    <AppleSquircleBadge palette="blue" size={64}>
                      <Package size={32} color="#ffffff" strokeWidth={2.4} />
                    </AppleSquircleBadge>
                    <span className="apple-quick-label">Book Pickup</span>
                    <span className="apple-quick-sub">At Doorstep</span>
                  </div>

                  <div 
                    className="apple-quick-card"
                    onClick={() => {
                      setActiveTab('track');
                    }}
                  >
                    <AppleSquircleBadge palette="teal" size={64}>
                      <Navigation size={32} color="#ffffff" strokeWidth={2.4} />
                    </AppleSquircleBadge>
                    <span className="apple-quick-label">Live Track</span>
                    <span className="apple-quick-sub">Flight Radar</span>
                  </div>

                  <div 
                    className="apple-quick-card"
                    onClick={() => {
                      setActiveTab('rates');
                    }}
                  >
                    <AppleSquircleBadge palette="gold" size={64}>
                      <Calculator size={32} color="#ffffff" strokeWidth={2.4} />
                    </AppleSquircleBadge>
                    <span className="apple-quick-label">Rates</span>
                    <span className="apple-quick-sub">195 Countries</span>
                  </div>

                  <div 
                    className="apple-quick-card"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, category: 'nri_food', packagingSpecial: true }));
                      setActiveTab('book');
                      setBookingStep(3);
                    }}
                  >
                    <AppleSquircleBadge palette="orange" size={64}>
                      <Sparkles size={32} color="#ffffff" strokeWidth={2.4} />
                    </AppleSquircleBadge>
                    <span className="apple-quick-label">NRI Food</span>
                    <span className="apple-quick-sub">Vacuum Pack</span>
                  </div>

                  <div 
                    className="apple-quick-card"
                    onClick={() => {
                      setActiveTab('account');
                    }}
                  >
                    <AppleSquircleBadge palette="purple" size={64}>
                      <User size={32} color="#ffffff" strokeWidth={2.4} />
                    </AppleSquircleBadge>
                    <span className="apple-quick-label">My Account</span>
                    <span className="apple-quick-sub">{isAuth ? 'Logged In' : 'Sign In'}</span>
                  </div>

                  <a 
                    href="https://wa.me/919059949365?text=Hello%20Sai%20International%20Couriers,%20I%20want%20to%20inquire%20about%20international%20courier%20booking" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="apple-quick-card"
                    style={{ textDecoration: 'none' }}
                  >
                    <AppleSquircleBadge palette="green" size={64}>
                      <Phone size={32} color="#ffffff" strokeWidth={2.4} />
                    </AppleSquircleBadge>
                    <span className="apple-quick-label">WhatsApp VIP</span>
                    <span className="apple-quick-sub">24/7 Hotline</span>
                  </a>
                </div>
              </div>

              {/* 3. Live Flight Telemetry Radar Card */}
              <div className="apple-radar-card">
                <div className="apple-radar-top">
                  <div className="apple-radar-beacon">
                    <span className="beacon-dot"></span>
                    <span>LIVE AIR CARGO TELEMETRY</span>
                  </div>
                  <span style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: '700' }}>
                    AWB #839201948291
                  </span>
                </div>

                <div className="apple-radar-flight">
                  <div className="radar-airport">
                    <span className="airport-code">HYD</span>
                    <span className="airport-city">Rajiv Gandhi Int.</span>
                  </div>

                  <div className="radar-flight-mid">
                    <Plane size={18} className="flight-plane-glyph" />
                    <div className="flight-track-line"></div>
                    <span className="flight-eta-pill">Flight EK-525 • In Transit</span>
                  </div>

                  <div className="radar-airport" style={{ textAlign: 'right' }}>
                    <span className="airport-code">DFW</span>
                    <span className="airport-city">Dallas, USA</span>
                  </div>
                </div>

                <button 
                  type="button" 
                  className="apple-radar-btn"
                  onClick={() => {
                    setTrackInput('839201948291');
                    setActiveTab('track');
                    performTrack('839201948291');
                  }}
                >
                  <Navigation size={15} />
                  <span>Inspect Consignment Radar Telemetry</span>
                </button>
              </div>

              {/* 4. Popular Global Destinations (1-Tap Ship) */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <h3 style={{ fontSize: '0.86rem', fontWeight: '800', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>
                    Express Air Corridors
                  </h3>
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Door-to-Door Rates</span>
                </div>

                <div className="apple-dest-grid">
                  {DESTINATION_COUNTRIES.slice(0, 4).map(country => (
                    <div key={country.code} className="apple-dest-card">
                      <div className="apple-dest-top">
                        <span className="dest-flag">{country.flag}</span>
                        <span className="dest-price">₹{country.ratePerKg}<small style={{ fontSize: '0.65rem', color: '#94a3b8' }}>/kg</small></span>
                      </div>
                      <div>
                        <div className="dest-country-name">{country.name}</div>
                        <div className="dest-transit">⚡ {country.transit} Door Delivery</div>
                      </div>
                      <button
                        type="button"
                        className="dest-ship-btn"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, destCountry: country.code }));
                          setActiveTab('book');
                          setBookingStep(2);
                        }}
                      >
                        <span>Ship Now</span>
                        <ChevronRight size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. Special NRI Logistics & Packaging Guarantees */}
              <div>
                <h3 style={{ fontSize: '0.86rem', fontWeight: '800', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px', marginTop: '4px' }}>
                  Why Sai Express?
                </h3>
                <div className="apple-benefits-list">
                  <div className="apple-benefit-item">
                    <AppleSquircleBadge palette="orange" size={52}>
                      <Sparkles size={26} color="#ffffff" strokeWidth={2.2} />
                    </AppleSquircleBadge>
                    <div className="apple-benefit-content">
                      <div className="apple-benefit-title" style={{ fontSize: '0.92rem' }}>Complimentary NRI Food Vacuum Sealing</div>
                      <div className="apple-benefit-desc" style={{ fontSize: '0.76rem' }}>5-layer heavy duty food-grade nitrogen vacuum pouching prevents leakage and odor on airlines.</div>
                    </div>
                  </div>

                  <div className="apple-benefit-item">
                    <AppleSquircleBadge palette="blue" size={52}>
                      <ShieldCheck size={26} color="#ffffff" strokeWidth={2.2} />
                    </AppleSquircleBadge>
                    <div className="apple-benefit-content">
                      <div className="apple-benefit-title" style={{ fontSize: '0.92rem' }}>Calibrated Scale at Doorstep</div>
                      <div className="apple-benefit-desc" style={{ fontSize: '0.76rem' }}>Our booking executive carries a certified electronic scale so you verify physical and volumetric weight before paying.</div>
                    </div>
                  </div>

                  <div className="apple-benefit-item">
                    <AppleSquircleBadge palette="green" size={52}>
                      <CheckCircle2 size={26} color="#ffffff" strokeWidth={2.2} />
                    </AppleSquircleBadge>
                    <div className="apple-benefit-content">
                      <div className="apple-benefit-title" style={{ fontSize: '0.92rem' }}>100% Export Customs &amp; KYC Clearance</div>
                      <div className="apple-benefit-desc" style={{ fontSize: '0.76rem' }}>Complete legal clearance for USA FDA, UK HMRC, Australia Biosecurity and Canadian customs.</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 6. Administrative Office & Kadapa Hub Info */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '16px',
                padding: '14px',
                fontSize: '0.74rem',
                color: '#94a3b8',
                lineHeight: '1.4'
              }}>
                <strong style={{ color: '#ffffff', display: 'block', marginBottom: '4px' }}>
                  📍 Hyderabad Administrative Office:
                </strong>
                Plot no: 1-9-202/29/15A, 2nd Floor, Hanuman Nagar Colony, E.C. Complex, Kushaiguda, Hyderabad - 500062
                <div style={{ marginTop: '6px', color: '#38bdf8' }}>
                  Direct Hotline: +91 90599 49365 / +91 90000 22821
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 1: CUSTOMER SELF-BOOKING WIZARD
              ========================================================================= */}
          {activeTab === 'book' && (
            <div className="apple-view-content fade-in">
              {/* Wizard Step Progress Tracker (Apple Segmented Pills) */}
              {bookingStep <= 4 && (
                <div className="apple-wizard-stepper">
                  <div className="stepper-pills-row">
                    <div className={`stepper-pill-item ${bookingStep === 1 ? 'active' : bookingStep > 1 ? 'completed' : ''}`}>
                      <span className="stepper-num-circle">{bookingStep > 1 ? '✓' : '1'}</span>
                      <span>Pickup</span>
                    </div>
                    <div className={`stepper-pill-item ${bookingStep === 2 ? 'active' : bookingStep > 2 ? 'completed' : ''}`}>
                      <span className="stepper-num-circle">{bookingStep > 2 ? '✓' : '2'}</span>
                      <span>Dest</span>
                    </div>
                    <div className={`stepper-pill-item ${bookingStep === 3 ? 'active' : bookingStep > 3 ? 'completed' : ''}`}>
                      <span className="stepper-num-circle">{bookingStep > 3 ? '✓' : '3'}</span>
                      <span>Packing</span>
                    </div>
                    <div className={`stepper-pill-item ${bookingStep === 4 ? 'active' : ''}`}>
                      <span className="stepper-num-circle">4</span>
                      <span>Review</span>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 1: Doorstep Pickup Details */}
              {bookingStep === 1 && (
                <div className="apple-card-panel">
                  <div className="panel-title-row">
                    <AppleSquircleBadge palette="blue" size={56}>
                      <MapPin size={28} color="#ffffff" strokeWidth={2.4} />
                    </AppleSquircleBadge>
                    <div>
                      <h2 className="panel-title">Doorstep Pickup Details</h2>
                      <p className="panel-subtitle">Our executive will arrive with calibrated scale &amp; packing kit.</p>
                    </div>
                  </div>

                  <div className="apple-input-group">
                    <label className="apple-field-label">Sender Full Name *</label>
                    <input 
                      type="text" 
                      className="apple-text-input" 
                      placeholder="e.g. S. Venkata Raman"
                      value={formData.senderName}
                      onChange={e => setFormData({ ...formData, senderName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="apple-input-group">
                    <label className="apple-field-label">Sender WhatsApp / Phone Number *</label>
                    <input 
                      type="tel" 
                      className="apple-text-input" 
                      placeholder="+91 90599 49365"
                      value={formData.senderPhone}
                      onChange={e => setFormData({ ...formData, senderPhone: e.target.value })}
                      required
                    />
                  </div>

                  <div className="apple-input-group">
                    <label className="apple-field-label">Complete Doorstep Pickup Address *</label>
                    <textarea 
                      className="apple-textarea" 
                      rows="3" 
                      placeholder="Door No, Street Name, Colony, Landmark, Pincode"
                      value={formData.senderAddress}
                      onChange={e => setFormData({ ...formData, senderAddress: e.target.value })}
                      required
                    ></textarea>
                  </div>

                  <div className="apple-two-col-grid">
                    <div className="apple-input-group">
                      <label className="apple-field-label">Pickup Date</label>
                      <input 
                        type="date" 
                        className="apple-text-input"
                        value={formData.pickupDate}
                        onChange={e => setFormData({ ...formData, pickupDate: e.target.value })}
                      />
                    </div>
                    <div className="apple-input-group">
                      <label className="apple-field-label">Preferred Time Slot</label>
                      <select 
                        className="apple-select"
                        value={formData.pickupSlot}
                        onChange={e => setFormData({ ...formData, pickupSlot: e.target.value })}
                      >
                        <option value="Morning (09:00 AM – 12:00 PM)">Morning (09 AM – 12 PM)</option>
                        <option value="Afternoon (12:00 PM – 03:00 PM)">Afternoon (12 PM – 03 PM)</option>
                        <option value="Evening (03:00 PM – 07:00 PM)">Evening (03 PM – 07 PM)</option>
                      </select>
                    </div>
                  </div>

                  <div className="apple-input-group">
                    <label className="apple-field-label">Regional Dispatch Hub</label>
                    <select 
                      className="apple-select"
                      value={formData.hubZone}
                      onChange={e => setFormData({ ...formData, hubZone: e.target.value })}
                    >
                      {REGIONAL_HUBS.map(hub => (
                        <option key={hub.id} value={hub.name}>{hub.name} ({hub.address})</option>
                      ))}
                    </select>
                  </div>

                  <button 
                    className="apple-btn-primary" 
                    onClick={() => {
                      if (!formData.senderName || !formData.senderPhone || !formData.senderAddress) {
                        alert('Please enter sender name, phone number, and pickup address.');
                        return;
                      }
                      setBookingStep(2);
                    }}
                  >
                    <span>Proceed to Destination</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              )}

              {/* STEP 2: International Destination */}
              {bookingStep === 2 && (
                <div className="apple-card-panel">
                  <div className="panel-title-row">
                    <AppleSquircleBadge palette="purple" size={56}>
                      <Plane size={28} color="#ffffff" strokeWidth={2.4} />
                    </AppleSquircleBadge>
                    <div>
                      <h2 className="panel-title">Destination &amp; Consignee</h2>
                      <p className="panel-subtitle">Select target country and recipient contact information.</p>
                    </div>
                  </div>

                  <label className="apple-field-label">Select Destination Country *</label>
                  <div className="apple-country-chips-grid">
                    {DESTINATION_COUNTRIES.map(c => (
                      <div 
                        key={c.code}
                        className={`country-chip ${formData.destCountry === c.code ? 'chip-selected' : ''}`}
                        onClick={() => setFormData({ ...formData, destCountry: c.code })}
                      >
                        <span className="country-flag">{c.flag}</span>
                        <div className="country-meta">
                          <strong className="country-name">{c.name}</strong>
                          <span className="country-transit">{c.transit}</span>
                        </div>
                        {formData.destCountry === c.code && <CheckCircle2 size={18} className="chip-check" />}
                      </div>
                    ))}
                  </div>

                  <div className="apple-input-group">
                    <label className="apple-field-label">Consignee / Receiver Name *</label>
                    <input 
                      type="text" 
                      className="apple-text-input" 
                      placeholder="Full name as on foreign passport/ID"
                      value={formData.receiverName}
                      onChange={e => setFormData({ ...formData, receiverName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="apple-input-group">
                    <label className="apple-field-label">Receiver Foreign Mobile / WhatsApp *</label>
                    <input 
                      type="tel" 
                      className="apple-text-input" 
                      placeholder="+1 (USA) / +44 (UK) / +971 (UAE)"
                      value={formData.receiverPhone}
                      onChange={e => setFormData({ ...formData, receiverPhone: e.target.value })}
                      required
                    />
                  </div>

                  <div className="apple-input-group">
                    <label className="apple-field-label">Destination Street Address</label>
                    <input 
                      type="text" 
                      className="apple-text-input" 
                      placeholder="Apartment, Suite, Street name"
                      value={formData.receiverAddress}
                      onChange={e => setFormData({ ...formData, receiverAddress: e.target.value })}
                    />
                  </div>

                  <div className="apple-two-col-grid">
                    <div className="apple-input-group">
                      <label className="apple-field-label">City</label>
                      <input 
                        type="text" 
                        className="apple-text-input" 
                        placeholder="e.g. Dallas, London"
                        value={formData.receiverCity}
                        onChange={e => setFormData({ ...formData, receiverCity: e.target.value })}
                      />
                    </div>
                    <div className="apple-input-group">
                      <label className="apple-field-label">Postal / ZIP Code</label>
                      <input 
                        type="text" 
                        className="apple-text-input" 
                        placeholder="e.g. 75001"
                        value={formData.receiverPostal}
                        onChange={e => setFormData({ ...formData, receiverPostal: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="apple-button-row">
                    <button className="apple-btn-secondary" onClick={() => setBookingStep(1)}>
                      Back
                    </button>
                    <button 
                      className="apple-btn-primary" 
                      onClick={() => {
                        if (!formData.receiverName || !formData.receiverPhone) {
                          alert('Please enter recipient name and telephone number.');
                          return;
                        }
                        setBookingStep(3);
                      }}
                    >
                      <span>Next: Packaging</span>
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Parcel Category & Weight Estimator */}
              {bookingStep === 3 && (
                <div className="apple-card-panel">
                  <div className="panel-title-row">
                    <AppleSquircleBadge palette="orange" size={56}>
                      <Box size={28} color="#ffffff" strokeWidth={2.4} />
                    </AppleSquircleBadge>
                    <div>
                      <h2 className="panel-title">Parcel &amp; Weight Estimator</h2>
                      <p className="panel-subtitle">Specialized vacuum packaging and live weight calculation.</p>
                    </div>
                  </div>

                  <label className="apple-field-label">Shipment Category *</label>
                  <div className="apple-category-list">
                    {PARCEL_CATEGORIES.map(cat => {
                      const paletteMap = {
                        nri_food: 'orange',
                        sweets: 'gold',
                        documents: 'blue',
                        garments: 'purple',
                        medicines: 'red',
                        general_cargo: 'teal'
                      };
                      return (
                        <div 
                          key={cat.id}
                          className={`category-item-card ${formData.category === cat.id ? 'cat-selected' : ''}`}
                          onClick={() => setFormData({ ...formData, category: cat.id })}
                        >
                          <AppleSquircleBadge palette={paletteMap[cat.id] || 'blue'} size={52}>
                            <span style={{ fontSize: '1.65rem', lineHeight: 1 }}>{cat.icon}</span>
                          </AppleSquircleBadge>
                          <div className="cat-info">
                            <strong>{cat.name}</strong>
                            <p>{cat.desc}</p>
                          </div>
                          {formData.category === cat.id && <CheckCircle2 size={18} className="cat-check" />}
                        </div>
                      );
                    })}
                  </div>

                  <div className="apple-weight-slider-box">
                    <div className="slider-header">
                      <span className="slider-title">Estimated Actual Weight</span>
                      <span className="slider-val">{formData.actualWeight} KG</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="50" 
                      step="1"
                      className="apple-slider"
                      value={formData.actualWeight}
                      onChange={e => setFormData({ ...formData, actualWeight: Number(e.target.value) })}
                    />
                    <div className="slider-ticks">
                      <span>1 kg</span>
                      <span>10 kg</span>
                      <span>25 kg</span>
                      <span>50 kg</span>
                    </div>
                  </div>

                  {/* Volumetric Dimensions */}
                  <div className="apple-dimensions-box">
                    <span className="box-title">Box Dimensions (For Volumetric Weight Calculation)</span>
                    <div className="dimension-inputs-row">
                      <div>
                        <label>Length (cm)</label>
                        <input 
                          type="number" 
                          value={formData.length} 
                          onChange={e => setFormData({ ...formData, length: Number(e.target.value) || 1 })} 
                        />
                      </div>
                      <div>
                        <label>Width (cm)</label>
                        <input 
                          type="number" 
                          value={formData.width} 
                          onChange={e => setFormData({ ...formData, width: Number(e.target.value) || 1 })} 
                        />
                      </div>
                      <div>
                        <label>Height (cm)</label>
                        <input 
                          type="number" 
                          value={formData.height} 
                          onChange={e => setFormData({ ...formData, height: Number(e.target.value) || 1 })} 
                        />
                      </div>
                    </div>
                    <div className="chargeable-note">
                      Volumetric Weight: <strong>{volWeight} kg</strong> • Chargeable Weight: <span className="highlight">{chargeableWeight} kg</span>
                    </div>
                  </div>

                  {/* Special Packaging Toggle */}
                  <div 
                    className="apple-toggle-box"
                    onClick={() => setFormData({ ...formData, packagingSpecial: !formData.packagingSpecial })}
                  >
                    <div className="toggle-info">
                      <strong>Complimentary 5-Layer Export Sealing</strong>
                      <p>Moisture-barrier vacuum sealing, bubble wrap &amp; tamper-proof security carton (Included Free).</p>
                    </div>
                    <div className={`apple-switch ${formData.packagingSpecial ? 'switch-on' : ''}`}>
                      <div className="switch-thumb"></div>
                    </div>
                  </div>

                  <div className="apple-button-row">
                    <button className="apple-btn-secondary" onClick={() => setBookingStep(2)}>
                      Back
                    </button>
                    <button className="apple-btn-primary" onClick={() => setBookingStep(4)}>
                      <span>Review &amp; Quote</span>
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: Review, Live Pricing & Confirmation */}
              {bookingStep === 4 && (
                <div className="apple-card-panel">
                  <div className="panel-title-row">
                    <AppleSquircleBadge palette="green" size={56}>
                      <CheckCircle2 size={28} color="#ffffff" strokeWidth={2.4} />
                    </AppleSquircleBadge>
                    <div>
                      <h2 className="panel-title">Review &amp; Instant Booking</h2>
                      <p className="panel-subtitle">Transparent billing with zero hidden customs charges.</p>
                    </div>
                  </div>

                  {/* Order Summary Pass */}
                  <div className="apple-boarding-pass">
                    <div className="pass-header">
                      <div>
                        <span className="pass-eyebrow">ORIGIN</span>
                        <strong className="pass-city">Andhra Pradesh</strong>
                        <span className="pass-hub">{formData.hubZone.split('Hub')[0]}</span>
                      </div>
                      <div className="pass-flight-route">
                        <Plane size={24} className="flight-icon" />
                        <span className="route-line"></span>
                        <span className="transit-badge">{countryObj.transit}</span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span className="pass-eyebrow">DESTINATION</span>
                        <strong className="pass-city">{countryObj.name}</strong>
                        <span className="pass-hub">{countryObj.flag} {countryObj.code}</span>
                      </div>
                    </div>

                    <div className="pass-details-grid">
                      <div>
                        <span className="label">Sender</span>
                        <strong>{formData.senderName}</strong>
                        <span className="sub">{formData.senderPhone}</span>
                      </div>
                      <div>
                        <span className="label">Receiver</span>
                        <strong>{formData.receiverName}</strong>
                        <span className="sub">{formData.receiverPhone}</span>
                      </div>
                      <div>
                        <span className="label">Category</span>
                        <strong>{PARCEL_CATEGORIES.find(p => p.id === formData.category)?.name}</strong>
                      </div>
                      <div>
                        <span className="label">Chargeable Wt.</span>
                        <strong className="highlight">{chargeableWeight} KG</strong>
                      </div>
                    </div>

                    <div className="pass-pricing-breakdown">
                      <div className="price-row">
                        <span>Base Freight ({chargeableWeight}kg × ₹{countryObj.ratePerKg}):</span>
                        <span>₹{baseFreight.toLocaleString()}</span>
                      </div>
                      {foodPackingFee > 0 && (
                        <div className="price-row">
                          <span>5-Layer Food Sealing &amp; Vacuum Pack:</span>
                          <span style={{ color: '#34d399', fontWeight: 'bold' }}>FREE (Included)</span>
                        </div>
                      )}
                      <div className="price-row">
                        <span>GST &amp; Aviation Fuel Surcharge (18%):</span>
                        <span>₹{gstTax.toLocaleString()}</span>
                      </div>
                      <div className="price-total-row">
                        <span>All-Inclusive Total Rate:</span>
                        <span className="total-val">₹{totalAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Selection */}
                  <div className="payment-select-group">
                    <label className="apple-field-label">Payment Preference</label>
                    <div className="payment-options-grid">
                      <div 
                        className={`pay-card ${formData.paymentMethod === 'pay_at_doorstep' ? 'pay-selected' : ''}`}
                        onClick={() => setFormData({ ...formData, paymentMethod: 'pay_at_doorstep' })}
                      >
                        <div className="pay-icon"><Truck size={20} /></div>
                        <div>
                          <strong>Pay at Doorstep Pickup (UPI / Cash)</strong>
                          <p>Weigh with executive on calibrated scale, then pay via UPI QR or Cash.</p>
                        </div>
                        {formData.paymentMethod === 'pay_at_doorstep' && <CheckCircle2 size={18} className="pay-check" />}
                      </div>

                      <div 
                        className={`pay-card ${formData.paymentMethod === 'upi_instant' ? 'pay-selected' : ''}`}
                        onClick={() => setFormData({ ...formData, paymentMethod: 'upi_instant' })}
                      >
                        <div className="pay-icon"><QrCode size={20} /></div>
                        <div>
                          <strong>Pay Instant via UPI QR Code</strong>
                          <p>Scan on screen using Google Pay, PhonePe, Paytm, or BHIM.</p>
                        </div>
                        {formData.paymentMethod === 'upi_instant' && <CheckCircle2 size={18} className="pay-check" />}
                      </div>
                    </div>
                  </div>

                  {formData.paymentMethod === 'upi_instant' && (
                    <div style={{ textAlign: 'center', padding: '16px 0' }}>
                      <span className="apple-field-label">Scan Dynamic UPI QR</span>
                      <div style={{ background: '#fff', padding: '12px', display: 'inline-block', borderRadius: '14px', margin: '8px auto' }}>
                        <QRCodeSVG 
                          value={`upi://pay?pa=saiinternationalcouriers@upi&pn=Sai%20International%20Couriers&am=${totalAmount}&cu=INR`} 
                          size={140} 
                        />
                      </div>
                      <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>Scan to authorize direct bank clearance for Andhra Pradesh pickup.</p>
                    </div>
                  )}

                  <div className="apple-button-row">
                    <button className="apple-btn-secondary" onClick={() => setBookingStep(3)}>
                      Back
                    </button>
                    <button 
                      className="apple-btn-primary glow"
                      disabled={bookingLoading}
                      onClick={handleBookingSubmit}
                    >
                      {bookingLoading ? (
                        <span>Dispatched to Driver...</span>
                      ) : (
                        <>
                          <CheckCircle2 size={18} />
                          <span>Confirm Doorstep Booking &amp; Generate Pass</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 5: Success & Digital Air Waybill Boarding Pass */}
              {bookingStep === 5 && confirmedBooking && (
                <div className="apple-card-panel success-view">
                  <div className="success-badge-circle">
                    <CheckCircle2 size={40} color="#10b981" />
                  </div>
                  <span className="success-pill">BOOKING CONFIRMED &amp; DISPATCHED</span>
                  <h2 className="success-title">Your Doorstep Pickup is Scheduled</h2>
                  <p className="success-desc">
                    An executive driver from our <strong>{confirmedBooking.branchZone}</strong> has been notified for pickup on <strong>{formData.pickupDate}</strong> ({formData.pickupSlot}).
                  </p>

                  <div className="apple-digital-ticket">
                    <div className="ticket-awb-row">
                      <div>
                        <span className="awb-label">TRACKING AWB NUMBER</span>
                        <strong className="awb-number">{confirmedBooking.awb}</strong>
                      </div>
                      <div className="qr-wrapper">
                        <QRCodeSVG value={`https://saiexpresscourier.com/tracking?awb=${confirmedBooking.awb}`} size={76} />
                      </div>
                    </div>

                    <div className="ticket-meta-grid">
                      <div>
                        <span>Sender:</span>
                        <strong>{confirmedBooking.senderName}</strong>
                      </div>
                      <div>
                        <span>Destination:</span>
                        <strong>{confirmedBooking.destCountry}</strong>
                      </div>
                      <div>
                        <span>Est. Total:</span>
                        <strong className="highlight">₹{confirmedBooking.totalAmount?.toLocaleString()}</strong>
                      </div>
                      <div>
                        <span>Status:</span>
                        <span className="status-live">Driver Dispatched</span>
                      </div>
                    </div>
                  </div>

                  <div className="ticket-actions-grid">
                    <button 
                      className="apple-btn-secondary"
                      onClick={() => {
                        setTrackInput(confirmedBooking.awb);
                        setActiveTab('track');
                        performTrack(confirmedBooking.awb);
                      }}
                    >
                      <Navigation size={16} /> Track Telemetry
                    </button>

                    <a 
                      href={`https://wa.me/?text=${encodeURIComponent(`Here is my Sai International Air Waybill Pass: AWB ${confirmedBooking.awb}. Track live flight status at https://saiexpresscourier.com/tracking?awb=${confirmedBooking.awb}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="apple-btn-secondary"
                      style={{ textDecoration: 'none', color: '#25D366' }}
                    >
                      <Share2 size={16} /> Share on WhatsApp
                    </a>
                  </div>

                  <button 
                    className="apple-btn-ghost"
                    onClick={() => {
                      setBookingStep(1);
                      setConfirmedBooking(null);
                    }}
                  >
                    + Book Another Overseas Consignment
                  </button>
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              TAB 2: LIVE SATELLITE TRACKING & TELEMETRY
              ========================================================================= */}
          {activeTab === 'track' && (
            <div className="apple-view-content fade-in">
              <div className="apple-card-panel">
                <div className="panel-title-row">
                  <AppleSquircleBadge palette="teal" size={56}>
                    <Navigation size={28} color="#ffffff" strokeWidth={2.4} />
                  </AppleSquircleBadge>
                  <div>
                    <h2 className="panel-title">Autonomous Satellite Tracking</h2>
                    <p className="panel-subtitle">Enter your 12-digit Air Waybill for live flight &amp; courier telemetry.</p>
                  </div>
                </div>

                <div className="apple-search-bar">
                  <Search size={18} className="search-icon" />
                  <input 
                    type="text"
                    className="search-input"
                    placeholder="Enter AWB Code (e.g. SAI-USA-7721)"
                    value={trackInput}
                    onChange={e => setTrackInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && performTrack(trackInput)}
                  />
                  <button 
                    className="search-submit-btn" 
                    onClick={() => performTrack(trackInput)}
                    disabled={trackLoading}
                  >
                    {trackLoading ? 'Pinging...' : 'Locate'}
                  </button>
                </div>

                <div className="apple-sample-pills">
                  <span className="pills-label">Recent Flights:</span>
                  {['SAI-USA-7721', 'SAI-UK-8842', 'SAI-UAE-9931'].map(sample => (
                    <button 
                      key={sample}
                      type="button"
                      onClick={() => {
                        setTrackInput(sample);
                        performTrack(sample);
                      }}
                    >
                      {sample}
                    </button>
                  ))}
                </div>

                {trackError && (
                  <div style={{
                    padding: '12px 14px',
                    borderRadius: '14px',
                    backgroundColor: 'rgba(239, 68, 68, 0.12)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#f87171',
                    fontSize: '0.84rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '14px'
                  }}>
                    <AlertCircle size={18} />
                    <span>{trackError}</span>
                  </div>
                )}

                {trackResult && (
                  <div className="apple-telemetry-result">
                    <div className="telemetry-top-bar">
                      <div>
                        <span className="telemetry-awb">{trackResult.awb || trackInput}</span>
                        <h3 className="telemetry-status">{trackResult.status}</h3>
                      </div>
                      <span className="telemetry-carrier-tag">
                        <Plane size={14} />
                        {trackResult.carrier || 'Global Express Jet'}
                      </span>
                    </div>

                    <div className="telemetry-stats-row">
                      <div>
                        <span>Origin</span>
                        <strong>{trackResult.origin || 'Hyderabad Central Hub'}</strong>
                      </div>
                      <div>
                        <span>Destination</span>
                        <strong>{trackResult.destination || 'International Corridor'}</strong>
                      </div>
                      <div>
                        <span>ETA Arrival</span>
                        <strong>{trackResult.eta || '3–4 Business Days'}</strong>
                      </div>
                    </div>

                    {/* Progress checkpoints */}
                    <div className="telemetry-timeline">
                      {(trackResult.history || [
                        { status: 'Order Picked Up Confirmed', location: 'Kadapa Regional Hub', time: 'Today 09:30 AM', completed: true },
                        { status: '5-Layer Vacuum Sealing Completed', location: 'Sai Packaging Hub', time: 'Today 01:15 PM', completed: true },
                        { status: 'Customs Cleared & RGIA Manifest', location: 'Hyderabad Air Cargo Hub', time: 'Today 05:45 PM', completed: true },
                        { status: 'Air Freight Cargo in Flight', location: 'International Flight AI-127', time: 'In Flight', active: true },
                        { status: 'Out for Doorstep Delivery', location: 'Destination Airport Hub', time: 'Pending', pending: true }
                      ]).map((item, idx) => (
                        <div key={idx} className={`timeline-checkpoint ${item.completed ? 'cp-done' : item.active ? 'cp-active' : 'cp-pending'}`}>
                          <div className="cp-marker">
                            {item.completed ? <Check size={12} /> : item.active ? <span className="cp-ping"></span> : null}
                          </div>
                          <div className="cp-content">
                            <strong>{item.status}</strong>
                            <p>{item.location} • <span className="cp-time">{item.time}</span></p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 3: TRANSPARENT RATE CALCULATOR
              ========================================================================= */}
          {activeTab === 'rates' && (
            <div className="apple-view-content fade-in">
              <div className="apple-card-panel">
                <div className="panel-title-row">
                  <AppleSquircleBadge palette="gold" size={56}>
                    <Calculator size={28} color="#ffffff" strokeWidth={2.4} />
                  </AppleSquircleBadge>
                  <div>
                    <h2 className="panel-title">Instant Air Freight Calculator</h2>
                    <p className="panel-subtitle">Transparent door-to-door overseas rates from Andhra Pradesh.</p>
                  </div>
                </div>

                <div className="apple-input-group">
                  <label className="apple-field-label">Target Destination Country</label>
                  <select 
                    className="apple-select"
                    value={calcCountry}
                    onChange={e => setCalcCountry(e.target.value)}
                  >
                    {DESTINATION_COUNTRIES.map(c => (
                      <option key={c.code} value={c.code}>{c.flag} {c.name} ({c.transit})</option>
                    ))}
                  </select>
                </div>

                <div className="apple-weight-slider-box">
                  <div className="slider-header">
                    <span className="slider-title">Shipment Weight</span>
                    <span className="slider-val">{calcWeight} KG</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="60" 
                    step="1"
                    className="apple-slider"
                    value={calcWeight}
                    onChange={e => setCalcWeight(Number(e.target.value))}
                  />
                  <div className="slider-ticks">
                    <span>1 kg</span>
                    <span>15 kg</span>
                    <span>30 kg</span>
                    <span>60 kg</span>
                  </div>
                </div>

                {(() => {
                  const sel = DESTINATION_COUNTRIES.find(c => c.code === calcCountry) || DESTINATION_COUNTRIES[0];
                  const fr = calcWeight * sel.ratePerKg;
                  const pack = calcIsFood ? 350 : 0;
                  const gst = Math.round((fr + pack) * 0.18);
                  const total = fr + pack + gst;

                  return (
                    <div className="apple-quote-result-card">
                      <div className="quote-header">
                        <span className="quote-country">{sel.flag} {sel.name} Express Tariff</span>
                        <span className="quote-transit">Delivery in {sel.transit}</span>
                      </div>
                      <div className="quote-price">
                        ₹{total.toLocaleString()}
                        <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#94a3b8', marginLeft: '6px' }}>(All-Inclusive)</span>
                      </div>
                      <div className="quote-breakdown">
                        <div>Air Freight: <strong>₹{fr.toLocaleString()}</strong></div>
                        <div>Food Sealing: <strong style={{ color: '#34d399' }}>Free</strong></div>
                        <div>GST Tax: <strong>₹{gst.toLocaleString()}</strong></div>
                        <div>Rate / Kg: <strong>₹{sel.ratePerKg}/kg</strong></div>
                      </div>

                      <button 
                        className="apple-btn-primary"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            destCountry: sel.code,
                            actualWeight: calcWeight
                          }));
                          setActiveTab('book');
                          setBookingStep(1);
                        }}
                      >
                        <span>Book This Rate Now</span>
                        <ArrowRight size={18} />
                      </button>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 4: DIGITAL PASSES & 24/7 SUPPORT
              ========================================================================= */}
          {activeTab === 'passes' && (
            <div className="apple-view-content fade-in">
              <div className="apple-card-panel">
                <div className="panel-title-row">
                  <AppleSquircleBadge palette="purple" size={56}>
                    <ShieldCheck size={28} color="#ffffff" strokeWidth={2.4} />
                  </AppleSquircleBadge>
                  <div>
                    <h2 className="panel-title">Customer Care &amp; Hubs</h2>
                    <p className="panel-subtitle">Managing Director desks and 24/7 dispatch hotlines.</p>
                  </div>
                </div>

                <div className="apple-support-cards-list">
                  <div className="support-officer-card">
                    <div className="officer-avatar">CB</div>
                    <div className="officer-meta">
                      <strong>S. Chandra Babu</strong>
                      <span>Managing Director — Regional Network &amp; NRI Logistics</span>
                      <a href="tel:+919059949365" className="officer-call-btn">
                        <Phone size={14} /> Call Dispatch Desk
                      </a>
                    </div>
                  </div>

                  <div className="support-officer-card">
                    <div className="officer-avatar">JM</div>
                    <div className="officer-meta">
                      <strong>S. Junaid Mohuddin</strong>
                      <span>Managing Director — International Air Freight &amp; Customs</span>
                      <a href="tel:+919000022821" className="officer-call-btn">
                        <Phone size={14} /> Call International Desk
                      </a>
                    </div>
                  </div>
                </div>

                <div className="apple-hubs-summary">
                  <span className="summary-title">Official Branch Centers</span>
                  {REGIONAL_HUBS.map(hub => (
                    <div key={hub.id} className="hub-quick-item">
                      <div className="hub-dot"></div>
                      <div>
                        <strong>{hub.name}</strong>
                        <p>{hub.address} • <a href={`tel:${hub.phone}`}>{hub.phone}</a></p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 5: CUSTOMER ACCOUNT & AUTHENTICATION PORTAL
              ========================================================================= */}
          {activeTab === 'account' && (
            <div className="apple-view-content fade-in">
              {isAuth && user ? (
                /* Logged In Customer Profile */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="apple-account-hero">
                    <div className="apple-account-avatar">
                      {user.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'CU'}
                    </div>
                    <div className="apple-account-meta">
                      <h3 className="account-name">{user.name || 'S. Venkata Raman'}</h3>
                      <p className="account-phone">{user.phone || '+91 90599 49365'} • {user.email}</p>
                      <span className="account-tier-badge">
                        <Sparkles size={11} />
                        <span>Sai Express Gold Member</span>
                      </span>
                    </div>
                  </div>

                  {/* Saved Addresses */}
                  <div className="apple-card-panel" style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <h4 style={{ fontSize: '0.84rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>Saved Addresses</h4>
                      <span style={{ fontSize: '0.7rem', color: '#38bdf8' }}>2 Locations</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '12px',
                        padding: '10px 12px',
                        fontSize: '0.78rem'
                      }}>
                        <strong style={{ color: '#ffffff', display: 'block', marginBottom: '2px' }}>🏠 Home (Hyderabad Admin)</strong>
                        <span style={{ color: '#94a3b8' }}>Plot no: 1-9-202/29/15A, 2nd Floor, Hanuman Nagar Colony, EC Complex, Kushaiguda, Hyderabad - 500062</span>
                      </div>
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '12px',
                        padding: '10px 12px',
                        fontSize: '0.78rem'
                      }}>
                        <strong style={{ color: '#ffffff', display: 'block', marginBottom: '2px' }}>🏢 Office (Kadapa Central)</strong>
                        <span style={{ color: '#94a3b8' }}>Co-operative Colony, Kadapa Central Hub, Andhra Pradesh - 516001</span>
                      </div>
                    </div>
                  </div>

                  {/* Consignment History */}
                  <div className="apple-card-panel" style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <h4 style={{ fontSize: '0.84rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>Recent Consignments</h4>
                      <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Live Telemetry</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '12px',
                        padding: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}>
                        <div>
                          <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: '800' }}>AWB #839201948291</span>
                          <div style={{ fontSize: '0.82rem', fontWeight: '800', color: '#ffffff' }}>Dallas, TX, USA 🇺🇸</div>
                          <span style={{ fontSize: '0.68rem', color: '#2dd4bf' }}>In Transit • Emirates SkyCargo</span>
                        </div>
                        <button
                          type="button"
                          className="dest-ship-btn"
                          onClick={() => {
                            setTrackInput('839201948291');
                            setActiveTab('track');
                            performTrack('839201948291');
                          }}
                        >
                          Track
                        </button>
                      </div>

                      <div style={{
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '12px',
                        padding: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}>
                        <div>
                          <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: '800' }}>AWB #482910384928</span>
                          <div style={{ fontSize: '0.82rem', fontWeight: '800', color: '#ffffff' }}>London, UK 🇬🇧</div>
                          <span style={{ fontSize: '0.68rem', color: '#f59e0b' }}>Out for Delivery • Local Van</span>
                        </div>
                        <button
                          type="button"
                          className="dest-ship-btn"
                          onClick={() => {
                            setTrackInput('482910384928');
                            setActiveTab('track');
                            performTrack('482910384928');
                          }}
                        >
                          Track
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Sign Out Button */}
                  <button
                    type="button"
                    onClick={logout}
                    style={{
                      padding: '12px',
                      borderRadius: '14px',
                      backgroundColor: 'rgba(239, 68, 68, 0.12)',
                      border: '1px solid rgba(239, 68, 68, 0.35)',
                      color: '#f87171',
                      fontSize: '0.85rem',
                      fontWeight: '800',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <LogOut size={16} />
                    <span>Sign Out of Account</span>
                  </button>
                </div>
              ) : (
                /* Log In / Sign Up Card right in the tab */
                <div className="apple-card-panel">
                  <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                    <img 
                      src="/assets/images/sai_logo_transparent.png" 
                      alt="Sai International" 
                      style={{ height: '48px', width: 'auto', marginBottom: '8px' }} 
                    />
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '900', color: '#ffffff', margin: '0 0 4px 0' }}>
                      Customer Sign In
                    </h2>
                    <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: 0 }}>
                      Sign in to track orders, save doorstep addresses &amp; get VIP booking rates.
                    </p>
                  </div>

                  {/* Segmented Control */}
                  <div className="auth-segmented-tabs">
                    <button
                      type="button"
                      className={`auth-tab-btn ${authMode === 'login' ? 'active' : ''}`}
                      onClick={() => setAuthMode('login')}
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      className={`auth-tab-btn ${authMode === 'register' ? 'active' : ''}`}
                      onClick={() => setAuthMode('register')}
                    >
                      Create Account
                    </button>
                  </div>

                  {/* One-Tap Demo Fill Button */}
                  <button
                    type="button"
                    onClick={handleAuthDemoFill}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '11px 14px',
                      borderRadius: '14px',
                      backgroundColor: 'rgba(245, 158, 11, 0.14)',
                      border: '1px solid rgba(245, 158, 11, 0.4)',
                      color: '#fbbf24',
                      fontSize: '0.82rem',
                      fontWeight: '800',
                      cursor: 'pointer',
                      marginBottom: '14px',
                      boxShadow: '0 4px 12px rgba(245, 158, 11, 0.15)'
                    }}
                  >
                    <Sparkles size={16} color="#f59e0b" />
                    <span>⚡ One-Tap Demo Customer (customer@sai.com)</span>
                  </button>

                  {authError && (
                    <div style={{
                      padding: '10px 12px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(239, 68, 68, 0.15)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      color: '#f87171',
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '14px'
                    }}>
                      <AlertCircle size={16} />
                      <span>{authError}</span>
                    </div>
                  )}

                  <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {authMode === 'register' && (
                      <>
                        <div className="apple-input-group" style={{ marginBottom: 0 }}>
                          <label className="apple-field-label">Full Name</label>
                          <input
                            type="text"
                            className="apple-text-input"
                            placeholder="e.g. S. Venkata Raman"
                            value={authName}
                            onChange={e => setAuthName(e.target.value)}
                            required
                          />
                        </div>
                        <div className="apple-input-group" style={{ marginBottom: 0 }}>
                          <label className="apple-field-label">WhatsApp / Phone Number</label>
                          <input
                            type="tel"
                            className="apple-text-input"
                            placeholder="+91 90599 49365"
                            value={authPhone}
                            onChange={e => setAuthPhone(e.target.value)}
                            required
                          />
                        </div>
                      </>
                    )}

                    <div className="apple-input-group" style={{ marginBottom: 0 }}>
                      <label className="apple-field-label">Registered Email</label>
                      <input
                        type="email"
                        className="apple-text-input"
                        placeholder="e.g. customer@sai.com"
                        value={authEmail}
                        onChange={e => setAuthEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div className="apple-input-group" style={{ marginBottom: 0 }}>
                      <label className="apple-field-label">Password</label>
                      <input
                        type="password"
                        className="apple-text-input"
                        placeholder="••••••••••••"
                        value={authPassword}
                        onChange={e => setAuthPassword(e.target.value)}
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={authLoading}
                      className="apple-btn-primary"
                      style={{ marginTop: '8px' }}
                    >
                      {authLoading ? 'Verifying with RGIA Server...' : authMode === 'login' ? 'Sign In to Portal' : 'Register Account'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </main>

        {/* =========================================================================
            iOS CUPERTINO FLOATING DOCK (BOTTOM TAB BAR - 5 APPLE ICONS)
            ========================================================================= */}
        <nav className="apple-dock-nav">
          <button 
            className={`dock-tab-btn ${activeTab === 'home' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('home')}
          >
            <AppleSquircleBadge palette={activeTab === 'home' ? 'blue' : 'dark'} size={48}>
              <Home size={26} color="#ffffff" strokeWidth={2.4} />
            </AppleSquircleBadge>
            <span>Home</span>
            {activeTab === 'home' && <span className="dock-active-dot"></span>}
          </button>

          <button 
            className={`dock-tab-btn ${activeTab === 'book' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('book')}
          >
            <AppleSquircleBadge palette={activeTab === 'book' ? 'blue' : 'dark'} size={48}>
              <Package size={26} color="#ffffff" strokeWidth={2.4} />
            </AppleSquircleBadge>
            <span>Book</span>
            {activeTab === 'book' && <span className="dock-active-dot"></span>}
          </button>

          <button 
            className={`dock-tab-btn ${activeTab === 'track' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('track')}
          >
            <AppleSquircleBadge palette={activeTab === 'track' ? 'teal' : 'dark'} size={48}>
              <Navigation size={26} color="#ffffff" strokeWidth={2.4} />
            </AppleSquircleBadge>
            <span>Track</span>
            {activeTab === 'track' && <span className="dock-active-dot"></span>}
          </button>

          <button 
            className={`dock-tab-btn ${activeTab === 'rates' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('rates')}
          >
            <AppleSquircleBadge palette={activeTab === 'rates' ? 'gold' : 'dark'} size={48}>
              <Calculator size={26} color="#ffffff" strokeWidth={2.4} />
            </AppleSquircleBadge>
            <span>Rates</span>
            {activeTab === 'rates' && <span className="dock-active-dot"></span>}
          </button>

          <button 
            className={`dock-tab-btn ${activeTab === 'account' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('account')}
          >
            <AppleSquircleBadge palette={activeTab === 'account' ? 'purple' : 'dark'} size={48}>
              <User size={26} color="#ffffff" strokeWidth={2.4} />
            </AppleSquircleBadge>
            <span>Account</span>
            {activeTab === 'account' && <span className="dock-active-dot"></span>}
          </button>
        </nav>
      </div>
    </div>
  );
}
