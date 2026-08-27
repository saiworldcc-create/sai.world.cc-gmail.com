import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import usePageContent from '../hooks/usePageContent';
import useScrollReveal from '../hooks/useScrollReveal';
import useMouseParallax from '../hooks/useMouseParallax';
import VideoPlayer, { VideoModal } from '../components/common/VideoPlayer';
import { trackShipment } from '../services/api';
import { TESTIMONIALS, BRANCH_MAP_DATA, SERVICE_HUB_LINKS } from '../constants/appData';

/* ── Hero Tracking Widget ── */
function HeroTrackingCard() {
  const [awb, setAwb] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleTrack = async (e) => {
    e?.preventDefault();
    if (!awb.trim()) { setError('Please enter an AWB / Tracking Number.'); return; }
    setLoading(true); setError(''); setResult(null);
    try {
      const res = await trackShipment(awb.trim());
      navigate(`/tracking?awb=${encodeURIComponent(awb.trim())}`);
    } catch {
      navigate(`/tracking?awb=${encodeURIComponent(awb.trim())}`);
    } finally { setLoading(false); }
  };

  const sampleCodes = ['SAI-88492-USA', 'SAI-77310-UK', 'SAI-55201-AUS'];

  return (
    <div className="hero-tracking-glass-card">
      <div className="tracking-card-header">
        <div className="tracking-card-title">
          <i className="fa-solid fa-radar"></i>
          <h3>Track Shipment Live</h3>
        </div>
        <span className="radar-live-badge">
          <span className="radar-live-dot"></span> Live 24/7
        </span>
      </div>
      <form onSubmit={handleTrack} className="hero-tracking-form">
        <div className="track-input-group">
          <i className="fa-solid fa-box-archive track-input-icon"></i>
          <input
            type="text"
            className="hero-clean-track-input"
            placeholder="Enter AWB / Tracking Number"
            value={awb}
            onChange={e => { setAwb(e.target.value); setError(''); }}
            autoComplete="off"
            spellCheck="false"
          />
          {awb && (
            <button type="button" className="track-clear-btn" onClick={() => setAwb('')} style={{ display: 'flex' }}>
              <i className="fa-solid fa-xmark"></i>
            </button>
          )}
        </div>
        <div className="tracking-actions-grid">
          <button type="submit" className="btn btn-teal tracking-submit-btn" disabled={loading}>
            {loading ? <><i className="fa-solid fa-circle-notch fa-spin"></i> Locating…</> : <><i className="fa-solid fa-magnifying-glass"></i> <span>Track Status</span></>}
          </button>
          <Link to="/book-pickup" className="btn btn-coral tracking-book-btn">
            <i className="fa-solid fa-truck-fast"></i> <span>Book Pickup</span>
          </Link>
        </div>
        {error && <div className="tracking-feedback error" style={{ display: 'block' }}><i className="fa-solid fa-circle-exclamation"></i> {error}</div>}
      </form>
      <div className="hero-sample-chips">
        <span className="chips-label">Demo:</span>
        {sampleCodes.map(code => (
          <button key={code} type="button" className="sample-chip" onClick={() => setAwb(code)}>{code}</button>
        ))}
      </div>
    </div>
  );
}

/* ── Testimonials Carousel ── */
function TestimonialsCarousel({ items }) {
  const [idx, setIdx] = useState(0);
  const timerRef = useRef();
  const list = items && items.length ? items : TESTIMONIALS;

  useEffect(() => {
    timerRef.current = setInterval(() => setIdx(i => (i + 1) % list.length), 6500);
    return () => clearInterval(timerRef.current);
  }, [list.length]);

  const reset = (i) => { clearInterval(timerRef.current); setIdx(i); timerRef.current = setInterval(() => setIdx(j => (j + 1) % list.length), 6500); };

  const item = list[idx];
  return (
    <div className="testimonial-editorial-box">
      <div className="testimonial-slide-item" style={{ display: 'block' }}>
        <div className="stars-row">★★★★★</div>
        <p className="testimonial-quote-text">"{item.text}"</p>
        <div className="testimonial-client-row">
          <div className="client-avatar-badge">{item.initials || item.name?.[0]}</div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontWeight: 700, color: 'var(--text-slate-dark)' }}>{item.name}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-slate-muted)' }}>{item.role}</div>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginTop: '1rem' }}>
        <button className="btn btn-soft-cream btn-sm" onClick={() => reset((idx - 1 + list.length) % list.length)}>←</button>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {list.map((_, i) => (
            <span key={i} onClick={() => reset(i)} style={{ width: i === idx ? '28px' : '10px', height: '10px', borderRadius: '6px', background: i === idx ? 'var(--accent-coral)' : '#CBD5E1', cursor: 'pointer', transition: 'all 0.2s', display: 'inline-block' }}></span>
          ))}
        </div>
        <button className="btn btn-soft-cream btn-sm" onClick={() => reset((idx + 1) % list.length)}>→</button>
      </div>
    </div>
  );
}

/* ── Branch Map Switcher ── */
function BranchMapSwitcher() {
  const [activeBranch, setActiveBranch] = useState('kadapa-main');
  const data = BRANCH_MAP_DATA[activeBranch];
  return (
    <div className="google-maps-card-wrapper">
      <div className="maps-interactive-header">
        <div className="maps-branch-selector-pills">
          {Object.entries(BRANCH_MAP_DATA).map(([key, b]) => (
            <button key={key} className={`map-branch-pill-btn${activeBranch === key ? ' active' : ''}`} onClick={() => setActiveBranch(key)}>
              <i className="fa-solid fa-location-dot"></i> {b.title.split('(')[0].trim().replace("SAI INTERNATIONAL COURIER'S SERVICE'S", 'Kadapa Main')}
            </button>
          ))}
        </div>
        <div>
          <a href={data.externalUrl} target="_blank" rel="noopener noreferrer" className="btn btn-soft-cream btn-sm">
            <i className="fa-solid fa-diamond-turn-right" style={{ color: 'var(--accent-coral)' }}></i> Open in Google Maps
          </a>
        </div>
      </div>
      <div className="google-map-iframe-container">
        <iframe title="Branch Map" src={data.url} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen></iframe>
      </div>
      <div style={{ padding: '1rem 1.5rem', background: 'var(--bg-card-tint)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
        <div>
          <strong style={{ color: 'var(--text-slate-dark)', fontSize: '0.95rem' }}>{data.title}</strong>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-slate-muted)' }}>{data.addr}</div>
        </div>
        <a href={`tel:${data.phone}`} className="btn btn-soft-cream btn-sm">Call for Pickup</a>
      </div>
    </div>
  );
}

/* ── HomePage ── */
export default function HomePage() {
  const { content } = usePageContent('home', {});
  const h = content.hero || {};
  const bs = content.brandStory || {};
  const sv = content.services || {};
  const fp = content.foodPackaging || {};
  const tm = content.testimonials || {};
  const vs = content.videoSection || {};

  const [activeVideoModal, setActiveVideoModal] = useState(null);
  const parallaxRef = useMouseParallax(5);
  const storyRef = useScrollReveal();
  const servicesRef = useScrollReveal();
  const foodRef = useScrollReveal();
  const hubRef = useScrollReveal();
  const videoRef = useScrollReveal();
  const testimonialsRef = useScrollReveal();
  const branchMapRef = useScrollReveal();

  const scrollToServicesHub = (e) => {
    if (e) e.preventDefault();
    const target = document.getElementById('services-hub');
    if (!target) return;
    const startY = window.pageYOffset;
    const targetY = target.getBoundingClientRect().top + startY - 75;
    const distance = targetY - startY;
    const duration = 500; // 0.5s slow smooth scroll
    let startTimestamp = null;

    const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);
      window.scrollTo(0, startY + distance * easeInOutCubic(progress));
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        window.scrollTo(0, targetY);
      }
    };
    requestAnimationFrame(step);
  };

  return (
    <main>
      {/* 1. Hero */}
      <section className="hero-section-editorial" id="hero">
        <div className="hero-backdrop-layer" ref={parallaxRef}>
          <div className="hero-ambient-orb-1"></div>
          <div className="hero-ambient-orb-2"></div>
          <div className="hero-backdrop-overlay"></div>
          {h.heroBgImage && /\.(mp4|webm|ogg|mov|m4v)($|\?)/i.test(h.heroBgImage) ? (
            <video
              key={`hero-vid-${h.heroBgImage}`}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="hero-backdrop-img"
              style={{ objectFit: 'cover', width: '100%', height: '100%', position: 'absolute', inset: 0 }}
            >
              <source src={h.heroBgImage} type="video/mp4" />
            </video>
          ) : h.heroBgImage ? (
            <picture key={`hero-pic-${h.heroBgImage}`} className="hero-backdrop-picture">
              {h.heroBgMobile && <source media="(max-width: 768px)" srcSet={h.heroBgMobile} />}
              <img
                src={h.heroBgImage}
                className="hero-backdrop-img"
                alt="Sai International Couriers Global"
              />
            </picture>
          ) : null}
        </div>
        <div className="hero-main-container hero-sky-placement">
          {/* 1. Upper Sky Area (Second Screenshot Position: Above the Plane) */}
          <div className="hero-sky-copy-zone">
            <div className="hero-kicker-badge">
              <span className="hero-kicker-dot"></span>
              <span>GLOBAL LOGISTICS & CARGO</span>
            </div>
            <h1 className="hero-heading">
              <span className="hero-heading-white">{h.heading || 'From Andhra Pradesh'}&nbsp;</span>
              <span className="hero-heading-lead-in">to the </span>
              <span className="animated-world-text">World.</span>
            </h1>
            <p className="hero-description">
              Worldwide Express Courier, Air Cargo & Doorstep Delivery to <span className="hero-highlight-countries">195+ Countries</span>.
            </p>
          </div>

          {/* 2. Floating Explore Services in the Middle of Hero */}
          <div className="hero-floating-center-cta">
            <a
              href="#services-hub"
              onClick={scrollToServicesHub}
              className="btn-hero-floating-explore"
              title="Explore Our Services"
            >
              <span>Explore Our Services</span>
              <i className="fa-solid fa-arrow-down"></i>
            </a>
            {(h.videoUrl || h.heroVideoUrl) && (
              <button
                type="button"
                className="btn btn-hero-video-glass"
                onClick={() => setActiveVideoModal(h.videoUrl || h.heroVideoUrl)}
                title="Watch Process Video"
              >
                <i className="fa-solid fa-circle-play"></i>
                <span>Watch Video</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 2. Quick Services & Logistics Hub (Dedicated Section for Services, NRI Food, Tracking, Rates & Customs) */}
      <section className="section section-quick-services-hub reveal-init" id="services-hub" ref={hubRef}>
        <div className="container">
          <div className="section-header-editorial center reveal-init">
            <div className="eyebrow-pill teal">Logistics & Online Services Hub</div>
            <h2 className="section-title">Worldwide Courier Solutions & Direct Online Tools</h2>
            <p className="section-lead">Direct access to our international express courier network, authentic NRI food shipping, live satellite tracking, rate calculator, and customs documentation guide.</p>
          </div>

          <div className="quick-hub-grid">
            {SERVICE_HUB_LINKS.map((item, idx) => (
              <Link
                key={item.to}
                to={item.to}
                className={`quick-hub-card reveal-init stagger-${(idx % 4) + 1}`}
              >
                <div className="quick-hub-card-top">
                  <div className="quick-hub-icon-box">
                    <i className={`fa-solid ${item.icon}`}></i>
                  </div>
                  <span className="quick-hub-badge">{item.badge}</span>
                </div>
                <div className="quick-hub-eyebrow">{item.eyebrow}</div>
                <h3 className="quick-hub-title">{item.title}</h3>
                <p className="quick-hub-desc">{item.desc}</p>
                <div className="quick-hub-cta">
                  <span>{item.cta}</span>
                  <i className="fa-solid fa-arrow-right"></i>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Brand Story */}
      <section className="section brand-story-section reveal-init" id="about-story" ref={storyRef}>
        <div className="container">
          <div className="brand-story-grid">
            <div className="story-img-frame reveal-init stagger-1">
              <img src={bs.image || '/assets/images/express_doorstep_pickup.jpg'} alt="Sai Couriers Doorstep Pickup" loading="lazy" />
            </div>
            <div className="reveal-init stagger-2">
              <div className="eyebrow-pill teal">{bs.eyebrow || 'Our Heritage & Commitment'}</div>
              <h2>{bs.heading || 'Connecting Andhra Pradesh with the World'}</h2>
              <p style={{ fontSize: '1.05rem', lineHeight: '1.65', margin: '1rem 0' }}>{bs.paragraph1}</p>
              <p>{bs.paragraph2}</p>
              <div className="story-features-list">
                {(bs.features || ['Direct Air Cargo Flights', 'Free Doorstep Collection', 'End-to-End Customs Support', 'Live Satellite GPS Tracking']).map((f, i) => (
                  <div key={f} className={`story-feature-item reveal-init stagger-${i + 1}`}><i className="fa-solid fa-plane"></i><span>{f}</span></div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', marginTop: '1.5rem' }}>
                <a href="tel:+919059949365" className="btn btn-coral"><i className="fa-solid fa-phone"></i> Speak with Logistics Manager</a>
                <a href="https://wa.me/919059949365" target="_blank" rel="noopener noreferrer" className="btn btn-soft-cream"><i className="fa-brands fa-whatsapp" style={{ color: '#25D366' }}></i> WhatsApp Inquiry</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Services */}
      <section className="section reveal-init" id="services-section" ref={servicesRef}>
        <div className="container">
          <div className="section-header-editorial reveal-init">
            <div className="eyebrow-pill">{sv.eyebrow || 'Comprehensive Logistics'}</div>
            <h2 className="section-title">{sv.heading || 'Worldwide Courier & Air Freight Solutions'}</h2>
            <p className="section-lead">{sv.lead}</p>
          </div>
          <div className="services-editorial-grid">
            <div className="service-featured-card reveal-init stagger-1">
              <div className="service-featured-img">
                <img src={sv.featuredService?.image || '/assets/images/courier_delivery_service.jpg'} alt="Express Courier" loading="lazy" />
              </div>
              <div className="service-featured-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="eyebrow-pill teal" style={{ margin: 0 }}>{sv.featuredService?.badge || 'Priority Delivery'}</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-coral)' }}>{sv.featuredService?.deliveryTime || '4–5 Days Guaranteed'}</span>
                </div>
                <h3>{sv.featuredService?.title || 'International Express Courier'}</h3>
                <p>{sv.featuredService?.description}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-slate-dark)' }}>
                  {(sv.featuredService?.bullets || []).map(b => <div key={b}><i className="fa-solid fa-circle-check" style={{ color: 'var(--accent-teal)', marginRight: '0.5rem' }}></i>{b}</div>)}
                </div>
                <div style={{ marginTop: 'auto', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <a href="tel:+919059949365" className="btn btn-coral btn-sm">Book Courier Service</a>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-slate-muted)' }}>195+ Destinations</span>
                </div>
              </div>
            </div>
            <div className="service-stacked-cards">
              {(sv.stackedServices || []).map((s, i) => (
                <div key={i} className={`service-horizontal-box reveal-init stagger-${i + 2}`} style={i === 1 ? { borderLeft: '4px solid var(--accent-coral)' } : {}}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ background: i === 1 ? 'var(--accent-coral-soft)' : 'var(--bg-powder-blue)', color: i === 1 ? 'var(--accent-coral)' : 'var(--text-slate-dark)', fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-xs)' }}>{s.badge}</span>
                    <span style={{ color: i === 1 ? 'var(--accent-coral)' : 'var(--accent-teal)', fontWeight: 700, fontSize: '0.85rem' }}>{i === 0 ? 'Volume Rates' : '100% Leak-Proof'}</span>
                  </div>
                  <h3>{s.title}</h3>
                  <p style={{ fontSize: '0.92rem' }}>{s.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Food Packaging */}
      <section className="section section-peach reveal-init" id="food-packaging" ref={foodRef}>
        <div className="container">
          <div className="food-packaging-grid">
            <div className="food-packaging-img-frame reveal-init stagger-1">
              <img src={fp.image || '/assets/images/special_food_packaging.jpg'} alt="Food Packaging" loading="lazy" />
            </div>
            <div className="reveal-init stagger-2">
              <div className="eyebrow-pill">{fp.eyebrow || 'Specialized Packaging Standards'}</div>
              <h2>{fp.heading || 'Send the Taste of Home Worldwide'}</h2>
              <p className="text-highlight-banner" style={{ fontSize: '1.05rem', margin: '0.75rem 0' }}><strong>{fp.highlight}</strong></p>
              <p>{fp.paragraph}</p>
              <div className="food-labels-grid">
                {(fp.items || []).map((item, i) => (
                  <div key={item.title} className={`food-label-card reveal-init stagger-${(i % 4) + 1}`}>
                    <i className={`fa-solid ${item.icon} food-label-icon`}></i>
                    <div>
                      <h4 style={{ margin: '0 0 2px 0', fontSize: '0.95rem' }}>{item.title}</h4>
                      <p style={{ margin: 0, fontSize: '0.8rem' }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', marginTop: '1.5rem' }}>
                <a href="tel:+919059949365" className="btn btn-coral"><i className="fa-solid fa-box-check"></i> Book Food Parcel Pickup</a>
                <a href="https://wa.me/919059949365?text=Hello%20Sai%20Couriers,%20I%20want%20to%20send%20homemade%20pickles." target="_blank" rel="noopener noreferrer" className="btn btn-soft-cream"><i className="fa-brands fa-whatsapp" style={{ color: '#25D366' }}></i> WhatsApp Inquiry</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Video Showcase Section */}
      {vs && (vs.videoUrl || vs.enabled !== false) && (
        <section className="section section-video-showcase reveal-init" id="video-showcase" ref={videoRef}>
          <div className="container">
            <div className="section-header-editorial center reveal-init">
              <div className="eyebrow-pill teal">{vs.eyebrow || 'Inside Sai Couriers'}</div>
              <h2 className="section-title">{vs.heading || 'Watch How We Pack & Ship Your Parcels'}</h2>
              <p className="section-lead">{vs.description || 'From certified vacuum sealing of homemade Andhra delicacies to direct international air cargo flights, see our operations in action.'}</p>
            </div>
            <div className="video-showcase-wrapper reveal-init stagger-1">
              <div className="video-player-frame">
                <VideoPlayer
                  videoUrl={vs.videoUrl || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'}
                  posterImage={vs.posterImage || '/assets/images/sai_global_3d_hero.jpg'}
                  title={vs.heading || 'Sai Couriers Video'}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 8. Testimonials */}
      <section className="section section-peach reveal-init" id="testimonials" ref={testimonialsRef}>
        <div className="container">
          <div className="section-header-editorial center reveal-init">
            <div className="eyebrow-pill teal">{tm.eyebrow || 'Verified Reviews'}</div>
            <h2 className="section-title">{tm.heading || 'Trusted by Families & Businesses'}</h2>
            <p className="section-lead">{tm.lead}</p>
          </div>
          <TestimonialsCarousel items={tm.items} />
        </div>
      </section>

      {/* 9. Branch Map */}
      <section className="section reveal-init" id="regional-branches" ref={branchMapRef}>
        <div className="container">
          <div className="section-header-editorial reveal-init">
            <div className="eyebrow-pill teal">Real-Time Branch Locations</div>
            <h2 className="section-title">Find Your Nearest SAI Branch on Google Maps</h2>
            <p className="section-lead">Click any branch below to view its exact live location on Google Maps or get instant doorstep pickup.</p>
          </div>
          <BranchMapSwitcher />
        </div>
      </section>

      <VideoModal
        isOpen={!!activeVideoModal}
        onClose={() => setActiveVideoModal(null)}
        videoUrl={activeVideoModal}
        title="Sai International Couriers Video"
      />
    </main>
  );
}
