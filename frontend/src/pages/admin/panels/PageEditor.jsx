import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPageContent, updatePageContent } from '../../../services/api';
import ImageUploader from '../../../components/admin/ImageUploader';
import VideoPlayer, { parseVideoUrl } from '../../../components/common/VideoPlayer';

const EDITABLE_PAGES = [
  { key: 'branding', label: 'Navbar & Branding', icon: 'fa-palette' },
  { key: 'home', label: 'Home Page', icon: 'fa-house' },
  { key: 'about', label: 'About', icon: 'fa-circle-info' },
  { key: 'services', label: 'Services', icon: 'fa-boxes-stacking' },
  { key: 'food-shipping', label: 'Food Shipping', icon: 'fa-jar' },
  { key: 'contact', label: 'Contact', icon: 'fa-envelope' },
  { key: 'branches', label: 'Branches', icon: 'fa-location-dot' },
  { key: 'tracking', label: 'Tracking', icon: 'fa-satellite-dish' },
  { key: 'calculator', label: 'Rate Calculator', icon: 'fa-calculator' },
  { key: 'customs-guide', label: 'Customs Guide', icon: 'fa-file-shield' },
  { key: 'book-pickup', label: 'Book Pickup', icon: 'fa-truck-fast' },
];

const LABEL_MAP = {
  icon: 'Icon (e.g. fa-jar, fa-plane)',
  title: 'Title',
  desc: 'Description',
  description: 'Detailed Description',
  text: 'Review / Testimonial Feedback',
  name: 'Full Name / Author',
  role: 'Location / Subtitle',
  initials: 'Avatar Initials',
  badge: 'Badge Tag',
  transit: 'Delivery Timeframe',
  bullets: 'Key Bullet Points',
  items: 'Included Items',
  address: 'Branch Address',
  phone: 'Contact Phone Number',
  hours: 'Operating Hours',
  mapUrl: 'Google Maps Link',
  span: 'Featured Card (Full Width)',
  heading: 'Heading',
  eyebrow: 'Subtitle / Eyebrow',
  lead: 'Introductory Lead Text',
  videoUrl: 'Video Link (YouTube / Vimeo / MP4)',
  heroVideoUrl: 'Hero Video Link (YouTube / MP4)',
  videoSection: 'Video Showcase Section',
  videoTitle: 'Video Title',
  videoSubtitle: 'Video Subtitle',
  posterImage: 'Video Thumbnail / Cover Image',
  enabled: 'Enable / Show on Website',
  headingHighlight: 'Highlighted Heading Words',
  paragraph: 'Paragraph Content',
  paragraph1: 'First Paragraph',
  paragraph2: 'Second Paragraph',
  paragraphs: 'Paragraphs',
  step: 'Step Description',
  tip: 'Customs Advice / Tip',
  country: 'Country Name',
  requiredDocs: 'Required KYC Documents',
  restrictedItems: 'Restricted / Prohibited Items',
  timeSlots: 'Pickup Time Slots',
  categories: 'Service Categories',
  countries: 'Supported Countries',
  branches: 'Branch Locations',
  demoAWBs: 'Sample Tracking Numbers',
  phones: 'Contact Numbers',
};

function formatLabel(str) {
  if (!str) return '';
  if (LABEL_MAP[str]) return LABEL_MAP[str];
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/[_-]/g, ' ')
    .replace(/^\w/, c => c.toUpperCase())
    .trim();
}

// ─── Field Components ──────────────────────────────────────────────────────
function TextField({ label, value, onChange, multiline = false, placeholder = '' }) {
  return (
    <div className="admin-field">
      <label className="admin-field-label">{formatLabel(label)}</label>
      {multiline ? (
        <textarea
          className="admin-field-input"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || `Enter ${formatLabel(label).toLowerCase()}…`}
          rows={3}
        />
      ) : (
        <input
          type="text"
          className="admin-field-input"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || `Enter ${formatLabel(label).toLowerCase()}…`}
        />
      )}
    </div>
  );
}

function ImageField({ label, value, onChange, folder }) {
  const isVideo = value && /\.(mp4|webm|ogg|mov|m4v)($|\?)/i.test(value);

  return (
    <div className="admin-field">
      <label className="admin-field-label" style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
        <i className={isVideo ? "fa-solid fa-video" : "fa-solid fa-image"} style={{ color: isVideo ? 'var(--accent-coral)' : 'var(--accent-teal)' }}></i>
        <span>{formatLabel(label)}</span>
      </label>
      {value && (
        <div className="admin-current-image" style={{ alignItems: 'flex-start' }}>
          {isVideo ? (
            <video key={`preview-vid-${value}`} controls src={value} style={{ width: '140px', height: '90px', borderRadius: '8px', objectFit: 'cover', background: '#0F1F2C' }} />
          ) : (
            <img key={`preview-img-${value}`} src={value} alt="Current" style={{ width: '100px', height: '70px', borderRadius: '8px', objectFit: 'cover' }} />
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <span className="admin-image-url">{value}</span>
            <span style={{ fontSize: '0.72rem', color: isVideo ? 'var(--accent-coral)' : 'var(--accent-teal)', fontWeight: 700 }}>
              {isVideo ? '🎥 Video File' : '🖼️ Image File'}
            </span>
          </div>
        </div>
      )}
      <ImageUploader
        onUpload={(url) => onChange(url)}
        folder={folder || '/sai-couriers'}
        label="Upload Photo or Video"
        allowVideo={true}
        currentImage={null}
      />
      <div className="admin-field-or">— or enter photo or video link —</div>
      <input
        type="url"
        className="admin-field-input"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://... or /assets/images/... (photo or video link)"
      />
    </div>
  );
}

function VideoField({ label, value, onChange }) {
  const parsed = parseVideoUrl(value);

  return (
    <div className="admin-field admin-video-field">
      <label className="admin-field-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <i className="fa-solid fa-video" style={{ color: 'var(--accent-coral)' }}></i>
        <span>{formatLabel(label)}</span>
      </label>

      {/* Video Preview Box */}
      {parsed ? (
        <div className="admin-video-preview-box">
          <VideoPlayer videoUrl={value} autoplay={false} />
        </div>
      ) : (
        <div className="admin-video-placeholder">
          <i className="fa-solid fa-circle-play"></i>
          <div><strong style={{ color: '#1E3446' }}>No Video Configured</strong></div>
          <div style={{ fontSize: '0.8rem', color: '#7091A8', maxWidth: '380px' }}>
            Upload a video file from your computer below, or paste any YouTube/Vimeo/MP4 link.
          </div>
        </div>
      )}

      {/* Direct Video File Upload to ImageKit */}
      <ImageUploader
        onUpload={(url) => onChange(url)}
        folder="/sai-couriers/videos"
        label="Upload Video"
        allowVideoOnly={true}
        currentImage={null}
      />

      <div className="admin-field-or">— or enter video link (YouTube, Vimeo, MP4) —</div>

      {/* Input */}
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <input
          type="url"
          className="admin-field-input"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g. https://www.youtube.com/watch?v=... or https://youtu.be/... or .mp4 link"
        />
        {value && (
          <button
            type="button"
            className="admin-array-remove"
            title="Clear video link"
            onClick={() => onChange('')}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        )}
      </div>
      <div className="admin-video-hint">
        <i className="fa-solid fa-circle-info"></i>
        Upload MP4/WebM video directly or paste YouTube watch/shorts or Vimeo links.
      </div>
    </div>
  );
}

// ─── Visual Structured Array Editor (Zero Raw JSON) ────────────────────────
function StructuredArrayEditor({ label, value = [], onChange }) {
  const items = Array.isArray(value) ? value : [];

  // Determine if this array holds structured objects or plain strings
  const isObjectArray = items.some(item => typeof item === 'object' && item !== null && !Array.isArray(item));

  if (!isObjectArray) {
    // Plain String Array (e.g. countries, bullet points, time slots, docs)
    return (
      <div className="admin-field">
        <label className="admin-field-label">{formatLabel(label)}</label>
        <div className="admin-array-list">
          {items.map((item, i) => (
            <div key={i} className="admin-array-item">
              <input
                type="text"
                className="admin-field-input"
                value={typeof item === 'string' ? item : String(item ?? '')}
                onChange={(e) => {
                  const updated = [...items];
                  updated[i] = e.target.value;
                  onChange(updated);
                }}
                placeholder={`Item #${i + 1}`}
              />
              <button
                type="button"
                className="admin-array-remove"
                title="Remove item"
                onClick={() => onChange(items.filter((_, idx) => idx !== i))}
              >
                <i className="fa-solid fa-trash-can"></i>
              </button>
            </div>
          ))}
          <button
            type="button"
            className="admin-array-add"
            onClick={() => onChange([...items, ''])}
          >
            <i className="fa-solid fa-plus"></i> Add Item
          </button>
        </div>
      </div>
    );
  }

  // Structured Objects Array (Features, Testimonials, Food Packaging items, Services, Branches)
  const updateItemProp = (index, key, val) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [key]: val };
    onChange(updated);
  };

  const removeItem = (index) => {
    onChange(items.filter((_, idx) => idx !== index));
  };

  const addNewItem = () => {
    // Clone schema from first item with empty fields
    const template = items[0]
      ? Object.keys(items[0]).reduce((acc, k) => {
          if (k === '_id') return acc;
          if (k === 'icon') {
            acc[k] = items[0].icon || 'fa-box-check';
            return acc;
          }
          const val = items[0][k];
          acc[k] = typeof val === 'boolean' ? false : (Array.isArray(val) ? [] : '');
          return acc;
        }, {})
      : { title: '', desc: '', icon: 'fa-box-check' };
    onChange([...items, template]);
  };

  return (
    <div className="admin-field">
      <label className="admin-field-label" style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1E3446' }}>
        {formatLabel(label)} ({items.length} items)
      </label>

      <div className="admin-structured-list">
        {items.map((item, i) => {
          const itemTitle = item.title || item.name || item.heading || item.country || (item.text ? item.text.substring(0, 45) + '…' : `Item #${i + 1}`);

          return (
            <div key={i} className="admin-structured-card">
              <div className="admin-structured-card-header">
                <div className="admin-structured-card-title">
                  {item.icon && <i className={`fa-solid ${item.icon}`} style={{ color: 'var(--accent-coral)' }}></i>}
                  <span>#{i + 1}: {itemTitle}</span>
                </div>
                <button
                  type="button"
                  className="admin-array-remove"
                  title="Remove this item"
                  onClick={() => removeItem(i)}
                >
                  <i className="fa-solid fa-trash-can"></i>
                </button>
              </div>

              <div className="admin-structured-card-body">
                {Object.entries(item).map(([propKey, propVal]) => {
                  // Skip technical ID and icon inputs (icons are managed automatically)
                  if (propKey === '_id' || propKey === 'icon') return null;


                  // Long text / Description / Review Feedback in comfortable multi-line textarea
                  if (
                    propKey === 'text' ||
                    propKey === 'desc' ||
                    propKey === 'description' ||
                    propKey === 'paragraph' ||
                    propKey === 'tip' ||
                    (typeof propVal === 'string' && propVal.length > 70)
                  ) {
                    return (
                      <div key={propKey} className="admin-field">
                        <label className="admin-field-label">{formatLabel(propKey)}</label>
                        <textarea
                          className="admin-field-input"
                          rows={3}
                          value={propVal || ''}
                          onChange={(e) => updateItemProp(i, propKey, e.target.value)}
                          placeholder={`Enter ${formatLabel(propKey).toLowerCase()}…`}
                        />
                      </div>
                    );
                  }

                  // Boolean toggle (e.g. span)
                  if (typeof propVal === 'boolean') {
                    return (
                      <div key={propKey} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <input
                          type="checkbox"
                          id={`chk-${i}-${propKey}`}
                          checked={propVal}
                          onChange={(e) => updateItemProp(i, propKey, e.target.checked)}
                          style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                        />
                        <label htmlFor={`chk-${i}-${propKey}`} style={{ fontSize: '0.88rem', fontWeight: 600, color: '#29465D', cursor: 'pointer' }}>
                          {formatLabel(propKey)}
                        </label>
                      </div>
                    );
                  }

                  // Nested array of strings (e.g. bullet points or sub-items)
                  if (Array.isArray(propVal)) {
                    return (
                      <div key={propKey} className="admin-field">
                        <label className="admin-field-label">{formatLabel(propKey)} (one per line)</label>
                        <textarea
                          className="admin-field-input"
                          rows={3}
                          value={propVal.join('\n')}
                          onChange={(e) => updateItemProp(i, propKey, e.target.value.split('\n').filter(s => s.trim()))}
                          placeholder="Enter items, one per line…"
                        />
                      </div>
                    );
                  }

                  // Standard text/number input
                  return (
                    <div key={propKey} className="admin-field">
                      <label className="admin-field-label">{formatLabel(propKey)}</label>
                      <input
                        type="text"
                        className="admin-field-input"
                        value={propVal ?? ''}
                        onChange={(e) => updateItemProp(i, propKey, e.target.value)}
                        placeholder={`Enter ${formatLabel(propKey).toLowerCase()}…`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        <button
          type="button"
          className="admin-array-add"
          style={{ padding: '0.75rem 1.25rem', fontSize: '0.9rem', alignSelf: 'flex-start' }}
          onClick={addNewItem}
        >
          <i className="fa-solid fa-plus"></i> Add New Item
        </button>
      </div>
    </div>
  );
}

// ─── Section-specific editors ──────────────────────────────────────────────
function SectionEditor({ sectionKey, sectionData, onChange, page }) {
  const update = (field, value) => onChange({ ...sectionData, [field]: value });

  const imageFields = ['image', 'heroBgImage', 'heroBgMobile', 'imageMobile', 'url', 'posterImage'];
  const videoFields = ['videoUrl', 'heroVideoUrl', 'video', 'embedUrl'];
  const skipFields = ['_id', '__v'];

  const hasVideoField = Object.keys(sectionData || {}).some(k => videoFields.includes(k));

  return (
    <div className="admin-section-editor">
      <h4 className="admin-section-editor-title">
        <i className="fa-solid fa-pen-to-square"></i> {formatLabel(sectionKey)}
      </h4>
      <div className="admin-section-fields">
        {Object.entries(sectionData || {}).map(([field, val]) => {
          if (skipFields.includes(field)) return null;

          // Video field with live embed/player preview
          if (videoFields.includes(field)) {
            return (
              <VideoField
                key={field}
                label={field}
                value={val}
                onChange={(v) => update(field, v)}
              />
            );
          }

          // Single image upload field
          if (imageFields.includes(field)) {
            return (
              <ImageField
                key={field}
                label={field}
                value={val}
                onChange={(v) => update(field, v)}
                folder={`/sai-couriers/${page}`}
              />
            );
          }

          // Array fields (handles both string lists and structured object lists without raw JSON)
          if (Array.isArray(val)) {
            return (
              <StructuredArrayEditor
                key={field}
                label={field}
                value={val}
                onChange={(v) => update(field, v)}
              />
            );
          }

          // Nested single object (e.g. ctaPrimary, featuredService, contactInfo, info)
          if (typeof val === 'object' && val !== null) {
            return (
              <div key={field} className="admin-nested-object">
                <label className="admin-field-label" style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1E3446', marginBottom: '0.5rem' }}>
                  {formatLabel(field)}
                </label>
                <div className="admin-nested-fields">
                  {Object.entries(val).map(([k, v]) => {
                    if (k === 'icon') return null;
                    if (videoFields.includes(k)) {
                      return (
                        <VideoField
                          key={k}
                          label={k}
                          value={v}
                          onChange={(nv) => update(field, { ...val, [k]: nv })}
                        />
                      );
                    }
                    if (imageFields.includes(k)) {
                      return (
                        <ImageField
                          key={k}
                          label={k}
                          value={v}
                          onChange={(nv) => update(field, { ...val, [k]: nv })}
                          folder={`/sai-couriers/${page}`}
                        />
                      );
                    }
                    if (Array.isArray(v)) {
                      return (
                        <StructuredArrayEditor
                          key={k}
                          label={k}
                          value={v}
                          onChange={(nv) => update(field, { ...val, [k]: nv })}
                        />
                      );
                    }
                    return (
                      <TextField
                        key={k}
                        label={k}
                        value={v}
                        onChange={(nv) => update(field, { ...val, [k]: nv })}
                        multiline={typeof v === 'string' && (v.length > 70 || k.toLowerCase().includes('desc') || k.toLowerCase().includes('text'))}
                      />
                    );
                  })}
                </div>
              </div>
            );
          }

          // Standard string field
          if (typeof val === 'string') {
            return (
              <TextField
                key={field}
                label={field}
                value={val}
                onChange={(v) => update(field, v)}
                multiline={
                  field.toLowerCase().includes('description') ||
                  field.toLowerCase().includes('paragraph') ||
                  field.toLowerCase().includes('lead') ||
                  field.toLowerCase().includes('text') ||
                  val.length > 70
                }
              />
            );
          }

          // Boolean toggle
          if (typeof val === 'boolean') {
            return (
              <div key={field} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <input
                  type="checkbox"
                  id={`field-${field}`}
                  checked={val}
                  onChange={(e) => update(field, e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor={`field-${field}`} style={{ fontSize: '0.88rem', fontWeight: 600, color: '#29465D', cursor: 'pointer' }}>
                  {formatLabel(field)}
                </label>
              </div>
            );
          }

          return null;
        })}

        {/* Optional Add Hero Background (Photo or Video) for Hero section */}
        {sectionKey === 'hero' && !('heroBgImage' in (sectionData || {})) && (
          <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px dashed #DDEFF7' }}>
            <button
              type="button"
              className="admin-array-add"
              style={{ background: '#F4FBFB', borderColor: 'var(--accent-teal)', color: 'var(--accent-teal)' }}
              onClick={() => update('heroBgImage', '')}
            >
              <i className="fa-solid fa-photo-film"></i> Add Hero Background (Photo or Video)
            </button>
          </div>
        )}

        {/* Optional Add Video button for any section that doesn't have a video yet */}
        {!hasVideoField && (
          <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px dashed #DDEFF7' }}>
            <button
              type="button"
              className="admin-array-add"
              style={{ background: '#F4FBFB', borderColor: 'var(--accent-teal)', color: 'var(--accent-teal)' }}
              onClick={() => update('videoUrl', '')}
            >
              <i className="fa-solid fa-film"></i> Add Video to this Section
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main PageEditor ───────────────────────────────────────────────────────
export default function PageEditor() {
  const { page } = useParams();
  const navigate = useNavigate();
  const [sections, setSections] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [activeSection, setActiveSection] = useState('');

  // If no page is in URL, default to 'home'
  const currentPage = page || 'home';

  useEffect(() => {
    setLoading(true);
    setMsg('');
    getPageContent(currentPage)
      .then(res => {
        const data = res.data || {};
        if (data.hero && data.hero.heroBgImage === undefined) {
          data.hero.heroBgImage = '';
        }
        if (currentPage === 'home') {
          if (data.hero && data.hero.videoUrl === undefined) {
            data.hero.videoUrl = '';
          }
          if (!data.videoSection) {
            data.videoSection = {
              enabled: true,
              eyebrow: 'Operations in Action',
              heading: 'Watch Our Packing & International Courier Process',
              description: 'See how our team packs, vacuum-seals, and ships parcels worldwide with speed and care.',
              videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
              posterImage: '/assets/images/sai_global_3d_hero.jpg',
            };
          }
        }
        setSections(data);
        const sectionKeys = Object.keys(data);
        if (sectionKeys.length > 0) setActiveSection(sectionKeys[0]);
      })
      .catch(err => {
        setMsg(`❌ Error loading content: ${err.message}`);
      })
      .finally(() => setLoading(false));
  }, [currentPage]);

  const handleSave = async () => {
    setSaving(true);
    setMsg('');
    try {
      await updatePageContent(currentPage, sections);
      try {
        sessionStorage.setItem(`sai_cms_cache_${currentPage}`, JSON.stringify(sections));
      } catch {}
      setMsg('✅ Page content saved successfully! Changes are now live.');
      setTimeout(() => setMsg(''), 5000);
    } catch (err) {
      setMsg(`❌ Save failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const currentMeta = EDITABLE_PAGES.find(p => p.key === currentPage) || {
    label: currentPage,
    icon: 'fa-file-pen',
  };

  const sectionKeys = Object.keys(sections);

  return (
    <div className="admin-panel-content">
      {/* Top Header */}
      <div className="admin-editor-header">
        <div>
          <div className="admin-breadcrumbs">
            <Link to="/admin/dashboard">Pages</Link>
            <i className="fa-solid fa-chevron-right"></i>
            <span>{currentMeta.label}</span>
          </div>
          <h2 className="admin-editor-title">
            <i className={`fa-solid ${currentMeta.icon}`}></i> {currentMeta.label}
          </h2>
          <p className="admin-editor-subtitle">
            Edit all content sections for this page. Click Save when done.
          </p>
        </div>

        <div className="admin-editor-actions">
          <Link
            to={currentPage === 'home' ? '/' : `/${currentPage}`}
            target="_blank"
            className="admin-btn admin-btn-outline"
          >
            <i className="fa-solid fa-eye"></i> Preview
          </Link>
          <button
            type="button"
            className="admin-btn admin-btn-primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? (
              <><i className="fa-solid fa-circle-notch fa-spin"></i> Saving…</>
            ) : (
              <><i className="fa-solid fa-floppy-disk"></i> Save Changes</>
            )}
          </button>
        </div>
      </div>

      {msg && (
        <div className={`admin-save-msg ${msg.startsWith('✅') ? 'success' : 'error'}`}>
          {msg}
        </div>
      )}

      {/* Editor Body */}
      {loading ? (
        <div className="admin-loading">
          <i className="fa-solid fa-circle-notch fa-spin"></i> Loading page content…
        </div>
      ) : sectionKeys.length === 0 ? (
        <div className="admin-coming-soon">
          <i className="fa-solid fa-circle-exclamation" style={{ fontSize: '3rem', color: '#D5A85F', marginBottom: '1rem' }}></i>
          <h3>No Content Sections Found</h3>
          <p>This page hasn't been seeded yet.</p>
        </div>
      ) : (
        <div className="admin-editor-layout">
          {/* Section Tabs */}
          <aside className="admin-section-tabs">
            {sectionKeys.map(key => (
              <button
                key={key}
                type="button"
                className={`admin-section-tab${activeSection === key ? ' active' : ''}`}
                onClick={() => setActiveSection(key)}
              >
                {formatLabel(key)}
              </button>
            ))}
          </aside>

          {/* Active Section Content */}
          <main className="admin-editor-body">
            {activeSection && sections[activeSection] && (
              <SectionEditor
                sectionKey={activeSection}
                sectionData={sections[activeSection]}
                onChange={(updated) =>
                  setSections(prev => ({ ...prev, [activeSection]: updated }))
                }
                page={currentPage}
              />
            )}
          </main>
        </div>
      )}
    </div>
  );
}
