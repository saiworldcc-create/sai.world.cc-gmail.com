import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import usePageContent from '../hooks/usePageContent';
import { COUNTRY_RATES } from '../constants/appData';

export default function CalculatorPage() {
  const { content } = usePageContent('calculator', {});
  const hero = content.hero || {};

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
          <h1 className="page-hero-title">{hero.heading || 'Shipping Cost & Dimensional Weight Calculator'}</h1>
          <p className="page-hero-desc">
            {hero.lead || 'Get transparent price estimates for international express parcel and air cargo shipments from Andhra Pradesh to 195+ countries with instant volumetric calculation.'}
          </p>
        </div>
      </section>

      <section className="section section-ivory">
        <div className="container">
          <div className="calculator-main-grid">
            {/* Input Form */}
            <div className="calc-input-panel">
              <h3 style={{ fontSize: '1.35rem', color: 'var(--text-slate-dark)', marginBottom: '0.5rem' }}>Package & Destination Details</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-slate-muted)', marginBottom: '1.75rem' }}>
                Fill in your parcel specifications below. The system automatically compares dead weight and volumetric dimensions.
              </p>

              <form onSubmit={(e) => e.preventDefault()}>
                <div className="form-row-two">
                  <div className="form-group-item">
                    <label className="form-label-title" htmlFor="calc-dest-country">
                      <i className="fa-solid fa-globe" style={{ color: 'var(--accent-coral)' }}></i> Destination Country
                    </label>
                    <select
                      id="calc-dest-country"
                      className="form-input-field"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
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
                    <label className="form-label-title" htmlFor="calc-category-select">
                      <i className="fa-solid fa-box-open" style={{ color: 'var(--accent-teal)' }}></i> Item Category
                    </label>
                    <select
                      id="calc-category-select"
                      className="form-input-field"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="food">NRI Homemade Food & Pickles</option>
                      <option value="docs">University Transcripts & Documents</option>
                      <option value="parcel">Express Personal / Gift Parcel</option>
                      <option value="cargo">Commercial Heavy Air Cargo (50kg+)</option>
                      <option value="baggage">Excess Relocation Baggage</option>
                    </select>
                  </div>
                </div>

                <div className="form-group-item" style={{ marginTop: '1rem' }}>
                  <label className="form-label-title" htmlFor="calc-dead-weight">
                    <i className="fa-solid fa-scale-balanced" style={{ color: 'var(--accent-coral)' }}></i> Actual Scale Weight (Dead Weight in kg)
                  </label>
                  <input
                    type="number"
                    id="calc-dead-weight"
                    className="form-input-field"
                    value={deadWeight}
                    min="0.5"
                    step="0.5"
                    onChange={(e) => setDeadWeight(e.target.value)}
                    placeholder="e.g. 5"
                    required
                  />
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-slate-light)' }}>Exact weight measured on a digital physical scale.</span>
                </div>

                <div style={{ marginTop: '1.5rem', marginBottom: '0.75rem' }}>
                  <label className="form-label-title">
                    <i className="fa-solid fa-cube" style={{ color: 'var(--accent-teal)' }}></i> Carton Dimensions (in Centimeters)
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginTop: '0.5rem' }}>
                    <div>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-slate-muted)' }}>Length (cm)</span>
                      <input
                        type="number"
                        className="form-input-field"
                        value={length}
                        min="1"
                        onChange={(e) => setLength(e.target.value)}
                        placeholder="L"
                      />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-slate-muted)' }}>Width (cm)</span>
                      <input
                        type="number"
                        className="form-input-field"
                        value={width}
                        min="1"
                        onChange={(e) => setWidth(e.target.value)}
                        placeholder="W"
                      />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-slate-muted)' }}>Height (cm)</span>
                      <input
                        type="number"
                        className="form-input-field"
                        value={height}
                        min="1"
                        onChange={(e) => setHeight(e.target.value)}
                        placeholder="H"
                      />
                    </div>
                  </div>
                </div>

                <div className="volumetric-formula-pill">
                  <i className="fa-solid fa-circle-info" style={{ color: 'var(--accent-teal)', marginRight: '0.35rem' }}></i>
                  <strong>IATA International Standard:</strong> Volumetric Weight = (Length × Width × Height in cm) ÷ 5000. Air carriers bill based on whichever is higher.
                </div>
              </form>
            </div>

            {/* Results Card */}
            <div className="calc-output-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="eyebrow-pill teal" style={{ margin: 0 }}>Instant Estimate</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-coral)' }}>
                  <i className="fa-solid fa-bolt"></i> {calcResults.transit}
                </span>
              </div>

              <div className="chargeable-weight-display-box">
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-slate-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Chargeable Weight</span>
                  <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--accent-coral)' }}>{calcResults.roundChargeable} kg</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-slate-muted)' }}>Volumetric Calc</span>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-slate-dark)' }}>{calcResults.volWeight} kg</div>
                </div>
              </div>

              <div style={{ fontSize: '0.82rem', lineHeight: 1.45, fontWeight: 600, color: calcResults.isVolGreater ? '#E97856' : 'var(--accent-teal)' }}>
                {calcResults.explanation}
              </div>

              <div style={{ borderTop: '1.5px solid rgba(41, 70, 93, 0.1)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div className="calc-rate-breakdown-row">
                  <span style={{ color: 'var(--text-slate-muted)' }}>Doorstep Collection (AP)</span>
                  <strong style={{ color: '#27AE60' }}>FREE</strong>
                </div>

                <div className="calc-rate-breakdown-row">
                  <span style={{ color: 'var(--text-slate-muted)' }}>5-Ply Export Box & Vacuum Sealing</span>
                  <strong style={{ color: '#27AE60' }}>FREE</strong>
                </div>

                <div className="calc-rate-breakdown-row">
                  <span style={{ color: 'var(--text-slate-muted)' }}>Estimated Transit Time</span>
                  <strong style={{ color: 'var(--text-slate-dark)' }}>{calcResults.transit}</strong>
                </div>

                <div className="calc-rate-breakdown-row" style={{ borderTop: '1px dashed rgba(41, 70, 93, 0.15)', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
                  <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-slate-dark)' }}>Estimated Total</span>
                  <strong style={{ fontSize: '1.45rem', color: 'var(--accent-coral)' }}>
                    ₹{calcResults.totalMin.toLocaleString('en-IN')} – ₹{calcResults.totalMax.toLocaleString('en-IN')}
                  </strong>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
                <Link to="/book-pickup" className="btn btn-coral btn-lg" style={{ flex: 1, textAlign: 'center' }}>
                  <i className="fa-solid fa-truck-fast"></i> Book Pickup Now
                </Link>
                <a
                  href={`https://wa.me/919059949365?text=${encodeURIComponent(`Hello Sai Couriers, I calculated an estimate for ${country} (${calcResults.roundChargeable} kg ${category}): ₹${calcResults.totalMin} - ₹${calcResults.totalMax}. Please confirm pickup.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-teal btn-lg"
                  style={{ flex: 1, textAlign: 'center' }}
                >
                  <i className="fa-brands fa-whatsapp"></i> Confirm Rate
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
