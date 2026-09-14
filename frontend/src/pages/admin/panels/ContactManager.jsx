import { useState, useEffect } from 'react';
import { getPageContent, updatePageContent } from '../../../services/api';

const DEFAULT_CONTACT_DATA = {
  branches: {},
  global: { email: '', phones: [], hours: '' },
};

export default function ContactManager() {
  const [data, setData] = useState(DEFAULT_CONTACT_DATA);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    getPageContent('contact')
      .then(res => {
        if (res.data) {
          setData({
            branches: res.data.branches || {},
            global: res.data.global || { email: '', phones: [], hours: '' },
          });
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await updatePageContent('contact', data);
      setMsg('✅ Contact & Branch details updated successfully!');
      setTimeout(() => setMsg(''), 4000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleGlobalChange = (field, value) => {
    setData(prev => ({
      ...prev,
      global: { ...prev.global, [field]: value }
    }));
  };

  const handleBranchChange = (key, field, value) => {
    setData(prev => ({
      ...prev,
      branches: {
        ...prev.branches,
        [key]: { ...prev.branches[key], [field]: value }
      }
    }));
  };

  const addBranch = () => {
    const newKey = `branch-${Date.now()}`;
    setData(prev => ({
      ...prev,
      branches: {
        ...prev.branches,
        [newKey]: { title: 'New Branch', addr: '', url: '', externalUrl: '', phone: '' }
      }
    }));
  };

  const removeBranch = (key) => {
    if (!window.confirm('Remove this branch location?')) return;
    setData(prev => {
      const newBranches = { ...prev.branches };
      delete newBranches[key];
      return { ...prev, branches: newBranches };
    });
  };

  if (loading) return <div className="admin-loading"><i className="fa-solid fa-circle-notch fa-spin"></i> Loading contact data...</div>;

  return (
    <div className="admin-panel-content">
      <div className="admin-editor-header">
        <h2 className="admin-editor-title"><i className="fa-solid fa-address-book"></i> Contact & Branches Manager</h2>
        <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? <><i className="fa-solid fa-circle-notch fa-spin"></i> Saving...</> : <><i className="fa-solid fa-floppy-disk"></i> Save Changes</>}
        </button>
      </div>

      {msg && <div className="admin-save-msg success">{msg}</div>}
      {error && <div className="admin-save-msg error"><i className="fa-solid fa-triangle-exclamation"></i> {error}</div>}

      <div className="admin-editor-layout">
        <div className="admin-editor-main">
          
          {/* Global Contact Info */}
          <div className="admin-section-card">
            <h3 className="admin-section-title"><i className="fa-solid fa-envelope-open-text"></i> Global Contact Details</h3>
            
            <div className="admin-form-group">
              <label>Primary Email Address</label>
              <input 
                type="email" 
                className="admin-input" 
                value={data.global.email || ''} 
                onChange={(e) => handleGlobalChange('email', e.target.value)} 
              />
            </div>
            
            <div className="admin-form-group">
              <label>Working Hours</label>
              <input 
                type="text" 
                className="admin-input" 
                value={data.global.hours || ''} 
                onChange={(e) => handleGlobalChange('hours', e.target.value)} 
                placeholder="e.g. 09:00 AM – 09:30 PM (All 7 Days Open)"
              />
            </div>

            <div className="admin-form-group">
              <label>Helpline Phone Numbers (Comma separated)</label>
              <input 
                type="text" 
                className="admin-input" 
                value={(data.global.phones || []).join(', ')} 
                onChange={(e) => handleGlobalChange('phones', e.target.value.split(',').map(s => s.trim()))} 
                placeholder="+91 90599 49365, +91 96031 49365"
              />
            </div>
          </div>

          {/* Branch Locations */}
          <div className="admin-section-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 className="admin-section-title" style={{ margin: 0 }}><i className="fa-solid fa-building-flag"></i> Branch Locations</h3>
              <button className="admin-btn admin-btn-sm admin-btn-outline" onClick={addBranch}>
                <i className="fa-solid fa-plus"></i> Add Branch
              </button>
            </div>

            {Object.entries(data.branches).map(([key, branch], index) => (
              <div key={key} style={{ background: 'var(--bg-powder-blue)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', border: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <h4 style={{ margin: 0, color: 'var(--text-slate-dark)', fontSize: '1rem' }}>Branch {index + 1}</h4>
                  <button className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => removeBranch(key)} title="Remove Branch">
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="admin-form-group">
                    <label>Branch Title</label>
                    <input 
                      type="text" 
                      className="admin-input" 
                      value={branch.title || ''} 
                      onChange={(e) => handleBranchChange(key, 'title', e.target.value)} 
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Phone Number</label>
                    <input 
                      type="text" 
                      className="admin-input" 
                      value={branch.phone || ''} 
                      onChange={(e) => handleBranchChange(key, 'phone', e.target.value)} 
                    />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label>Physical Address</label>
                  <input 
                    type="text" 
                    className="admin-input" 
                    value={branch.addr || ''} 
                    onChange={(e) => handleBranchChange(key, 'addr', e.target.value)} 
                  />
                </div>

                <div className="admin-form-group">
                  <label>Google Maps Embed URL</label>
                  <input 
                    type="text" 
                    className="admin-input" 
                    value={branch.url || ''} 
                    onChange={(e) => handleBranchChange(key, 'url', e.target.value)} 
                  />
                </div>

                <div className="admin-form-group">
                  <label>Google Maps Share Link</label>
                  <input 
                    type="text" 
                    className="admin-input" 
                    value={branch.externalUrl || ''} 
                    onChange={(e) => handleBranchChange(key, 'externalUrl', e.target.value)} 
                  />
                </div>
              </div>
            ))}
          </div>

        </div>
        
        {/* Sidebar Hints */}
        <div className="admin-editor-sidebar">
          <div className="admin-info-box">
            <i className="fa-solid fa-circle-info"></i>
            <div>
              <strong>Global Contacts</strong> appear in the footer and main contact page.<br/><br/>
              <strong>Branches</strong> appear in the dropdowns for pickup requests and in the locations grid. Ensure you provide valid Google Maps Embed URLs so the maps render correctly on the Branches page!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
