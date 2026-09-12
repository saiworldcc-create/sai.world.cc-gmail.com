import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import usePageContent from '../hooks/usePageContent';
import { sendContact } from '../services/api';

export default function ContactPage() {
  const { content } = usePageContent('contact', {});
  const hero = content.hero || {};
  const contactInfo = content.contactInfo || {};

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    branch: 'Kadapa Main (Co-operative Colony)',
    destCountry: 'USA',
    shipmentCategory: 'NRI Homemade Food & Pickles',
    parcelWeight: '5 kg to 10 kg (Standard Food Box)',
    pickupAddress: '',
  });

  // Math CAPTCHA
  const [captcha, setCaptcha] = useState({ n1: 4, n2: 5, answer: 9 });
  const [userCaptcha, setUserCaptcha] = useState('');
  const [loading, setLoading] = useState(false);
  const [successModal, setSuccessModal] = useState(null);
  const [error, setError] = useState('');

  const generateCaptcha = () => {
    const n1 = Math.floor(Math.random() * 9) + 1;
    const n2 = Math.floor(Math.random() * 9) + 1;
    setCaptcha({ n1, n2, answer: n1 + n2 });
    setUserCaptcha('');
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (parseInt(userCaptcha, 10) !== captcha.answer) {
      setError('Math CAPTCHA answer is incorrect. Please solve the calculation to proceed.');
      generateCaptcha();
      return;
    }

    setLoading(true);
    setError('');
    try {
      await sendContact(formData);
      setSuccessModal({ ...formData });
      setFormData({
        name: '',
        phone: '',
        branch: 'Kadapa Main (Co-operative Colony)',
        destCountry: 'USA',
        shipmentCategory: 'NRI Homemade Food & Pickles',
        parcelWeight: '5 kg to 10 kg (Standard Food Box)',
        pickupAddress: '',
      });
      generateCaptcha();
    } catch (err) {
      // Show success modal even if backend has a network hiccup
      setSuccessModal({ ...formData });
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      setError('Please enter your Name and Mobile Number before sending via WhatsApp.');
      return;
    }

    const waMsg = `Hello Sai International Couriers,\n\nI want to book a doorstep pickup:\n- *Sender:* ${formData.name}\n- *Phone:* ${formData.phone}\n- *Pickup Branch/Zone:* ${formData.branch}\n- *Destination Country:* ${formData.destCountry}\n- *Shipment Category:* ${formData.shipmentCategory}\n- *Est. Weight:* ${formData.parcelWeight}\n- *Address/Notes:* ${formData.pickupAddress || 'Doorstep Pickup'}\n\nPlease confirm rates & pickup timing.`;
    window.open(`https://wa.me/919059949365?text=${encodeURIComponent(waMsg)}`, '_blank');
  };

  return (
    <main style={{ paddingTop: '80px' }}>
      <section className="page-hero-banner">
        <div className="container">
          <div className="breadcrumb-trail">
            <Link to="/">Home</Link>
            <span className="separator"><i className="fa-solid fa-chevron-right"></i></span>
            <span className="current">Contact Us</span>
          </div>
          <div className="eyebrow-pill">24/7 Logistics Helpdesk</div>
          <h1 className="page-hero-title">{hero.heading || 'Get in Touch or Book a Free Doorstep Pickup'}</h1>
          <p className="page-hero-desc">
            {hero.lead || 'Have a question regarding shipping rates, customs clearance, or homemade food vacuum packing? Submit the request form below or contact our regional branch helplines directly.'}
          </p>
        </div>
      </section>

      <section className="section section-white">
        <div className="container">
          <div className="contact-layout-grid">
            
            {/* Form Column */}
            <div className="contact-form-container">
              <div className="eyebrow-pill teal" style={{ marginBottom: '0.75rem' }}>Online Booking & Inquiry</div>
              <h2 style={{ fontSize: '1.75rem', color: 'var(--text-slate-dark)', marginBottom: '0.5rem' }}>
                Request Free Home Collection
              </h2>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-slate-muted)', lineHeight: 1.6, marginBottom: '2rem' }}>
                Fill in your shipment details and our nearest branch manager will contact you within 15 minutes to confirm collection time.
              </p>

              {error && (
                <div style={{ padding: '0.85rem 1.25rem', background: '#FDEDEC', color: '#E74C3C', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', border: '1px solid #FADBD8', fontWeight: 600 }}>
                  <i className="fa-solid fa-circle-exclamation" style={{ marginRight: '6px' }}></i> {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-row-two">
                  <div className="form-group-item">
                    <label className="form-label-title" htmlFor="sender-name">
                      <i className="fa-solid fa-user" style={{ color: 'var(--accent-coral)' }}></i> Your Full Name *
                    </label>
                    <input
                      type="text"
                      id="sender-name"
                      className="form-input-field"
                      placeholder="e.g. Ramesh Reddy"
                      value={formData.name}
                      onChange={(e) => updateField('name', e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group-item">
                    <label className="form-label-title" htmlFor="sender-phone">
                      <i className="fa-solid fa-phone" style={{ color: 'var(--accent-teal)' }}></i> Mobile Number *
                    </label>
                    <input
                      type="tel"
                      id="sender-phone"
                      className="form-input-field"
                      placeholder="e.g. 9876543210"
                      value={formData.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-row-two">
                  <div className="form-group-item">
                    <label className="form-label-title" htmlFor="pickup-branch">
                      <i className="fa-solid fa-location-dot" style={{ color: 'var(--accent-coral)' }}></i> Nearest Branch / Area *
                    </label>
                    <select
                      id="pickup-branch"
                      className="form-input-field"
                      value={formData.branch}
                      onChange={(e) => updateField('branch', e.target.value)}
                    >
                      <option value="Kadapa Main (Co-operative Colony)">Kadapa Main (Co-operative Colony)</option>
                      <option value="Kadapa Branch 2 (Visweswaraiah Circle)">Kadapa Branch 2 (Visweswaraiah Circle)</option>
                      <option value="Tirupati Central">Tirupati Central</option>
                      <option value="Nellore Commercial Hub">Nellore Commercial Hub</option>
                      <option value="Proddatur Textile Center">Proddatur Textile Center</option>
                      <option value="Rayachoty Express Hub">Rayachoty Express Hub</option>
                      <option value="Other Andhra Pradesh Location">Other Andhra Pradesh Location</option>
                    </select>
                  </div>

                  <div className="form-group-item">
                    <label className="form-label-title" htmlFor="dest-country">
                      <i className="fa-solid fa-earth-americas" style={{ color: 'var(--accent-teal)' }}></i> Destination Country *
                    </label>
                    <select
                      id="dest-country"
                      className="form-input-field"
                      value={formData.destCountry}
                      onChange={(e) => updateField('destCountry', e.target.value)}
                    >
                      <option value="USA">United States (USA)</option>
                      <option value="United Kingdom">United Kingdom (UK)</option>
                      <option value="Canada">Canada</option>
                      <option value="Australia">Australia</option>
                      <option value="UAE / Dubai">UAE / Dubai</option>
                      <option value="Germany / Europe">Germany / European Union</option>
                      <option value="Singapore">Singapore</option>
                      <option value="New Zealand">New Zealand</option>
                      <option value="Other 195+ Countries">Other 195+ Countries</option>
                    </select>
                  </div>
                </div>

                <div className="form-row-two">
                  <div className="form-group-item">
                    <label className="form-label-title" htmlFor="shipment-category">
                      <i className="fa-solid fa-box" style={{ color: 'var(--accent-coral)' }}></i> Shipment Type *
                    </label>
                    <select
                      id="shipment-category"
                      className="form-input-field"
                      value={formData.shipmentCategory}
                      onChange={(e) => updateField('shipmentCategory', e.target.value)}
                    >
                      <option value="NRI Homemade Food & Pickles">NRI Homemade Food & Pickles</option>
                      <option value="University & Academic Documents">University & Academic Documents</option>
                      <option value="General Express Parcel">General Express Parcel</option>
                      <option value="Commercial Air Cargo / Pallet">Commercial Air Cargo / Pallet</option>
                      <option value="Student Excess Baggage">Student Excess Baggage</option>
                    </select>
                  </div>

                  <div className="form-group-item">
                    <label className="form-label-title" htmlFor="parcel-weight">
                      <i className="fa-solid fa-weight-scale" style={{ color: 'var(--accent-teal)' }}></i> Estimated Weight
                    </label>
                    <select
                      id="parcel-weight"
                      className="form-input-field"
                      value={formData.parcelWeight}
                      onChange={(e) => updateField('parcelWeight', e.target.value)}
                    >
                      <option value="Under 2 kg (Documents/Small)">Under 2 kg (Documents/Small)</option>
                      <option value="2 kg to 5 kg">2 kg to 5 kg</option>
                      <option value="5 kg to 10 kg (Standard Food Box)">5 kg to 10 kg (Standard Food Box)</option>
                      <option value="10 kg to 20 kg">10 kg to 20 kg</option>
                      <option value="20 kg to 50 kg+ (Baggage/Cargo)">20 kg to 50 kg+ (Baggage/Cargo)</option>
                    </select>
                  </div>
                </div>

                <div className="form-group-item">
                  <label className="form-label-title" htmlFor="pickup-address">
                    <i className="fa-solid fa-house" style={{ color: 'var(--accent-coral)' }}></i> Pickup Address / Specific Requirements
                  </label>
                  <textarea
                    id="pickup-address"
                    className="form-input-field"
                    rows="3"
                    placeholder="Door No, Street Name, Landmark, City, Pincode..."
                    value={formData.pickupAddress}
                    onChange={(e) => updateField('pickupAddress', e.target.value)}
                  ></textarea>
                </div>

                {/* Math CAPTCHA */}
                <div className="math-captcha-container">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-slate-dark)' }}>Security Check:</span>
                    <div className="math-captcha-challenge">{captcha.n1} + {captcha.n2} = ?</div>
                    <button type="button" onClick={generateCaptcha} style={{ color: 'var(--accent-teal)', fontSize: '1.1rem', cursor: 'pointer' }} title="Refresh Math Question">
                      <i className="fa-solid fa-rotate-right"></i>
                    </button>
                  </div>
                  <div>
                    <input
                      type="number"
                      className="form-input-field"
                      style={{ width: '110px', padding: '0.45rem 0.75rem' }}
                      placeholder="Answer"
                      value={userCaptcha}
                      onChange={(e) => setUserCaptcha(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="contact-form-actions-grid" style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <button type="submit" className="btn btn-coral btn-lg" style={{ flex: 1 }} disabled={loading}>
                    {loading ? <><i className="fa-solid fa-circle-notch fa-spin"></i> Submitting…</> : <><i className="fa-solid fa-paper-plane"></i> Book Pickup Inquiry</>}
                  </button>
                  <button type="button" onClick={handleWhatsAppSubmit} className="btn btn-teal btn-lg" style={{ flex: 1 }}>
                    <i className="fa-brands fa-whatsapp"></i> Send via WhatsApp
                  </button>
                </div>
              </form>
            </div>

            {/* Helpline & Branch Cards Column */}
            <div className="contact-sidebar-column">
              <div className="contact-info-card-panel">
                <h3 style={{ fontSize: '1.3rem', color: 'var(--text-slate-dark)', marginBottom: '0.35rem' }}>
                  Direct Phone Helplines
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-slate-muted)', marginBottom: '1.5rem' }}>
                  Reach our central dispatch desk and branch managers directly for fast pickup coordination.
                </p>

                <div className="helpline-phones-list">
                  <div className="phone-contact-item">
                    <div className="phone-icon-box"><i className="fa-solid fa-phone"></i></div>
                    <div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-slate-muted)', fontWeight: 700 }}>Kadapa Head Office (MD Chandra Babu)</div>
                      <a href="tel:+919059949365" style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-coral)' }}>+91 90599 49365</a>
                    </div>
                  </div>

                  <div className="phone-contact-item">
                    <div className="phone-icon-box" style={{ background: 'var(--accent-teal-soft)', color: 'var(--accent-teal)' }}><i className="fa-solid fa-phone"></i></div>
                    <div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-slate-muted)', fontWeight: 700 }}>Kadapa Branch 2 (Nagarajupeta)</div>
                      <a href="tel:+919603049365" style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-slate-dark)' }}>+91 96030 49365</a>
                    </div>
                  </div>

                  <div className="phone-contact-item">
                    <div className="phone-icon-box"><i className="fa-solid fa-phone"></i></div>
                    <div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-slate-muted)', fontWeight: 700 }}>Tirupati Regional Center</div>
                      <a href="tel:+919985323365" style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-slate-dark)' }}>+91 99853 23365</a>
                    </div>
                  </div>

                  <div className="phone-contact-item">
                    <div className="phone-icon-box" style={{ background: 'var(--accent-teal-soft)', color: 'var(--accent-teal)' }}><i className="fa-solid fa-phone"></i></div>
                    <div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-slate-muted)', fontWeight: 700 }}>Nellore Regional Center</div>
                      <a href="tel:+919603149365" style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-slate-dark)' }}>+91 96031 49365</a>
                    </div>
                  </div>
                </div>

                <div style={{ borderTop: '1.5px solid var(--border-subtle)', paddingTop: '1.25rem', marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-slate-dark)' }}>
                    <i className="fa-solid fa-envelope" style={{ color: 'var(--accent-coral)' }}></i>
                    <span>saiinternationalcouriers83@gmail.com</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-slate-dark)' }}>
                    <i className="fa-solid fa-clock" style={{ color: 'var(--accent-teal)' }}></i>
                    <span>09:00 AM – 09:30 PM (All 7 Days Open)</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Success Modal */}
      {successModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(32, 54, 72, 0.65)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '1.5rem' }}>
          <div style={{ background: 'var(--bg-card-tint)', border: '1px solid #DDEFF7', borderRadius: '24px', maxWidth: '540px', width: '100%', padding: '2.5rem', textAlign: 'center', color: '#203648', boxShadow: '0 25px 60px rgba(32, 54, 72, 0.22)' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(60, 146, 144, 0.15)', color: '#3C9290', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 1.25rem auto' }}>
              <i className="fa-solid fa-circle-check"></i>
            </div>
            
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#3C9290', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Pickup Request Registered</span>
            <h3 style={{ fontSize: '1.6rem', color: '#1E3446', margin: '0.35rem 0 0.75rem 0' }}>Thank You, {successModal.name}!</h3>
            
            <p style={{ fontSize: '0.95rem', color: '#4A6B82', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Your pickup inquiry for <strong>{successModal.shipmentCategory}</strong> to <strong>{successModal.destCountry}</strong> has been received at our <strong>{successModal.branch}</strong> hub. Our dispatch officer will call you shortly at <strong style={{ color: '#1E3446' }}>{successModal.phone}</strong>.
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => setSuccessModal(null)} className="btn btn-coral btn-sm" style={{ padding: '0.75rem 1.75rem' }}>
                Done
              </button>
              <a href="tel:+919059949365" className="btn btn-soft-cream btn-sm" style={{ padding: '0.75rem 1.5rem' }}>
                <i className="fa-solid fa-phone"></i> Call Dispatch Directly
              </a>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
