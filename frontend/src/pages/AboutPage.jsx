import { Link } from 'react-router-dom';
import usePageContent from '../hooks/usePageContent';
import useScrollReveal from '../hooks/useScrollReveal';
import useCountUp from '../hooks/useCountUp';

function StatCard({ stat }) {
  const match = String(stat.value).match(/^([0-9]+)(.*)$/);
  const target = match ? parseInt(match[1], 10) : null;
  const suffix = match ? match[2] : '';
  const { ref, value } = useCountUp(target || 0, 1600, suffix);

  return (
    <div 
      ref={ref} 
      style={{ 
        textAlign: 'center', 
        padding: '1.25rem', 
        background: 'var(--bg-mist)', 
        borderRadius: 'var(--radius-md)', 
        border: '1px solid var(--border-light)',
        transition: 'transform 0.25s var(--anim-ease-out), box-shadow 0.25s ease'
      }}
    >
      <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--accent-teal)' }}>
        {target !== null ? value : stat.value}
      </div>
      <div style={{ fontSize: '0.85rem', color: 'var(--text-slate-muted)' }}>{stat.label}</div>
    </div>
  );
}

function SubpageHero({ eyebrow, heading, lead, breadcrumb, bgMedia }) {
  const isVideo = bgMedia && /\.(mp4|webm|ogg|mov|m4v)($|\?)/i.test(bgMedia);

  return (
    <section
      className={`page-hero-banner${bgMedia ? ' has-bg-media' : ''} reveal-init`}
      id="about-hero"
    >
      {bgMedia && (
        <div className="page-hero-backdrop">
          {isVideo ? (
            <video
              key={`about-hero-vid-${bgMedia}`}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="page-hero-media"
            >
              <source src={bgMedia} type="video/mp4" />
            </video>
          ) : (
            <img
              key={`about-hero-img-${bgMedia}`}
              src={bgMedia}
              alt={heading}
              className="page-hero-media"
            />
          )}
          <div className="page-hero-overlay"></div>
        </div>
      )}
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div className="breadcrumb-trail">
          <Link to="/">Home</Link>
          <span className="separator"><i className="fa-solid fa-chevron-right"></i></span>
          <span className="current">{breadcrumb}</span>
        </div>
        <div className="eyebrow-pill teal"><i className="fa-solid fa-circle-info"></i> {eyebrow}</div>
        <h1 className="page-hero-title">{heading}</h1>
        <p className="page-hero-lead">{lead}</p>
      </div>
    </section>
  );
}

export default function AboutPage() {
  const { content } = usePageContent('about', {});
  const h = content.hero || {};
  const s = content.story || {};
  const c = content.contact || {};

  const heroMedia = h.heroBgImage || h.image || h.videoUrl || '';
  const storyMedia = s.image || s.videoUrl || '';
  const isStoryVideo = storyMedia && /\.(mp4|webm|ogg|mov|m4v)($|\?)/i.test(storyMedia);

  const storyRef = useScrollReveal();
  const contactRef = useScrollReveal();

  return (
    <main style={{ paddingTop: heroMedia ? '0px' : '80px' }}>
      <SubpageHero
        eyebrow={h.eyebrow || 'Our Story'}
        heading={h.heading || 'About Sai International Couriers & Cargo'}
        lead={h.lead || 'Trusted courier partner serving Andhra Pradesh families & businesses.'}
        breadcrumb="About Us"
        bgMedia={heroMedia}
      />

      <section className="section reveal-init" ref={storyRef}>
        <div className="container">
          <div className="brand-story-grid">
            <div className="story-img-frame reveal-init stagger-1">
              {isStoryVideo ? (
                <video
                  key={`story-vid-${storyMedia}`}
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls
                  src={storyMedia}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', borderRadius: 'var(--radius-xl)' }}
                />
              ) : (
                <img
                  key={`story-img-${storyMedia || 'default'}`}
                  src={storyMedia || '/assets/images/sai_customer_support.jpg'}
                  alt="Sai Couriers Team"
                  loading="lazy"
                />
              )}
            </div>
            <div className="reveal-init stagger-2">
              <h2>{s.heading || 'Connecting Andhra Pradesh with the World Since Day One'}</h2>
              {(s.paragraphs || []).map((p, i) => <p key={i} style={{ marginBottom: '1rem', lineHeight: '1.7' }}>{p}</p>)}

              {s.stats && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem', marginTop: '2rem' }}>
                  {s.stats.map(stat => (
                    <StatCard key={stat.label} stat={stat} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="section section-powder-blue reveal-init" ref={contactRef}>
        <div className="container">
          <div className="section-header-editorial center">
            <div className="eyebrow-pill teal">Get in Touch</div>
            <h2>Contact Information</h2>
          </div>
          <div className="about-contact-grid">
            {[
              { icon: 'fa-phone', label: 'Phone', value: c.phone || '+91 90599 49365', href: `tel:${(c.phone || '+919059949365').replace(/\s/g, '')}` },
              { icon: 'fa-envelope', label: 'Email', value: c.email || 'saiinternationalcouriers83@gmail.com', href: `mailto:${c.email}` },
              { icon: 'fa-location-dot', label: 'Address', value: c.address || '41/1248, Co-operative Colony, Kadapa, AP' },
              { icon: 'fa-clock', label: 'Hours', value: c.hours || 'Mon–Sun: 09:00 AM – 09:30 PM' },
            ].map(item => (
              <div 
                key={item.label} 
                style={{ 
                  background: 'var(--bg-card-tint)', 
                  borderRadius: 'var(--radius-md)', 
                  padding: '1.75rem 1.5rem', 
                  border: '1px solid var(--border-light)', 
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  boxSizing: 'border-box'
                }}
              >
                <div style={{ width: '46px', height: '46px', background: 'var(--accent-teal-soft)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-teal)', fontSize: '1.15rem', marginBottom: '1rem', flexShrink: 0 }}>
                  <i className={`fa-solid ${item.icon}`}></i>
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-slate-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.35rem' }}>
                  {item.label}
                </div>
                {item.href ? (
                  <a 
                    href={item.href} 
                    style={{ 
                      fontWeight: 600, 
                      color: 'var(--accent-coral)',
                      wordBreak: 'break-word',
                      fontSize: item.label === 'Email' ? '0.9rem' : '0.95rem',
                      lineHeight: '1.45',
                      textDecoration: 'none'
                    }}
                  >
                    {item.value}
                  </a>
                ) : (
                  <div style={{ fontWeight: 600, color: 'var(--text-slate-dark)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                    {item.value}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
