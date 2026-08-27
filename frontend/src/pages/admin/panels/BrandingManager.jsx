import { useState, useEffect } from 'react';
import { getPageContent, updatePageContent } from '../../../services/api';
import ImageUploader from '../../../components/admin/ImageUploader';

const DEFAULT_BRANDING_SECTIONS = {
  logo: {
    url: '/assets/images/sai_logo_transparent.png',
    alt: 'Sai International Couriers & Cargo',
    height: 46,
    showText: false,
  },
  header: {
    companyName: 'SAI',
    tagline: 'International Couriers & Cargo',
    phone: '+91 90599 49365',
    trackBtnText: 'Track',
    bookBtnText: 'Book Pickup',
  },
};

export default function BrandingManager() {
  const [branding, setBranding] = useState(DEFAULT_BRANDING_SECTIONS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    getPageContent('branding')
      .then(res => {
        if (res.data && Object.keys(res.data).length > 0) {
          setBranding({
            logo: { ...DEFAULT_BRANDING_SECTIONS.logo, ...(res.data.logo || {}) },
            header: { ...DEFAULT_BRANDING_SECTIONS.header, ...(res.data.header || {}) },
          });
        }
      })
      .catch(err => {
        // Fallback to default
        console.warn('Using default branding:', err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  const updateLogo = (field, value) => {
    setBranding(prev => ({
      ...prev,
      logo: { ...prev.logo, [field]: value }
    }));
  };

  const updateHeader = (field, value) => {
    setBranding(prev => ({
      ...prev,
      header: { ...prev.header, [field]: value }
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    setError('');
    try {
      await updatePageContent('branding', branding);
      setMsg('✅ Branding & Logo updated successfully! Changes reflect on the live navbar.');
      setTimeout(() => setMsg(''), 5000);
    } catch (err) {
      setError(`❌ Failed to save: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleResetToDefault = () => {
    if (window.confirm('Reset logo to default official SAI logo?')) {
      setBranding(DEFAULT_BRANDING_SECTIONS);
    }
  };

  if (loading) {
    return (
      <div className="admin-panel-content">
        <div className="admin-loading">
          <i className="fa-solid fa-circle-notch fa-spin"></i> Loading branding configuration…
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel-content">
      {/* Header */}
      <div className="admin-editor-header">
        <div>
          <h2 className="admin-editor-title">
            <i className="fa-solid fa-palette"></i> Website Branding & Logo
          </h2>
          <p className="admin-editor-subtitle">
            Customize the header logo and branding details shown across all website pages.
          </p>
        </div>
        <div className="admin-editor-actions">
          <button 
            type="button" 
            onClick={handleResetToDefault} 
            className="admin-btn admin-btn-outline"
          >
            <i className="fa-solid fa-rotate-left"></i> Reset Default
          </button>
          <button 
            type="button" 
            onClick={handleSave} 
            className="admin-btn admin-btn-primary"
            disabled={saving}
          >
            {saving ? <><i className="fa-solid fa-circle-notch fa-spin"></i> Saving…</> : <><i className="fa-solid fa-floppy-disk"></i> Save Changes</>}
          </button>
        </div>
      </div>

      {msg && <div className="admin-save-msg success">{msg}</div>}
      {error && <div className="admin-save-msg error">{error}</div>}

      {/* Live Navbar Preview Box */}
      <div className="admin-settings-card" style={{ marginBottom: '1.75rem' }}>
        <h4><i className="fa-solid fa-eye"></i> Live Navbar Preview</h4>
        <p style={{ fontSize: '0.85rem', color: '#7091A8', marginBottom: '1rem' }}>
          This is how your brand section will appear inside the floating navbar capsule.
        </p>

        <div style={{ background: 'linear-gradient(135deg, #1E3446 0%, #0F2537 100%)', padding: '1.5rem', borderRadius: '16px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.95)', padding: '0.5rem 1.5rem', borderRadius: '9999px', display: 'inline-flex', alignItems: 'center', gap: '0.75rem', boxShadow: '0 8px 30px rgba(0,0,0,0.2)' }}>
            {branding.logo?.url ? (
              <img
                src={branding.logo.url}
                alt={branding.logo.alt || "Logo Preview"}
                style={{ height: `${branding.logo.height || 46}px`, maxWidth: '200px', objectFit: 'contain', display: 'block' }}
              />
            ) : (
              <div style={{ width: '36px', height: '36px', background: '#1E3446', color: '#E97856', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fa-solid fa-plane-departure"></i>
              </div>
            )}
            {branding.logo?.showText && (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: 900, color: '#1E3446', fontSize: '1.2rem', lineHeight: 1 }}>{branding.header?.companyName || 'SAI'}</span>
                <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#E97856', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{branding.header?.tagline || 'International Couriers'}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Logo Configuration Form */}
      <div className="admin-settings-card" style={{ marginBottom: '1.75rem' }}>
        <h4><i className="fa-solid fa-image"></i> Logo Image Upload & Settings</h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Logo Uploader */}
          <div className="admin-field">
            <label className="admin-field-label">Upload Logo Image</label>
            <ImageUploader
              onUpload={(url) => updateLogo('url', url)}
              folder="/sai-couriers/branding"
              label="Choose Logo File"
              currentImage={branding.logo?.url}
            />
          </div>

          <div className="admin-field-or">— or enter web link —</div>

          {/* Direct URL */}
          <div className="admin-field">
            <label className="admin-field-label">Logo Image Link</label>
            <input
              type="text"
              className="admin-field-input"
              value={branding.logo?.url || ''}
              onChange={(e) => updateLogo('url', e.target.value)}
              placeholder="e.g. /assets/images/sai_logo_transparent.png or https://..."
            />
            <span style={{ fontSize: '0.78rem', color: '#7091A8' }}>
              Supports transparent PNG, SVG, or JPG image format.
            </span>
          </div>

          {/* Alt text and Height */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
            <div className="admin-field">
              <label className="admin-field-label">Logo Alt Text</label>
              <input
                type="text"
                className="admin-field-input"
                value={branding.logo?.alt || ''}
                onChange={(e) => updateLogo('alt', e.target.value)}
                placeholder="Sai International Couriers & Cargo"
              />
            </div>

            <div className="admin-field">
              <label className="admin-field-label">
                Display Height in Navbar: <strong>{branding.logo?.height || 46}px</strong>
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <input
                  type="range"
                  min="32"
                  max="64"
                  value={branding.logo?.height || 46}
                  onChange={(e) => updateLogo('height', parseInt(e.target.value, 10))}
                  style={{ flex: 1 }}
                />
                <input
                  type="number"
                  min="32"
                  max="64"
                  className="admin-field-input"
                  style={{ width: '80px' }}
                  value={branding.logo?.height || 46}
                  onChange={(e) => updateLogo('height', parseInt(e.target.value, 10))}
                />
              </div>
            </div>
          </div>

          {/* Show text toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
            <input
              type="checkbox"
              id="show-text-toggle"
              checked={!!branding.logo?.showText}
              onChange={(e) => updateLogo('showText', e.target.checked)}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <label htmlFor="show-text-toggle" style={{ fontSize: '0.9rem', color: '#1E3446', fontWeight: 600, cursor: 'pointer' }}>
              Show text brand name next to logo (optional)
            </label>
          </div>
        </div>
      </div>

      {/* Header Text & Buttons Configuration */}
      <div className="admin-settings-card">
        <h4><i className="fa-solid fa-heading"></i> Header Buttons & Labels</h4>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
          <div className="admin-field">
            <label className="admin-field-label">Company Brand Name</label>
            <input
              type="text"
              className="admin-field-input"
              value={branding.header?.companyName || ''}
              onChange={(e) => updateHeader('companyName', e.target.value)}
              placeholder="SAI"
            />
          </div>

          <div className="admin-field">
            <label className="admin-field-label">Tagline</label>
            <input
              type="text"
              className="admin-field-input"
              value={branding.header?.tagline || ''}
              onChange={(e) => updateHeader('tagline', e.target.value)}
              placeholder="International Couriers & Cargo"
            />
          </div>

          <div className="admin-field">
            <label className="admin-field-label">Tracking Button Text</label>
            <input
              type="text"
              className="admin-field-input"
              value={branding.header?.trackBtnText || ''}
              onChange={(e) => updateHeader('trackBtnText', e.target.value)}
              placeholder="Track"
            />
          </div>

          <div className="admin-field">
            <label className="admin-field-label">Pickup Button Text</label>
            <input
              type="text"
              className="admin-field-input"
              value={branding.header?.bookBtnText || ''}
              onChange={(e) => updateHeader('bookBtnText', e.target.value)}
              placeholder="Book Pickup"
            />
          </div>
        </div>

        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button 
            type="button" 
            onClick={handleSave} 
            className="admin-btn admin-btn-primary"
            disabled={saving}
          >
            {saving ? <><i className="fa-solid fa-circle-notch fa-spin"></i> Saving…</> : <><i className="fa-solid fa-floppy-disk"></i> Save Branding</>}
          </button>
        </div>
      </div>
    </div>
  );
}
