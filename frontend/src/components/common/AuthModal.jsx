import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { GoogleLogin } from '@react-oauth/google';

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, login, register, loginWithGoogle } = useUser();
  const navigate = useNavigate();
  
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isAuthModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isLoginMode) {
        await login(formData);
        closeAuthModal();
        navigate('/dashboard');
      } else {
        await register(formData);
        closeAuthModal();
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
    }
  };

  const handleGoogleSuccess = async (tokenResponse) => {
    try {
      await loginWithGoogle(tokenResponse.credential);
      closeAuthModal();
      navigate('/dashboard');
    } catch (err) {
      setError('Google login failed. Please try again.');
      console.error(err);
    }
  };

  return (
    <div 
      className="auth-modal-overlay" 
      onClick={closeAuthModal}
      style={{
        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
        backgroundColor: 'rgba(11, 22, 34, 0.65)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999,
        padding: '1rem',
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      <div 
        className="auth-modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#FFFFFF', padding: '2.5rem', borderRadius: '16px', width: '100%', maxWidth: '420px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', position: 'relative',
          animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <button 
          onClick={closeAuthModal}
          style={{
            position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none',
            fontSize: '1.5rem', color: '#A0B0C0', cursor: 'pointer', padding: '0.5rem',
            lineHeight: 1, transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#333'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#A0B0C0'}
        >
          &times;
        </button>

        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <img src="/assets/images/sai_logo_transparent.png" alt="Sai Couriers" style={{ height: '40px', marginBottom: '1rem' }} />
          <h2 style={{ color: '#1E293B', fontSize: '1.75rem', fontWeight: '700', margin: 0 }}>
            {isLoginMode ? 'Welcome back' : 'Create an account'}
          </h2>
          <p style={{ color: '#64748B', marginTop: '0.5rem', fontSize: '0.95rem' }}>
            {isLoginMode ? 'Log in to manage your shipments' : 'Join SAI Couriers to track globally'}
          </p>
        </div>

        {error && (
          <div style={{ color: '#E74C3C', background: '#FCECEC', padding: '0.8rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center' }}>
            {error}
          </div>
        )}
        
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', width: '100%' }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Google login failed. Please try again.')}
            useOneTap={false}
            shape="rectangular"
            theme="filled_blue"
            size="large"
            text={isLoginMode ? 'signin_with' : 'signup_with'}
            width="100%"
          />
        </div>

        <div style={{ textAlign: 'center', margin: '1.5rem 0', color: '#94A3B8', display: 'flex', alignItems: 'center' }}>
          <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }}></div>
          <span style={{ margin: '0 1rem', fontSize: '0.85rem', fontWeight: '600' }}>OR</span>
          <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }}></div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {!isLoginMode && (
            <input 
              type="text" 
              placeholder="Full Name" 
              required 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
              style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '1rem', outline: 'none' }} 
            />
          )}
          <input 
            type="email" 
            placeholder="Email Address" 
            required 
            value={formData.email} 
            onChange={e => setFormData({...formData, email: e.target.value})} 
            style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '1rem', outline: 'none' }} 
          />
          {!isLoginMode && (
            <input 
              type="tel" 
              placeholder="Phone Number (Optional)" 
              value={formData.phone} 
              onChange={e => setFormData({...formData, phone: e.target.value})} 
              style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '1rem', outline: 'none' }} 
            />
          )}
          <input 
            type="password" 
            placeholder="Password" 
            required 
            value={formData.password} 
            onChange={e => setFormData({...formData, password: e.target.value})} 
            style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '1rem', outline: 'none' }} 
          />
          
          <button 
            type="submit" 
            style={{ 
              marginTop: '0.5rem', width: '100%', padding: '0.85rem', borderRadius: '8px', 
              background: '#3CC8C8', color: 'white', fontWeight: 'bold', fontSize: '1rem', 
              border: 'none', cursor: 'pointer', transition: 'background 0.2s' 
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#2BB5B5'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#3CC8C8'}
          >
            {isLoginMode ? 'Log in' : 'Create account'}
          </button>
        </form>
        
        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: '#64748B' }}>
          {isLoginMode ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => { setIsLoginMode(!isLoginMode); setError(''); }} 
            style={{ color: '#1E293B', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold', padding: 0 }}
          >
            {isLoginMode ? 'Sign up' : 'Log in'}
          </button>
        </div>
      </div>
      
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
      `}</style>
    </div>
  );
}
