import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import usePageContent from '../hooks/usePageContent';
import { COUNTRIES } from '../constants/countries';
import SearchableSelect from '../components/common/SearchableSelect';
import api from '../services/api';

export default function CalculatorPage() {
  const { content } = usePageContent('calculator', {});
  const hero = content.hero || {};

  const [step, setStep] = useState(1);
  const [country, setCountry] = useState('USA');
  const [category, setCategory] = useState('food');
  const [customCategory, setCustomCategory] = useState('');
  const [deadWeight, setDeadWeight] = useState(5);
  const [length, setLength] = useState(35);
  const [width, setWidth] = useState(25);
  const [height, setHeight] = useState(20);

  const [isLoading, setIsLoading] = useState(false);
  const [calcResults, setCalcResults] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedService, setSelectedService] = useState(0);

  const handleCalculate = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const payload = {
        country,
        actualWeight: deadWeight,
        length, width, height
      };
      const res = await api.post('/rates/calculate', payload);
      setCalcResults(res);
      setStep(3);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to fetch rates. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
                  <SearchableSelect 
                    id="calc-dest-country"
                    value={country}
                    onChange={setCountry}
                    options={COUNTRIES}
                    placeholder="Search country..."
                  />
                </div>

                <div className="form-group-item" style={{ marginTop: '2rem' }}>
                  <label className="form-label-title" style={{ marginBottom: '1rem', display: 'block' }}>
                    <i className="fa-solid fa-box-open" style={{ color: '#3CC8C8' }}></i> Select Item Category
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    {[
                      { id: 'food', icon: 'fa-bowl-food', title: 'Food & Pickles', desc: 'NRI Homemade items' },
                      { id: 'docs', icon: 'fa-file-signature', title: 'Documents', desc: 'Transcripts & files' },
                      { id: 'parcel', icon: 'fa-gift', title: 'Express Parcel', desc: 'Gifts & personal items' },
                      { id: 'cargo', icon: 'fa-pallet', title: 'Heavy Cargo', desc: 'Commercial 50kg+' },
                      { id: 'custom', icon: 'fa-pen-to-square', title: 'Custom Item', desc: 'Enter manually' }
                    ].map(cat => (
                      <div 
                        key={cat.id}
                        onClick={() => setCategory(cat.id)}
                        style={{
                          background: category === cat.id ? 'rgba(60, 200, 200, 0.1)' : 'rgba(255,255,255,0.02)',
                          border: `2px solid ${category === cat.id ? '#3CC8C8' : 'rgba(255,255,255,0.1)'}`,
                          borderRadius: '8px',
                          padding: '1rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1rem'
                        }}
                        onMouseEnter={(e) => { if(category !== cat.id) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; }}
                        onMouseLeave={(e) => { if(category !== cat.id) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                      >
                        <div style={{ 
                          width: '40px', height: '40px', borderRadius: '50%', 
                          background: category === cat.id ? '#3CC8C8' : 'rgba(255,255,255,0.05)',
                          color: category === cat.id ? '#122336' : '#A0B0C0',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem'
                        }}>
                          <i className={`fa-solid ${cat.icon}`}></i>
                        </div>
                        <div>
                          <strong style={{ color: '#FFF', display: 'block', fontSize: '0.95rem' }}>{cat.title}</strong>
                          <span style={{ color: '#7091A8', fontSize: '0.8rem' }}>{cat.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {category === 'custom' && (
                    <div className="animate-slide-in" style={{ marginTop: '1.5rem' }}>
                      <label className="form-label-title" htmlFor="calc-custom-category">
                        <i className="fa-solid fa-keyboard" style={{ color: '#E97856' }}></i> Specify Your Item
                      </label>
                      <input 
                        type="text" 
                        id="calc-custom-category" 
                        className="form-input-field" 
                        value={customCategory} 
                        onChange={(e) => setCustomCategory(e.target.value)} 
                        placeholder="e.g., Electronics, Handicrafts, Medicines..." 
                        style={{ marginTop: '0.5rem' }}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Dimensions */}
            {step === 2 && (
              <div className="animate-slide-in">
                <h3 style={{ fontSize: '1.4rem', color: '#FFF', marginBottom: '1.5rem' }}>Enter Parcel Dimensions</h3>
                
                {errorMsg && (
                  <div style={{ background: 'rgba(233,120,86,0.1)', color: '#E97856', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                    <i className="fa-solid fa-circle-exclamation"></i> {errorMsg}
                  </div>
                )}

                <div className="form-group-item">
                  <label className="form-label-title" htmlFor="calc-dead-weight">
                    <i className="fa-solid fa-scale-balanced" style={{ color: '#E97856' }}></i> Actual Scale Weight (kg)
                  </label>
                  <input type="number" id="calc-dead-weight" className="form-input-field" value={deadWeight} min="0.5" step="0.5" onChange={(e) => setDeadWeight(e.target.value)} required />
                </div>


              </div>
            )}

            {/* Step 3: Result */}
            {step === 3 && calcResults && (
              <div className="animate-slide-in">
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1.8rem', color: '#FFF', marginBottom: '0.5rem' }}>Select Your Service Level</h3>
                  <p style={{ color: '#A0B0C0' }}>Shipping {calcResults.actualWeight}kg from Andhra Pradesh to {country}</p>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px', border: '1px dashed #3CC8C8', marginBottom: '2rem', display: 'flex', justifyContent: 'center', gap: '2rem', color: '#FFF' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.8rem', color: '#7091A8' }}>Chargeable Weight</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#3CC8C8' }}>{calcResults.chargeableWeight} kg</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.8rem', color: '#7091A8' }}>Volumetric Weight</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{calcResults.volWeight.toFixed(2)} kg</div>
                  </div>
                </div>

                {calcResults.options && calcResults.options.length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
                    {calcResults.options.map((opt, i) => {
                      const isSelected = selectedService === i;
                      return (
                        <div key={i} 
                          onClick={() => setSelectedService(i)}
                          style={{ 
                            background: isSelected ? 'rgba(255,255,255,0.05)' : '#0B1622', 
                            border: `2px solid ${isSelected ? opt.color : 'rgba(255,255,255,0.1)'}`, 
                            borderRadius: '12px', 
                            padding: '1.5rem', 
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                            boxShadow: isSelected ? `0 10px 30px ${opt.color}33` : 'none'
                          }}
                        >
                          {isSelected && (
                            <div style={{ position: 'absolute', top: '10px', right: '10px', color: opt.color, fontSize: '1.2rem' }}>
                              <i className="fa-solid fa-circle-check"></i>
                            </div>
                          )}
                          {i === 0 && (
                            <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: opt.color, color: '#FFF', padding: '2px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800 }}>
                              BEST VALUE
                            </div>
                          )}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
                            <i className={`fa-solid ${opt.icon}`} style={{ color: opt.color, fontSize: '1.5rem' }}></i>
                            <div>
                              <strong style={{ color: '#FFF', display: 'block', fontSize: '1.1rem' }}>{opt.brand}</strong>
                              <span style={{ fontSize: '0.75rem', color: '#7091A8' }}>{opt.tagline}</span>
                            </div>
                          </div>
                          
                          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '1rem 0', margin: '1rem 0', flexGrow: 1 }}>
                            <div style={{ color: '#E2E8F0', fontSize: '0.9rem', marginBottom: '0.5rem' }}><i className="fa-regular fa-clock" style={{ width: '20px', color: '#3CC8C8' }}></i> {opt.transit}</div>
                            <div style={{ color: '#E2E8F0', fontSize: '0.9rem' }}><i className="fa-solid fa-truck" style={{ width: '20px', color: '#3CC8C8' }}></i> {opt.poweredBy} Network</div>
                          </div>

                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 800, color: opt.color, lineHeight: 1 }}>₹{opt.totalCost.toLocaleString('en-IN')}</div>
                            <div style={{ fontSize: '0.7rem', color: '#7091A8', marginTop: '5px' }}>*Approx total cost</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', color: '#E97856', padding: '2rem', background: 'rgba(233,120,86,0.1)', borderRadius: '8px' }}>
                    <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: '2rem', marginBottom: '1rem' }}></i>
                    <h4>Service Unavailable</h4>
                    <p>We're sorry, direct rates for this destination are currently unavailable online. Please contact our support team for a manual quote.</p>
                  </div>
                )}
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
                <button onClick={step === 2 ? handleCalculate : nextStep} className="btn btn-teal" disabled={isLoading}>
                  {isLoading ? 'Calculating...' : (
                    <>Next Step <i className="fa-solid fa-arrow-right"></i></>
                  )}
                </button>
              ) : (
                <Link 
                  to="/book-pickup" 
                  state={{ 
                    prefill: {
                      destination: country,
                      weight: calcResults?.chargeableWeight,
                      dimensions: `${length}x${width}x${height}`,
                      serviceBrand: calcResults?.options?.[selectedService]?.brand,
                      estimatedCost: calcResults?.options?.[selectedService]?.totalCost
                    }
                  }}
                  className="btn btn-coral"
                >
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
