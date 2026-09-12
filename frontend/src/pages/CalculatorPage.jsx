import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import usePageContent from '../hooks/usePageContent';
import { COUNTRY_RATES } from '../constants/appData';

export default function CalculatorPage() {
  const { content } = usePageContent('calculator', {});
  const hero = content.hero || {};

  const [step, setStep] = useState(1);
  const [country, setCountry] = useState('USA');
  const [category, setCategory] = useState('food');
  const [deadWeight, setDeadWeight] = useState(5);
  const [length, setLength] = useState(35);
  const [width, setWidth] = useState(25);
  const [height, setHeight] = useState(20);

  const calcResults = useMemo(() => {
    const l = parseFloat(length) || 0;
    const w = parseFloat(width) || 0;
    const h = parseFloat(height) || 0;
    const dw = parseFloat(deadWeight) || 0;

    const volWeight = (l * w * h) / 5000;
    const rawChargeable = Math.max(dw, volWeight);
    const roundChargeable = Math.max(0.5, Math.ceil(rawChargeable * 2) / 2);

    const rateInfo = COUNTRY_RATES[country] || COUNTRY_RATES['Other'];
    let basePrice = roundChargeable * rateInfo.ratePerKg;
    if (basePrice < rateInfo.minCharge) basePrice = rateInfo.minCharge;

    const foodHandling = category === 'food' ? rateInfo.foodHandling : 0;
    const totalMin = Math.round(basePrice + foodHandling);
    const totalMax = Math.round(totalMin * 1.08);

    const isVolGreater = volWeight > dw;

    return {
      volWeight: volWeight.toFixed(2),
      roundChargeable: roundChargeable.toFixed(1),
      transit: rateInfo.transit,
      totalMin,
      totalMax,
      isVolGreater,
      explanation: isVolGreater
        ? `Volumetric weight (${volWeight.toFixed(2)} kg) is greater than Dead weight (${dw} kg). Billing is based on Volumetric.`
        : `Dead weight (${dw} kg) is greater than Volumetric weight (${volWeight.toFixed(2)} kg). Billing is based on Actual weight.`
    };
  }, [country, category, deadWeight, length, width, height]);

  const nextStep = () => setStep(s => Math.min(s + 1, 3));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  return (
    <main style={{ paddingTop: '80px' }}>
      <section className="page-hero-banner">
        <div className="container">
          <div className="breadcrumb-trail">
            <Link to="/">Home</Link>
            <span className="separator"><i className="fa-solid fa-chevron-right"></i></span>
            <span className="current">Rate & Volumetric Calculator</span>
          </div>
          <div className="eyebrow-pill teal">
            <i className="fa-solid fa-calculator"></i> Transparent Tariff Engine
          </div>
          <h1 className="page-hero-title">Interactive Quote Builder</h1>
          <p className="page-hero-desc">
            Get an instant, transparent price estimate for your international express parcel in 3 simple steps.
          </p>
        </div>
      </section>

      <section className="section section-ivory">
        <div className="container" style={{ maxWidth: '800px' }}>
          
          {/* Stepper Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '20px', left: '10%', right: '10%', height: '2px', background: '#E2E8F0', zIndex: 0 }}></div>
            <div style={{ position: 'absolute', top: '20px', left: '10%', width: step === 1 ? '0%' : step === 2 ? '40%' : '80%', height: '2px', background: '#3CC8C8', zIndex: 0, transition: 'width 0.4s ease' }}></div>
            
            {[1, 2, 3].map(num => (
              <div key={num} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1 }}>
                <div style={{ 
                  width: '40px', height: '40px', borderRadius: '50%', 
                  background: step >= num ? '#3CC8C8' : 'var(--bg-card-tint)', 
                  color: step >= num ? '#0B1622' : '#A0B0C0', 
                  border: `2px solid ${step >= num ? '#3CC8C8' : '#E2E8F0'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold',
                  transition: 'all 0.3s ease'
                }}>
                  {step > num ? <i className="fa-solid fa-check"></i> : num}
                </div>
                <span style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: step >= num ? '#1E3446' : '#A0B0C0', fontWeight: 600 }}>
                  {num === 1 ? 'Destination' : num === 2 ? 'Dimensions' : 'Quote'}
                </span>
              </div>
            ))}
          </div>

          <div style={{ background: '#122336', padding: '2rem', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0', animation: 'fadeIn 0.5s ease' }}>
            
            {/* Step 1: Destination */}
            {step === 1 && (
              <div className="animate-slide-in">
                <h3 style={{ fontSize: '1.4rem', color: '#FFF', marginBottom: '1.5rem' }}>Where are you shipping to?</h3>
                <div className="form-group-item">
                  <label className="form-label-title" htmlFor="calc-dest-country">
                    <i className="fa-solid fa-globe" style={{ color: '#E97856' }}></i> Destination Country
                  </label>
                  <select id="calc-dest-country" className="form-input-field" value={country} onChange={(e) => setCountry(e.target.value)}>
                    <option value="USA">🇺🇸 United States (USA)</option>
                    <option value="UK">🇬🇧 United Kingdom (UK)</option>
                    <option value="Canada">🇨🇦 Canada</option>
                    <option value="Australia">🇦🇺 Australia</option>
                    <option value="UAE">🇦🇪 United Arab Emirates (Dubai)</option>
                    <option value="Other">🌍 Other Global Destination</option>
                  </select>
                </div>

                <div className="form-group-item" style={{ marginTop: '1.5rem' }}>
                  <label className="form-label-title" htmlFor="calc-category-select">
                    <i className="fa-solid fa-box-open" style={{ color: '#3CC8C8' }}></i> Item Category
                  </label>
                  <select id="calc-category-select" className="form-input-field" value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="food">NRI Homemade Food & Pickles</option>
                    <option value="docs">University Transcripts & Documents</option>
                    <option value="parcel">Express Personal / Gift Parcel</option>
                    <option value="cargo">Commercial Heavy Air Cargo (50kg+)</option>
                  </select>
                </div>
              </div>
            )}

            {/* Step 2: Dimensions */}
            {step === 2 && (
              <div className="animate-slide-in">
                <h3 style={{ fontSize: '1.4rem', color: '#FFF', marginBottom: '1.5rem' }}>Enter Parcel Dimensions</h3>
                
                <div className="form-group-item">
                  <label className="form-label-title" htmlFor="calc-dead-weight">
                    <i className="fa-solid fa-scale-balanced" style={{ color: '#E97856' }}></i> Actual Scale Weight (kg)
                  </label>
                  <input type="number" id="calc-dead-weight" className="form-input-field" value={deadWeight} min="0.5" step="0.5" onChange={(e) => setDeadWeight(e.target.value)} required />
                </div>

                <div style={{ marginTop: '1.5rem' }}>
                  <label className="form-label-title">
                    <i className="fa-solid fa-cube" style={{ color: '#3CC8C8' }}></i> Carton Dimensions (cm)
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginTop: '0.5rem' }}>
                    <div>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#A0B0C0' }}>Length</span>
                      <input type="number" className="form-input-field" value={length} min="1" onChange={(e) => setLength(e.target.value)} />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#A0B0C0' }}>Width</span>
                      <input type="number" className="form-input-field" value={width} min="1" onChange={(e) => setWidth(e.target.value)} />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#A0B0C0' }}>Height</span>
                      <input type="number" className="form-input-field" value={height} min="1" onChange={(e) => setHeight(e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Result */}
            {step === 3 && (
              <div className="animate-slide-in" style={{ textAlign: 'center' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--bg-powder-blue)', color: 'var(--accent-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', margin: '0 auto 1.5rem auto' }}>
                  <i className="fa-solid fa-file-invoice-dollar"></i>
                </div>
                <h3 style={{ fontSize: '1.4rem', color: '#1E3446', marginBottom: '0.5rem' }}>Your Estimated Quote</h3>
                <p style={{ color: '#4A6B82', marginBottom: '2rem' }}>Shipping from Andhra Pradesh to {country}</p>
                
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: '0.5rem', color: '#1E3446', marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '2rem', fontWeight: 700 }}>₹{calcResults.totalMin}</span>
                  <span style={{ fontSize: '1.2rem', color: '#A0B0C0' }}>- ₹{calcResults.totalMax}</span>
                </div>
                
                <div style={{ background: 'var(--bg-card-tint)', padding: '1.5rem', borderRadius: '8px', textAlign: 'left', border: '1px solid var(--border-light)', marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ color: '#7091A8', fontSize: '0.9rem' }}>Chargeable Weight:</span>
                    <strong style={{ color: '#E97856' }}>{calcResults.roundChargeable} kg</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ color: '#7091A8', fontSize: '0.9rem' }}>Estimated Transit:</span>
                    <strong style={{ color: '#1E3446' }}>{calcResults.transit}</strong>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#A0B0C0', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px dashed #CBD5E1' }}>
                    <i className="fa-solid fa-circle-info"></i> {calcResults.explanation}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #E2E8F0' }}>
              {step > 1 ? (
                <button onClick={prevStep} className="btn btn-outline-slate">
                  <i className="fa-solid fa-arrow-left"></i> Back
                </button>
              ) : <div></div>}
              
              {step < 3 ? (
                <button onClick={nextStep} className="btn btn-teal">
                  Next Step <i className="fa-solid fa-arrow-right"></i>
                </button>
              ) : (
                <Link to="/book-pickup" className="btn btn-coral">
                  Book Pickup Now <i className="fa-solid fa-truck-fast"></i>
                </Link>
              )}
            </div>

          </div>
        </div>
      </section>
      <style>{`
        .animate-slide-in { animation: slideIn 0.4s ease forwards; }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </main>
  );
}
