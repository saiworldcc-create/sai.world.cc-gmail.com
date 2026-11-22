import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Package, 
  Search, 
  Calculator, 
  Clock, 
  MapPin, 
  Navigation, 
  ShieldCheck, 
  CheckCircle2, 
  ChevronRight, 
  Phone, 
  ArrowRight, 
  Upload, 
  Sparkles, 
  CreditCard, 
  QrCode, 
  FileText, 
  Plane, 
  Truck, 
  Box, 
  Share2, 
  AlertCircle,
  HelpCircle,
  Calendar,
  Layers,
  Check
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { createBooking, trackShipment } from '../../services/api';
import { COUNTRY_RATES } from '../../constants/appData';
import { AppleSquircleBadge, AppleSaiAppIcon } from '../../components/common/AppleIcons';

const DESTINATION_COUNTRIES = [
  { code: 'USA', name: 'United States', flag: '🇺🇸', transit: '4–5 Days', minDays: 4, ratePerKg: 780 },
  { code: 'UK', name: 'United Kingdom', flag: '🇬🇧', transit: '4–5 Days', minDays: 4, ratePerKg: 690 },
  { code: 'Canada', name: 'Canada', flag: '🇨🇦', transit: '4–5 Days', minDays: 4, ratePerKg: 820 },
  { code: 'Australia', name: 'Australia', flag: '🇦🇺', transit: '4–5 Days', minDays: 4, ratePerKg: 850 },
  { code: 'UAE', name: 'UAE & Dubai', flag: '🇦🇪', transit: '3–4 Days', minDays: 3, ratePerKg: 490 },
  { code: 'Germany', name: 'Germany & Europe', flag: '🇩🇪', transit: '4–5 Days', minDays: 4, ratePerKg: 740 },
  { code: 'Singapore', name: 'Singapore', flag: '🇸🇬', transit: '3–4 Days', minDays: 3, ratePerKg: 520 },
  { code: 'New Zealand', name: 'New Zealand', flag: '🇳🇿', transit: '5–6 Days', minDays: 5, ratePerKg: 890 }
];

const PARCEL_CATEGORIES = [
  { id: 'nri_food', name: 'NRI Pickles & Homemade Food', icon: '🍲', desc: 'Complimentary 5-stage leakproof vacuum packing & spices certification.' },
  { id: 'sweets', name: 'Traditional Sweets & Snacks', icon: '🍬', desc: 'Pootharekulu, Laddu, Halwa with moisture-barrier export sealing.' },
  { id: 'documents', name: 'University Transcripts & Passports', icon: '🎓', desc: 'Tamper-evident waterproof security envelope with priority courier flight.' },
  { id: 'garments', name: 'Textiles & Ready-made Clothes', icon: '👕', desc: 'Proddatur & regional silks, wedding sarees, and export clothing.' },
  { id: 'medicines', name: 'Prescription Healthcare & Medicines', icon: '💊', desc: 'Requires doctor prescription, item invoice & customs medical declaration.' },
  { id: 'general_cargo', name: 'General Commercial Cargo & Samples', icon: '📦', desc: 'Heavy freight, business samples, and e-commerce exports.' }
];

const REGIONAL_HUBS = [
  { id: 'kadapa-ho', name: 'Kadapa Head Office Hub', address: 'Co-operative Colony, Kadapa', phone: '+91 90599 49365' },
  { id: 'hyd-admin', name: 'Hyderabad Administrative & RGIA Hub', address: 'Kushaiguda / RGIA Cargo, Hyderabad', phone: '+91 90000 22821' },
  { id: 'kadapa-b2', name: 'Kadapa Branch 2 (Nagarajupeta)', address: 'Near Visweswaraiah Circle, Kadapa', phone: '+91 90008 67874' },
  { id: 'tirupati', name: 'Tirupati Regional Center', address: 'Bairagi Patteda, Near Babanikethan School', phone: '+91 90599 49365' },
  { id: 'proddatur', name: 'Proddatur Regional Hub', address: 'Bollavaram, Sastry Nagar, Proddatur', phone: '+91 90599 49365' }
];

export default function CustomerApp() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'book'); // 'book' | 'track' | 'rates' | 'passes'

  // Booking Flow Wizard State
  const [bookingStep, setBookingStep] = useState(1);
  const [formData, setFormData] = useState({
    senderName: '',
    senderPhone: '',
    senderAddress: '',
    pickupDate: new Date().toISOString().split('T')[0],
    pickupSlot: 'Morning (09:00 AM – 12:00 PM)',
    hubZone: 'Kadapa Head Office Hub',
    destCountry: 'USA',
    receiverName: '',
    receiverPhone: '',
    receiverAddress: '',
    receiverCity: '',
    receiverPostal: '',
    category: 'nri_food',
    actualWeight: 5,
    length: 30,
    width: 25,
    height: 20,
    packagingSpecial: true,
    paymentMethod: 'pay_at_doorstep', // 'upi_instant' | 'pay_at_doorstep'
    specialNotes: ''
  });

  const [bookingLoading, setBookingLoading] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Tracking Flow State
  const [trackInput, setTrackInput] = useState(searchParams.get('awb') || '');
  const [trackResult, setTrackResult] = useState(null);
  const [trackLoading, setTrackLoading] = useState(false);
  const [trackError, setTrackError] = useState('');

  // Rate Calculator State
  const [calcCountry, setCalcCountry] = useState('USA');
  const [calcWeight, setCalcWeight] = useState(7);
  const [calcIsFood, setCalcIsFood] = useState(true);

  // Auto-track if AWB provided in query
  useEffect(() => {
    const awbParam = searchParams.get('awb');
    if (awbParam) {
      setTrackInput(awbParam);
      setActiveTab('track');
      performTrack(awbParam);
    }
  }, [searchParams]);

  // Pricing formula computation
  const getSelectedCountryObj = () => DESTINATION_COUNTRIES.find(c => c.code === formData.destCountry) || DESTINATION_COUNTRIES[0];
  const volWeight = Math.ceil((formData.length * formData.width * formData.height) / 5000);
  const chargeableWeight = Math.max(Number(formData.actualWeight) || 1, volWeight);
  const countryObj = getSelectedCountryObj();
  const baseFreight = chargeableWeight * countryObj.ratePerKg;
  const foodPackingFee = formData.packagingSpecial ? 350 : 0;
  const gstTax = Math.round((baseFreight + foodPackingFee) * 0.18);
  const totalAmount = baseFreight + foodPackingFee + gstTax;

  const handleBookingSubmit = async () => {
    setBookingLoading(true);
    try {
      const payload = {
        senderName: formData.senderName,
        senderPhone: formData.senderPhone,
        senderAddress: formData.senderAddress,
        branchZone: formData.hubZone,
        pickupDate: formData.pickupDate,
        pickupTimeSlot: formData.pickupSlot,
        destCountry: formData.destCountry,
        receiverName: formData.receiverName,
        receiverPhone: formData.receiverPhone,
        receiverAddress: `${formData.receiverAddress}, ${formData.receiverCity} ${formData.receiverPostal}`.trim(),
        itemCategory: PARCEL_CATEGORIES.find(p => p.id === formData.category)?.name || 'Express Parcel',
        estimatedWeight: `${chargeableWeight} kg (Vol: ${volWeight}kg / Act: ${formData.actualWeight}kg)`,
        specialInstructions: `${formData.paymentMethod === 'pay_at_doorstep' ? '[Pay on Doorstep Pickup]' : '[Prepaid UPI]'} ${formData.specialNotes}`
      };

      const res = await createBooking(payload);
      if (res && res.data) {
        setConfirmedBooking({
          ...res.data,
          totalAmount,
          chargeableWeight,
          destCountry: formData.destCountry,
          receiverName: formData.receiverName,
          categoryName: PARCEL_CATEGORIES.find(p => p.id === formData.category)?.name
        });
        setBookingStep(5); // Success confirmation view
      }
    } catch (err) {
      alert(err.message || 'Booking submission failed. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  const performTrack = async (awbCode) => {
    if (!awbCode?.trim()) return;
    setTrackLoading(true);
    setTrackError('');
    try {
      const res = await trackShipment(awbCode.trim());
      if (res && res.data) {
        setTrackResult(res.data);
      } else {
        setTrackError('Consignment not found. Please verify the 12-digit AWB number.');
      }
    } catch (err) {
      setTrackError(err.message || 'Shipment not found in live telemetry network.');
    } finally {
      setTrackLoading(false);
    }
  };

  return (
    <div className="apple-app-shell">
      {/* Dynamic Background Mesh Gradients */}
      <div className="apple-ambient-glow-top"></div>
      <div className="apple-ambient-glow-bottom"></div>

      <div className="apple-mobile-device-viewport">
        {/* iOS Top Status Bar / Header */}
        <header className="apple-app-header">
          <div className="apple-brand-pill">
            <AppleSaiAppIcon size={42} />
            <div>
              <span className="apple-brand-name">SAI INTERNATIONAL</span>
              <span className="apple-brand-sub">NRI Courier &amp; Cargo Express</span>
            </div>
          </div>

          <div className="apple-status-badge">
            <span className="apple-live-indicator"></span>
            <span>Live Express</span>
          </div>
        </header>

        {/* Dynamic Main App Screen */}
        <main className="apple-screen-body">
          {/* =========================================================================
              TAB 1: CUSTOMER SELF-BOOKING WIZARD
              ========================================================================= */}
          {activeTab === 'book' && (
            <div className="apple-view-content fade-in">
              {/* Wizard Step Progress Tracker (Apple Segmented Pills) */}
              {bookingStep <= 4 && (
                <div className="apple-wizard-stepper">
                  <div className="stepper-pills-row">
                    <div className={`stepper-pill-item ${bookingStep === 1 ? 'active' : bookingStep > 1 ? 'completed' : ''}`}>
                      <span className="stepper-num-circle">{bookingStep > 1 ? '✓' : '1'}</span>
                      <span>Pickup</span>
                    </div>
                    <div className={`stepper-pill-item ${bookingStep === 2 ? 'active' : bookingStep > 2 ? 'completed' : ''}`}>
                      <span className="stepper-num-circle">{bookingStep > 2 ? '✓' : '2'}</span>
                      <span>Dest</span>
                    </div>
                    <div className={`stepper-pill-item ${bookingStep === 3 ? 'active' : bookingStep > 3 ? 'completed' : ''}`}>
                      <span className="stepper-num-circle">{bookingStep > 3 ? '✓' : '3'}</span>
                      <span>Packing</span>
                    </div>
                    <div className={`stepper-pill-item ${bookingStep === 4 ? 'active' : ''}`}>
                      <span className="stepper-num-circle">4</span>
                      <span>Review</span>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 1: Doorstep Pickup Details */}
              {bookingStep === 1 && (
                <div className="apple-card-panel">
                  <div className="panel-title-row">
                    <AppleSquircleBadge palette="blue" size={48}>
                      <MapPin size={24} color="#ffffff" strokeWidth={2.4} />
                    </AppleSquircleBadge>
                    <div>
                      <h2 className="panel-title">Doorstep Pickup Details</h2>
                      <p className="panel-subtitle">Our executive will arrive with calibrated scale &amp; packing kit.</p>
                    </div>
                  </div>

                  <div className="apple-input-group">
                    <label className="apple-field-label">Sender Full Name *</label>
                    <input 
                      type="text" 
                      className="apple-text-input" 
                      placeholder="e.g. S. Venkata Raman"
                      value={formData.senderName}
                      onChange={e => setFormData({ ...formData, senderName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="apple-input-group">
                    <label className="apple-field-label">Sender WhatsApp / Phone Number *</label>
                    <input 
                      type="tel" 
                      className="apple-text-input" 
                      placeholder="+91 90599 49365"
                      value={formData.senderPhone}
                      onChange={e => setFormData({ ...formData, senderPhone: e.target.value })}
                      required
                    />
                  </div>

                  <div className="apple-input-group">
                    <label className="apple-field-label">Complete Doorstep Pickup Address *</label>
                    <textarea 
                      className="apple-textarea" 
                      rows="3" 
                      placeholder="Door No, Street Name, Colony, Landmark, Pincode"
                      value={formData.senderAddress}
                      onChange={e => setFormData({ ...formData, senderAddress: e.target.value })}
                      required
                    ></textarea>
                  </div>

                  <div className="apple-two-col-grid">
                    <div className="apple-input-group">
                      <label className="apple-field-label">Pickup Date</label>
                      <input 
                        type="date" 
                        className="apple-text-input"
                        value={formData.pickupDate}
                        onChange={e => setFormData({ ...formData, pickupDate: e.target.value })}
                      />
                    </div>
                    <div className="apple-input-group">
                      <label className="apple-field-label">Preferred Time Slot</label>
                      <select 
                        className="apple-select"
                        value={formData.pickupSlot}
                        onChange={e => setFormData({ ...formData, pickupSlot: e.target.value })}
                      >
                        <option value="Morning (09:00 AM – 12:00 PM)">Morning (09 AM – 12 PM)</option>
                        <option value="Afternoon (12:00 PM – 03:00 PM)">Afternoon (12 PM – 03 PM)</option>
                        <option value="Evening (03:00 PM – 07:00 PM)">Evening (03 PM – 07 PM)</option>
                      </select>
                    </div>
                  </div>

                  <div className="apple-input-group">
                    <label className="apple-field-label">Regional Dispatch Hub</label>
                    <select 
                      className="apple-select"
                      value={formData.hubZone}
                      onChange={e => setFormData({ ...formData, hubZone: e.target.value })}
                    >
                      {REGIONAL_HUBS.map(hub => (
                        <option key={hub.id} value={hub.name}>{hub.name} ({hub.address})</option>
                      ))}
                    </select>
                  </div>

                  <button 
                    className="apple-btn-primary" 
                    onClick={() => {
                      if (!formData.senderName || !formData.senderPhone || !formData.senderAddress) {
                        alert('Please enter sender name, phone number, and pickup address.');
                        return;
                      }
                      setBookingStep(2);
                    }}
                  >
                    <span>Proceed to Destination</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              )}

              {/* STEP 2: International Destination */}
              {bookingStep === 2 && (
                <div className="apple-card-panel">
                  <div className="panel-title-row">
                    <AppleSquircleBadge palette="purple" size={48}>
                      <Plane size={24} color="#ffffff" strokeWidth={2.4} />
                    </AppleSquircleBadge>
                    <div>
                      <h2 className="panel-title">Destination &amp; Consignee</h2>
                      <p className="panel-subtitle">Select target country and recipient contact information.</p>
                    </div>
                  </div>

                  <label className="apple-field-label">Select Destination Country *</label>
                  <div className="apple-country-chips-grid">
                    {DESTINATION_COUNTRIES.map(c => (
                      <div 
                        key={c.code}
                        className={`country-chip ${formData.destCountry === c.code ? 'chip-selected' : ''}`}
                        onClick={() => setFormData({ ...formData, destCountry: c.code })}
                      >
                        <span className="country-flag">{c.flag}</span>
                        <div className="country-meta">
                          <strong className="country-name">{c.name}</strong>
                          <span className="country-transit">{c.transit}</span>
                        </div>
                        {formData.destCountry === c.code && <CheckCircle2 size={16} className="chip-check" />}
                      </div>
                    ))}
                  </div>

                  <div className="apple-input-group">
                    <label className="apple-field-label">Recipient Full Legal Name *</label>
                    <input 
                      type="text" 
                      className="apple-text-input" 
                      placeholder="e.g. Prasad Reddy"
                      value={formData.receiverName}
                      onChange={e => setFormData({ ...formData, receiverName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="apple-input-group">
                    <label className="apple-field-label">Recipient Local Phone Number *</label>
                    <input 
                      type="tel" 
                      className="apple-text-input" 
                      placeholder="e.g. +1 (469) 555-0192"
                      value={formData.receiverPhone}
                      onChange={e => setFormData({ ...formData, receiverPhone: e.target.value })}
                      required
                    />
                  </div>

                  <div className="apple-input-group">
                    <label className="apple-field-label">Destination Street Address *</label>
                    <textarea 
                      className="apple-textarea" 
                      rows="2" 
                      placeholder="Street, Suite/Apartment, State/Province"
                      value={formData.receiverAddress}
                      onChange={e => setFormData({ ...formData, receiverAddress: e.target.value })}
                    ></textarea>
                  </div>

                  <div className="apple-two-col-grid">
                    <div className="apple-input-group">
                      <label className="apple-field-label">Destination City</label>
                      <input 
                        type="text" 
                        className="apple-text-input" 
                        placeholder="e.g. Dallas, TX"
                        value={formData.receiverCity}
                        onChange={e => setFormData({ ...formData, receiverCity: e.target.value })}
                      />
                    </div>
                    <div className="apple-input-group">
                      <label className="apple-field-label">Postal / ZIP Code</label>
                      <input 
                        type="text" 
                        className="apple-text-input" 
                        placeholder="e.g. 75001"
                        value={formData.receiverPostal}
                        onChange={e => setFormData({ ...formData, receiverPostal: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="apple-button-row">
                    <button className="apple-btn-secondary" onClick={() => setBookingStep(1)}>
                      Back
                    </button>
                    <button 
                      className="apple-btn-primary" 
                      onClick={() => {
                        if (!formData.receiverName || !formData.receiverPhone) {
                          alert('Please enter recipient name and telephone number.');
                          return;
                        }
                        setBookingStep(3);
                      }}
                    >
                      <span>Next: Packaging</span>
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Parcel Category & Weight Estimator */}
              {bookingStep === 3 && (
                <div className="apple-card-panel">
                  <div className="panel-title-row">
                    <AppleSquircleBadge palette="orange" size={48}>
                      <Box size={24} color="#ffffff" strokeWidth={2.4} />
                    </AppleSquircleBadge>
                    <div>
                      <h2 className="panel-title">Parcel &amp; Weight Estimator</h2>
                      <p className="panel-subtitle">Specialized vacuum packaging and live weight calculation.</p>
                    </div>
                  </div>

                  <label className="apple-field-label">Shipment Category *</label>
                  <div className="apple-category-list">
                    {PARCEL_CATEGORIES.map(cat => {
                      const paletteMap = {
                        nri_food: 'orange',
                        sweets: 'gold',
                        documents: 'blue',
                        garments: 'purple',
                        medicines: 'red',
                        general_cargo: 'teal'
                      };
                      return (
                        <div 
                          key={cat.id}
                          className={`category-item-card ${formData.category === cat.id ? 'cat-selected' : ''}`}
                          onClick={() => setFormData({ ...formData, category: cat.id })}
                        >
                          <AppleSquircleBadge palette={paletteMap[cat.id] || 'blue'} size={40}>
                            <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>{cat.icon}</span>
                          </AppleSquircleBadge>
                          <div className="cat-info">
                            <strong>{cat.name}</strong>
                            <p>{cat.desc}</p>
                          </div>
                          {formData.category === cat.id && <CheckCircle2 size={18} className="cat-check" />}
                        </div>
                      );
                    })}
                  </div>

                  <div className="apple-weight-slider-box">
                    <div className="slider-header">
                      <span className="slider-title">Estimated Actual Weight</span>
                      <span className="slider-val">{formData.actualWeight} KG</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="50" 
                      step="1"
                      className="apple-slider"
                      value={formData.actualWeight}
                      onChange={e => setFormData({ ...formData, actualWeight: Number(e.target.value) })}
                    />
                    <div className="slider-ticks">
                      <span>1 kg</span>
                      <span>10 kg</span>
                      <span>25 kg</span>
                      <span>50 kg</span>
                    </div>
                  </div>

                  {/* Volumetric Dimensions */}
                  <div className="apple-dimensions-box">
                    <span className="box-title">Box Dimensions (For Volumetric Weight Calculation)</span>
                    <div className="dimension-inputs-row">
                      <div>
                        <label>Length (cm)</label>
                        <input 
                          type="number" 
                          value={formData.length} 
                          onChange={e => setFormData({ ...formData, length: Number(e.target.value) || 1 })} 
                        />
                      </div>
                      <div>
                        <label>Width (cm)</label>
                        <input 
                          type="number" 
                          value={formData.width} 
                          onChange={e => setFormData({ ...formData, width: Number(e.target.value) || 1 })} 
                        />
                      </div>
                      <div>
                        <label>Height (cm)</label>
                        <input 
                          type="number" 
                          value={formData.height} 
                          onChange={e => setFormData({ ...formData, height: Number(e.target.value) || 1 })} 
                        />
                      </div>
                    </div>
                    <div className="chargeable-note">
                      Volumetric Weight: <strong>{volWeight} kg</strong> • Chargeable Weight: <strong className="highlight">{chargeableWeight} kg</strong>
                    </div>
                  </div>

                  {/* NRI Food Vacuum Packing Addon Toggle */}
                  <div className="apple-toggle-box" onClick={() => setFormData({ ...formData, packagingSpecial: !formData.packagingSpecial })}>
                    <div className="toggle-info">
                      <strong>5-Tier Food Vacuum Sealing &amp; 5-Ply Box</strong>
                      <p>Guaranteed 100% leakproof sealing for homemade pickles, podis and Andhra sweets.</p>
                    </div>
                    <div className={`apple-switch ${formData.packagingSpecial ? 'switch-on' : ''}`}>
                      <div className="switch-thumb"></div>
                    </div>
                  </div>

                  <div className="apple-button-row">
                    <button className="apple-btn-secondary" onClick={() => setBookingStep(2)}>
                      Back
                    </button>
                    <button className="apple-btn-primary" onClick={() => setBookingStep(4)}>
                      <span>Review &amp; Quote</span>
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: Review, Live Pricing & Confirmation */}
              {bookingStep === 4 && (
                <div className="apple-card-panel">
                  <div className="panel-title-row">
                    <AppleSquircleBadge palette="green" size={48}>
                      <CheckCircle2 size={24} color="#ffffff" strokeWidth={2.4} />
                    </AppleSquircleBadge>
                    <div>
                      <h2 className="panel-title">Review &amp; Instant Booking</h2>
                      <p className="panel-subtitle">Transparent billing with zero hidden customs charges.</p>
                    </div>
                  </div>

                  {/* Order Summary Pass */}
                  <div className="apple-boarding-pass">
                    <div className="pass-header">
                      <div>
                        <span className="pass-eyebrow">ORIGIN</span>
                        <strong className="pass-city">Andhra Pradesh</strong>
                        <span className="pass-hub">{formData.hubZone.split('Hub')[0]}</span>
                      </div>
                      <div className="pass-flight-route">
                        <Plane size={24} className="flight-icon" />
                        <span className="route-line"></span>
                        <span className="transit-badge">{countryObj.transit}</span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span className="pass-eyebrow">DESTINATION</span>
                        <strong className="pass-city">{countryObj.name}</strong>
                        <span className="pass-hub">{countryObj.flag} {countryObj.code}</span>
                      </div>
                    </div>

                    <div className="pass-details-grid">
                      <div>
                        <span className="label">Sender</span>
                        <strong>{formData.senderName}</strong>
                        <span className="sub">{formData.senderPhone}</span>
                      </div>
                      <div>
                        <span className="label">Receiver</span>
                        <strong>{formData.receiverName}</strong>
                        <span className="sub">{formData.receiverPhone}</span>
                      </div>
                      <div>
                        <span className="label">Category</span>
                        <strong>{PARCEL_CATEGORIES.find(p => p.id === formData.category)?.name}</strong>
                      </div>
                      <div>
                        <span className="label">Chargeable Weight</span>
                        <strong>{chargeableWeight} KG</strong>
                      </div>
                    </div>

                    <div className="pass-pricing-breakdown">
                      <div className="price-row">
                        <span>Base Air Freight ({chargeableWeight} kg × ₹{countryObj.ratePerKg})</span>
                        <span>₹{baseFreight.toLocaleString()}</span>
                      </div>
                      {foodPackingFee > 0 && (
                        <div className="price-row">
                          <span>Special Food Vacuum Sealing &amp; 5-Ply Box</span>
                          <span>₹{foodPackingFee}</span>
                        </div>
                      )}
                      <div className="price-row">
                        <span>GST &amp; Aviation Handling (18%)</span>
                        <span>₹{gstTax.toLocaleString()}</span>
                      </div>
                      <div className="price-total-row">
                        <span>Total Estimated Freight</span>
                        <span className="total-val">₹{totalAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Preference */}
                  <div className="payment-select-group">
                    <label className="apple-field-label">Payment Preference</label>
                    <div className="payment-options-grid">
                      <div 
                        className={`pay-card ${formData.paymentMethod === 'pay_at_doorstep' ? 'pay-selected' : ''}`}
                        onClick={() => setFormData({ ...formData, paymentMethod: 'pay_at_doorstep' })}
                      >
                        <div className="pay-icon"><Truck size={22} /></div>
                        <div>
                          <strong>Pay at Doorstep Pickup</strong>
                          <p>Weigh on driver scale &amp; pay via Cash or UPI QR on pickup.</p>
                        </div>
                        {formData.paymentMethod === 'pay_at_doorstep' && <Check size={18} className="pay-check" />}
                      </div>

                      <div 
                        className={`pay-card ${formData.paymentMethod === 'upi_instant' ? 'pay-selected' : ''}`}
                        onClick={() => setFormData({ ...formData, paymentMethod: 'upi_instant' })}
                      >
                        <div className="pay-icon"><QrCode size={22} /></div>
                        <div>
                          <strong>Prepay via UPI / QR</strong>
                          <p>Instant zero-touch booking with priority courier scheduling.</p>
                        </div>
                        {formData.paymentMethod === 'upi_instant' && <Check size={18} className="pay-check" />}
                      </div>
                    </div>
                  </div>

                  <div className="apple-button-row">
                    <button className="apple-btn-secondary" onClick={() => setBookingStep(3)} disabled={bookingLoading}>
                      Back
                    </button>
                    <button 
                      className="apple-btn-primary glow" 
                      onClick={handleBookingSubmit}
                      disabled={bookingLoading}
                    >
                      {bookingLoading ? (
                        <span>Confirming Dispatch…</span>
                      ) : (
                        <>
                          <span>Book Doorstep Pickup (₹{totalAmount.toLocaleString()})</span>
                          <CheckCircle2 size={18} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 5: Success Ticket & AWB Pass */}
              {bookingStep === 5 && confirmedBooking && (
                <div className="apple-card-panel success-view">
                  <div className="success-badge-circle">
                    <CheckCircle2 size={44} color="#10b981" />
                  </div>
                  <span className="success-pill">Booking Confirmed &amp; Driver Alerted</span>
                  <h2 className="success-title">Your Doorstep Pickup Is Scheduled!</h2>
                  <p className="success-desc">
                    An executive driver from our <strong>{confirmedBooking.branchZone}</strong> has been notified for pickup on <strong>{formData.pickupDate}</strong> ({formData.pickupSlot}).
                  </p>

                  <div className="apple-digital-ticket">
                    <div className="ticket-awb-row">
                      <div>
                        <span className="awb-label">TRACKING AWB NUMBER</span>
                        <strong className="awb-number">{confirmedBooking.awb}</strong>
                      </div>
                      <div className="qr-wrapper">
                        <QRCodeSVG value={`https://saiexpresscourier.com/tracking?awb=${confirmedBooking.awb}`} size={76} />
                      </div>
                    </div>

                    <div className="ticket-meta-grid">
                      <div>
                        <span>Sender:</span>
                        <strong>{confirmedBooking.senderName}</strong>
                      </div>
                      <div>
                        <span>Destination:</span>
                        <strong>{confirmedBooking.destCountry}</strong>
                      </div>
                      <div>
                        <span>Est. Total:</span>
                        <strong className="highlight">₹{confirmedBooking.totalAmount?.toLocaleString()}</strong>
                      </div>
                      <div>
                        <span>Status:</span>
                        <span className="status-live">Driver Dispatched</span>
                      </div>
                    </div>
                  </div>

                  <div className="ticket-actions-grid">
                    <button 
                      className="apple-btn-secondary"
                      onClick={() => {
                        setTrackInput(confirmedBooking.awb);
                        setActiveTab('track');
                        performTrack(confirmedBooking.awb);
                      }}
                    >
                      <Navigation size={18} />
                      <span>Track Live Dispatch</span>
                    </button>

                    <a 
                      href={`https://wa.me/919059949365?text=${encodeURIComponent(`Hello Sai International, I booked pickup for AWB: ${confirmedBooking.awb} to ${confirmedBooking.destCountry}. Please confirm my pickup time slot.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="apple-btn-primary"
                    >
                      <Share2 size={18} />
                      <span>WhatsApp Dispatch Desk</span>
                    </a>
                  </div>

                  <button 
                    className="apple-btn-ghost"
                    onClick={() => {
                      setBookingStep(1);
                      setConfirmedBooking(null);
                    }}
                  >
                    + Book Another Overseas Consignment
                  </button>
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              TAB 2: LIVE SATELLITE TRACKING & TELEMETRY
              ========================================================================= */}
          {activeTab === 'track' && (
            <div className="apple-view-content fade-in">
              <div className="apple-card-panel">
                <div className="panel-title-row">
                  <AppleSquircleBadge palette="teal" size={48}>
                    <Navigation size={24} color="#ffffff" strokeWidth={2.4} />
                  </AppleSquircleBadge>
                  <div>
                    <h2 className="panel-title">Autonomous Satellite Tracking</h2>
                    <p className="panel-subtitle">Enter your 12-digit Air Waybill for live flight &amp; courier telemetry.</p>
                  </div>
                </div>

                <div className="apple-search-bar">
                  <Search size={20} className="search-icon" />
                  <input 
                    type="text" 
                    className="search-input"
                    placeholder="Enter AWB Code (e.g. SAI-88492-USA)"
                    value={trackInput}
                    onChange={e => setTrackInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') performTrack(trackInput); }}
                  />
                  <button 
                    className="search-submit-btn" 
                    onClick={() => performTrack(trackInput)}
                    disabled={trackLoading}
                  >
                    {trackLoading ? 'Tracking…' : 'Track'}
                  </button>
                </div>

                {trackError && (
                  <div className="apple-error-banner">
                    <AlertCircle size={18} />
                    <span>{trackError}</span>
                  </div>
                )}

                {/* Sample quick pills */}
                <div className="apple-sample-pills">
                  <span className="pills-label">Sample Live Flights:</span>
                  <button onClick={() => { setTrackInput('SAI-88492-USA'); performTrack('SAI-88492-USA'); }}>SAI-88492-USA</button>
                  <button onClick={() => { setTrackInput('SAI-77310-UK'); performTrack('SAI-77310-UK'); }}>SAI-77310-UK</button>
                  <button onClick={() => { setTrackInput('SAI-55201-AUS'); performTrack('SAI-55201-AUS'); }}>SAI-55201-AUS</button>
                </div>

                {/* Live Telemetry Card */}
                {trackResult && (
                  <div className="apple-telemetry-result fade-in">
                    <div className="telemetry-top-bar">
                      <div>
                        <span className="telemetry-awb">AWB {trackResult.awb}</span>
                        <h3 className="telemetry-status">{trackResult.status || 'In Transit'}</h3>
                      </div>
                      <span className="telemetry-carrier-tag">
                        <Plane size={14} /> {trackResult.carrier || 'Sai Air Freight Express'}
                      </span>
                    </div>

                    <div className="telemetry-stats-row">
                      <div>
                        <span>Origin</span>
                        <strong>{trackResult.origin || 'Kadapa Hub (AP)'}</strong>
                      </div>
                      <div>
                        <span>Destination</span>
                        <strong>{trackResult.destination || 'International Port'}</strong>
                      </div>
                      <div>
                        <span>Estimated Arrival</span>
                        <strong className="highlight">{trackResult.eta || '3–4 Business Days'}</strong>
                      </div>
                    </div>

                    {/* Milestone Progress Bar */}
                    <div className="apple-timeline-stepper">
                      <span className="timeline-title">Real-Time Progression Milestones</span>
                      
                      <div className="milestones-vertical-list">
                        {(trackResult.history || [
                          { status: 'Doorstep Pickup Completed & Weighed', time: 'Today, 10:30 AM', location: 'Kadapa Hub', completed: true },
                          { status: 'Multi-Barrier Vacuum Sealing & 5-Ply Packing Done', time: 'Today, 02:15 PM', location: 'Sai Central Packaging Center', completed: true },
                          { status: 'Customs Cleared & Outward Air Cargo Manifested', time: 'Today, 06:45 PM', location: 'RGIA Shamshabad International Terminal', completed: true },
                          { status: 'Consignment Airlifted on International Cargo Flight', time: 'In Progress', location: 'Flight Transit Corridor', active: true },
                          { status: 'Arriving at Destination Hub & Local Delivery', time: 'Scheduled', location: trackResult.destination || 'Destination Country' }
                        ]).map((m, idx) => (
                          <div key={idx} className={`milestone-item ${m.completed ? 'done' : m.active ? 'active' : ''}`}>
                            <div className="milestone-indicator">
                              {m.completed ? <Check size={12} /> : <div className="pulse-dot"></div>}
                            </div>
                            <div className="milestone-content">
                              <strong>{m.status}</strong>
                              <div className="milestone-meta">
                                <span>{m.location}</span> • <span>{m.time}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 3: TRANSPARENT RATE CALCULATOR
              ========================================================================= */}
          {activeTab === 'rates' && (
            <div className="apple-view-content fade-in">
              <div className="apple-card-panel">
                <div className="panel-title-row">
                  <AppleSquircleBadge palette="gold" size={48}>
                    <Calculator size={24} color="#ffffff" strokeWidth={2.4} />
                  </AppleSquircleBadge>
                  <div>
                    <h2 className="panel-title">Instant Air Freight Calculator</h2>
                    <p className="panel-subtitle">Transparent door-to-door overseas rates from Andhra Pradesh.</p>
                  </div>
                </div>

                <div className="apple-input-group">
                  <label className="apple-field-label">Select Destination Country</label>
                  <select 
                    className="apple-select"
                    value={calcCountry}
                    onChange={e => setCalcCountry(e.target.value)}
                  >
                    {DESTINATION_COUNTRIES.map(c => (
                      <option key={c.code} value={c.code}>{c.flag} {c.name} ({c.transit}) — ₹{c.ratePerKg}/KG</option>
                    ))}
                  </select>
                </div>

                <div className="apple-weight-slider-box">
                  <div className="slider-header">
                    <span className="slider-title">Shipment Weight</span>
                    <span className="slider-val">{calcWeight} KG</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="50" 
                    step="1"
                    className="apple-slider"
                    value={calcWeight}
                    onChange={e => setCalcWeight(Number(e.target.value))}
                  />
                  <div className="slider-ticks">
                    <span>1 kg</span>
                    <span>10 kg</span>
                    <span>25 kg</span>
                    <span>50 kg</span>
                  </div>
                </div>

                <div className="apple-toggle-box" onClick={() => setCalcIsFood(!calcIsFood)}>
                  <div className="toggle-info">
                    <strong>Include NRI Food Vacuum Packaging</strong>
                    <p>Leakproof vacuum pouches, food certification &amp; triple-ply export corrugated carton.</p>
                  </div>
                  <div className={`apple-switch ${calcIsFood ? 'switch-on' : ''}`}>
                    <div className="switch-thumb"></div>
                  </div>
                </div>

                {/* Live Calculated Quote Box */}
                {(() => {
                  const c = DESTINATION_COUNTRIES.find(x => x.code === calcCountry) || DESTINATION_COUNTRIES[0];
                  const freight = calcWeight * c.ratePerKg;
                  const pack = calcIsFood ? 350 : 0;
                  const gst = Math.round((freight + pack) * 0.18);
                  const total = freight + pack + gst;

                  return (
                    <div className="apple-calculated-result">
                      <div className="quote-header">
                        <span>Total Estimated Cost</span>
                        <strong className="quote-price">₹{total.toLocaleString()}</strong>
                      </div>
                      <div className="quote-breakdown">
                        <div><span>Base Rate:</span> <strong>₹{c.ratePerKg}/kg</strong></div>
                        <div><span>Freight Subtotal:</span> <strong>₹{freight.toLocaleString()}</strong></div>
                        <div><span>Packaging:</span> <strong>₹{pack}</strong></div>
                        <div><span>GST (18%):</span> <strong>₹{gst.toLocaleString()}</strong></div>
                        <div><span>Transit Time:</span> <strong>{c.transit}</strong></div>
                      </div>

                      <button 
                        className="apple-btn-primary glow"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            destCountry: calcCountry,
                            actualWeight: calcWeight,
                            packagingSpecial: calcIsFood
                          });
                          setActiveTab('book');
                          setBookingStep(1);
                        }}
                      >
                        <span>Book This Rate Now</span>
                        <ArrowRight size={18} />
                      </button>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 4: DIGITAL PASSES & 24/7 SUPPORT
              ========================================================================= */}
          {activeTab === 'passes' && (
            <div className="apple-view-content fade-in">
              <div className="apple-card-panel">
                <div className="panel-title-row">
                  <AppleSquircleBadge palette="purple" size={48}>
                    <ShieldCheck size={24} color="#ffffff" strokeWidth={2.4} />
                  </AppleSquircleBadge>
                  <div>
                    <h2 className="panel-title">Customer Care &amp; Hubs</h2>
                    <p className="panel-subtitle">Managing Director desks and 24/7 dispatch hotlines.</p>
                  </div>
                </div>

                <div className="apple-support-cards-list">
                  <div className="support-officer-card">
                    <div className="officer-avatar">CB</div>
                    <div className="officer-meta">
                      <strong>S. Chandra Babu</strong>
                      <span>Managing Director — Regional Network &amp; NRI Logistics</span>
                      <a href="tel:+919059949365" className="officer-call-btn">
                        <Phone size={14} /> Call Dispatch Desk
                      </a>
                    </div>
                  </div>

                  <div className="support-officer-card">
                    <div className="officer-avatar">JM</div>
                    <div className="officer-meta">
                      <strong>S. Junaid Mohuddin</strong>
                      <span>Managing Director — International Air Freight &amp; Customs</span>
                      <a href="tel:+919000022821" className="officer-call-btn">
                        <Phone size={14} /> Call International Desk
                      </a>
                    </div>
                  </div>
                </div>

                <div className="apple-hubs-summary">
                  <span className="summary-title">Official Branch Centers</span>
                  {REGIONAL_HUBS.map(hub => (
                    <div key={hub.id} className="hub-quick-item">
                      <div className="hub-dot"></div>
                      <div>
                        <strong>{hub.name}</strong>
                        <p>{hub.address} • <a href={`tel:${hub.phone}`}>{hub.phone}</a></p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>

        {/* =========================================================================
            iOS CUPERTINO FLOATING DOCK (BOTTOM TAB BAR)
            ========================================================================= */}
        <nav className="apple-dock-nav">
          <button 
            className={`dock-tab-btn ${activeTab === 'book' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('book')}
          >
            <AppleSquircleBadge palette={activeTab === 'book' ? 'blue' : 'dark'} size={36}>
              <Package size={19} color="#ffffff" strokeWidth={2.4} />
            </AppleSquircleBadge>
            <span>Book</span>
            {activeTab === 'book' && <span className="dock-active-dot"></span>}
          </button>

          <button 
            className={`dock-tab-btn ${activeTab === 'track' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('track')}
          >
            <AppleSquircleBadge palette={activeTab === 'track' ? 'teal' : 'dark'} size={36}>
              <Navigation size={19} color="#ffffff" strokeWidth={2.4} />
            </AppleSquircleBadge>
            <span>Track</span>
            {activeTab === 'track' && <span className="dock-active-dot"></span>}
          </button>

          <button 
            className={`dock-tab-btn ${activeTab === 'rates' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('rates')}
          >
            <AppleSquircleBadge palette={activeTab === 'rates' ? 'gold' : 'dark'} size={36}>
              <Calculator size={19} color="#ffffff" strokeWidth={2.4} />
            </AppleSquircleBadge>
            <span>Rates</span>
            {activeTab === 'rates' && <span className="dock-active-dot"></span>}
          </button>

          <button 
            className={`dock-tab-btn ${activeTab === 'passes' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('passes')}
          >
            <AppleSquircleBadge palette={activeTab === 'passes' ? 'purple' : 'dark'} size={36}>
              <ShieldCheck size={19} color="#ffffff" strokeWidth={2.4} />
            </AppleSquircleBadge>
            <span>Support</span>
            {activeTab === 'passes' && <span className="dock-active-dot"></span>}
          </button>
        </nav>
      </div>
    </div>
  );
}
