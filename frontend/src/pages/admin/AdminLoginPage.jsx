import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../../services/api';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { login } = useAdminAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await adminLogin(form);
      login(res.token, res.admin);
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        {/* Header */}
        <div className="admin-login-header">
          <div className="admin-login-logo">
            <img 
              src="/assets/images/sai_logo_transparent.png" 
              alt="Sai International Couriers & Cargo" 
            />
          </div>
          <h1>SAI Admin Panel</h1>
          <p>Sai International Couriers & Cargo</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-form-group">
            <label htmlFor="admin-email">
              <i className="fa-solid fa-envelope"></i> Admin Email
            </label>
            <input
              id="admin-email"
              type="email"
              placeholder="admin@sai-couriers.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              autoComplete="email"
            />
          </div>

          <div className="admin-form-group">
            <label htmlFor="admin-password">
              <i className="fa-solid fa-lock"></i> Password
            </label>
            <div className="admin-pass-input">
              <input
                id="admin-password"
                type={showPass ? 'text' : 'password'}
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                autoComplete="current-password"
              />
              <button type="button" onClick={() => setShowPass(p => !p)} className="admin-pass-toggle" tabIndex={-1}>
                <i className={`fa-solid fa-eye${showPass ? '-slash' : ''}`}></i>
              </button>
            </div>
          </div>

          {error && (
            <div className="admin-error-msg">
              <i className="fa-solid fa-circle-exclamation"></i> {error}
            </div>
          )}

          <button type="submit" className="admin-login-btn" disabled={loading}>
            {loading ? <><i className="fa-solid fa-circle-notch fa-spin"></i> Signing In…</> : <><i className="fa-solid fa-shield-check"></i> Sign In to Admin Panel</>}
          </button>
        </form>

        <p className="admin-login-footer-note">
          <i className="fa-solid fa-lock"></i> Secured with JWT Authentication
        </p>
      </div>
    </div>
  );
}
