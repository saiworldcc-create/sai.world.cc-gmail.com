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
  const [expandedBranch, setExpandedBranch] = useState(null);

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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
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

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '1.5rem' }}>
              {Object.entries(data.branches).map(([key, branch], index) => {
                const isExpanded = expandedBranch === key;
                return (
                  <div key={key} style={{ background: '#F8FBFC', padding: '1.5rem', borderRadius: '12px', border: '1px solid #DDEFF7', display: 'flex', flexDirection: 'column' }}>
                    <div 
                      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                      onClick={() => setExpandedBranch(isExpanded ? null : key)}
                    >
                      <h4 style={{ margin: 0, color: '#1E3446', fontSize: '1.1rem', fontWeight: 800 }}>
                        Branch {index + 1} {branch.title ? `- ${branch.title}` : ''}
                      </h4>
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <i className={`fa-solid fa-chevron-${isExpanded ? 'up' : 'down'}`} style={{ color: '#7091A8' }}></i>
                        <button 
                          className="admin-btn admin-btn-sm admin-btn-danger" 
                          onClick={(e) => {
                            e.stopPropagation();
                            removeBranch(key);
                          }} 
                          title="Remove Branch"
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    </div>
                    
                    {isExpanded && (
                      <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #E3EDF3' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                          <div className="admin-form-group" style={{ marginBottom: 0 }}>
                            <label>Branch Title</label>
                            <input 
                              type="text" 
                              className="admin-input" 
                              value={branch.title || ''} 
                              onChange={(e) => handleBranchChange(key, 'title', e.target.value)} 
                            />
                          </div>
                          <div className="admin-form-group" style={{ marginBottom: 0 }}>
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

                        <div className="admin-form-group" style={{ marginBottom: 0 }}>
                          <label>Google Maps Share Link</label>
                          <input 
                            type="text" 
                            className="admin-input" 
                            value={branch.externalUrl || ''} 
                            onChange={(e) => handleBranchChange(key, 'externalUrl', e.target.value)} 
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
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
