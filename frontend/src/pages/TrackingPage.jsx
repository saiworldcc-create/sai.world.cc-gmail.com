import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import usePageContent from '../hooks/usePageContent';
import { trackShipment } from '../services/api';

const MILESTONE_STEPS = [
  { num: 1, title: 'Picked Up', sub: 'Kadapa Hub', icon: 'fa-truck-ramp-box' },
  { num: 2, title: 'KYC Verified', sub: 'Customs Ready', icon: 'fa-file-shield' },
  { num: 3, title: 'RGIA Departed', sub: 'Air Cargo Jet', icon: 'fa-plane-departure' },
  { num: 4, title: 'In Transit', sub: 'Destination Hub', icon: 'fa-earth-americas' },
  { num: 5, title: 'Delivered', sub: 'Doorstep Signed', icon: 'fa-box-open' }
];

export default function TrackingPage() {
  const { content } = usePageContent('tracking', {});
  const hero = content.hero || {};
  const [searchParams, setSearchParams] = useSearchParams();
  const awbParam = searchParams.get('awb') || '';

  const [inputAwb, setInputAwb] = useState(awbParam);
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTracking = async (awbCode) => {
    if (!awbCode?.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await trackShipment(awbCode.trim());
      setTrackingData(res.data);
      setSearchParams({ awb: awbCode.trim() });
    } catch (err) {
      setError(err.message || 'Unable to locate tracking details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (awbParam) {
      setInputAwb(awbParam);
      fetchTracking(awbParam);
    }
  }, [awbParam]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchTracking(inputAwb);
  };

  const handleSampleClick = (sample) => {
    setInputAwb(sample);
    fetchTracking(sample);
  };

  return (
    <main style={{ paddingTop: '80px' }}>
      <section className="page-hero-banner">
        <div className="container">
          <div className="breadcrumb-trail">
            <Link to="/">Home</Link>
            <span className="separator"><i className="fa-solid fa-chevron-right"></i></span>
            <span className="current">Live Shipment Tracking</span>
          </div>
          <div className="eyebrow-pill teal">
            <i className="fa-solid fa-satellite-dish"></i> {hero.eyebrow || 'Real-Time Global Milestone Radar'}
          </div>
          <h1 className="page-hero-title">{hero.heading || 'Track Your International Shipment'}</h1>
          <p className="page-hero-desc">
            {hero.lead || 'Enter your Air Waybill (AWB) or Consignment Number to monitor your parcel from doorstep collection in Andhra Pradesh to final overseas destination delivery.'}
          </p>
        </div>
      </section>

      <section className="section section-ivory">
        <div className="container">
          <div className="unified-tracking-card" style={{ background: '#FFFFFF', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', padding: 'clamp(1.5rem, 4vw, 2.5rem)', maxWidth: '1200px', margin: '0 auto', boxShadow: 'var(--shadow-md)' }}>
            
            {/* Search Input Box */}
            <div className="tracking-search-top">
              <form onSubmit={handleSubmit} className="hero-tracking-inline-form">
                <div className="track-input-group">
                  <i className="fa-solid fa-magnifying-glass track-input-icon"></i>
                  <input
                    type="text"
                    className="hero-clean-track-input"
                    placeholder="Enter Air Waybill (e.g. SAI-88492-USA)"
                    value={inputAwb}
                    onChange={(e) => setInputAwb(e.target.value)}
                    required
                  />
                  {inputAwb && (
                    <button type="button" className="track-clear-btn" onClick={() => setInputAwb('')} style={{ display: 'flex' }}>
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  )}
                </div>
                <button type="submit" className="btn btn-coral" disabled={loading}>
                  {loading ? <><i className="fa-solid fa-circle-notch fa-spin"></i> Locating…</> : <><i className="fa-solid fa-location-crosshairs"></i> Track Shipment</>}
                </button>
              </form>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1.25rem' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-slate-muted)' }}>Try Sample Numbers:</span>
                {['SAI-88492-USA', 'SAI-77310-UK', 'SAI-55201-AUS'].map(sample => (
                  <button
                    key={sample}
                    type="button"
                    className="sample-chip-light sample-track-pill"
                    onClick={() => handleSampleClick(sample)}
                  >
                    {sample}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div style={{ padding: '1rem', background: '#FDEDEC', color: '#E74C3C', borderRadius: 'var(--radius-md)', textAlign: 'center', marginTop: '1.5rem', border: '1px solid #FADBD8' }}>
                <i className="fa-solid fa-circle-exclamation" style={{ marginRight: '6px' }}></i> {error}
              </div>
            )}

            <hr style={{ border: 'none', borderTop: '1px dashed var(--border-subtle)', margin: '2.5rem 0' }} />

            {/* Tracking Result View */}
            {trackingData ? (
              <div className="tracking-result-panel">
                <div className="tracking-summary-header">
                  <div>
                    <span className="eyebrow-pill teal" style={{ marginBottom: '0.4rem' }}>Live Tracking Data</span>
                    <h2 style={{ fontSize: '1.8rem', color: '#1E3446', margin: 0 }}>AWB: {trackingData.awb}</h2>
                    <p style={{ fontSize: '0.95rem', color: '#4A6B82', margin: '0.35rem 0 0 0' }}>
                      <strong>{trackingData.origin}</strong> &rarr; <strong style={{ color: '#E97856' }}>{trackingData.destination}</strong>
                    </p>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-block', background: 'rgba(60, 146, 144, 0.12)', color: '#3C9290', padding: '0.4rem 1rem', borderRadius: '9999px', fontWeight: 800, fontSize: '0.9rem' }}>
                      <i className="fa-solid fa-circle-dot"></i> {trackingData.status}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#7091A8', marginTop: '0.4rem' }}>{trackingData.eta}</div>
                  </div>
                </div>

                {/* 5-Stage Stepper */}
                <div style={{ margin: '2rem 0' }}>
                  <h4 style={{ fontSize: '1rem', color: '#1E3446', marginBottom: '1rem' }}>Shipment Transit Milestones</h4>
                  <div className="tracking-stepper-row">
                    {MILESTONE_STEPS.map(step => {
                      const isCompleted = step.num < trackingData.stage || (step.num === 5 && trackingData.stage === 5);
                      const isActive = step.num === trackingData.stage && trackingData.stage < 5;
                      const cls = isCompleted ? 'completed' : isActive ? 'active' : '';
                      return (
                        <div key={step.num} className={`stepper-node-box ${cls}`}>
                          <div className="stepper-node-dot">
                            <i className={`fa-solid ${step.icon}`}></i>
                          </div>
                          <div className="stepper-node-title">{step.title}</div>
                          <div className="stepper-node-subtitle">{step.sub}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Split Details & Activity Log */}
                <div className="tracking-details-split-grid">
                  {/* Left: Detailed Activity Timeline */}
                  <div>
                    <h4 style={{ fontSize: '1.05rem', color: '#1E3446', marginBottom: '1.25rem' }}>Live Activity Log</h4>
                    <div className="tracking-activity-timeline">
                      {(trackingData.history || []).map((item, idx) => (
                        <div key={idx} className="tracking-log-entry">
                          <div className={`tracking-log-dot ${item.active ? 'active' : ''}`}></div>
                          <strong style={{ color: '#1E3446', fontSize: '0.95rem' }}>{item.status}</strong>
                          <div style={{ fontSize: '0.82rem', color: '#4A6B82', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '4px' }}>
                            <span><i className="fa-solid fa-clock" style={{ color: '#3C9290' }}></i> {item.time}</span>
                            <span><i className="fa-solid fa-location-dot" style={{ color: '#E97856' }}></i> {item.location}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right: Consignment Specifications */}
                  <div className="tracking-info-table-box">
                    <h4 style={{ fontSize: '1.05rem', color: '#1E3446', marginBottom: '0.75rem' }}>Parcel Specifications</h4>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', padding: '0.5rem 0', borderBottom: '1px solid rgba(41,70,93,0.08)' }}>
                      <span style={{ color: '#7091A8' }}>Sender</span>
                      <strong style={{ color: '#1E3446' }}>{trackingData.sender}</strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', padding: '0.5rem 0', borderBottom: '1px solid rgba(41,70,93,0.08)' }}>
                      <span style={{ color: '#7091A8' }}>Consignee</span>
                      <strong style={{ color: '#1E3446' }}>{trackingData.receiver}</strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', padding: '0.5rem 0', borderBottom: '1px solid rgba(41,70,93,0.08)' }}>
                      <span style={{ color: '#7091A8' }}>Contents</span>
                      <strong style={{ color: '#1E3446' }}>{trackingData.contents}</strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', padding: '0.5rem 0', borderBottom: '1px solid rgba(41,70,93,0.08)' }}>
                      <span style={{ color: '#7091A8' }}>Actual / Volumetric</span>
                      <strong style={{ color: '#1E3446' }}>{trackingData.deadWeight} / {trackingData.volWeight}</strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', padding: '0.5rem 0', borderBottom: '1px solid rgba(41,70,93,0.08)' }}>
                      <span style={{ color: '#7091A8' }}>Chargeable Weight</span>
                      <strong style={{ color: '#E97856', fontSize: '1rem' }}>{trackingData.chargeableWeight}</strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', padding: '0.5rem 0' }}>
                      <span style={{ color: '#7091A8' }}>Carrier Network</span>
                      <strong style={{ color: '#3C9290' }}>{trackingData.carrier}</strong>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
                      <button onClick={() => window.print()} className="btn btn-outline-slate btn-sm" style={{ flex: 1 }}>
                        <i className="fa-solid fa-print"></i> Print Waybill
                      </button>
                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(`Tracking my parcel with Sai International Couriers: AWB ${trackingData.awb} - Current Status: ${trackingData.status} to ${trackingData.destination}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-teal btn-sm"
                        style={{ flex: 1 }}
                      >
                        <i className="fa-brands fa-whatsapp"></i> Share Status
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="tracking-result-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--bg-powder-blue)', color: 'var(--accent-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', margin: '0 auto 1.5rem auto' }}>
                  <i className="fa-solid fa-plane-circle-check"></i>
                </div>
                <h3 style={{ fontSize: '1.4rem', color: 'var(--text-slate-dark)', marginBottom: '0.5rem' }}>Ready to Track Your Parcel</h3>
                <p style={{ color: 'var(--text-slate-muted)', maxWidth: '520px', margin: '0 auto 1.5rem auto', fontSize: '0.95rem' }}>
                  Click on any of the sample Air Waybills above or enter your consignment code to view live stage updates, customs reports, and destination ETAs.
                </p>
                <button type="button" className="btn btn-teal btn-sm" onClick={() => handleSampleClick('SAI-88492-USA')}>
                  <i className="fa-solid fa-bolt"></i> Load Sample Shipment (Dallas, USA)
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5-Stage Transit Explanation */}
      <section className="section section-peach">
        <div className="container">
          <div className="section-header-editorial center">
            <div className="eyebrow-pill">Logistics Protocol</div>
            <h2 className="section-title">How Our 5-Stage Tracking Works</h2>
            <p className="section-lead">Every parcel dispatched via Sai International Couriers passes through 5 documented transit checkpoints.</p>
          </div>

          <div className="shipment-journey-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            <div className="journey-step-card">
              <div className="journey-step-number">Stage 1</div>
              <div className="journey-step-icon"><i className="fa-solid fa-truck-ramp-box"></i></div>
              <h4 style={{ fontSize: '1rem', color: 'var(--text-slate-dark)' }}>Doorstep Collection</h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-slate-muted)', lineHeight: 1.4 }}>
                Picked up from your residence and weighed with calibrated digital scales.
              </p>
            </div>

            <div className="journey-step-card">
              <div className="journey-step-number">Stage 2</div>
              <div className="journey-step-icon"><i className="fa-solid fa-box-tissue"></i></div>
              <h4 style={{ fontSize: '1rem', color: 'var(--text-slate-dark)' }}>Vacuum Sealing</h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-slate-muted)', lineHeight: 1.4 }}>
                Sealed with multi-barrier nylon-poly pouches in 5-ply corrugated export cartons.
              </p>
            </div>

            <div className="journey-step-card">
              <div className="journey-step-number">Stage 3</div>
              <div className="journey-step-icon"><i className="fa-solid fa-plane-departure"></i></div>
              <h4 style={{ fontSize: '1rem', color: 'var(--text-slate-dark)' }}>RGIA Flight Cargo</h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-slate-muted)', lineHeight: 1.4 }}>
                Customs passed and loaded onto direct international flights from Hyderabad.
              </p>
            </div>

            <div className="journey-step-card">
              <div className="journey-step-number">Stage 4</div>
              <div className="journey-step-icon"><i className="fa-solid fa-passport"></i></div>
              <h4 style={{ fontSize: '1rem', color: 'var(--text-slate-dark)' }}>Foreign Customs</h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-slate-muted)', lineHeight: 1.4 }}>
                Processed through overseas gateway customs (e.g. US FDA / UK HMRC / Australia Dept of Ag).
              </p>
            </div>

            <div className="journey-step-card">
              <div className="journey-step-number">Stage 5</div>
              <div className="journey-step-icon"><i className="fa-solid fa-house-chimney-user"></i></div>
              <h4 style={{ fontSize: '1rem', color: 'var(--text-slate-dark)' }}>Door Delivery</h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-slate-muted)', lineHeight: 1.4 }}>
                Hand-delivered to the overseas consignee with digital proof of delivery signature.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
