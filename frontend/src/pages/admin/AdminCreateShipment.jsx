import { useState } from 'react';
import { createMockShipment } from '../../services/api';
import { getShipments } from '../../services/db';
import InvoiceGenerator from './InvoiceGenerator';

export default function AdminCreateShipment() {
  const [formData, setFormData] = useState({
    senderName: '', senderPhone: '', senderAddress: '',
    receiverName: '', receiverPhone: '', receiverAddress: '', destination: '',
    originHub: 'Kadapa Hub (Main)',
    weight: '', length: '', width: '', height: '',
    carrier: 'SAI Express',
    items: '',
    price: '',
    images: [],
    customsValue: '', shipmentType: 'Non-Document (Parcel)',
    kycFiles: [], paymentMethod: 'Cash', paymentStatus: 'Paid'
  });
  
  const [loading, setLoading] = useState(false);
  const [createdShipment, setCreatedShipment] = useState(null);
  
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
        reader.onload = (ev) => resolve(ev.target.result);
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
    const numericWeight = parseFloat(newWeight.replace(/[^0-9.]/g, ''));
    
    let autoPrice = formData.price;
    if (!isNaN(numericWeight) && numericWeight > 0) {
      // Default rate: ₹800 per kg
      const ratePerKg = 800; 
      autoPrice = `₹${(numericWeight * ratePerKg).toLocaleString('en-IN')}`;
    } else if (newWeight === '') {
      autoPrice = '';
    }

    setFormData({ 
      ...formData, 
      weight: newWeight,
      price: autoPrice
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
      const payload = {
        ...formData,
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
      senderName: '', senderPhone: '', senderAddress: '',
      receiverName: '', receiverPhone: '', receiverAddress: '', destination: '',
      originHub: 'Kadapa Hub (Main)', weight: '', length: '', width: '', height: '',
      carrier: 'SAI Express', items: '', price: '', images: [],
      customsValue: '', shipmentType: 'Non-Document (Parcel)',
      kycFiles: [], paymentMethod: 'Cash', paymentStatus: 'Paid'
    });
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
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
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
                <div className="admin-field" style={{ marginBottom: '1.5rem' }}>
                  <label className="admin-field-label">Sender Full Address</label>
                  <div style={{ position: 'relative' }}>
                    <i className="fa-solid fa-map-location-dot" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#7091A8' }}></i>
                    <input type="text" minLength="10" name="senderAddress" className="admin-field-input" value={formData.senderAddress} onChange={handleChange} required placeholder="e.g. 12-34, Main Road, Kadapa, AP" style={{ paddingLeft: '2.5rem' }} />
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
                    <label className="admin-field-label">Receiver Full Address</label>
                    <div style={{ position: 'relative' }}>
                      <i className="fa-solid fa-location-dot" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#7091A8' }}></i>
                      <input type="text" minLength="10" name="receiverAddress" className="admin-field-input" value={formData.receiverAddress} onChange={handleChange} required placeholder="e.g. 10 Downing St, Westminster" style={{ paddingLeft: '2.5rem' }} />
                    </div>
                  </div>
                  <div className="admin-field">
                    <label className="admin-field-label">Destination (City, Country)</label>
                    <div style={{ position: 'relative' }}>
                      <i className="fa-solid fa-earth-americas" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#7091A8' }}></i>
                      <input type="text" name="destination" className="admin-field-input" placeholder="e.g. London, United Kingdom" value={formData.destination} onChange={handleChange} required style={{ paddingLeft: '2.5rem' }} />
                    </div>
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
                      <select name="shipmentType" className="admin-field-input" value={formData.shipmentType} onChange={handleChange} style={{ cursor: 'pointer', paddingLeft: '2.5rem' }}>
                        <option>Non-Document (Parcel)</option>
                        <option>Document</option>
                      </select>
                    </div>
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
                      <i className="fa-solid fa-indian-rupee-sign" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#7091A8' }}></i>
                      <input type="text" name="price" className="admin-field-input" placeholder="e.g. ₹12,000" value={formData.price} onChange={handleChange} required style={{ paddingLeft: '2.5rem' }} />
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

              <div style={{ borderTop: '2px solid #F4F7F9', paddingTop: '1.5rem', marginTop: '0.5rem' }}>
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
      </div>
    </div>
  );
}
