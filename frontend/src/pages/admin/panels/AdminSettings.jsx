import { useState } from 'react';
import { changeAdminPassword } from '../../../services/api';
import { useAdminAuth } from '../../../context/AdminAuthContext';

export default function AdminSettings() {
  const { admin } = useAdminAuth();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [msg, setMsg] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      setMsg('❌ New passwords do not match.');
      return;
    }
    setSaving(true);
    try {
      await changeAdminPassword({ currentPassword: form.currentPassword, newPassword: form.newPassword });
      setMsg('✅ Password changed successfully!');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setMsg(`❌ ${err.message}`);
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(''), 5000);
    }
  };

  return (
    <div className="admin-panel-content">
      <h2 className="admin-editor-title"><i className="fa-solid fa-gear"></i> Admin Settings</h2>

      {/* Profile Info */}
      <div className="admin-settings-card">
        <h4><i className="fa-solid fa-user-circle"></i> Admin Profile</h4>
        <div className="admin-profile-row">
          <div className="admin-profile-avatar">{admin?.name?.[0] || 'A'}</div>
          <div>
            <div className="admin-profile-name">{admin?.name}</div>
            <div className="admin-profile-email">{admin?.email}</div>
            <span className="admin-status-badge" style={{ background: '#3C929018', color: '#3C9290' }}>{admin?.role}</span>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="admin-settings-card">
        <h4><i className="fa-solid fa-key"></i> Change Password</h4>
        {msg && <div className={`admin-save-msg ${msg.startsWith('✅') ? 'success' : 'error'}`} style={{ marginBottom: '1rem' }}>{msg}</div>}
        <form onSubmit={handleSubmit}>
          {[
            { id: 'currentPassword', label: 'Current Password', key: 'currentPassword' },
            { id: 'newPassword', label: 'New Password', key: 'newPassword' },
            { id: 'confirmPassword', label: 'Confirm New Password', key: 'confirmPassword' },
          ].map(field => (
            <div key={field.id} className="admin-field">
              <label className="admin-field-label">{field.label}</label>
              <input
                type="password"
                id={field.id}
                className="admin-field-input"
                value={form[field.key]}
                onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                required
                minLength={6}
              />
            </div>
          ))}
          <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
            {saving ? <><i className="fa-solid fa-circle-notch fa-spin"></i> Saving…</> : <><i className="fa-solid fa-floppy-disk"></i> Update Password</>}
          </button>
        </form>
      </div>

      {/* Business & Support Details */}
      <div className="admin-settings-card">
        <h4><i className="fa-solid fa-building-circle-check"></i> Business & Support Details</h4>
        <div className="admin-info-table">
          <div><span>Primary Helpline</span><strong>+91 90599 49365</strong></div>
          <div><span>WhatsApp Support</span><strong>+91 90599 49365</strong></div>
          <div><span>Official Email</span><strong>info@saiinternationalcouriers.com</strong></div>
          <div><span>System Status</span><span className="admin-status-badge" style={{ background: '#27AE6018', color: '#27AE60' }}>● All Services Operational</span></div>
        </div>
      </div>
    </div>
  );
}
