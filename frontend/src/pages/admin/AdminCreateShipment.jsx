import { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { createMockShipment, calculateRates, getCountries } from '../../services/api';
import { getShipments } from '../../services/db';
import InvoiceGenerator from './InvoiceGenerator';

const SearchableSelect = ({ options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = options.filter(o => o.toLowerCase().includes(search.toLowerCase()));

  return (
    <div ref={wrapperRef} style={{ position: 'relative', width: '100%' }}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="admin-field-input"
        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: '2.5rem', background: '#fff', minHeight: '42px' }}
      >
        <span style={{ color: value ? '#1E3446' : '#7091A8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{value || placeholder}</span>
        <i className={`fa-solid fa-chevron-${isOpen ? 'up' : 'down'}`} style={{ fontSize: '0.8rem', color: '#7091A8' }}></i>
      </div>
      {isOpen && (
        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50, background: '#fff', border: '1px solid #E3EDF3', borderRadius: '8px', marginTop: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', maxHeight: '250px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '8px', borderBottom: '1px solid #E3EDF3' }}>
            <div style={{ position: 'relative' }}>
              <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#7091A8', fontSize: '0.8rem' }}></i>
              <input 
                type="text" 
                autoFocus
                placeholder="Search..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ width: '100%', padding: '8px 10px 8px 30px', border: '1px solid #E3EDF3', borderRadius: '4px', outline: 'none', fontSize: '0.9rem' }}
              />
            </div>
          </div>
          <div style={{ overflowY: 'auto' }}>
            {filtered.map(opt => (
              <div 
                key={opt}
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                  setSearch('');
                }}
                style={{ padding: '10px 12px', cursor: 'pointer', background: value === opt ? '#F4F8FA' : 'transparent', color: '#1E3446', fontSize: '0.95rem' }}
                onMouseEnter={(e) => e.target.style.background = '#F4F8FA'}
                onMouseLeave={(e) => e.target.style.background = value === opt ? '#F4F8FA' : 'transparent'}
              >
                {opt}
              </div>
            ))}
            {filtered.length === 0 && <div style={{ padding: '10px 12px', color: '#7091A8', fontSize: '0.9rem', textAlign: 'center' }}>No results found</div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default function AdminCreateShipment() {
  const [formData, setFormData] = useState({
    senderName: '', senderEmail: '', senderPhone: '', senderAddress: '',
    receiverName: '', receiverEmail: '', receiverPhone: '', receiverAddress: '', destination: '',
    originHub: 'Kadapa Hub (Main)',
    weight: '', length: '', width: '', height: '',
    carrier: 'SAI Express',
    items: '',
    price: '',
    images: [],
    customsValue: '', shipmentType: 'Non-Document (Parcel)', customShipmentType: '',
    kycFiles: [], paymentMethod: 'Cash', paymentStatus: 'Paid',
    upiId: 'saicouriers@ybl'
  });
  
  const [loading, setLoading] = useState(false);
  const [createdShipment, setCreatedShipment] = useState(null);
  // QR Code States
  const [showQrGenerator, setShowQrGenerator] = useState(false);
  
  const [countries, setCountries] = useState([]);

  // Auto-calculate rates
  useEffect(() => {
    // Fetch available countries
    getCountries()
      .then(res => {
        if (res.success && res.countries) setCountries(res.countries);
      })
      .catch(err => console.error('Failed to load countries', err));

    const fetchAutoRate = async () => {
      const numericWeight = parseFloat(formData.weight.replace(/[^0-9.]/g, ''));
      if (!formData.destination || isNaN(numericWeight) || numericWeight <= 0) return;

      const parts = formData.destination.split(',');
      const country = parts[parts.length - 1].trim();
      
      try {
        const res = await calculateRates({
          country,
          actualWeight: numericWeight,
          length: formData.length || 0,
          width: formData.width || 0,
          height: formData.height || 0
        });
        
        if (res && res.options) {
          let targetBrand = 'Sai Self';
          if (formData.carrier === 'DHL Express') targetBrand = 'Sai Exp';
          else if (formData.carrier === 'UPS Saver' || formData.carrier === 'FedEx Priority') targetBrand = 'Sai Priority';
          
          const option = res.options.find(o => o.brand === targetBrand);
          if (option) {
            setFormData(prev => ({
              ...prev,
              price: `₹${option.totalCost.toLocaleString('en-IN')}`
            }));
          } else {
            setFormData(prev => ({ ...prev, price: 'Unavailable Service' }));
          }
        }
      } catch (err) {
        // Clear price if country not found or API fails
        setFormData(prev => ({ ...prev, price: 'Unavailable Service' }));
      }
    };

    const timeout = setTimeout(fetchAutoRate, 800);
    return () => clearTimeout(timeout);
  }, [formData.weight, formData.length, formData.width, formData.height, formData.destination, formData.carrier]);
  
  // Generate a random AWB number
  const generateAwb = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 7; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
    return `SAI-IN-${result}`;
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    Promise.all(files.map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (ev) => resolve(ev.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    })).then(base64Images => {
      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), ...base64Images]
      }));
    });
  };

  const handleKycUpload = (e) => {
    const files = Array.from(e.target.files);
    Promise.all(files.map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (ev) => resolve({ name: file.name, url: ev.target.result });
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    })).then(base64Files => {
      setFormData(prev => ({
        ...prev,
        kycFiles: [...(prev.kycFiles || []), ...base64Files]
      }));
    });
  };

  const handleWeightChange = (e) => {
    const newWeight = e.target.value;
    
    setFormData({ 
      ...formData, 
      weight: newWeight
    });
  };

  const handleSenderPhoneBlur = (e) => {
    const phone = e.target.value.trim();
    if (phone.length >= 10) {
      const shipments = getShipments();
      // Find most recent shipment with this sender phone
      const pastShipment = shipments.reverse().find(s => s.senderPhone === phone);
      if (pastShipment) {
        setFormData(prev => ({
          ...prev,
          senderName: prev.senderName || pastShipment.senderName,
          senderAddress: prev.senderAddress || pastShipment.senderAddress,
        }));
      }
    }
  };

  const handleReceiverPhoneBlur = (e) => {
    const phone = e.target.value.trim();
    if (phone.length >= 10) {
      const shipments = getShipments();
      const pastShipment = shipments.reverse().find(s => s.receiverPhone === phone);
      if (pastShipment) {
        setFormData(prev => ({
          ...prev,
          receiverName: prev.receiverName || pastShipment.receiverName,
          receiverAddress: prev.receiverAddress || pastShipment.receiverAddress,
          destination: prev.destination || pastShipment.destination,
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const finalShipmentType = formData.shipmentType === 'Other (Custom)' 
        ? formData.customShipmentType || 'Custom Parcel'
        : formData.shipmentType;

      const payload = {
        ...formData,
        shipmentType: finalShipmentType,
        awb: generateAwb(),
      };
      const res = await createMockShipment(payload);
      setCreatedShipment(res.data);
    } catch (err) {
      alert('Failed to create shipment.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCreatedShipment(null);
    setFormData({
      senderName: '', senderEmail: '', senderPhone: '', senderAddress: '',
      receiverName: '', receiverEmail: '', receiverPhone: '', receiverAddress: '', destination: '',
      originHub: 'Kadapa Hub (Main)', weight: '', length: '', width: '', height: '',
      carrier: 'SAI Express', items: '', price: '', images: [],
      customsValue: '', shipmentType: 'Non-Document (Parcel)', customShipmentType: '',
      kycFiles: [], paymentMethod: 'Cash', paymentStatus: 'Paid',
      upiId: 'saicouriers@ybl'
    });
  };

  const handleDownloadQR = () => {
    const svg = document.getElementById("customer-qr-svg");
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    
    // Add extra height for the text
    const padding = 20;
    const textHeight = 40;
    
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width + padding * 2;
      canvas.height = img.height + padding * 2 + textHeight;
      
      // White background
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw QR Code
      ctx.drawImage(img, padding, padding);
      
      // Draw AWB Text
      ctx.fillStyle = "#1E3446";
      ctx.font = "bold 20px monospace";
      ctx.textAlign = "center";
      ctx.fillText(createdShipment?.awb || 'UNKNOWN', canvas.width / 2, canvas.height - padding);
      
      // Download
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `QR_${createdShipment?.awb || 'Shipment'}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="admin-panel-content" style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '1000px' }}>
        {createdShipment ? (
          <div style={{ background: '#FFFFFF', padding: '3rem', borderRadius: '16px', border: '1px solid #DDEFF7', boxShadow: '0 8px 30px rgba(32, 54, 72, 0.08)', textAlign: 'center' }}>
            <div style={{ width: '80px', height: '80px', background: '#E6F4F1', color: '#3C9290', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', margin: '0 auto 1.5rem auto' }}>
              <i className="fa-solid fa-check"></i>
            </div>
            <h2 style={{ color: '#1E3446', marginBottom: '1rem', fontSize: '1.8rem' }}>Shipment Created Successfully!</h2>
            <div style={{ background: '#F8FBFC', border: '1px dashed #B8D5E5', padding: '1.5rem', borderRadius: '12px', display: 'inline-block', marginBottom: '2rem' }}>
              <span style={{ display: 'block', fontSize: '0.9rem', color: '#7091A8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem', fontWeight: 700 }}>Tracking Number (AWB)</span>
              <strong style={{ color: '#1E3446', fontSize: '1.5rem', letterSpacing: '2px', fontFamily: 'monospace' }}>{createdShipment.awb}</strong>
            </div>
            <p style={{ color: '#4A6B82', marginBottom: '2.5rem', fontSize: '1.1rem' }}>This shipment is now live in the database and can be tracked by the customer immediately.</p>
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button type="button" onClick={() => setShowQrGenerator(true)} className="admin-btn admin-btn-outline" style={{ padding: '0.8rem 1.5rem', fontSize: '1rem', borderColor: 'var(--accent-teal)', color: 'var(--accent-teal)' }}>
                <i className="fa-solid fa-qrcode"></i> Save&generate the Qr code
              </button>
              <InvoiceGenerator shipment={createdShipment} />
              <button onClick={resetForm} className="admin-btn admin-btn-outline" style={{ padding: '0.8rem 1.5rem', fontSize: '1rem' }}>
                <i className="fa-solid fa-plus"></i> Create Another
              </button>
            </div>
          </div>
        ) : (
          <div style={{ background: '#FFFFFF', padding: '3rem', borderRadius: '16px', boxShadow: '0 8px 30px rgba(32, 54, 72, 0.08)', border: '1px solid #E3EDF3' }}>
            <h2 style={{ margin: '0 0 2rem 0', color: '#1E3446', fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '2px solid #F4F7F9', paddingBottom: '1rem' }}>
              <i className="fa-solid fa-box-open" style={{ color: 'var(--accent-teal)' }}></i> Create New Shipment
            </h2>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
              {/* Customer Details Section */}
              <div>
                <h4 style={{ color: '#4A6B82', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fa-solid fa-users"></i> Sender Details
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                  <div className="admin-field">
                    <label className="admin-field-label">Sender Full Name</label>
                    <div style={{ position: 'relative' }}>
                      <i className="fa-regular fa-user" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#7091A8' }}></i>
                      <input type="text" name="senderName" className="admin-field-input" value={formData.senderName} onChange={handleChange} required placeholder="e.g. John Doe" style={{ paddingLeft: '2.5rem' }} />
                    </div>
                  </div>
                  <div className="admin-field">
                    <label className="admin-field-label">Sender Phone</label>
                    <div style={{ position: 'relative' }}>
                      <i className="fa-solid fa-phone" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#7091A8' }}></i>
                      <input type="tel" pattern="[\+]?[0-9\s\-]{10,15}" title="Enter a valid phone number (10-15 digits)" name="senderPhone" className="admin-field-input" value={formData.senderPhone} onChange={handleChange} onBlur={handleSenderPhoneBlur} required placeholder="e.g. +91 9876543210" style={{ paddingLeft: '2.5rem' }} />
                    </div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                  <div className="admin-field">
                    <label className="admin-field-label">Sender Email <span style={{ color: '#7091A8', fontWeight: 'normal' }}>(Optional)</span></label>
                    <div style={{ position: 'relative' }}>
                      <i className="fa-solid fa-envelope" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#7091A8' }}></i>
                      <input type="email" name="senderEmail" className="admin-field-input" value={formData.senderEmail} onChange={handleChange} placeholder="e.g. sender@example.com" style={{ paddingLeft: '2.5rem' }} />
                    </div>
                  </div>
                  <div className="admin-field">
                    <label className="admin-field-label">Sender Full Address</label>
                    <div style={{ position: 'relative' }}>
                      <i className="fa-solid fa-map-location-dot" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#7091A8' }}></i>
                      <input type="text" minLength="10" name="senderAddress" className="admin-field-input" value={formData.senderAddress} onChange={handleChange} required placeholder="e.g. 12-34, Main Road, Kadapa, AP" style={{ paddingLeft: '2.5rem' }} />
                    </div>
                  </div>
                </div>
                
                <div className="admin-field" style={{ marginBottom: '2.5rem' }}>
                  <label className="admin-field-label">Sender KYC / ID Proof <span style={{ color: '#7091A8', fontWeight: 'normal' }}>(Aadhar, PAN, or Passport)</span></label>
                  <input type="file" multiple accept="image/*,application/pdf" onChange={handleKycUpload} className="admin-field-input" style={{ padding: '0.5rem' }} />
                  {formData.kycFiles && formData.kycFiles.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                      {formData.kycFiles.map((file, idx) => (
                        <div key={idx} style={{ position: 'relative', width: '90px', height: '90px', borderRadius: '8px', overflow: 'hidden', border: '2px solid #E3EDF3', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                          {file.startsWith('data:image') ? (
                            <img src={file} alt={`KYC ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <div style={{ width: '100%', height: '100%', background: '#F8FBFC', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3C9290' }}><i className="fa-solid fa-file-pdf fa-2x"></i></div>
                          )}
                          <button 
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              const newFiles = [...formData.kycFiles];
                              newFiles.splice(idx, 1);
                              setFormData({ ...formData, kycFiles: newFiles });
                            }}
                            style={{ position: 'absolute', top: 2, right: 2, background: 'rgba(231,76,60,0.9)', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}
                          >
                            <i className="fa-solid fa-xmark"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <h4 style={{ color: '#4A6B82', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fa-solid fa-user-check"></i> Receiver Details
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                  <div className="admin-field">
                    <label className="admin-field-label">Receiver Full Name</label>
                    <div style={{ position: 'relative' }}>
                      <i className="fa-regular fa-user" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#7091A8' }}></i>
                      <input type="text" name="receiverName" className="admin-field-input" value={formData.receiverName} onChange={handleChange} required placeholder="e.g. Jane Smith" style={{ paddingLeft: '2.5rem' }} />
                    </div>
                  </div>
                  <div className="admin-field">
                    <label className="admin-field-label">Receiver Phone</label>
                    <div style={{ position: 'relative' }}>
                      <i className="fa-solid fa-phone" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#7091A8' }}></i>
                      <input type="tel" pattern="[\+]?[0-9\s\-]{10,15}" title="Enter a valid phone number (10-15 digits)" name="receiverPhone" className="admin-field-input" value={formData.receiverPhone} onChange={handleChange} onBlur={handleReceiverPhoneBlur} required placeholder="e.g. +44 20 7123 4567" style={{ paddingLeft: '2.5rem' }} />
                    </div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                  <div className="admin-field">
                    <label className="admin-field-label">Receiver Email <span style={{ color: '#7091A8', fontWeight: 'normal' }}>(Optional)</span></label>
                    <div style={{ position: 'relative' }}>
                      <i className="fa-solid fa-envelope" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#7091A8' }}></i>
                      <input type="email" name="receiverEmail" className="admin-field-input" value={formData.receiverEmail} onChange={handleChange} placeholder="e.g. receiver@example.com" style={{ paddingLeft: '2.5rem' }} />
                    </div>
                  </div>
                  <div className="admin-field">
                    <label className="admin-field-label">Destination Country</label>
                    <div style={{ position: 'relative' }}>
                      <i className="fa-solid fa-earth-americas" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#7091A8', zIndex: 1 }}></i>
                      <SearchableSelect 
                        options={countries}
                        value={formData.destination}
                        onChange={(val) => setFormData({ ...formData, destination: val })}
                        placeholder="-- Select Country --"
                      />
                    </div>
                  </div>
                </div>
                <div className="admin-field" style={{ marginBottom: '1.5rem' }}>
                  <label className="admin-field-label">Receiver Full Address</label>
                  <div style={{ position: 'relative' }}>
                    <i className="fa-solid fa-location-dot" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#7091A8' }}></i>
                    <input type="text" minLength="10" name="receiverAddress" className="admin-field-input" value={formData.receiverAddress} onChange={handleChange} required placeholder="e.g. 10 Downing St, Westminster" style={{ paddingLeft: '2.5rem' }} />
                  </div>
                </div>
              </div>

              {/* Shipment Details Section */}
              <div>
                <h4 style={{ color: '#4A6B82', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fa-solid fa-box-open"></i> Package Dimensions & Details
                </h4>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                  <div className="admin-field">
                    <label className="admin-field-label">Shipment Type</label>
                    <div style={{ position: 'relative' }}>
                      <i className="fa-solid fa-box" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#7091A8', zIndex: 1 }}></i>
                      <select 
                        name="shipmentType" 
                        className="admin-field-input" 
                        value={formData.shipmentType} 
                        onChange={handleChange} 
                        style={{ paddingLeft: '2.5rem' }} 
                        required
                      >
                        <option value="Non-Document (Parcel)">Non-Document (Parcel)</option>
                        <option value="Document">Document</option>
                        <option value="Food Items">Food Items</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Garments / Clothes">Garments / Clothes</option>
                        <option value="Medicines">Medicines</option>
                        <option value="Commercial Cargo">Commercial Cargo</option>
                        <option value="Other (Custom)">Other (Custom)</option>
                      </select>
                    </div>
                    {formData.shipmentType === 'Other (Custom)' && (
                      <div style={{ marginTop: '0.5rem', position: 'relative' }}>
                        <i className="fa-solid fa-pen" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#7091A8', zIndex: 1 }}></i>
                        <input
                          type="text"
                          name="customShipmentType"
                          className="admin-field-input"
                          value={formData.customShipmentType}
                          onChange={handleChange}
                          style={{ paddingLeft: '2.5rem' }}
                          placeholder="Enter custom type..."
                          required
                        />
                      </div>
                    )}
                  </div>
                  <div className="admin-field">
                    <label className="admin-field-label">Customs Declared Value</label>
                    <div style={{ position: 'relative' }}>
                      <i className="fa-solid fa-file-invoice-dollar" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#7091A8' }}></i>
                      <input type="text" name="customsValue" className="admin-field-input" placeholder="e.g. ₹5,000 or $50" value={formData.customsValue} onChange={handleChange} required style={{ paddingLeft: '2.5rem' }} />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div className="admin-field">
                    <label className="admin-field-label">Weight (Calculates Price)</label>
                    <div style={{ position: 'relative' }}>
                      <i className="fa-solid fa-weight-hanging" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#7091A8' }}></i>
                      <input type="text" name="weight" className="admin-field-input" placeholder="e.g. 15 kg" value={formData.weight} onChange={handleWeightChange} required style={{ paddingLeft: '2.5rem' }} />
                    </div>
                  </div>
                  <div className="admin-field">
                    <label className="admin-field-label">Length (cm)</label>
                    <input type="number" min="1" max="500" name="length" className="admin-field-input" placeholder="L" value={formData.length} onChange={handleChange} />
                  </div>
                  <div className="admin-field">
                    <label className="admin-field-label">Width (cm)</label>
                    <input type="number" min="1" max="500" name="width" className="admin-field-input" placeholder="W" value={formData.width} onChange={handleChange} />
                  </div>
                  <div className="admin-field">
                    <label className="admin-field-label">Height (cm)</label>
                    <input type="number" min="1" max="500" name="height" className="admin-field-input" placeholder="H" value={formData.height} onChange={handleChange} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                  <div className="admin-field">
                    <label className="admin-field-label">Price Quoted</label>
                    <div style={{ position: 'relative' }}>
                      <i className={`fa-solid ${formData.price === 'Unavailable Service' ? 'fa-triangle-exclamation' : 'fa-indian-rupee-sign'}`} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: formData.price === 'Unavailable Service' ? '#E74C3C' : '#7091A8' }}></i>
                      <input type="text" name="price" className="admin-field-input" placeholder="e.g. ₹12,000" value={formData.price} onChange={handleChange} required style={{ paddingLeft: '2.5rem', color: formData.price === 'Unavailable Service' ? '#E74C3C' : 'inherit', fontWeight: formData.price === 'Unavailable Service' ? '600' : 'normal' }} />
                    </div>
                  </div>
                  <div className="admin-field">
                    <label className="admin-field-label">Service / Carrier</label>
                    <div style={{ position: 'relative' }}>
                      <i className="fa-solid fa-plane-departure" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#7091A8', zIndex: 1 }}></i>
                      <select name="carrier" className="admin-field-input" value={formData.carrier} onChange={handleChange} style={{ cursor: 'pointer', paddingLeft: '2.5rem' }}>
                        <option>SAI Express (Default)</option>
                        <option>DHL Express</option>
                        <option>FedEx Priority</option>
                        <option>UPS Saver</option>
                      </select>
                    </div>
                  </div>
                  <div className="admin-field">
                    <label className="admin-field-label">Origin Hub</label>
                    <div style={{ position: 'relative' }}>
                      <i className="fa-solid fa-building" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#7091A8', zIndex: 1 }}></i>
                      <select name="originHub" className="admin-field-input" value={formData.originHub} onChange={handleChange} style={{ cursor: 'pointer', paddingLeft: '2.5rem' }}>
                        <option>Kadapa Hub (Main)</option>
                        <option>Tirupati Branch</option>
                        <option>Proddatur Drop-off</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                  <div className="admin-field">
                    <label className="admin-field-label">Payment Method</label>
                    <div style={{ position: 'relative' }}>
                      <i className="fa-solid fa-credit-card" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#7091A8', zIndex: 1 }}></i>
                      <select name="paymentMethod" className="admin-field-input" value={formData.paymentMethod} onChange={handleChange} style={{ cursor: 'pointer', paddingLeft: '2.5rem' }}>
                        <option>Cash</option>
                        <option>UPI / QR Code</option>
                        <option>Bank Transfer</option>
                        <option>Credit/Debit Card</option>
                      </select>
                    </div>
                  </div>
                  <div className="admin-field">
                    <label className="admin-field-label">Payment Status</label>
                    <div style={{ position: 'relative' }}>
                      <i className="fa-solid fa-circle-check" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#7091A8', zIndex: 1 }}></i>
                      <select name="paymentStatus" className="admin-field-input" value={formData.paymentStatus} onChange={handleChange} style={{ cursor: 'pointer', paddingLeft: '2.5rem' }}>
                        <option>Paid</option>
                        <option>Pending</option>
                        <option>To Be Billed</option>
                      </select>
                    </div>
                  </div>
                </div>

                {formData.paymentMethod === 'UPI / QR Code' && (
                  <div style={{ background: '#F8FBFC', padding: '1rem 1.5rem', borderRadius: '8px', border: '1px dashed var(--accent-teal)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '40px', height: '40px', background: 'var(--accent-teal)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                        <i className="fa-solid fa-qrcode"></i>
                      </div>
                      <div style={{ width: '100%' }}>
                        <div style={{ fontSize: '0.85rem', color: '#7091A8', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, marginBottom: '0.2rem' }}>Official UPI ID for Payment</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <input type="text" name="upiId" value={formData.upiId} onChange={handleChange} className="admin-field-input" style={{ width: '220px', fontFamily: 'monospace', fontSize: '1.1rem', padding: '0.5rem', margin: 0, border: '1px solid #B8D5E5' }} />
                          <button type="button" onClick={() => {navigator.clipboard.writeText(formData.upiId); alert('UPI ID Copied!');}} style={{ background: 'transparent', border: 'none', color: 'var(--accent-teal)', cursor: 'pointer', fontSize: '1.2rem', padding: '0.5rem' }} title="Copy UPI ID">
                            <i className="fa-regular fa-copy"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div style={{ background: 'white', padding: '0.5rem', borderRadius: '8px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <QRCodeSVG 
                        value={`upi://pay?pa=${formData.upiId}&pn=Sai%20Couriers&cu=INR${formData.price ? '&am=' + parseFloat(formData.price.replace(/[^0-9.]/g, '')).toFixed(2) : ''}`} 
                        size={80} 
                      />
                      <span style={{ fontSize: '0.7rem', color: '#7091A8', marginTop: '0.3rem', fontWeight: 'bold' }}>Scan to Pay</span>
                    </div>
                  </div>
                )}

                <div className="admin-field">
                  <label className="admin-field-label">Declared Items (Contents)</label>
                  <textarea name="items" className="admin-field-input" placeholder="e.g. Homemade Sweets, Pickles, Clothes" value={formData.items} onChange={handleChange} required rows="3" style={{ resize: 'vertical', padding: '1rem' }}></textarea>
                </div>

                <div className="admin-field" style={{ marginTop: '0.5rem' }}>
                  <label className="admin-field-label">Upload Stock / Items Images <span style={{ color: '#7091A8', fontWeight: 'normal' }}>(Will be printed on receipt)</span></label>
                  <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="admin-field-input" style={{ padding: '0.5rem' }} />
                  {formData.images && formData.images.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                      {formData.images.map((img, idx) => (
                        <div key={idx} style={{ position: 'relative', width: '90px', height: '90px', borderRadius: '8px', overflow: 'hidden', border: '2px solid #E3EDF3', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                          <img src={img} alt={`Stock ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <button 
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              const newImgs = [...formData.images];
                              newImgs.splice(idx, 1);
                              setFormData({ ...formData, images: newImgs });
                            }}
                            style={{ position: 'absolute', top: 2, right: 2, background: 'rgba(231,76,60,0.9)', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}
                          >
                            <i className="fa-solid fa-xmark"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ borderTop: '2px solid #F4F7F9', paddingTop: '1.5rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                <button type="submit" disabled={loading} className="admin-btn admin-btn-primary" style={{ padding: '1rem', fontSize: '1.1rem', width: '100%', justifyContent: 'center' }}>
                  {loading ? (
                    <><i className="fa-solid fa-circle-notch fa-spin"></i> Generating...</>
                  ) : (
                    <><i className="fa-solid fa-barcode"></i> Generate AWB & Create Shipment</>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* QR Generator Modal */}
        {showQrGenerator && (
          <div className="admin-modal-overlay" onClick={() => setShowQrGenerator(false)} style={{ zIndex: 9999 }}>
            <div className="admin-modal" onClick={e => e.stopPropagation()} style={{ textAlign: 'center', padding: '2rem' }}>
              <h3 style={{ marginBottom: '1.5rem', color: '#1E3446' }}>Customer Details QR Code</h3>
              <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', display: 'inline-block', border: '1px solid #E2E8F0' }}>
                <QRCodeSVG 
                  id="customer-qr-svg"
                  value={JSON.stringify({
                    qrId: `QR-${Date.now()}`,
                    generatedAt: new Date().toISOString(),
                    awb: createdShipment?.awb || formData.awb || 'UNKNOWN',
                    senderName: createdShipment?.senderName || formData.senderName, 
                    senderPhone: createdShipment?.senderPhone || formData.senderPhone, 
                    senderAddress: createdShipment?.senderAddress || formData.senderAddress,
                    receiverName: createdShipment?.receiverName || formData.receiverName, 
                    receiverPhone: createdShipment?.receiverPhone || formData.receiverPhone, 
                    receiverAddress: createdShipment?.receiverAddress || formData.receiverAddress,
                    destination: createdShipment?.destination || formData.destination
                  })} 
                  size={250} 
                />
                <div style={{ marginTop: '1rem', fontWeight: 'bold', color: '#1E3446', fontSize: '1.2rem', letterSpacing: '2px', fontFamily: 'monospace' }}>
                  {createdShipment?.awb || 'UNKNOWN'}
                </div>
              </div>
              <p style={{ marginTop: '1rem', color: '#7091A8', fontSize: '0.9rem' }}>Scan this code to instantly fill customer details</p>
              
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem' }}>
                <button className="admin-btn admin-btn-outline" onClick={() => setShowQrGenerator(false)}>
                  Close
                </button>
                <button className="admin-btn admin-btn-primary" onClick={handleDownloadQR}>
                  <i className="fa-solid fa-download"></i> Save QR Code
                </button>
              </div>
            </div>
          </div>
        )}



      </div>
    </div>
  );
}
