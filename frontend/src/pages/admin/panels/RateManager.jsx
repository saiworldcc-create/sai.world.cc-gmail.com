import React, { useState, useEffect, useRef, Fragment } from 'react';
import { createPortal } from 'react-dom';
import api from '../../../services/api';
import { uploadRateFile, applyParsedRates } from '../../../services/api';

export default function RateManager() {
  const [ratesData, setRatesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('dhl'); // dhl, ups, self
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Search filter for country list
  const [searchTerm, setSearchTerm] = useState('');

  // File upload state
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [parsedPreview, setParsedPreview] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [applying, setApplying] = useState(false);
  const [uploadCarrier, setUploadCarrier] = useState('dhl'); // which carrier to upload for
  const fileInputRef = useRef(null);

  // Delete confirmation state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteCarrier, setDeleteCarrier] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchRates();
  }, []);

  const fetchRates = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/rates');
      setRatesData(response.rates);
    } catch (err) {
      setErrorMsg('Failed to load rates data.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      await api.put('/admin/rates', ratesData);
      setSuccessMsg('Rates updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setErrorMsg('Failed to save rates.');
    } finally {
      setSaving(false);
    }
  };

  // Generic value update handler
  const handleCountryUpdate = (idx, field, value) => {
    const newData = { ...ratesData };
    newData.countryMap[idx][field] = value;
    setRatesData(newData);
  };

  const handleGridUpdate = (carrier, zoneOrCountry, weight, value) => {
    const newData = { ...ratesData };
    if (carrier === 'self') {
      newData.carriers.self.rates[zoneOrCountry][weight] = Number(value);
    } else {
      newData.carriers[carrier].rates[zoneOrCountry][weight] = Number(value);
    }
    setRatesData(newData);
  };

  // ─── File Upload Handlers ──────────────────────────────────────────────────

  const handleFileSelect = (file) => {
    if (!file) return;
    const allowedExts = ['.pdf', '.xlsx', '.xls', '.csv'];
    const ext = '.' + file.name.split('.').pop().toLowerCase();
    if (!allowedExts.includes(ext)) {
      setErrorMsg(`Unsupported file type: ${ext}. Allowed: PDF, Excel, CSV.`);
      return;
    }
    setUploadFile(file);
    setErrorMsg('');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleUploadAndParse = async () => {
    if (!uploadFile) return;

    setUploading(true);
    setErrorMsg('');
    try {
      const formData = new FormData();
      formData.append('rateFile', uploadFile);
      const result = await uploadRateFile(uploadCarrier, formData);
      setParsedPreview(result);
      setShowUploadModal(false);
      setShowPreviewModal(true);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to parse the uploaded file.');
    } finally {
      setUploading(false);
    }
  };

  const handleApplyRates = async () => {
    if (!parsedPreview) return;

    setApplying(true);
    setErrorMsg('');
    try {
      await applyParsedRates(uploadCarrier, parsedPreview.parsed);
      setSuccessMsg(`${uploadCarrier.toUpperCase()} rates updated from ${parsedPreview.fileName}!`);
      setTimeout(() => setSuccessMsg(''), 4000);
      setShowPreviewModal(false);
      setParsedPreview(null);
      setUploadFile(null);
      await fetchRates();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to apply rates.');
    } finally {
      setApplying(false);
    }
  };

  const handleCancelPreview = () => {
    setShowPreviewModal(false);
    setParsedPreview(null);
  };

  const openUploadModal = () => {
    setUploadCarrier(activeTab);
    setUploadFile(null);
    setParsedPreview(null);
    setShowUploadModal(true);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const closeUploadModal = () => {
    setShowUploadModal(false);
    setUploadFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const clearUploadFile = () => {
    setUploadFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ─── Delete Handlers ──────────────────────────────────────────────────────

  const openDeleteModal = (carrier) => {
    setDeleteCarrier(carrier);
    setShowDeleteModal(true);
  };

  const handleDeleteRates = async () => {
    if (!deleteCarrier) return;
    setDeleting(true);
    setErrorMsg('');
    try {
      const newData = { ...ratesData };
      newData.carriers[deleteCarrier].rates = {};
      await api.put('/admin/rates', newData);
      setRatesData(newData);
      setSuccessMsg(`${deleteCarrier.toUpperCase()} rates deleted successfully.`);
      setTimeout(() => setSuccessMsg(''), 3000);
      setShowDeleteModal(false);
      setDeleteCarrier(null);
    } catch (err) {
      setErrorMsg('Failed to delete rates.');
    } finally {
      setDeleting(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // ─── Render Loading ───────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="admin-panel-content">
        <div className="admin-welcome-banner">
          <div>
            <h2>Rate Manager</h2>
            <p>Loading rate tables...</p>
          </div>
        </div>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: '2rem', color: 'var(--accent-teal)' }}></i>
        </div>
      </div>
    );
  }

  if (!ratesData) return <div className="admin-panel-content">Error loading data.</div>;

  // ─── Render Tabs ────────────────────────────────────────────────────────────

  const renderTabs = () => (
    <div className="rate-tabs">
      <button className={`rate-tab ${activeTab === 'dhl' ? 'active' : ''}`} onClick={() => setActiveTab('dhl')}>
        <i className="fa-solid fa-plane-departure"></i> DHL Rates
      </button>
      <button className={`rate-tab ${activeTab === 'ups' ? 'active' : ''}`} onClick={() => setActiveTab('ups')}>
        <i className="fa-solid fa-truck-fast"></i> UPS Rates
      </button>
      <button className={`rate-tab ${activeTab === 'self' ? 'active' : ''}`} onClick={() => setActiveTab('self')}>
        <i className="fa-solid fa-box-open"></i> Sai Self Rates
      </button>
    </div>
  );

  // ─── Upload Modal ─────────────────────────────────────────────────────────

  const renderUploadModal = () => {
    if (!showUploadModal) return null;

    return createPortal(
      <div className="admin-modal-overlay" onClick={closeUploadModal}>
        <div className="admin-modal rate-upload-modal" onClick={(e) => e.stopPropagation()}>
          <div className="admin-modal-header">
            <h3><i className="fa-solid fa-cloud-arrow-up"></i> Upload Rate Sheet</h3>
            <button onClick={closeUploadModal}><i className="fa-solid fa-xmark"></i></button>
          </div>

          <div className="admin-modal-body">
            {/* Carrier is automatically selected based on activeTab, no selector needed */}

            {/* Dropzone */}
            <div
              className={`rate-upload-dropzone ${dragOver ? 'drag-over' : ''} ${uploadFile ? 'has-file' : ''}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => !uploadFile && fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.xlsx,.xls,.csv"
                style={{ display: 'none' }}
                onChange={(e) => handleFileSelect(e.target.files?.[0])}
              />

              {!uploadFile ? (
                <div className="rate-upload-placeholder">
                  <div className="rate-upload-icon">
                    <i className="fa-solid fa-file-arrow-up"></i>
                  </div>
                  <p className="rate-upload-text">
                    Drag & drop your <strong style={{ color: '#3C9290' }}>{uploadCarrier === 'self' ? 'Sai Self' : uploadCarrier?.toUpperCase()}</strong> rate sheet here
                  </p>
                  <p className="rate-upload-subtext">or click to browse</p>
                  <div className="rate-upload-formats">
                    <span className="rate-format-badge"><i className="fa-solid fa-file-pdf"></i> PDF</span>
                    <span className="rate-format-badge"><i className="fa-solid fa-file-excel"></i> Excel</span>
                    <span className="rate-format-badge"><i className="fa-solid fa-file-csv"></i> CSV</span>
                  </div>
                </div>
              ) : (
                <div className="rate-upload-file-info">
                  <div className="rate-file-icon">
                    {uploadFile.name.endsWith('.pdf') ? (
                      <i className="fa-solid fa-file-pdf"></i>
                    ) : uploadFile.name.endsWith('.csv') ? (
                      <i className="fa-solid fa-file-csv"></i>
                    ) : (
                      <i className="fa-solid fa-file-excel"></i>
                    )}
                  </div>
                  <div className="rate-file-details">
                    <span className="rate-file-name">{uploadFile.name}</span>
                    <span className="rate-file-size">{formatFileSize(uploadFile.size)}</span>
                  </div>
                  <button className="rate-file-remove" onClick={(e) => { e.stopPropagation(); clearUploadFile(); }} title="Remove file">
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>
              )}
            </div>

            {errorMsg && (
              <div className="admin-alert error" style={{ margin: 0 }}>
                <i className="fa-solid fa-triangle-exclamation"></i> {errorMsg}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="rate-preview-footer">
            <button className="admin-btn admin-btn-outline" onClick={closeUploadModal} disabled={uploading}>
              Cancel
            </button>
            <button
              className="admin-btn admin-btn-primary"
              onClick={handleUploadAndParse}
              disabled={!uploadFile || uploading}
            >
              {uploading ? (
                <><i className="fa-solid fa-circle-notch fa-spin"></i> Parsing...</>
              ) : (
                <><i className="fa-solid fa-magnifying-glass-chart"></i> Upload & Preview</>
              )}
            </button>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  // ─── Preview Modal ──────────────────────────────────────────────────────────

  const renderPreviewModal = () => {
    if (!showPreviewModal || !parsedPreview) return null;

    const { parsed, summary, fileName, carrier } = parsedPreview;
    const previewZones = parsed.zones;
    const firstZone = parsed.zones[0];
    const previewWeights = Object.keys(parsed.rates[firstZone] || {})
      .sort((a, b) => parseFloat(a) - parseFloat(b))
      .slice(0, 15);

    return createPortal(
      <div className="admin-modal-overlay" onClick={handleCancelPreview}>
        <div className="admin-modal rate-preview-modal" onClick={(e) => e.stopPropagation()}>
          <div className="admin-modal-header">
            <h3><i className="fa-solid fa-table-cells"></i> Preview Parsed Rates</h3>
            <button onClick={handleCancelPreview}><i className="fa-solid fa-xmark"></i></button>
          </div>

          <div className="admin-modal-body">
            {/* Summary Card */}
            <div className="rate-preview-summary">
              <div className="rate-preview-stat">
                <div className="rate-preview-stat-icon" style={{ background: 'rgba(60,146,144,0.12)', color: 'var(--accent-teal)' }}>
                  <i className="fa-solid fa-layer-group"></i>
                </div>
                <div>
                  <span className="rate-preview-stat-value">{summary.zones}</span>
                  <span className="rate-preview-stat-label">Zones</span>
                </div>
              </div>
              <div className="rate-preview-stat">
                <div className="rate-preview-stat-icon" style={{ background: 'rgba(233,120,86,0.12)', color: 'var(--accent-coral)' }}>
                  <i className="fa-solid fa-weight-scale"></i>
                </div>
                <div>
                  <span className="rate-preview-stat-value">{summary.weights}</span>
                  <span className="rate-preview-stat-label">Weight Brackets</span>
                </div>
              </div>
              <div className="rate-preview-stat">
                <div className="rate-preview-stat-icon" style={{ background: 'rgba(30,52,70,0.1)', color: '#1E3446' }}>
                  <i className="fa-solid fa-file-lines"></i>
                </div>
                <div>
                  <span className="rate-preview-stat-value file-name-val">{fileName}</span>
                  <span className="rate-preview-stat-label">Source File</span>
                </div>
              </div>
            </div>

            {/* Zone/Region Names */}
            <div className="rate-preview-zones">
              <h4><i className="fa-solid fa-globe"></i> {parsed.regions ? 'Detected Continents' : 'Detected Zones'}</h4>
              <div className="rate-zone-chips">
                {parsed.regions 
                  ? Array.from(new Set(Object.values(parsed.regions))).sort().map((reg, i) => (
                      <span key={i} className="rate-zone-chip" style={{ background: '#3C9290', color: 'white', fontWeight: 'bold' }}>{reg}</span>
                    ))
                  : parsed.zones.map((z, i) => (
                      <span key={i} className="rate-zone-chip">{z}</span>
                    ))
                }
              </div>
            </div>

            {/* Preview Table */}
            <div className="rate-preview-table-wrap">
              <h4><i className="fa-solid fa-table"></i> Rate Preview {previewZones.length < parsed.zones.length ? `(showing ${previewZones.length} of ${parsed.zones.length} zones)` : ''}</h4>
              <div className="rate-grid-container">
                <table className="rate-table rate-preview-table">
                  <thead>
                    <tr>
                      <th>Weight</th>
                      {previewZones.map(z => <th key={z}>{z}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {previewWeights.map(w => (
                      <tr key={w}>
                        <td><strong>{w}</strong></td>
                        {previewZones.map(z => (
                          <td key={z}>₹{(parsed.rates[z]?.[w] || 0).toLocaleString('en-IN')}</td>
                        ))}
                      </tr>
                    ))}
                    {Object.keys(parsed.rates[firstZone] || {}).length > 15 && (
                      <tr>
                        <td colSpan={previewZones.length + 1} style={{ textAlign: 'center', color: '#7091A8', fontStyle: 'italic' }}>
                          ... and {Object.keys(parsed.rates[firstZone]).length - 15} more weight brackets
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Warning */}
            <div className="rate-preview-warning">
              <i className="fa-solid fa-triangle-exclamation"></i>
              <span>This will <strong>replace all existing {uploadCarrier.toUpperCase()} rates</strong> with the uploaded data. Make sure the parsed data looks correct before applying.</span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="rate-preview-footer">
            <button className="admin-btn admin-btn-outline" onClick={handleCancelPreview} disabled={applying}>
              <i className="fa-solid fa-xmark"></i> Cancel
            </button>
            <button className="admin-btn admin-btn-primary" onClick={handleApplyRates} disabled={applying}>
              {applying ? (
                <><i className="fa-solid fa-circle-notch fa-spin"></i> Applying...</>
              ) : (
                <><i className="fa-solid fa-check"></i> Apply to {uploadCarrier.toUpperCase()} Rates</>
              )}
            </button>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  // ─── Delete Confirmation Modal ──────────────────────────────────────────────

  const renderDeleteModal = () => {
    if (!showDeleteModal || !deleteCarrier) return null;

    const carrierLabel = deleteCarrier === 'self' ? 'Sai Self' : deleteCarrier.toUpperCase();
    const rateCount = Object.keys(ratesData.carriers[deleteCarrier]?.rates || {}).length;

    return createPortal(
      <div className="admin-modal-overlay" onClick={() => setShowDeleteModal(false)}>
        <div className="admin-modal admin-logout-modal" onClick={(e) => e.stopPropagation()}>
          <div className="admin-logout-icon-wrap">
            <i className="fa-solid fa-trash-can"></i>
          </div>
          <h3 className="admin-logout-title">Delete {carrierLabel} Rates?</h3>
          <p className="admin-logout-desc">
            This will permanently delete <strong>all {rateCount} zone rate entries</strong> for {carrierLabel}. 
            This action cannot be undone.
          </p>
          <div className="admin-logout-actions">
            <button 
              className="admin-btn admin-btn-outline" 
              onClick={() => setShowDeleteModal(false)}
              disabled={deleting}
            >
              Cancel
            </button>
            <button 
              className="admin-btn admin-btn-danger" 
              onClick={handleDeleteRates}
              disabled={deleting}
            >
              {deleting ? (
                <><i className="fa-solid fa-circle-notch fa-spin"></i> Deleting...</>
              ) : (
                <><i className="fa-solid fa-trash-can"></i> Delete All Rates</>
              )}
            </button>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  // ─── Render Country Map ─────────────────────────────────────────────────────

  const renderCountryMap = () => {
    const filtered = ratesData.countryMap.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return (
      <div className="rate-grid-container">
        <div className="rate-search-bar">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input 
            type="text" 
            placeholder="Search countries..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>
        <table className="rate-table">
          <thead>
            <tr>
              <th>Country Name</th>
              <th>DHL Zone</th>
              <th>UPS Zone</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((country) => {
              const actualIdx = ratesData.countryMap.findIndex(c => c.name === country.name);
              return (
                <tr key={country.name}>
                  <td>{country.name}</td>
                  <td>
                    <input 
                      type="text" 
                      className="rate-input" 
                      value={country.dhl} 
                      onChange={(e) => handleCountryUpdate(actualIdx, 'dhl', e.target.value)} 
                    />
                  </td>
                  <td>
                    <input 
                      type="text" 
                      className="rate-input" 
                      value={country.ups} 
                      onChange={(e) => handleCountryUpdate(actualIdx, 'ups', e.target.value)} 
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  // ─── Render Carrier Grid ────────────────────────────────────────────────────

  const renderCarrierGrid = (carrier) => {
    const rates = ratesData.carriers[carrier].rates;
    if (!rates || Object.keys(rates).length === 0) {
      return (
        <div className="rate-empty-state">
          <i className="fa-solid fa-folder-open"></i>
          <h4>No rates found</h4>
          <p>Upload a rate sheet to get started with {carrier === 'self' ? 'Sai Self' : carrier.toUpperCase()} rates.</p>
          <button className="admin-btn admin-btn-primary" onClick={openUploadModal}>
            <i className="fa-solid fa-cloud-arrow-up"></i> Upload Rate Sheet
          </button>
        </div>
      );
    }

    if (carrier === 'self') {
      const regionsMap = ratesData.carriers[carrier]?.regions || {};
      const grouped = {};
      const regionsList = [];
      Object.keys(rates).forEach(c => {
        const reg = regionsMap[c] || 'OTHER';
        if (!grouped[reg]) {
          grouped[reg] = [];
          regionsList.push(reg);
        }
        grouped[reg].push(c);
      });

      const allCountries = Object.keys(rates);
      const weightKeys = Object.keys(rates[allCountries[0]] || {}).sort((a, b) => {
        const order = ['0.5', 'add0.5', '6.0', '8.0', '11.0', '16.0', '21.0', '26.0'];
        let idxA = order.indexOf(a);
        let idxB = order.indexOf(b);
        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
        if (idxA !== -1) return -1;
        if (idxB !== -1) return 1;
        return parseFloat(a) - parseFloat(b);
      });

      return (
        <div className="rate-grid-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'white', padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <i className="fa-solid fa-location-dot" style={{ color: '#3C9290' }}></i>
              <input 
                type="text" 
                placeholder="Zipcode enter here" 
                className="rate-input"
                style={{ width: '200px', padding: '0.3rem 0.6rem', fontSize: '0.85rem' }}
              />
            </div>
          </div>
          <div className="rate-grid-container">
            <table className="rate-table">
              <thead>
                <tr>
                  <th style={{ verticalAlign: 'middle', borderRight: '2px solid #E2E8F0', borderBottom: '2px solid #E2E8F0' }}>
                    Country / Zone
                  </th>
                  {weightKeys.map(w => <th key={w} style={{ zIndex: 9, borderBottom: '2px solid #E2E8F0' }}>{w} kg</th>)}
                </tr>
              </thead>
              <tbody>
              {regionsList.map(reg => (
                <React.Fragment key={reg}>
                  <tr className="region-header-row">
                    <td colSpan={weightKeys.length + 1} style={{ background: '#3C9290', color: 'white', textAlign: 'center', fontWeight: 'bold', letterSpacing: '2px', padding: '0.6rem' }}>
                      {reg}
                    </td>
                  </tr>
                  {grouped[reg].map(c => (
                    <tr key={c}>
                      <td><strong>{c}</strong></td>
                      {weightKeys.map(w => (
                        <td key={w}>
                          <input 
                            type="number" 
                            className="rate-input number-input" 
                            value={rates[c][w] || 0}
                            onChange={(e) => handleGridUpdate(carrier, c, w, e.target.value)}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
    } else {
      const zoneKeys = Object.keys(rates).sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
      if (zoneKeys.length === 0) return <p>No data.</p>;
      const weightKeys = Object.keys(rates[zoneKeys[0]]).sort((a, b) => parseFloat(a) - parseFloat(b));

      return (
        <div className="rate-grid-container">
          <table className="rate-table">
            <thead>
              <tr>
                <th>Weight Bracket</th>
                {zoneKeys.map(z => <th key={z}>{z}</th>)}
              </tr>
            </thead>
            <tbody>
              {weightKeys.map(w => (
                <tr key={w}>
                  <td><strong>{w} kg</strong></td>
                  {zoneKeys.map(z => (
                    <td key={z}>
                      <input 
                        type="number" 
                        className="rate-input number-input" 
                        value={rates[z][w] || 0}
                        onChange={(e) => handleGridUpdate(carrier, z, w, e.target.value)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
  };

  // ─── Get current carrier label for delete button ─────────────────────────

  const getActiveCarrier = () => {
    if (activeTab === 'dhl') return 'dhl';
    if (activeTab === 'ups') return 'ups';
    if (activeTab === 'self') return 'self';
    return null;
  };

  const activeCarrier = getActiveCarrier();
  const hasRates = activeCarrier && ratesData.carriers[activeCarrier] && 
    Object.keys(ratesData.carriers[activeCarrier].rates || {}).length > 0;

  // ─── Main Render ────────────────────────────────────────────────────────────

  return (
    <div className="admin-panel-content">
      <div className="admin-welcome-banner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Rate Manager</h2>
          <p>Manage base shipping prices directly from this spreadsheet view.</p>
        </div>
        <div className="rate-banner-actions">
          <button 
            className="admin-btn admin-btn-upload" 
            onClick={openUploadModal}
          >
            <i className="fa-solid fa-cloud-arrow-up"></i>
            Upload Rates
          </button>
          {activeCarrier && hasRates && (
            <button 
              className="admin-btn admin-btn-danger"
              onClick={() => openDeleteModal(activeCarrier)}
            >
              <i className="fa-solid fa-trash-can"></i>
              Delete {activeCarrier === 'self' ? 'Self' : activeCarrier.toUpperCase()} Rates
            </button>
          )}
          <button 
            className="admin-btn admin-btn-primary" 
            onClick={handleSave} 
            disabled={saving}
          >
            {saving ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-floppy-disk"></i>}
            {saving ? 'Saving...' : 'Save Master Rates'}
          </button>
        </div>
      </div>

      {errorMsg && <div className="admin-alert error"><i className="fa-solid fa-triangle-exclamation"></i> {errorMsg}</div>}
      {successMsg && <div className="admin-alert success"><i className="fa-solid fa-circle-check"></i> {successMsg}</div>}

      <div className="rate-manager-card">
        {renderTabs()}
        
        <div className="rate-manager-content">
          {activeTab === 'dhl' && renderCarrierGrid('dhl')}
          {activeTab === 'ups' && renderCarrierGrid('ups')}
          {activeTab === 'self' && renderCarrierGrid('self')}
        </div>
      </div>

      {/* Modals */}
      {renderUploadModal()}
      {renderPreviewModal()}
      {renderDeleteModal()}
    </div>
  );
}
