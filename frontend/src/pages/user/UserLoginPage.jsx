import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { GoogleLogin } from '@react-oauth/google';

export default function UserLoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const { login, register, loginWithGoogle } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    let res;
    if (isLogin) {
      res = await login(formData.email, formData.password);
    } else {
      res = await register(formData.name, formData.email, formData.password, formData.phone);
    }
    
    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.message);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('');
    const res = await loginWithGoogle(credentialResponse.credential);
    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="section" style={{ minHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '120px' }}>
      <div style={{ background: 'var(--bg-card-tint)', padding: '2rem', borderRadius: '12px', width: '100%', maxWidth: '400px', border: '1px solid var(--border-light)' }}>
        <h2 style={{ color: 'var(--text-slate-dark)', marginBottom: '1.5rem', textAlign: 'center' }}>
          {isLogin ? 'Customer Login' : 'Create Account'}
        </h2>
        {error && <div style={{ color: '#E74C3C', background: '#E74C3C18', padding: '0.8rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}
        
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', width: '100%' }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Google login failed. Please try again.')}
            useOneTap
            shape="rectangular"
            theme="filled_blue"
            size="large"
            text={isLogin ? 'signin_with' : 'signup_with'}
            width="100%"
          />
        </div>

        <div style={{ textAlign: 'center', margin: '1rem 0', color: '#7091A8', display: 'flex', alignItems: 'center' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-light)' }}></div>
          <span style={{ margin: '0 1rem', fontSize: '0.8rem', fontWeight: 'bold' }}>OR</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-light)' }}></div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {!isLogin && (
          <input type="text" placeholder="Full Name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="form-input-field" />
        )}
        <input type="email" placeholder="Email Address" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="form-input-field" />
        {!isLogin && (
          <input type="tel" placeholder="Phone Number" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="form-input-field" />
        )}
        <input type="password" placeholder="Password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="form-input-field" />
        
        <button type="submit" className="btn btn-coral" style={{ marginTop: '0.5rem', width: '100%' }}>
          {isLogin ? 'Sign In' : 'Sign Up'}
        </button>
      </form>
      <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button onClick={() => setIsLogin(!isLogin)} style={{ color: 'var(--accent-teal)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
          {isLogin ? 'Sign Up' : 'Log In'}
        </button>
      </div>
      </div>
    </div>
  );
}
