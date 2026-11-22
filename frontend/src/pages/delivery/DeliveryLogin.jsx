import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Truck, 
  ShieldCheck, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Sparkles, 
  PhoneCall, 
  CheckCircle2, 
  AlertCircle,
  Smartphone,
  ScanLine
} from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { AppleSquircleBadge, AppleFaceIDIcon, AppleSaiAppIcon } from '../../components/common/AppleIcons';

export default function DeliveryLogin() {
  const { user, login, loading } = useUser();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [biometricScanning, setBiometricScanning] = useState(false);

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

  const handleBiometricAuth = async () => {
    setBiometricScanning(true);
    setError('');
    setEmail('driver@sai.com');
    setPassword('Driver@2026');
    
    // Simulate Apple Face ID / Touch ID verification
    setTimeout(async () => {
      try {
        const res = await login('driver@sai.com', 'Driver@2026');
        setBiometricScanning(false);
        if (res.success) {
          navigate('/delivery');
        } else {
          setError(res.message || 'Biometric authentication failed.');
        }
      } catch (err) {
        setBiometricScanning(false);
        setError(err.message || 'Biometric authentication failed.');
      }
    }, 1100);
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
    <div className="apple-app-shell" style={styles.shell}>
      {/* Background radial ambient orbs */}
      <div style={styles.ambientOrb1}></div>
      <div style={styles.ambientOrb2}></div>

      <div className="apple-mobile-device-viewport" style={styles.viewport}>
        {/* Top iOS Status Header */}
        <div style={styles.topBar}>
          <div style={styles.brandRow}>
            <AppleSaiAppIcon size={46} />
            <div>
              <div style={styles.appName}>SAI EXPRESS AGENT</div>
              <div style={styles.appSub}>Executive Driver Workspace</div>
            </div>
          </div>
          <div style={styles.liveBadge}>
            <span style={styles.liveDot}></span>
            <span>v2.6 iOS 18</span>
          </div>
        </div>

        {/* Main Glass Card */}
        <div style={styles.glassCard}>
          <div style={styles.cardHeader}>
            <div style={styles.shieldPill}>
              <AppleSquircleBadge palette="blue" size={20}>
                <ShieldCheck size={12} color="#ffffff" />
              </AppleSquircleBadge>
              <span>Encrypted Field Terminal</span>
            </div>
            <h1 style={styles.title}>Agent Sign In</h1>
            <p style={styles.subtitle}>
              Sign in to manage doorstep pickups, GPS route manifests, live scale weighing & instant digital PODs.
            </p>
          </div>

          {/* Quick Demo Credentials Button */}
          <div style={styles.demoFillContainer}>
            <button
              type="button"
              onClick={handleDemoFill}
              style={styles.demoButton}
              title="Auto-fill Demo Driver Credentials"
            >
              <AppleSquircleBadge palette="gold" size={24}>
                <Sparkles size={13} color="#ffffff" />
              </AppleSquircleBadge>
              <span>Auto-Fill Demo Credentials (driver@sai.com)</span>
            </button>
          </div>

          {error && (
            <div style={styles.errorBanner}>
              <AlertCircle size={18} color="#ef4444" style={{ flexShrink: 0 }} />
              <div style={styles.errorText}>{error}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={styles.form}>
            {/* Email Field */}
            <div style={styles.fieldGroup}>
              <label style={styles.fieldLabel}>DRIVER ID / REGISTERED EMAIL</label>
              <div style={styles.inputContainer}>
                <Mail size={18} color="#64748b" style={styles.leadingIcon} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="driver@sai.com"
                  style={styles.textInput}
                  required
                  autoCapitalize="none"
                  autoCorrect="off"
                />
              </div>
            </div>

            {/* Password Field */}
            <div style={styles.fieldGroup}>
              <div style={styles.passwordLabelRow}>
                <label style={styles.fieldLabel}>ACCESS PASSWORD</label>
                <a href="tel:+919059949365" style={styles.forgotLink}>Reset with Dispatch?</a>
              </div>
              <div style={styles.inputContainer}>
                <Lock size={18} color="#64748b" style={styles.leadingIcon} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  style={{ ...styles.textInput, paddingRight: '44px' }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} color="#94a3b8" /> : <Eye size={18} color="#94a3b8" />}
                </button>
              </div>
            </div>

            {/* Remember Me Toggle */}
            <div style={styles.optionsRow}>
              <label style={styles.rememberToggle}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={styles.checkbox}
                />
                <span style={styles.rememberText}>Stay signed in on this device</span>
              </label>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={loading || biometricScanning}
              style={{
                ...styles.primaryButton,
                opacity: (loading || biometricScanning) ? 0.7 : 1
              }}
            >
              {loading ? (
                <span>Authenticating Driver...</span>
              ) : (
                <>
                  <span>Unlock Agent Cockpit</span>
                  <ArrowRight size={18} strokeWidth={2.4} />
                </>
              )}
            </button>

            {/* Biometric Express Login (Face ID) */}
            <div style={styles.biometricDivider}>
              <div style={styles.dividerLine}></div>
              <span style={styles.dividerText}>OR QUICK BIOMETRIC</span>
              <div style={styles.dividerLine}></div>
            </div>

            <button
              type="button"
              onClick={handleBiometricAuth}
              disabled={biometricScanning || loading}
              style={styles.biometricButton}
            >
              {biometricScanning ? (
                <>
                  <AppleSquircleBadge palette="teal" size={32}>
                    <ScanLine size={18} color="#ffffff" className="fa-spin" />
                  </AppleSquircleBadge>
                  <span style={{ color: '#38bdf8', fontWeight: '800' }}>Scanning Face ID / Biometrics...</span>
                </>
              ) : (
                <>
                  <AppleSquircleBadge palette="teal" size={32}>
                    <AppleFaceIDIcon size={18} color="#ffffff" />
                  </AppleSquircleBadge>
                  <span>One-Tap Face ID Express Login</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Switch to Customer App */}
          <div style={styles.switchBox}>
            <span style={styles.switchPrompt}>Looking for Customer Self-Booking?</span>
            <button
              type="button"
              onClick={() => navigate('/customer')}
              style={styles.switchButton}
            >
              <Smartphone size={14} color="#ff6b4a" />
              <span>Launch Customer Booking App</span>
            </button>
          </div>
        </div>

        {/* Bottom Driver Dispatch Helpline */}
        <div style={styles.footerNote}>
          <PhoneCall size={14} color="#38bdf8" />
          <span>Dispatch Control Tower: </span>
          <a href="tel:+919059949365" style={styles.phoneLink}>+91 90599 49365</a>
        </div>
      </div>
    </div>
  );
}

const styles = {
  shell: {
    minHeight: '100vh',
    minHeight: '100dvh',
    backgroundColor: '#070b12',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '16px',
    position: 'relative',
    overflow: 'hidden'
  },
  ambientOrb1: {
    position: 'absolute',
    top: '-10%',
    left: '20%',
    width: '450px',
    height: '450px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(2, 132, 199, 0.22) 0%, rgba(0, 0, 0, 0) 70%)',
    pointerEvents: 'none',
    zIndex: 1
  },
  ambientOrb2: {
    position: 'absolute',
    bottom: '-15%',
    right: '15%',
    width: '500px',
    height: '500px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255, 107, 74, 0.16) 0%, rgba(0, 0, 0, 0) 70%)',
    pointerEvents: 'none',
    zIndex: 1
  },
  viewport: {
    width: '100%',
    maxWidth: '430px',
    position: 'relative',
    zIndex: 2,
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    paddingBottom: '30px'
  },
  topBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 4px'
  },
  brandRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  appName: {
    fontSize: '0.98rem',
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: '0.4px'
  },
  appSub: {
    fontSize: '0.72rem',
    color: '#94a3b8',
    fontWeight: '500'
  },
  liveBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 10px',
    borderRadius: '20px',
    backgroundColor: 'rgba(16, 185, 129, 0.14)',
    border: '1px solid rgba(16, 185, 129, 0.35)',
    fontSize: '0.7rem',
    fontWeight: '700',
    color: '#34d399'
  },
  liveDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: '#10b981',
    boxShadow: '0 0 8px #10b981'
  },
  glassCard: {
    background: 'rgba(18, 27, 43, 0.8)',
    backdropFilter: 'blur(35px)',
    WebkitBackdropFilter: 'blur(35px)',
    borderRadius: '26px',
    border: '1px solid rgba(255, 255, 255, 0.14)',
    boxShadow: '0 24px 60px -12px rgba(0, 0, 0, 0.75), 0 0 1px 1px rgba(255, 255, 255, 0.1) inset',
    padding: '24px 22px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  cardHeader: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  shieldPill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    border: '1px solid rgba(56, 189, 248, 0.25)',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '0.72rem',
    fontWeight: '700',
    color: '#38bdf8',
    marginBottom: '4px'
  },
  title: {
    margin: 0,
    fontSize: '1.65rem',
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: '-0.02em'
  },
  subtitle: {
    margin: 0,
    fontSize: '0.84rem',
    color: '#94a3b8',
    lineHeight: 1.45
  },
  demoFillContainer: {
    width: '100%'
  },
  demoButton: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '10px 14px',
    borderRadius: '16px',
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    border: '1px solid rgba(245, 158, 11, 0.35)',
    color: '#fbbf24',
    fontSize: '0.8rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  errorBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 14px',
    borderRadius: '14px',
    backgroundColor: 'rgba(239, 68, 68, 0.14)',
    border: '1px solid rgba(239, 68, 68, 0.35)',
    color: '#f87171'
  },
  errorText: {
    fontSize: '0.82rem',
    lineHeight: 1.35,
    fontWeight: '600'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  fieldLabel: {
    fontSize: '0.68rem',
    fontWeight: '800',
    color: '#94a3b8',
    letterSpacing: '0.6px',
    textTransform: 'uppercase'
  },
  passwordLabelRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  forgotLink: {
    fontSize: '0.72rem',
    color: '#38bdf8',
    textDecoration: 'none',
    fontWeight: '600'
  },
  inputContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  leadingIcon: {
    position: 'absolute',
    left: '14px',
    pointerEvents: 'none'
  },
  textInput: {
    width: '100%',
    padding: '14px 14px 14px 44px',
    borderRadius: '14px',
    backgroundColor: '#0c1524',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    color: '#ffffff',
    fontSize: '0.92rem',
    outline: 'none',
    transition: 'border 0.2s ease, box-shadow 0.2s ease',
    boxSizing: 'border-box',
    WebkitTextFillColor: '#ffffff'
  },
  eyeButton: {
    position: 'absolute',
    right: '12px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  optionsRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  rememberToggle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer'
  },
  checkbox: {
    accentColor: '#0071E3',
    width: '16px',
    height: '16px',
    cursor: 'pointer'
  },
  rememberText: {
    fontSize: '0.78rem',
    color: '#cbd5e1',
    fontWeight: '500'
  },
  primaryButton: {
    width: '100%',
    padding: '14px 20px',
    borderRadius: '16px',
    background: 'linear-gradient(180deg, #2997FF 0%, #0071E3 100%)',
    border: '1px solid rgba(255, 255, 255, 0.35)',
    color: '#ffffff',
    fontSize: '0.96rem',
    fontWeight: '800',
    letterSpacing: '0.3px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    boxShadow: '0 10px 25px -4px rgba(0, 113, 227, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.4)',
    transition: 'all 0.2s ease'
  },
  biometricDivider: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginTop: '6px',
    marginBottom: '2px'
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    backgroundColor: 'rgba(255, 255, 255, 0.08)'
  },
  dividerText: {
    fontSize: '0.66rem',
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: '0.8px'
  },
  biometricButton: {
    width: '100%',
    padding: '10px 16px',
    borderRadius: '16px',
    backgroundColor: 'rgba(90, 200, 250, 0.1)',
    border: '1px solid rgba(90, 200, 250, 0.3)',
    color: '#ffffff',
    fontSize: '0.86rem',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    transition: 'all 0.2s ease'
  },
  switchBox: {
    padding: '14px',
    borderRadius: '16px',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    textAlign: 'center'
  },
  switchPrompt: {
    fontSize: '0.74rem',
    color: '#94a3b8'
  },
  switchButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    background: 'none',
    border: 'none',
    color: '#ff6b4a',
    fontSize: '0.82rem',
    fontWeight: '700',
    cursor: 'pointer'
  },
  footerNote: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    fontSize: '0.74rem',
    color: '#94a3b8'
  },
  phoneLink: {
    color: '#38bdf8',
    textDecoration: 'none',
    fontWeight: '700'
  }
};
