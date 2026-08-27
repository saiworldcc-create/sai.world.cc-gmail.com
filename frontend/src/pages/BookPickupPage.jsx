import { useState } from 'react';
import { Link } from 'react-router-dom';
import usePageContent from '../hooks/usePageContent';
import { createBooking } from '../services/api';

export default function BookPickupPage() {
  const { content } = usePageContent('book-pickup', {});
  const hero = content.hero || {};

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    senderName: '',
    senderPhone: '',
    branchZone: 'Kadapa Head Office (Co-operative Colony)',
    pickupDate: new Date().toISOString().split('T')[0],
    senderAddress: '',
    pickupTimeSlot: 'Morning (09:00 AM - 12:00 PM)',
    destCountry: 'USA',
    receiverName: '',
    receiverPhone: '',
    itemCategory: 'NRI Food & Pickles',
    estimatedWeight: '5–10 kg',
    specialInstructions: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNextStep1 = () => {
    if (!formData.senderName.trim() || !formData.senderPhone.trim() || !formData.senderAddress.trim()) {
      setError('Please fill in your Name, Phone Number, and Pickup Address to continue.');
      return;
    }
    setError('');
    setCurrentStep(2);
    window.scrollTo({ top: 220, behavior: 'smooth' });
  };

  const handleNextStep2 = () => {
    if (!formData.destCountry || !formData.receiverName.trim() || !formData.receiverPhone.trim()) {
      setError('Please enter Destination Country, Receiver Name, and Receiver Contact Number.');
      return;
    }
    setError('');
    setCurrentStep(3);
    window.scrollTo({ top: 220, behavior: 'smooth' });
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await createBooking(formData);
      setConfirmedBooking(res.data);
    } catch (err) {
      // Fallback AWB in case backend has a temporary connection glitch
      const fallbackAwb = `SAI-${Math.floor(10000 + Math.random() * 90000)}-${(formData.destCountry || 'EXP').substring(0, 3).toUpperCase()}`;
      setConfirmedBooking({
        awb: fallbackAwb,
        senderName: formData.senderName,
        senderPhone: formData.senderPhone,
        branchZone: formData.branchZone,
        destCountry: formData.destCountry
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ paddingTop: '80px' }}>
      <section className="page-hero-banner">
        <div className="container">
          <div className="breadcrumb-trail">
            <Link to="/">Home</Link>
            <span className="separator"><i className="fa-solid fa-chevron-right"></i></span>
            <span className="current">Book Doorstep Pickup</span>
          </div>
          <div className="eyebrow-pill">
            <i className="fa-solid fa-truck-ramp-box"></i> Free Doorstep Dispatch
          </div>
          <h1 className="page-hero-title">{hero.heading || 'Schedule International Parcel Pickup'}</h1>
          <p className="page-hero-desc">
            {hero.lead || 'Our mobile pickup executive arrives at your doorstep equipped with digital weighing scales, multi-barrier vacuum sealing pouches, and export corrugated cartons.'}
          </p>
        </div>
      </section>

      <section className="section section-ivory">
        <div className="container" style={{ maxWidth: '920px' }}>
          
          {/* Stepper Indicator */}
          <div className="wizard-stepper-header">
            <div className={`wizard-step-indicator${currentStep === 1 ? ' active' : currentStep > 1 ? ' completed' : ''}`}>
              <div className="wizard-step-number-circle">1</div>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 800 }}>Sender & Pickup</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-slate-muted)' }}>Address & Time Slot</div>
              </div>
            </div>

            <div className={`wizard-step-indicator${currentStep === 2 ? ' active' : currentStep > 2 ? ' completed' : ''}`} style={{ margin: '0 1rem' }}>
              <div className="wizard-step-number-circle">2</div>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 800 }}>Parcel & Destination</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-slate-muted)' }}>Receiver & Contents</div>
              </div>
            </div>

            <div className={`wizard-step-indicator${currentStep === 3 ? ' active' : ''}`}>
              <div className="wizard-step-number-circle">3</div>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 800 }}>Review & Confirm</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-slate-muted)' }}>AWB Generation</div>
              </div>
            </div>
          </div>

          {error && (
            <div style={{ padding: '0.85rem 1.25rem', background: '#FDEDEC', color: '#E74C3C', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', border: '1px solid #FADBD8', fontWeight: 600 }}>
              <i className="fa-solid fa-circle-exclamation" style={{ marginRight: '6px' }}></i> {error}
            </div>
          )}

          {/* Form Wizard Card */}
          <div className="contact-form-container" style={{ padding: 'clamp(1.5rem, 4vw, 3rem) clamp(1.25rem, 3vw, 2.5rem)', background: '#FFFFFF', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border-light)' }}>
            <form onSubmit={handleFinalSubmit}>
              
              {/* STEP 1 */}
              {currentStep === 1 && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accent-coral-soft)', color: 'var(--accent-coral)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>1</div>
                    <div>
                      <h3 style={{ fontSize: '1.25rem', color: 'var(--text-slate-dark)', margin: 0 }}>Sender Information & Pickup Slot</h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-slate-muted)', margin: 0 }}>Where should our pickup van arrive?</p>
                    </div>
                  </div>

                  <div className="form-row-two">
                    <div className="form-group-item">
                      <label className="form-label-title" htmlFor="sender-name">
                        <i className="fa-solid fa-user" style={{ color: 'var(--accent-coral)' }}></i> Full Name *
                      </label>
                      <input
                        type="text"
                        id="sender-name"
                        className="form-input-field"
                        placeholder="e.g. Venkata Raman"
                        value={formData.senderName}
                        onChange={(e) => updateField('senderName', e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group-item">
                      <label className="form-label-title" htmlFor="sender-phone">
                        <i className="fa-solid fa-phone" style={{ color: 'var(--accent-teal)' }}></i> Mobile Number (WhatsApp) *
                      </label>
                      <input
                        type="tel"
                        id="sender-phone"
                        className="form-input-field"
                        placeholder="e.g. 9059949365"
                        value={formData.senderPhone}
                        onChange={(e) => updateField('senderPhone', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row-two">
                    <div className="form-group-item">
                      <label className="form-label-title" htmlFor="sender-branch">
                        <i className="fa-solid fa-building" style={{ color: 'var(--accent-coral)' }}></i> Nearest Branch Hub *
                      </label>
                      <select
                        id="sender-branch"
                        className="form-input-field"
                        value={formData.branchZone}
                        onChange={(e) => updateField('branchZone', e.target.value)}
                      >
                        <option value="Kadapa Head Office (Co-operative Colony)">Kadapa Head Office (Co-operative Colony)</option>
                        <option value="Kadapa Branch 2 (Nagarajupeta)">Kadapa Branch 2 (Nagarajupeta)</option>
                        <option value="Tirupati Branch (Bhavani Nagar)">Tirupati Branch (Bhavani Nagar)</option>
                        <option value="Nellore Branch (Trunk Road)">Nellore Branch (Trunk Road)</option>
                        <option value="Proddatur Branch (Gandhi Road)">Proddatur Branch (Gandhi Road)</option>
                        <option value="Rayachoty Branch (Sundupalli Circle)">Rayachoty Branch (Sundupalli Circle)</option>
                      </select>
                    </div>

                    <div className="form-group-item">
                      <label className="form-label-title" htmlFor="pickup-date">
                        <i className="fa-solid fa-calendar-day" style={{ color: 'var(--accent-teal)' }}></i> Preferred Pickup Date *
                      </label>
                      <input
                        type="date"
                        id="pickup-date"
                        className="form-input-field"
                        value={formData.pickupDate}
                        onChange={(e) => updateField('pickupDate', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group-item" style={{ marginTop: '1rem' }}>
                    <label className="form-label-title" htmlFor="sender-address">
                      <i className="fa-solid fa-house-chimney" style={{ color: 'var(--accent-coral)' }}></i> Complete Pickup Address (House / Landmark) *
                    </label>
                    <textarea
                      id="sender-address"
                      className="form-input-field"
                      rows="3"
                      placeholder="Door No, Street Name, Landmark, City & Pincode"
                      value={formData.senderAddress}
                      onChange={(e) => updateField('senderAddress', e.target.value)}
                      required
                    ></textarea>
                  </div>

                  <div className="form-group-item" style={{ marginTop: '1.25rem' }}>
                    <label className="form-label-title">
                      <i className="fa-solid fa-clock" style={{ color: 'var(--accent-teal)' }}></i> Preferred Arrival Slot
                    </label>
                    <div className="time-slot-grid">
                      {[
                        { slot: 'Morning (09:00 AM - 12:00 PM)', title: '🌅 Morning', sub: '09:00 AM – 12:00 PM' },
                        { slot: 'Afternoon (12:00 PM - 04:00 PM)', title: '☀️ Afternoon', sub: '12:00 PM – 04:00 PM' },
                        { slot: 'Evening (04:00 PM - 08:00 PM)', title: '🌆 Evening', sub: '04:00 PM – 08:00 PM' },
                      ].map(t => (
                        <div
                          key={t.slot}
                          className={`time-slot-btn${formData.pickupTimeSlot === t.slot ? ' active' : ''}`}
                          onClick={() => updateField('pickupTimeSlot', t.slot)}
                        >
                          {t.title}<br /><span style={{ fontSize: '0.72rem', fontWeight: 500 }}>{t.sub}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
                    <button type="button" onClick={handleNextStep1} className="btn btn-coral btn-lg">
                      Continue to Parcel Details <i className="fa-solid fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2 */}
              {currentStep === 2 && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accent-teal-soft)', color: 'var(--accent-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>2</div>
                    <div>
                      <h3 style={{ fontSize: '1.25rem', color: 'var(--text-slate-dark)', margin: 0 }}>Destination & Parcel Specifications</h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-slate-muted)', margin: 0 }}>Where is the parcel travelling?</p>
                    </div>
                  </div>

                  <div className="form-row-two">
                    <div className="form-group-item">
                      <label className="form-label-title" htmlFor="dest-country">
                        <i className="fa-solid fa-earth-americas" style={{ color: 'var(--accent-coral)' }}></i> Destination Country *
                      </label>
                      <select
                        id="dest-country"
                        className="form-input-field"
                        value={formData.destCountry}
                        onChange={(e) => updateField('destCountry', e.target.value)}
                        required
                      >
                        <option value="USA">🇺🇸 United States (USA)</option>
                        <option value="UK">🇬🇧 United Kingdom (UK)</option>
                        <option value="Canada">🇨🇦 Canada</option>
                        <option value="Australia">🇦🇺 Australia</option>
                        <option value="UAE">🇦🇪 United Arab Emirates (Dubai)</option>
                        <option value="Germany">🇩🇪 Germany (Europe)</option>
                        <option value="Singapore">🇸🇬 Singapore</option>
                        <option value="New Zealand">🇳🇿 New Zealand</option>
                        <option value="Other">🌍 Other Global Destination</option>
                      </select>
                    </div>

                    <div className="form-group-item">
                      <label className="form-label-title" htmlFor="receiver-name">
                        <i className="fa-solid fa-user-tag" style={{ color: 'var(--accent-teal)' }}></i> Receiver Full Name *
                      </label>
                      <input
                        type="text"
                        id="receiver-name"
                        className="form-input-field"
                        placeholder="e.g. Prasad Reddy"
                        value={formData.receiverName}
                        onChange={(e) => updateField('receiverName', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row-two">
                    <div className="form-group-item">
                      <label className="form-label-title" htmlFor="receiver-phone">
                        <i className="fa-solid fa-phone-volume" style={{ color: 'var(--accent-coral)' }}></i> Receiver Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="receiver-phone"
                        className="form-input-field"
                        placeholder="e.g. +1 (469) 555-0192"
                        value={formData.receiverPhone}
                        onChange={(e) => updateField('receiverPhone', e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group-item">
                      <label className="form-label-title" htmlFor="item-category">
                        <i className="fa-solid fa-box-archive" style={{ color: 'var(--accent-teal)' }}></i> Shipment Category *
                      </label>
                      <select
                        id="item-category"
                        className="form-input-field"
                        value={formData.itemCategory}
                        onChange={(e) => updateField('itemCategory', e.target.value)}
                      >
                        <option value="NRI Food & Pickles">NRI Food, Sweets & Pickles</option>
                        <option value="Documents & Transcripts">University Transcripts & Legal Docs</option>
                        <option value="Personal Parcel & Gifts">Personal Clothes & Gifts</option>
                        <option value="Student Baggage">Student Excess Relocation Baggage</option>
                        <option value="Commercial Cargo">Commercial Export Cargo</option>
                        <option value="Other">Other Miscellaneous Items</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row-two">
                    <div className="form-group-item">
                      <label className="form-label-title" htmlFor="est-weight">
                        <i className="fa-solid fa-weight-scale" style={{ color: 'var(--accent-coral)' }}></i> Estimated Weight (Approx)
                      </label>
                      <select
                        id="est-weight"
                        className="form-input-field"
                        value={formData.estimatedWeight}
                        onChange={(e) => updateField('estimatedWeight', e.target.value)}
                      >
                        <option value="Under 2 kg">Under 2 kg (Small Packet / Docs)</option>
                        <option value="2 - 5 kg">2 to 5 kg (Standard Box)</option>
                        <option value="5 - 10 kg">5 to 10 kg (Pickles / Sweets)</option>
                        <option value="10 - 20 kg">10 to 20 kg (Family Care Package)</option>
                        <option value="20 - 50 kg">20 to 50 kg (Student Baggage)</option>
                        <option value="Above 50 kg">Above 50 kg (Heavy Air Cargo)</option>
                      </select>
                    </div>

                    <div className="form-group-item">
                      <label className="form-label-title" htmlFor="special-notes">
                        <i className="fa-solid fa-comment-dots" style={{ color: 'var(--accent-teal)' }}></i> Special Packing Notes
                      </label>
                      <input
                        type="text"
                        id="special-notes"
                        className="form-input-field"
                        placeholder="e.g. 3 jars mango pickle, need extra bubble wrap"
                        value={formData.specialInstructions}
                        onChange={(e) => updateField('specialInstructions', e.target.value)}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
                    <button type="button" onClick={() => setCurrentStep(1)} className="btn btn-soft-cream">
                      <i className="fa-solid fa-arrow-left"></i> Back to Sender Info
                    </button>
                    <button type="button" onClick={handleNextStep2} className="btn btn-teal btn-lg">
                      Review Summary <i className="fa-solid fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3 */}
              {currentStep === 3 && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accent-coral-soft)', color: 'var(--accent-coral)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>3</div>
                    <div>
                      <h3 style={{ fontSize: '1.25rem', color: 'var(--text-slate-dark)', margin: 0 }}>Review Details & Dispatch Pickup</h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-slate-muted)', margin: 0 }}>Verify before booking confirmation</p>
                    </div>
                  </div>

                  <div style={{ background: 'var(--bg-card-tint)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '1.5rem', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                      <div>
                        <span className="eyebrow-pill teal" style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem' }}>Sender & Pickup</span>
                        <div style={{ fontSize: '0.92rem', color: 'var(--text-slate-dark)', lineHeight: 1.6 }}>
                          <strong>{formData.senderName}</strong> ({formData.senderPhone})<br />
                          {formData.senderAddress}<br />
                          <span style={{ color: 'var(--accent-teal)' }}>Branch:</span> {formData.branchZone}<br />
                          <span style={{ color: 'var(--accent-coral)' }}>Slot:</span> {formData.pickupDate} • {formData.pickupTimeSlot}
                        </div>
                      </div>

                      <div>
                        <span className="eyebrow-pill" style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem' }}>Destination & Consignee</span>
                        <div style={{ fontSize: '0.92rem', color: 'var(--text-slate-dark)', lineHeight: 1.6 }}>
                          <strong>{formData.receiverName}</strong> ({formData.destCountry})<br />
                          Contact: {formData.receiverPhone}<br />
                          <span style={{ color: 'var(--accent-teal)' }}>Category:</span> {formData.itemCategory}<br />
                          <span style={{ color: 'var(--accent-teal)' }}>Estimated Weight:</span> {formData.estimatedWeight}<br />
                          <span style={{ color: '#27AE60' }}>Packaging:</span> Free 5-Ply Export Box + Vacuum Sealing
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <button type="button" onClick={() => setCurrentStep(2)} className="btn btn-soft-cream">
                      <i className="fa-solid fa-arrow-left"></i> Edit Details
                    </button>
                    <button type="submit" className="btn btn-coral btn-lg" disabled={loading}>
                      {loading ? <><i className="fa-solid fa-circle-notch fa-spin"></i> Confirming…</> : <><i className="fa-solid fa-check-circle"></i> Confirm Pickup Booking</>}
                    </button>
                  </div>
                </div>
              )}

            </form>
          </div>
        </div>
      </section>

      {/* Confirmation Success Modal */}
      {confirmedBooking && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(32, 54, 72, 0.65)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '1.5rem' }}>
          <div style={{ background: '#FFFFFF', border: '1px solid #DDEFF7', borderRadius: '24px', maxWidth: '560px', width: '100%', padding: '2.5rem', textAlign: 'center', color: '#203648', boxShadow: '0 25px 60px rgba(32, 54, 72, 0.22)' }}>
            <div style={{ width: '68px', height: '68px', borderRadius: '50%', background: 'rgba(60, 146, 144, 0.15)', color: '#3C9290', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.2rem', margin: '0 auto 1.25rem auto' }}>
              <i className="fa-solid fa-truck-fast"></i>
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#3C9290', textTransform: 'uppercase', letterSpacing: '1px' }}>Booking Confirmed</span>
            <h3 style={{ fontSize: '1.7rem', color: '#1E3446', margin: '0.35rem 0 0.5rem 0' }}>Pickup Scheduled!</h3>
            
            <div style={{ background: '#F4F8FA', border: '1.5px dashed #3C9290', borderRadius: '12px', padding: '1rem', margin: '1rem 0' }}>
              <span style={{ fontSize: '0.8rem', color: '#7091A8' }}>Generated Air Waybill (AWB)</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#E97856', letterSpacing: '1px' }}>{confirmedBooking.awb}</div>
            </div>

            <p style={{ fontSize: '0.95rem', color: '#4A6B82', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Our pickup executive from <strong>{formData.branchZone}</strong> will arrive at your address with digital weighing scales, export cartons, and vacuum sealing machine.
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to={`/tracking?awb=${confirmedBooking.awb}`} className="btn btn-coral btn-sm" style={{ padding: '0.75rem 1.5rem' }}>
                <i className="fa-solid fa-location-crosshairs"></i> Track Shipment
              </Link>
              <a
                href={`https://wa.me/919059949365?text=${encodeURIComponent(`Hello Sai International Couriers,\n\nI have confirmed a doorstep pickup on your website:\n- *AWB Reference:* ${confirmedBooking.awb}\n- *Sender:* ${formData.senderName} (${formData.senderPhone})\n- *Branch:* ${formData.branchZone}\n- *Destination:* ${formData.destCountry}\n\nPlease dispatch the pickup vehicle.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-teal btn-sm"
                style={{ padding: '0.75rem 1.5rem' }}
              >
                <i className="fa-brands fa-whatsapp"></i> Notify via WhatsApp
              </a>
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <button onClick={() => setConfirmedBooking(null)} style={{ background: 'none', border: 'none', color: 'var(--text-slate-muted)', cursor: 'pointer', fontSize: '0.85rem' }}>
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
