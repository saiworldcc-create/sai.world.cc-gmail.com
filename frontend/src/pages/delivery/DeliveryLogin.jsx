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
    backgroundColor: '#000000', // Pitch black for high contrast
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: '0',
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
  ambientGlowTop: { display: 'none' }, // Removed for battery saving
  ambientGlowBottom: { display: 'none' }, // Removed for battery saving
  mobileAppContainer: {
    width: '100%',
    maxWidth: '420px',
    backgroundColor: '#000000',
    minHeight: '100vh',
    padding: '2rem 1.5rem',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
  },
  appHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    paddingBottom: '1rem',
    borderBottom: '4px solid #333333' // Chunky border
  },
  brandRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  logoBadge: {
    width: '48px',
    height: '48px',
    backgroundColor: '#FF5000', // Flat safety orange
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px' // Boxy industrial look
  },
  appName: {
    fontSize: '1.2rem',
    fontWeight: '900',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    margin: 0,
  },
  appSubtext: {
    fontSize: '0.85rem',
    color: '#AAAAAA',
    fontWeight: '700',
    textTransform: 'uppercase'
  },
  versionPill: {
    fontSize: '0.8rem',
    fontWeight: '800',
    color: '#000000',
    backgroundColor: '#00FF00', // High contrast neon green
    padding: '4px 8px',
    borderRadius: '2px', // Boxy
  },
  heroSection: {
    marginBottom: '2rem'
  },
  heroIconWrapper: { display: 'none' }, // Removed decorative icon
  heroTitle: {
    fontSize: '1.8rem',
    fontWeight: '900',
    color: '#FFFFFF',
    margin: '0 0 0.5rem 0',
    textTransform: 'uppercase'
  },
  heroDesc: {
    fontSize: '1rem',
    color: '#CCCCCC',
    margin: 0,
    lineHeight: 1.5,
    fontWeight: '500'
  },
  demoFillBtn: {
    width: '100%',
    backgroundColor: '#333333',
    color: '#FFFFFF',
    border: '2px solid #555555',
    padding: '1rem',
    fontSize: '1rem',
    fontWeight: '800',
    cursor: 'pointer',
    marginBottom: '2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textTransform: 'uppercase'
  },
  errorBox: {
    backgroundColor: '#FF0000',
    color: '#FFFFFF',
    padding: '1rem',
    marginBottom: '2rem',
    fontSize: '1rem',
    fontWeight: '800',
    display: 'flex',
    alignItems: 'center',
    border: '4px solid #990000'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    flex: 1
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  label: {
    fontSize: '1rem',
    color: '#FFFFFF',
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  inputIcon: { display: 'none' }, // Removed for cleaner industrial look
  input: {
    width: '100%',
    padding: '1.2rem 1rem', // Giant padding for fat fingers
    backgroundColor: '#111111',
    border: '3px solid #555555',
    fontSize: '1.2rem',
    color: '#FFFFFF',
    outline: 'none',
    boxSizing: 'border-box',
    fontWeight: '700'
  },
  togglePasswordBtn: {
    position: 'absolute',
    right: '15px',
    background: 'none',
    border: 'none',
    color: '#AAAAAA',
    fontSize: '1.2rem',
    cursor: 'pointer',
    padding: '10px'
  },
  optionsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rememberLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '1rem',
    color: '#FFFFFF',
    fontWeight: '700',
    cursor: 'pointer'
  },
  forgotLink: {
    fontSize: '1rem',
    color: '#00AAFF',
    textDecoration: 'none',
    fontWeight: '800',
    textTransform: 'uppercase'
  },
  submitBtn: {
    marginTop: '1rem',
    backgroundColor: '#FF5000', // Flat safety orange
    color: '#FFFFFF',
    border: 'none',
    padding: '1.2rem', // Massive touch target
    fontSize: '1.2rem',
    fontWeight: '900',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textTransform: 'uppercase',
  },
  appFooter: {
    marginTop: 'auto',
    paddingTop: '2rem',
    textAlign: 'center'
  },
  securityBadge: {
    fontSize: '0.9rem',
    fontWeight: '800',
    color: '#00FF00',
    marginBottom: '1rem',
    textTransform: 'uppercase'
  },
  supportText: {
    fontSize: '0.9rem',
    color: '#AAAAAA',
    fontWeight: '700'
  }
};

export default DeliveryLogin;
