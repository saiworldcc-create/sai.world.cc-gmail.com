import { Link } from 'react-router-dom';
import usePageContent from '../../hooks/usePageContent';
import useScrollReveal from '../../hooks/useScrollReveal';
import useCountUp from '../../hooks/useCountUp';

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
      className={`page-hero-banner${bgMedia ? ' has-bg-media' : ''}`}
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
        <p className="page-hero-desc">{lead}</p>
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
              <h2>{(!s.heading || s.heading.includes('Andhra Pradesh')) ? 'Connecting India with the World Since Day One' : s.heading}</h2>
              {(s.paragraphs && s.paragraphs.length > 0 ? s.paragraphs : [
                "Sai International Couriers & Cargo was established with one clear mission — to provide families, students, and commercial exporters across India, Andhra Pradesh, and Telangana with a reliable, affordable, and transparent international courier solution.",
                "Under the visionary leadership of Managing Directors S. Junaid Mohuddin and S. Chandra Vadu, we have grown from our founding office in Kadapa to a premier global shipping network serving thousands of satisfied NRI families and commercial exporters every month across major Indian metros and regional hubs.",
                "Our specialization in NRI food shipping — particularly homemade pickles, sweets, and traditional snacks — sets us apart in the industry. We understand the emotional value of these packages and treat each one with extraordinary care."
              ]).map((p, i) => {
                const formatted = p.replace(/(S\.\s*Junaid\s+Mohuddin|S\.\s*Chandra\s+Vadu|Managing\s+Directors?)/gi, '<strong>$1</strong>');
                return (
                  <p 
                    key={i} 
                    style={{ marginBottom: '1rem', lineHeight: '1.75', fontSize: '1.05rem' }}
                    dangerouslySetInnerHTML={{ __html: formatted }}
                  />
                );
              })}

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

      {/* Executive Leadership Section (SEO Optimized) */}
      <section 
        className="section section-leadership reveal-init" 
        style={{ 
          background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)', 
          padding: '5rem 0',
          borderTop: '1px solid var(--border-light, #e2e8f0)',
          borderBottom: '1px solid var(--border-light, #e2e8f0)'
        }}
        itemScope 
        itemType="https://schema.org/Organization"
      >
        <meta itemProp="name" content="Sai International Couriers & Cargo" />
        <meta itemProp="url" content="https://saiexpresscourier.com" />

        {/* JSON-LD Schema Structured Data for Search Engines */}
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LogisticsService",
              "name": "Sai International Couriers & Cargo",
              "url": "https://saiexpresscourier.com/about",
              "founder": [
                {
                  "@type": "Person",
                  "name": "S. Junaid Mohuddin",
                  "jobTitle": "Managing Director"
                },
                {
                  "@type": "Person",
                  "name": "S. Chandra Vadu",
                  "jobTitle": "Managing Director"
                }
              ],
              "employee": [
                {
                  "@type": "Person",
                  "name": "S. Junaid Mohuddin",
                  "jobTitle": "Managing Director"
                },
                {
                  "@type": "Person",
                  "name": "S. Chandra Vadu",
                  "jobTitle": "Managing Director"
                }
              ]
            })
          }}
        />

        <div className="container">
          <div className="section-header-editorial center" style={{ textAlign: 'center', maxWidth: '850px', margin: '0 auto 3.5rem' }}>
            <div 
              className="eyebrow-pill teal" 
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                padding: '0.45rem 1.25rem', 
                borderRadius: '999px', 
                background: 'rgba(13, 148, 136, 0.1)', 
                color: '#0d9488', 
                fontWeight: 800, 
                fontSize: '0.9rem', 
                marginBottom: '1rem', 
                textTransform: 'uppercase', 
                letterSpacing: '1px' 
              }}
            >
              <i className="fa-solid fa-award"></i> Executive Leadership
            </div>
            <h2 style={{ fontSize: 'clamp(2.1rem, 4vw, 2.85rem)', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px', marginBottom: '1rem' }}>
              Meet Our Managing Directors
            </h2>
            <p style={{ fontSize: '1.125rem', color: '#64748b', lineHeight: 1.75 }}>
              Steering Sai International Couriers &amp; Cargo with strategic vision, global logistics excellence, and dedicated service to Andhra Pradesh and our worldwide NRI community.
            </p>
          </div>

          <div 
            className="directors-grid"
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', 
              gap: '2rem', 
              maxWidth: '960px', 
              margin: '0 auto' 
            }}
          >
            {/* Director 1: S. Junaid Mohuddin */}
            <article 
              className="director-card" 
              itemScope 
              itemType="https://schema.org/Person" 
              itemProp="employee"
              style={{
                background: '#ffffff',
                borderRadius: '1.25rem',
                padding: '2.75rem 2.25rem',
                border: '2px solid rgba(13, 148, 136, 0.25)',
                boxShadow: '0 20px 35px -10px rgba(13, 148, 136, 0.12), 0 10px 15px -5px rgba(15, 23, 42, 0.05)',
                textAlign: 'center',
                position: 'relative'
              }}
            >
              <div 
                style={{ 
                  width: '96px', 
                  height: '96px', 
                  margin: '0 auto 1.5rem', 
                  borderRadius: '50%', 
                  background: 'linear-gradient(135deg, #0d9488 0%, #0284c7 100%)', 
                  color: '#ffffff', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '2.25rem', 
                  fontWeight: 900,
                  boxShadow: '0 10px 25px rgba(13, 148, 136, 0.35)'
                }}
              >
                JM
              </div>
              <h3 
                itemProp="name" 
                style={{ 
                  fontSize: '2rem', 
                  fontWeight: 900, 
                  color: '#0f172a', 
                  marginBottom: '0.5rem',
                  letterSpacing: '-0.5px' 
                }}
              >
                S. Junaid Mohuddin
              </h3>
              <div 
                itemProp="jobTitle" 
                style={{ 
                  display: 'inline-block',
                  background: 'rgba(13, 148, 136, 0.12)',
                  color: '#0f766e',
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  padding: '0.4rem 1.35rem',
                  borderRadius: '999px',
                  marginBottom: '1.35rem',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase'
                }}
              >
                Managing Director
              </div>
              <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.7, margin: 0 }}>
                Leading international air freight operations, customs compliance, and commercial carrier partnerships across the USA, UK, Canada, Australia, and the Middle East.
              </p>
            </article>

            {/* Director 2: S. Chandra Vadu */}
            <article 
              className="director-card" 
              itemScope 
              itemType="https://schema.org/Person" 
              itemProp="employee"
              style={{
                background: '#ffffff',
                borderRadius: '1.25rem',
                padding: '2.75rem 2.25rem',
                border: '2px solid rgba(2, 132, 199, 0.25)',
                boxShadow: '0 20px 35px -10px rgba(2, 132, 199, 0.12), 0 10px 15px -5px rgba(15, 23, 42, 0.05)',
                textAlign: 'center',
                position: 'relative'
              }}
            >
              <div 
                style={{ 
                  width: '96px', 
                  height: '96px', 
                  margin: '0 auto 1.5rem', 
                  borderRadius: '50%', 
                  background: 'linear-gradient(135deg, #0284c7 0%, #1e40af 100%)', 
                  color: '#ffffff', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '2.25rem', 
                  fontWeight: 900,
                  boxShadow: '0 10px 25px rgba(2, 132, 199, 0.35)'
                }}
              >
                CV
              </div>
              <h3 
                itemProp="name" 
                style={{ 
                  fontSize: '2rem', 
                  fontWeight: 900, 
                  color: '#0f172a', 
                  marginBottom: '0.5rem',
                  letterSpacing: '-0.5px' 
                }}
              >
                S. Chandra Vadu
              </h3>
              <div 
                itemProp="jobTitle" 
                style={{ 
                  display: 'inline-block',
                  background: 'rgba(2, 132, 199, 0.12)',
                  color: '#0369a1',
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  padding: '0.4rem 1.35rem',
                  borderRadius: '999px',
                  marginBottom: '1.35rem',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase'
                }}
              >
                Managing Director
              </div>
              <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.7, margin: 0 }}>
                Directing regional logistics networks across Kadapa, Tirupati, Nellore, and Hyderabad, with specialized leadership in NRI homemade food and vacuum packaging care.
              </p>
            </article>
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
