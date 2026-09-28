import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

const DeliveryLogin = () => {
  const { user, login, loading } = useUser();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  useEffect(() => {
    if (user && user.role === 'delivery_partner') {
      navigate('/delivery');
    }
  }, [user, navigate]);

  const handleDemoFill = () => {
    setEmail('driver@sai.com');
    setPassword('Driver@2026');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await login(email, password);
      if (!res.success) {
        setError(res.message || 'Authentication failed. Please check credentials.');
        return;
      }
      if (res.user && res.user.role !== 'delivery_partner') {
        setError('Unauthorized: Account is not registered as a Delivery Partner.');
        return;
      }
      navigate('/delivery');
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check credentials.');
    }
  };

  return (
    <div style={styles.pageBackground}>
      {/* Background glowing ambient elements */}
      <div style={styles.ambientGlowTop}></div>
      <div style={styles.ambientGlowBottom}></div>

      <div style={styles.mobileAppContainer}>
        {/* App Top Bar / Branding */}
        <div style={styles.appHeader}>
          <div style={styles.brandRow}>
            <div style={styles.logoBadge}>
              <i className="fa-solid fa-truck-fast" style={{ fontSize: '1.4rem', color: '#fff' }}></i>
            </div>
            <div>
              <h1 style={styles.appName}>SAI INTERNATIONAL</h1>
              <span style={styles.appSubtext}>Delivery Executive App</span>
            </div>
          </div>
          <span style={styles.versionPill}>
            <i className="fa-solid fa-circle" style={{ fontSize: '6px', color: '#10b981', marginRight: '5px' }}></i>
            v2.4 Live
          </span>
        </div>

        {/* Hero Banner inside App Card */}
        <div style={styles.heroSection}>
          <div style={styles.heroIconWrapper}>
            <i className="fa-solid fa-shield-halved" style={{ fontSize: '2rem', color: '#ff6b4a' }}></i>
          </div>
          <h2 style={styles.heroTitle}>Agent Workspace Sign In</h2>
          <p style={styles.heroDesc}>Enter your driver credentials to manage daily pickups, live GPS route tracking, and POD uploads.</p>
        </div>

        {/* Quick Demo Credentials Fill Button */}
        <button
          type="button"
          onClick={handleDemoFill}
          style={styles.demoFillBtn}
        >
          <i className="fa-solid fa-bolt" style={{ color: '#f59e0b', marginRight: '6px' }}></i>
          One-Tap Fill Demo Driver Login
        </button>

        {error && (
          <div style={styles.errorBox}>
            <i className="fa-solid fa-circle-exclamation" style={{ marginRight: '8px' }}></i>
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Driver Email / Mobile ID</label>
            <div style={styles.inputWrapper}>
              <i className="fa-solid fa-id-badge" style={styles.inputIcon}></i>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. driver@sai.com"
                style={styles.input}
                required
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Access Password</label>
            <div style={styles.inputWrapper}>
              <i className="fa-solid fa-lock" style={styles.inputIcon}></i>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your driver password"
                style={{ ...styles.input, paddingRight: '2.5rem' }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.togglePasswordBtn}
                tabIndex="-1"
              >
                <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
          </div>

          <div style={styles.optionsRow}>
            <label style={styles.rememberLabel}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: '#ff6b4a', width: '16px', height: '16px' }}
              />
              <span>Keep me signed in</span>
            </label>
            <a href="tel:+919059949365" style={styles.forgotLink}>Forgot password?</a>
          </div>

          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? (
              <>
                <i className="fa-solid fa-circle-notch fa-spin" style={{ marginRight: '8px' }}></i>
                Authenticating Driver...
              </>
            ) : (
              <>
                <span>Open Delivery Agent Dashboard</span>
                <i className="fa-solid fa-arrow-right" style={{ marginLeft: '8px' }}></i>
              </>
            )}
          </button>
        </form>

        {/* Security & Support Footer */}
        <div style={styles.appFooter}>
          <div style={styles.securityBadge}>
            <i className="fa-solid fa-location-dot" style={{ color: '#10b981', marginRight: '6px' }}></i>
            Realtime GPS Tracking & Offline Mode Enabled
          </div>
          <p style={styles.supportText}>
            Need assistance? <a href="tel:+919059949365" style={{ color: '#ff6b4a', textDecoration: 'none', fontWeight: 'bold' }}>Call Dispatch (+91 90599 49365)</a>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageBackground: {
    minHeight: '100vh',
    backgroundColor: '#070f1e',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '1.5rem 1rem',
    fontFamily: "'Outfit', 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
    position: 'relative',
    overflow: 'hidden'
  },
  ambientGlowTop: {
    position: 'absolute',
    top: '-15%',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '600px',
    height: '600px',
    background: 'radial-gradient(circle, rgba(255, 107, 74, 0.15) 0%, rgba(7, 15, 30, 0) 70%)',
    pointerEvents: 'none',
  },
  ambientGlowBottom: {
    position: 'absolute',
    bottom: '-20%',
    right: '10%',
    width: '500px',
    height: '500px',
    background: 'radial-gradient(circle, rgba(0, 180, 216, 0.12) 0%, rgba(7, 15, 30, 0) 70%)',
    pointerEvents: 'none',
  },
  mobileAppContainer: {
    width: '100%',
    maxWidth: '420px',
    backgroundColor: '#0f172a',
    borderRadius: '24px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(255, 107, 74, 0.15)',
    padding: '2rem 1.75rem',
    boxSizing: 'border-box',
    position: 'relative',
    zIndex: 2,
    backdropFilter: 'blur(10px)',
  },
  appHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
  },
  brandRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  logoBadge: {
    width: '42px',
    height: '42px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #ff6b4a 0%, #e0481d 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(255, 107, 74, 0.4)'
  },
  appName: {
    fontSize: '0.95rem',
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: '0.5px',
    margin: 0,
    lineHeight: 1.2
  },
  appSubtext: {
    fontSize: '0.75rem',
    color: '#94a3b8',
    fontWeight: '500'
  },
  versionPill: {
    fontSize: '0.7rem',
    fontWeight: '600',
    color: '#34d399',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    padding: '0.25rem 0.6rem',
    borderRadius: '20px',
    border: '1px solid rgba(16, 185, 129, 0.25)'
  },
  heroSection: {
    textAlign: 'center',
    marginBottom: '1.25rem'
  },
  heroIconWrapper: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 107, 74, 0.1)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '0.75rem',
    border: '1px solid rgba(255, 107, 74, 0.2)'
  },
  heroTitle: {
    fontSize: '1.35rem',
    fontWeight: '700',
    color: '#f8fafc',
    margin: '0 0 0.35rem 0'
  },
  heroDesc: {
    fontSize: '0.82rem',
    color: '#94a3b8',
    margin: 0,
    lineHeight: 1.45
  },
  demoFillBtn: {
    width: '100%',
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    color: '#fbbf24',
    border: '1px dashed rgba(245, 158, 11, 0.35)',
    padding: '0.65rem 1rem',
    borderRadius: '12px',
    fontSize: '0.82rem',
    fontWeight: '600',
    cursor: 'pointer',
    marginBottom: '1.25rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  },
  errorBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    color: '#fca5a5',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    padding: '0.75rem 1rem',
    borderRadius: '10px',
    marginBottom: '1.25rem',
    fontSize: '0.82rem',
    display: 'flex',
    alignItems: 'center'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.1rem'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem'
  },
  label: {
    fontSize: '0.75rem',
    color: '#cbd5e1',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  inputIcon: {
    position: 'absolute',
    left: '12px',
    color: '#64748b',
    fontSize: '0.95rem',
    pointerEvents: 'none'
  },
  input: {
    width: '100%',
    padding: '0.75rem 0.85rem 0.75rem 2.4rem',
    backgroundColor: '#1e293b',
    border: '1px solid #334155',
    borderRadius: '10px',
    fontSize: '0.92rem',
    color: '#f8fafc',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s ease',
  },
  togglePasswordBtn: {
    position: 'absolute',
    right: '10px',
    background: 'none',
    border: 'none',
    color: '#64748b',
    fontSize: '0.95rem',
    cursor: 'pointer',
    padding: '4px'
  },
  optionsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '-0.2rem'
  },
  rememberLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontSize: '0.8rem',
    color: '#94a3b8',
    cursor: 'pointer'
  },
  forgotLink: {
    fontSize: '0.8rem',
    color: '#60a5fa',
    textDecoration: 'none',
    fontWeight: '500'
  },
  submitBtn: {
    marginTop: '0.5rem',
    backgroundColor: '#ff6b4a',
    backgroundImage: 'linear-gradient(135deg, #ff6b4a 0%, #e0481d 100%)',
    color: '#ffffff',
    border: 'none',
    padding: '0.9rem',
    borderRadius: '12px',
    fontSize: '0.95rem',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 10px 20px -5px rgba(255, 107, 74, 0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.15s ease, box-shadow 0.15s ease'
  },
  appFooter: {
    marginTop: '1.75rem',
    paddingTop: '1.25rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
    textAlign: 'center'
  },
  securityBadge: {
    fontSize: '0.75rem',
    color: '#94a3b8',
    marginBottom: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  supportText: {
    fontSize: '0.75rem',
    color: '#64748b',
    margin: 0
  }
};

export default DeliveryLogin;
