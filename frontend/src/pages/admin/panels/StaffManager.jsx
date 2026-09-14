import { useState, useEffect } from 'react';
import { getAdminStaff, createAdminStaff, updateAdminStaff } from '../../../services/api';

export default function StaffManager() {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'branch-manager',
    customRoleName: '',
  });

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const res = await getAdminStaff();
      if (res.success) {
        setStaffList(res.staff);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch staff.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = (id) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Check if password is provided in edit mode, if not we might not want to require it but for now we require it for simplification or let backend handle it
    const submitData = { ...formData };
    if (editMode && !submitData.password) {
      delete submitData.password;
    }

    try {
      let res;
      if (editMode) {
        res = await updateAdminStaff(editingId, submitData);
      } else {
        res = await createAdminStaff(submitData);
      }

      if (res.success) {
        cancelEdit();
        fetchStaff();
      }
    } catch (err) {
      setError(err.message || 'Failed to save staff member.');
    }
  };

  const handleEdit = (staff) => {
    setEditMode(true);
    setEditingId(staff._id);
    setFormData({
      name: staff.name,
      email: staff.email,
      role: staff.role,
      customRoleName: staff.customRoleName || '',
      password: '', // Leave blank for edit, user must type new password to change
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditMode(false);
    setEditingId(null);
    setFormData({ name: '', email: '', password: '', role: 'branch-manager', customRoleName: '' });
  };

  return (
    <div className="admin-panel-content">
      <div className="admin-editor-header">
        <h2 className="admin-editor-title"><i className="fa-solid fa-users-gear"></i> Staff Management</h2>
      </div>
      
      <div className="admin-info-box">
        <i className="fa-solid fa-circle-info"></i>
        <div>
          Create and manage accounts for your branch managers, customs officers, and delivery agents. These accounts have restricted access.
        </div>
      </div>

      {error && (
        <div style={{ padding: '1rem', background: '#FDEDEC', color: '#E74C3C', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #FADBD8' }}>
          <i className="fa-solid fa-circle-exclamation"></i> {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '2rem' }}>
        {/* Create Form */}
        <div style={{ background: '#FFFFFF', padding: '1.75rem', borderRadius: '16px', border: '1px solid #E3EDF3', boxShadow: '0 4px 16px rgba(32, 54, 72, 0.04)', alignSelf: 'start' }}>
          <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.15rem', color: '#1E3446', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid #E3EDF3', paddingBottom: '0.75rem' }}>
            <i className={`fa-solid ${editMode ? 'fa-user-pen' : 'fa-user-plus'}`} style={{ color: 'var(--accent-teal)' }}></i> 
            {editMode ? 'Edit Account' : 'Create New Account'}
          </h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="admin-field">
              <label className="admin-field-label">Full Name</label>
              <input type="text" name="name" className="admin-field-input" value={formData.name} onChange={handleInputChange} required placeholder="e.g. John Doe" />
            </div>
            <div className="admin-field">
              <label className="admin-field-label">Email Address</label>
              <input type="email" name="email" className="admin-field-input" value={formData.email} onChange={handleInputChange} required placeholder="john@example.com" />
            </div>
            <div className="admin-field">
              <label className="admin-field-label">Password {editMode && '(Leave blank to keep current)'}</label>
              <div style={{ position: 'relative' }}>
                <input type={showPassword ? "text" : "password"} name="password" className="admin-field-input" value={formData.password} onChange={handleInputChange} required={!editMode} minLength={6} placeholder="Min. 6 characters" style={{ paddingRight: '2.5rem' }} />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#7091A8', cursor: 'pointer', fontSize: '1rem', padding: '0.2rem' }}
                  title={showPassword ? "Hide Password" : "Show Password"}
                >
                  <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>
            <div className="admin-field">
              <label className="admin-field-label">Role Category</label>
              <select name="role" className="admin-field-input" value={formData.role} onChange={handleInputChange} style={{ cursor: 'pointer' }}>
                <option value="branch-manager">Branch Manager</option>
                <option value="customs-officer">Customs Officer</option>
                <option value="delivery-agent">Delivery Agent</option>
                <option value="super-admin">Super Admin</option>
              </select>
            </div>
            {formData.role !== 'super-admin' && (
              <div className="admin-field">
                <label className="admin-field-label">Custom Role Name (Optional)</label>
                <input type="text" name="customRoleName" className="admin-field-input" value={formData.customRoleName} onChange={handleInputChange} placeholder="e.g. Delhi Branch Manager" />
              </div>
            )}
            <button type="submit" className="admin-btn admin-btn-primary" style={{ marginTop: '0.5rem', width: '100%', justifyContent: 'center' }}>
              <i className={`fa-solid ${editMode ? 'fa-floppy-disk' : 'fa-check'}`}></i> {editMode ? 'Save Changes' : 'Create Account'}
            </button>
            {editMode && (
              <button type="button" onClick={cancelEdit} className="admin-btn admin-btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
                Cancel
              </button>
            )}
          </form>
        </div>

        {/* Staff List */}
        <div style={{ background: '#FFFFFF', padding: '1.75rem', borderRadius: '16px', border: '1px solid #E3EDF3', boxShadow: '0 4px 16px rgba(32, 54, 72, 0.04)' }}>
          <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.15rem', color: '#1E3446', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid #E3EDF3', paddingBottom: '0.75rem' }}>
            <i className="fa-solid fa-users" style={{ color: 'var(--accent-teal)' }}></i> Active Staff Accounts
          </h3>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#7091A8' }}>
              <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--accent-teal)' }}></i>
              <p>Loading staff directory...</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid #E3EDF3' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.92rem' }}>
                <thead>
                  <tr style={{ background: '#F8FBFC', borderBottom: '2px solid #E3EDF3', textAlign: 'left' }}>
                    <th style={{ padding: '1rem 1.25rem', color: '#4A6B82', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Name</th>
                    <th style={{ padding: '1rem 1.25rem', color: '#4A6B82', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email</th>
                    <th style={{ padding: '1rem 1.25rem', color: '#4A6B82', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Password</th>
                    <th style={{ padding: '1rem 1.25rem', color: '#4A6B82', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Role</th>
                    <th style={{ padding: '1rem 1.25rem', color: '#4A6B82', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {staffList.map((staff) => (
                    <tr key={staff._id} style={{ borderBottom: '1px solid #E3EDF3', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#F8FBFC'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '1.25rem', fontWeight: '700', color: '#1E3446', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: staff.role === 'super-admin' ? '#FEF08A' : '#DDEFF7', color: staff.role === 'super-admin' ? '#854D0E' : '#29465D', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>
                          <i className={`fa-solid ${staff.role === 'super-admin' ? 'fa-user-shield' : 'fa-user'}`}></i>
                        </div>
                        {staff.name}
                      </td>
                      <td style={{ padding: '1.25rem', color: '#7091A8' }}>{staff.email}</td>
                      <td style={{ padding: '1.25rem', color: '#1E3446', fontFamily: 'monospace', fontSize: '0.95rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span>{visiblePasswords[staff._id] ? (staff.displayPassword || '********') : '********'}</span>
                          <button 
                            onClick={() => togglePasswordVisibility(staff._id)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7091A8', padding: '0.2rem' }}
                            title={visiblePasswords[staff._id] ? "Hide Password" : "Show Password"}
                          >
                            <i className={`fa-solid ${visiblePasswords[staff._id] ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                          </button>
                        </div>
                      </td>
                      <td style={{ padding: '1.25rem' }}>
                        <span style={{ 
                          background: staff.role === 'super-admin' ? '#FEF3C7' : '#E0E7FF', 
                          color: staff.role === 'super-admin' ? '#92400E' : '#4338CA',
                          padding: '0.35rem 0.75rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: '700',
                          border: `1px solid ${staff.role === 'super-admin' ? '#FDE68A' : '#C7D2FE'}`,
                          display: 'inline-block'
                        }}>
                          {staff.customRoleName || staff.role}
                        </span>
                        {staff.customRoleName && (
                          <div style={{ fontSize: '0.7rem', color: '#7091A8', marginTop: '0.2rem', marginLeft: '0.4rem' }}>
                            ({staff.role})
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '1.25rem', textAlign: 'right' }}>
                        {staff.role !== 'super-admin' && (
                          <button onClick={() => handleEdit(staff)} className="admin-btn admin-btn-outline admin-btn-sm" title="Edit User">
                            <i className="fa-solid fa-pen"></i> Edit
                          </button>
                        )}
                      </td>
                  </tr>
                ))}
                  {staffList.length === 0 && (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', padding: '4rem 2rem', color: '#7091A8' }}>
                        <i className="fa-solid fa-users-slash" style={{ fontSize: '2rem', marginBottom: '1rem', opacity: 0.5 }}></i>
                        <p>No staff accounts found.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
