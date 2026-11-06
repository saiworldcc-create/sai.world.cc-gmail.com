import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useUser } from '../../context/UserContext';

export default function VendorLogin() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();
  const { login } = useUser();

  useEffect(() => {
    // Trigger entrance animations after a tiny delay
    setTimeout(() => setIsLoaded(true), 50);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        navigate('/vendor');
      } else {
        setError(result.message || 'Authentication failed');
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
        @keyframes pulseGlow {
          0% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
          100% { opacity: 0.4; transform: scale(1); }
        }
        .login-container {
          min-height: 100vh;
          display: flex;
          font-family: 'Inter', sans-serif;
          background: #F8FAFC;
        }
        .login-left {
          display: none;
        }
        @media (min-width: 900px) {
          .login-left {
            display: flex;
            flex: 1.2;
            background: linear-gradient(135deg, #020617 0%, #0F172A 100%);
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 4rem;
            position: relative;
            overflow: hidden;
          }
        }
        .login-right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background: #fff;
          position: relative;
        }
        
        /* Staggered Animations */
        .animate-delay-1 { animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards; opacity: 0; }
        .animate-delay-2 { animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards; opacity: 0; }
        .animate-delay-3 { animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards; opacity: 0; }
        .animate-delay-4 { animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards; opacity: 0; }
        .animate-delay-5 { animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.5s forwards; opacity: 0; }
        
        .floating-element {
          animation: float 6s ease-in-out infinite;
        }
        
        .custom-input {
          width: 100%;
          padding: 1.1rem 1.2rem 1.1rem 3.2rem;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          font-size: 1rem;
          color: #0F172A;
          outline: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-sizing: border-box;
        }
        .custom-input:focus {
          background: #fff;
          border-color: #0EA5E9;
          box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.15);
        }
        .input-icon {
          position: absolute; left: 1.2rem; top: 50%; transform: translateY(-50%); color: #94A3B8;
          transition: color 0.3s ease;
        }
        .input-group:focus-within .input-icon {
          color: #0EA5E9;
        }
      `}</style>
      
      <div className="login-container">
        {/* Left Side - Large Logo */}
        <div className="login-left">
          {/* Animated Background Gradients for subtle effect */}
          <div style={{ position: 'absolute', width: '100%', height: '100%', background: 'linear-gradient(135deg, #020617 0%, #0F172A 100%)', zIndex: 0 }}></div>
          <div style={{ position: 'absolute', width: '800px', height: '800px', background: 'radial-gradient(circle, rgba(14,165,233,0.15) 0%, rgba(0,0,0,0) 70%)', top: '-20%', left: '-20%', zIndex: 0, animation: 'pulseGlow 8s infinite alternate' }}></div>
          <div style={{ position: 'absolute', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, rgba(0,0,0,0) 70%)', bottom: '-10%', right: '-10%', zIndex: 0, animation: 'pulseGlow 10s infinite alternate-reverse' }}></div>
          
          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', width: '100%', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            
            {/* Split animations into two nested divs to prevent CSS animation override bug */}
            <div className="animate-delay-1" style={{ margin: '0 auto', display: 'flex', justifyContent: 'center' }}>
              <div className="floating-element">
                <img src="/assets/images/sai_logo_transparent.png" alt="Sai International Logo" style={{ width: '100%', maxWidth: '600px', objectFit: 'contain', filter: 'drop-shadow(0px 20px 30px rgba(0,0,0,0.4))' }} />
              </div>
            </div>
            
            <h1 className="animate-delay-2" style={{ color: '#F8FAFC', fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-1px', marginTop: '3rem', lineHeight: '1.2' }}>
              Vendor <span style={{ color: '#0EA5E9' }}>Enterprise</span> Portal
            </h1>
            
            <p className="animate-delay-3" style={{ color: '#94A3B8', fontSize: '1.1rem', marginTop: '1rem', maxWidth: '400px' }}>
              Manage bulk orders, RFQs, and scale your global supply chain with our intelligent platform.
            </p>

          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="login-right">
          <div className="animate-delay-1" style={{ width: '100%', maxWidth: '420px', padding: '1rem' }}>
            
            {/* Show logo on mobile only */}
            <div style={{ display: 'block', marginBottom: '2.5rem', textAlign: 'center' }} className="d-md-none">
              <style>{`@media (min-width: 900px) { .d-md-none { display: none !important; } }`}</style>
              {/* Dark wrapper on mobile to show the white logo */}
              <div style={{ background: '#0F172A', padding: '1rem', borderRadius: '16px', display: 'inline-block' }}>
                <img src="/assets/images/sai_logo_transparent.png" alt="Sai International Logo" style={{ maxHeight: '70px', objectFit: 'contain' }} />
              </div>
            </div>

            <div className="animate-delay-2" style={{ marginBottom: '3rem' }}>
              <h2 style={{ margin: '0 0 0.5rem 0', color: '#0F172A', fontSize: '2.2rem', fontWeight: '800', letterSpacing: '-1px' }}>Welcome Back</h2>
              <p style={{ margin: 0, color: '#64748B', fontSize: '1.05rem' }}>Please enter your credentials to continue.</p>
            </div>

            {error && (
              <div className="animate-delay-2" style={{ padding: '1rem 1.2rem', background: '#FEF2F2', color: '#DC2626', borderRadius: '12px', marginBottom: '2rem', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.8rem', border: '1px solid #FECACA', fontWeight: '600', animation: 'fadeInUp 0.3s ease forwards' }}>
                <i className="fa-solid fa-triangle-exclamation"></i> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="animate-delay-3">
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#475569', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Work Email</label>
                <div className="input-group" style={{ position: 'relative' }}>
                  <i className="fa-solid fa-envelope input-icon"></i>
                  <input type="email" name="email" placeholder="vendor@company.com" value={formData.email} onChange={handleChange} required className="custom-input" />
                </div>
              </div>
              
              <div className="animate-delay-4">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Password</label>
                  <a href="#" style={{ fontSize: '0.85rem', color: '#0EA5E9', textDecoration: 'none', fontWeight: '600', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#0284C7'} onMouseLeave={e => e.currentTarget.style.color = '#0EA5E9'}>Recover Password</a>
                </div>
                <div className="input-group" style={{ position: 'relative' }}>
                  <i className="fa-solid fa-lock input-icon"></i>
                  <input type={showPassword ? "text" : "password"} name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required className="custom-input" style={{ paddingRight: '3rem' }} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: showPassword ? '#0EA5E9' : '#94A3B8', cursor: 'pointer', padding: '0.2rem', transition: 'color 0.2s', outline: 'none' }}>
                    <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="animate-delay-5" style={{ 
                marginTop: '1.5rem',
                background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', 
                color: '#FFFFFF', 
                border: 'none', 
                padding: '1.2rem', 
                borderRadius: '12px', 
                fontSize: '1.1rem', 
                fontWeight: '700', 
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: '0 10px 15px -3px rgba(15, 23, 42, 0.2)'
              }}
              onMouseEnter={e => { if(!loading) { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(15, 23, 42, 0.3)'; } }}
              onMouseLeave={e => { if(!loading) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(15, 23, 42, 0.2)'; } }}
              onMouseDown={e => { if(!loading) { e.currentTarget.style.transform = 'translateY(1px)'; e.currentTarget.style.boxShadow = '0 5px 10px -3px rgba(15, 23, 42, 0.2)'; } }}
              >
                {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : null}
                {loading ? 'Authenticating...' : 'Sign In to Portal'}
              </button>
            </form>
            
          </div>
        </div>
      </div>
    </>
  );
}

