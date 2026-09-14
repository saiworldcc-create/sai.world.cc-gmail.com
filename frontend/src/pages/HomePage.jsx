import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import usePageContent from '../hooks/usePageContent';
import useScrollReveal from '../hooks/useScrollReveal';
import useMouseParallax from '../hooks/useMouseParallax';
import VideoPlayer, { VideoModal } from '../components/common/VideoPlayer';
import { trackShipment } from '../services/api';
import { TESTIMONIALS, SERVICE_HUB_LINKS } from '../constants/appData';
import useContactInfo from '../hooks/useContactInfo';

/* ══════════════════════════════════════════════════════════════════════════════
   DATA ARRAYS — All repeated elements use loops, no hardcoded DOM duplication
   ══════════════════════════════════════════════════════════════════════════════ */

const ORBITAL_NODES = [
  { icon: 'fa-plane',          colorClass: 'node-teal',   label: 'Air Cargo' },
  { icon: 'fa-box',            colorClass: 'node-purple', label: 'Packaging' },
  { icon: 'fa-truck-fast',     colorClass: 'node-green',  label: 'Delivery' },
  { icon: 'fa-satellite-dish', colorClass: 'node-coral',  label: 'Tracking' },
];

const ORBITAL_PARTICLES = [
  { cls: 'p1' }, { cls: 'p2' }, { cls: 'p3' },
  { cls: 'p4' }, { cls: 'p5' }, { cls: 'p6' },
  { cls: 'p7' }, { cls: 'p8' },
];

const HERO_STATS = [
  { value: '195+',  label: 'Countries Served',    icon: 'fa-earth-americas' },
  { value: '50K+',  label: 'Parcels Delivered',    icon: 'fa-boxes-packing' },
  { value: '4-5',   label: 'Days Express Delivery', icon: 'fa-clock' },
  { value: '24/7',  label: 'Live GPS Tracking',    icon: 'fa-satellite-dish' },
];

const BRAND_FEATURES = [
  { icon: 'fa-plane-departure', text: 'Direct Air Cargo Flights' },
  { icon: 'fa-house-chimney',   text: 'Free Doorstep Collection' },
  { icon: 'fa-shield-check',    text: 'End-to-End Customs Support' },
  { icon: 'fa-location-crosshairs', text: 'Live Satellite GPS Tracking' },
];

const WHY_CHOOSE_US = [
  { icon: 'fa-gauge-high',     title: 'Express Speed',        desc: '4–5 day guaranteed delivery to 195+ countries worldwide.' },
  { icon: 'fa-shield-halved',  title: 'Secure Packaging',     desc: 'Multi-layer vacuum sealing for food, documents & valuables.' },
  { icon: 'fa-indian-rupee-sign', title: 'Transparent Pricing', desc: 'No hidden charges. Real-time rate calculator available online.' },
  { icon: 'fa-headset',        title: '24/7 Support',         desc: 'Dedicated logistics managers reachable via call & WhatsApp.' },
  { icon: 'fa-file-shield',    title: 'Customs Clearance',    desc: 'Complete KYC, export documentation & restricted goods support.' },
  { icon: 'fa-hand-holding-heart', title: 'NRI Special Care', desc: 'Homemade pickles, sweets & traditional food shipped with love.' },
];

/* ── Hero Tracking Widget ── */
function HeroTrackingCard() {
  const [awb, setAwb] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleTrack = async (e) => {
    e?.preventDefault();
    if (!awb.trim()) { setError('Please enter an AWB / Tracking Number.'); return; }
    setLoading(true); setError('');
    try {
      await trackShipment(awb.trim());
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

/* ── Animated Counter ── */
function AnimatedCounter({ value, label, icon }) {
  const [count, setCount] = useState('0');
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated.current) {
        hasAnimated.current = true;
        
        // Only animate simple numbers with optional letter/symbol suffixes (e.g., 195+, 50K+)
        const isSimpleNumber = /^[0-9]+[a-zA-Z+]*$/.test(value);
        if (!isSimpleNumber) {
          setCount(value);
          return;
        }

        const numericPart = value.replace(/[^0-9]/g, '');
        const suffix = value.replace(/[0-9]/g, '');
        const target = parseInt(numericPart, 10);
        if (isNaN(target)) { setCount(value); return; }
        
        const duration = 2000;
        const startTime = performance.now();
        const animate = (now) => {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.floor(eased * target) + suffix);
          if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div className="hero-stat-item" ref={ref}>
      <i className={`fa-solid ${icon} hero-stat-icon`}></i>
      <span className="hero-stat-value">{count}</span>
      <span className="hero-stat-label">{label}</span>
    </div>
  );
}

/* ── Global Network SVG Map ── */
function GlobalNetworkMap() {
  return (
    <section className="section" style={{ background: '#0B1622', overflow: 'hidden', padding: '5rem 0', position: 'relative' }}>
      <div className="container" style={{ textAlign: 'center', zIndex: 2, position: 'relative' }}>
        <h2 style={{ color: '#FFF', fontSize: '2.5rem', marginBottom: '1rem' }}>Our Global Reach</h2>
        <p style={{ color: '#A0B0C0', maxWidth: '600px', margin: '0 auto 4rem auto' }}>Seamlessly connecting Andhra Pradesh to 195+ countries through our established international air cargo network.</p>
      </div>

      <div style={{ position: 'relative', width: '100%', maxWidth: '1200px', margin: '0 auto', height: '500px' }}>
        {/* Simplified SVG World Map Background */}
        <svg viewBox="0 0 1000 500" style={{ width: '100%', height: '100%', opacity: 0.15, position: 'absolute', top: 0, left: 0 }}>
          <path fill="#3CC8C8" d="M140 180c10-20 30-30 50-20s30 40 10 60-50-10-60-40z M280 150c20-10 50 0 60 20s-10 40-30 30-40-30-30-50z M500 120c30-10 70 10 60 40s-40 20-60 0-20-30 0-40z M680 200c20-10 40 10 30 30s-30 10-40-10-10-20 10-20z M820 160c20 0 30 20 20 40s-30 10-40-10 0-30 20-30z M720 350c10-20 40-10 30 10s-30 20-40 0 0-20 10-10z M220 320c20-10 40 0 30 20s-30 10-40-10 0-20 10-10z" />
          <path fill="#FFF" d="M150 190 Q170 160 200 180 T250 170 T300 200 T350 180 T400 220 T450 190 T500 210 T550 180 T600 230 T650 200 T700 220 T750 180 T800 210" stroke="#FFF" strokeWidth="1" fillOpacity="0.2"/>
        </svg>

        {/* Animated Flight Paths */}
        <svg viewBox="0 0 1000 500" style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 1 }}>
          <defs>
            <linearGradient id="pathGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3CC8C8" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#3CC8C8" stopOpacity="1" />
            </linearGradient>
            <linearGradient id="pathGrad2" x1="100%" y1="0%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#E97856" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#E97856" stopOpacity="1" />
            </linearGradient>
          </defs>
          
          {/* India to USA */}
          <path className="flight-path" d="M 680,220 Q 400,100 180,180" fill="transparent" stroke="url(#pathGrad2)" strokeWidth="3" strokeDasharray="5, 10" />
          {/* India to UK */}
          <path className="flight-path" d="M 680,220 Q 580,120 520,150" fill="transparent" stroke="url(#pathGrad)" strokeWidth="3" strokeDasharray="5, 10" />
          {/* India to UAE */}
          <path className="flight-path" d="M 680,220 Q 640,200 620,230" fill="transparent" stroke="url(#pathGrad)" strokeWidth="3" strokeDasharray="5, 10" />
          {/* India to AUS */}
          <path className="flight-path" d="M 680,220 Q 750,280 800,350" fill="transparent" stroke="url(#pathGrad)" strokeWidth="3" strokeDasharray="5, 10" />
        </svg>

        {/* Hub Dots */}
        <div className="hub-dot" style={{ top: '44%', left: '68%' }} title="India (Origin)">
          <div className="pulse-ring coral"></div><div className="dot coral"></div><span className="hub-label">Andhra Pradesh</span>
        </div>
        <div className="hub-dot" style={{ top: '36%', left: '18%' }} title="USA">
          <div className="pulse-ring"></div><div className="dot"></div><span className="hub-label">USA</span>
        </div>
        <div className="hub-dot" style={{ top: '30%', left: '52%' }} title="UK">
          <div className="pulse-ring"></div><div className="dot"></div><span className="hub-label">UK</span>
        </div>
        <div className="hub-dot" style={{ top: '46%', left: '62%' }} title="UAE">
          <div className="pulse-ring"></div><div className="dot"></div><span className="hub-label">UAE</span>
        </div>
        <div className="hub-dot" style={{ top: '70%', left: '80%' }} title="Australia">
          <div className="pulse-ring"></div><div className="dot"></div><span className="hub-label">Australia</span>
        </div>
      </div>
    </section>
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
        <div className="stars-row">{'★'.repeat(item.rating || 5)}</div>
        <p className="testimonial-quote-text">"{item.text}"</p>
        <div className="testimonial-client-row">
          <div className="client-avatar-badge">{item.initials || item.name?.[0]}</div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontWeight: 700, color: 'var(--text-slate-dark)' }}>{item.name}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-slate-muted)' }}>{item.location || item.role}</div>
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

function BranchMapSwitcher() {
  const { data: contactData, loading } = useContactInfo();
  const branches = contactData?.branches || {};
  const [activeBranch, setActiveBranch] = useState('kadapa-main');
  
  if (loading || Object.keys(branches).length === 0) return <div className="skeleton-box" style={{ height: '400px' }}></div>;
  
  const data = branches[activeBranch] || Object.values(branches)[0];

  return (
    <div className="google-maps-card-wrapper">
      <div className="maps-interactive-header">
        <div className="maps-branch-selector-pills">
          {Object.entries(branches).map(([key, b]) => (
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

/* ══════════════════════════════════════════════════════════════════════════════
   MAIN HOMEPAGE — All sections unified, dynamic, loop-driven
   ══════════════════════════════════════════════════════════════════════════════ */
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
  const whyUsRef = useScrollReveal();
  const orbitalRef = useScrollReveal();

  const scrollToServicesHub = (e) => {
    if (e) e.preventDefault();
    const target = document.getElementById('services-hub');
    if (!target) return;
    const startY = window.pageYOffset;
    const targetY = target.getBoundingClientRect().top + startY - 75;
    const distance = targetY - startY;
    const duration = 500;
    let startTimestamp = null;
    const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);
      window.scrollTo(0, startY + distance * easeInOutCubic(progress));
      if (progress < 1) requestAnimationFrame(step);
      else window.scrollTo(0, targetY);
    };
    requestAnimationFrame(step);
  };

  return (
    <main>
      {/* ═══════════════════════════════════════════════════════════════════════
          1. HERO SECTION — Video background + headline + stats bar
          ═══════════════════════════════════════════════════════════════════════ */}
      <section className="hero-section-editorial" id="hero">
        <div className="hero-backdrop-layer" ref={parallaxRef}>
          <div className="hero-ambient-orb-1"></div>
          <div className="hero-ambient-orb-2"></div>
          <div className="hero-backdrop-overlay"></div>
          {(() => {
            const videoSrc = (h.heroBgImage && /\.(mp4|webm|ogg|mov|m4v)($|\?)/i.test(h.heroBgImage))
              ? h.heroBgImage
              : '/assets/images/hero_video.mp4';
            return (
              <video
                key={`hero-vid-${videoSrc}`}
                autoPlay loop muted playsInline preload="auto"
                className="hero-backdrop-img"
                style={{ objectFit: 'cover', width: '100%', height: '100%', position: 'absolute', inset: 0 }}
              >
                <source src={videoSrc} type="video/mp4" />
              </video>
            );
          })()}
        </div>
        <div className="hero-main-container hero-sky-placement">
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

          <div className="hero-floating-center-cta">
            <a href="#services-hub" onClick={scrollToServicesHub} className="btn-hero-floating-explore" title="Explore Our Services">
              <span>Explore Our Services</span>
              <i className="fa-solid fa-arrow-down"></i>
            </a>
            {(h.videoUrl || h.heroVideoUrl) && (
              <button type="button" className="btn btn-hero-video-glass" onClick={() => setActiveVideoModal(h.videoUrl || h.heroVideoUrl)} title="Watch Process Video">
                <i className="fa-solid fa-circle-play"></i>
                <span>Watch Video</span>
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Stats Counter Bar — rendered via loop */}
        <div className="hero-stats-bar">
          {HERO_STATS.map((stat, i) => (
            <AnimatedCounter key={i} value={stat.value} label={stat.label} icon={stat.icon} />
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          2. SERVICES HUB — Auto-scrolling marquee (loop-duplicated)
          ═══════════════════════════════════════════════════════════════════════ */}
      <section className="section section-quick-services-hub reveal-init" id="services-hub" ref={hubRef}>
        <div className="container">
          <div className="section-header-editorial center reveal-init">
            <div className="eyebrow-pill teal">Logistics & Online Services Hub</div>
            <h2 className="section-title">Worldwide Courier Solutions & Direct Online Tools</h2>
            <p className="section-lead">Direct access to our international express courier network, authentic NRI food shipping, live satellite tracking, rate calculator, and customs documentation guide.</p>
          </div>

          <div className="quick-hub-marquee-wrapper">
            <div className="quick-hub-marquee-track">
              {[...SERVICE_HUB_LINKS, ...SERVICE_HUB_LINKS].map((item, idx) => (
                <Link key={`${item.to}-${idx}`} to={item.to} className="quick-hub-card">
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
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          3. BRAND STORY — Features rendered via loop
          ═══════════════════════════════════════════════════════════════════════ */}
      <section className="section brand-story-section reveal-init" id="about-story" ref={storyRef}>
        <div className="container">
          <div className="brand-story-grid">
            <div className="story-img-frame reveal-init stagger-1">
              <img src={'/assets/images/brand_story_dark_ui.jpg'} alt="Sai Couriers Global Network" loading="lazy" />
            </div>
            <div className="reveal-init stagger-2">
              <div className="eyebrow-pill teal">{bs.eyebrow || 'Our Heritage & Commitment'}</div>
              <h2>{bs.heading || 'Connecting Andhra Pradesh with the World'}</h2>
              <p style={{ fontSize: '1.05rem', lineHeight: '1.65', margin: '1rem 0' }}>{bs.paragraph1}</p>
              <p>{bs.paragraph2}</p>
              <div className="story-features-list">
                {(bs.features ? bs.features.map((f, i) => ({ icon: BRAND_FEATURES[i]?.icon || 'fa-check', text: f })) : BRAND_FEATURES).map((f, i) => (
                  <div key={f.text} className={`story-feature-item reveal-init stagger-${i + 1}`}>
                    <i className={`fa-solid ${f.icon}`}></i>
                    <span>{f.text}</span>
                  </div>
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

      {/* ═══════════════════════════════════════════════════════════════════════
          4. GLOBAL NETWORK (Text Left, Orbital Animation Right)
          ═══════════════════════════════════════════════════════════════════════ */}
      <section className="orbital-animation-section reveal-init" ref={orbitalRef}>
        <div className="orbital-bg-mesh"></div>
        <div className="container">
          <div className="orbital-grid-layout">
            <div className="orbital-text-content reveal-init">
              <div className="eyebrow-pill teal">Global Logistics Network</div>
              <h2 className="orbital-heading">Seamless Deliveries Across Continents</h2>
              <p className="orbital-description">Our advanced satellite tracking and dedicated air cargo network ensures your shipments move swiftly and securely from our hubs in Andhra Pradesh to destinations worldwide.</p>
              
              <ul className="orbital-feature-list">
                <li><i className="fa-solid fa-plane-up"></i> Direct Air Freight Partnerships</li>
                <li><i className="fa-solid fa-truck-fast"></i> First-Mile Doorstep Collection</li>
                <li><i className="fa-solid fa-satellite-dish"></i> 24/7 Real-Time Shipment Tracking</li>
                <li><i className="fa-solid fa-file-shield"></i> Export Documentation & Customs</li>
              </ul>
              
              <div style={{ marginTop: '2.5rem' }}>
                <a href="#services-hub" onClick={scrollToServicesHub} className="btn btn-teal">
                  Explore Services <i className="fa-solid fa-arrow-right"></i>
                </a>
              </div>
            </div>

            <div className="orbital-visual-content">
              <div className="orbital-container">
                {/* Orbit rings via loop */}
                {[1, 2].map(n => (
                  <div key={n} className={`orbit-ring orbit-ring-${n}`}></div>
                ))}
      
                {/* Central node */}
                <div className="orbital-center-node">
                  <i className="fa-solid fa-earth-americas"></i>
                </div>
      
                {/* Orbiting nodes — dynamic via ORBITAL_NODES array */}
                {ORBITAL_NODES.map((node, i) => (
                  <div key={node.icon} className={`orbital-node-wrapper orbit-path-${i + 1}`}>
                    <div className={`orbital-node ${node.colorClass}`}>
                      <div className="node-glow-ring"></div>
                      <i className={`fa-solid ${node.icon}`}></i>
                    </div>
                    <span className="orbital-node-label">{node.label}</span>
                  </div>
                ))}
      
                {/* Floating particles — dynamic via loop */}
                {ORBITAL_PARTICLES.map((p, i) => (
                  <div key={i} className={`orbital-particle ${p.cls}`}></div>
                ))}
              </div>
              <div className="orbital-caption">
                <span className="orbital-caption-text">Live Global Logistics Tracking Engine</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          5. SERVICES — Featured + stacked cards
          ═══════════════════════════════════════════════════════════════════════ */}
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
                <img src={'/assets/images/services_warehouse_dark_ui.jpg'} alt="Express Courier" loading="lazy" />
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
              {((sv.stackedServices && sv.stackedServices.length > 0) ? sv.stackedServices : [
                {
                  badge: 'Volume Rates',
                  title: 'Heavy Commercial Air Cargo',
                  description: 'Special discounted volume pricing for commercial B2B shipments, excess baggage, and 50kg+ shipments.'
                },
                {
                  badge: '100% Leak-Proof',
                  title: 'NRI Food & Pickles Special',
                  description: 'Authentic Indian flavors shipped globally with our certified multi-layer vacuum sealing.'
                },
                {
                  badge: 'Express Network',
                  title: 'E-commerce Fulfillment',
                  description: 'Fast, reliable logistics for local businesses selling globally, fully integrated tracking APIs.'
                }
              ]).map((s, i) => (
                <div key={i} className={`service-horizontal-box reveal-init stagger-${i + 2}`} style={i === 1 ? { borderLeft: '4px solid var(--accent-coral)' } : {}}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ background: i === 1 ? 'var(--accent-coral-soft)' : 'var(--bg-powder-blue)', color: i === 1 ? 'var(--accent-coral)' : 'var(--text-slate-dark)', fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-xs)' }}>{s.badge}</span>
                    <span style={{ color: i === 1 ? 'var(--accent-coral)' : 'var(--accent-teal)', fontWeight: 700, fontSize: '0.85rem' }}>{i === 0 ? 'Volume Rates' : i === 1 ? '100% Leak-Proof' : 'Fast Integration'}</span>
                  </div>
                  <h3>{s.title}</h3>
                  <p style={{ fontSize: '0.92rem' }}>{s.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          6. WHY CHOOSE US — Dynamic grid via loop
          ═══════════════════════════════════════════════════════════════════════ */}
      <section className="section section-why-choose-us reveal-init" id="why-choose-us" ref={whyUsRef}>
        <div className="container">
          <div className="section-header-editorial center reveal-init">
            <div className="eyebrow-pill teal">Why SAI International?</div>
            <h2 className="section-title">Trusted by Thousands Across the Globe</h2>
            <p className="section-lead">From Kadapa to the world — here's why families and businesses choose us for their most precious shipments.</p>
          </div>
          <div className="why-choose-grid">
            {WHY_CHOOSE_US.map((item, i) => (
              <div key={item.title} className={`why-choose-card reveal-init stagger-${(i % 3) + 1}`}>
                <div className="why-choose-icon-wrap">
                  <i className={`fa-solid ${item.icon}`}></i>
                </div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          7. FOOD PACKAGING — Items via loop
          ═══════════════════════════════════════════════════════════════════════ */}
      <section className="section section-peach reveal-init" id="food-packaging" ref={foodRef}>
        <div className="container">
          <div className="food-packaging-grid">
            <div className="food-packaging-img-frame reveal-init stagger-1">
              <img src={'/assets/images/food_packaging_dark_ui.jpg'} alt="Premium Vacuum Sealed Food Packaging" loading="lazy" />
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

      {/* ═══════════════════════════════════════════════════════════════════════
          8. VIDEO SHOWCASE
          ═══════════════════════════════════════════════════════════════════════ */}
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

      {/* ═══════════════════════════════════════════════════════════════════════
          9. TESTIMONIALS — Carousel with loop-rendered dots
          ═══════════════════════════════════════════════════════════════════════ */}
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

      {/* ═══════════════════════════════════════════════════════════════════════
          10. BRANCH MAP
          ═══════════════════════════════════════════════════════════════════════ */}
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
