import { useState, useEffect } from 'react';
import { listImageKitFiles, deleteImageKitFile } from '../../../services/api';
import ImageUploader from '../../../components/admin/ImageUploader';

const IK_BASE = 'https://ik.imagekit.io/uy5estwss';

export default function MediaLibrary() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [folder, setFolder] = useState('/sai-couriers');
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [uploadKey, setUploadKey] = useState(0);

  const loadFiles = () => {
    setLoading(true);
    setError('');
    listImageKitFiles(folder)
      .then(res => setFiles(res.data || []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadFiles(); }, [folder]);

  const handleDelete = async (fileId) => {
    if (!window.confirm('Delete this photo permanently?')) return;
    try {
      await deleteImageKitFile(fileId);
      setFiles(f => f.filter(file => file.fileId !== fileId));
    } catch (err) {
      alert('Could not delete photo. Please try again.');
    }
  };

  const handleCopyUrl = (url) => {
    navigator.clipboard.writeText(url);
    alert('Photo link copied to clipboard!');
  };

  return (
    <div className="admin-panel-content">
      <div className="admin-editor-header">
        <h2 className="admin-editor-title"><i className="fa-solid fa-images"></i> Media Library</h2>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <select className="admin-field-input" value={folder} onChange={e => setFolder(e.target.value)} style={{ minWidth: '180px' }}>
            <option value="/sai-couriers">All Photos</option>
            <option value="/sai-couriers/home">Home Page</option>
            <option value="/sai-couriers/about">About Page</option>
            <option value="/sai-couriers/services">Services</option>
            <option value="/sai-couriers/food-shipping">Food Shipping</option>
          </select>
          <button className="admin-btn admin-btn-outline" onClick={loadFiles}>
            <i className="fa-solid fa-arrows-rotate"></i> Refresh
          </button>
        </div>
      </div>

      {/* Upload Area */}
      <div className="admin-media-upload-zone">
        <h4><i className="fa-solid fa-cloud-arrow-up"></i> Upload New Photo</h4>
        <ImageUploader
          key={uploadKey}
          onUpload={(url, fileId) => {
            if (url) { setUploadKey(k => k + 1); loadFiles(); }
          }}
          folder={folder || '/sai-couriers'}
          label="Click or drag photo here to upload"
        />
      </div>

      {error && <div className="admin-error">{error}</div>}

      {loading ? (
        <div className="admin-loading"><i className="fa-solid fa-circle-notch fa-spin"></i> Loading media…</div>
      ) : files.length === 0 ? (
        <div className="admin-coming-soon">
          <i className="fa-solid fa-image" style={{ fontSize: '3rem', color: '#CBD5E1', marginBottom: '1rem' }}></i>
          <h3>No Photos Found</h3>
          <p>Upload photos using the box above. They will appear here and can be used on any page.</p>
        </div>
      ) : (
        <div className="admin-media-grid">
          {files.map(file => (
            <div key={file.fileId} className="admin-media-card">
              <div className="admin-media-img-wrap">
                <img src={`${file.url}?tr=w-300,h-200,fo-auto`} alt={file.name} loading="lazy" />
              </div>
              <div className="admin-media-info">
                <div className="admin-media-name" title={file.name}>{file.name}</div>
                <div className="admin-media-meta">{file.fileType} • {Math.round((file.size || 0) / 1024)} KB</div>
              </div>
              <div className="admin-media-actions">
                <button className="admin-btn admin-btn-sm admin-btn-outline" onClick={() => handleCopyUrl(file.url)} title="Copy URL">
                  <i className="fa-solid fa-copy"></i>
                </button>
                <a href={file.url} target="_blank" rel="noreferrer" className="admin-btn admin-btn-sm admin-btn-outline" title="View Full">
                  <i className="fa-solid fa-arrow-up-right-from-square"></i>
                </a>
                <button className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => handleDelete(file.fileId)} title="Delete">
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
