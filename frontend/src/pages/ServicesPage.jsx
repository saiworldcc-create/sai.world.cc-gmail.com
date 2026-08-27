import { Link } from 'react-router-dom';
import usePageContent from '../hooks/usePageContent';
import useScrollReveal from '../hooks/useScrollReveal';

export default function ServicesPage() {
  const { content } = usePageContent('services', {});
  const hero = content.hero || {};
  const catalogRef = useScrollReveal();
  const servicesList = content.servicesList || [
    {
      id: 'express-courier',
      badge: 'Fastest Transit',
      title: 'International Air Express Courier',
      description: 'Guaranteed 4–5 business days delivery to over 195+ countries including USA, UK, Canada, Australia, Germany, UAE, and Singapore. Full milestone visibility from your doorstep to foreign delivery.',
      image: '/assets/images/courier_delivery_service.jpg',
      perks: ['4–5 Days Guaranteed Transit', 'Free Doorstep Home Pickup', 'Milestone SMS & WhatsApp Alerts', 'Duty-Prepaid / DDU Options'],
      primaryBtn: { text: 'Book Express Courier', href: 'tel:+919059949365', icon: 'fa-phone' },
      secondaryBtn: { text: 'Get Rate Quote', href: 'https://wa.me/919059949365?text=Hello%20Sai%20Couriers,%20I%20need%20a%20rate%20quote%20for%20International%20Express.', icon: 'fa-calculator' }
    },
    {
      id: 'air-cargo',
      badge: 'Commercial & Heavy Freight',
      badgeClass: 'teal',
      title: 'International Air Cargo Solutions',
      description: 'Economical air freight for commercial exports, bulk pallets, machinery spares, agricultural produce, and heavy industrial cargo originating from Kadapa and Rayalaseema commercial hubs.',
      image: '/assets/images/sai_express_cargo_jet.jpg',
      reverse: true,
      perks: ['Airport-to-Airport & Door Delivery', 'Commercial Export Invoicing', 'Palletization & Strapping', 'Customs Clearance Assistance'],
      primaryBtn: { text: 'Cargo Helpdesk: 96031 49365', href: 'tel:+919603149365', icon: 'fa-phone', isTeal: true }
    },
    {
      id: 'food-special',
      badge: 'Rayalaseema & Andhra Special',
      title: 'Special NRI Food & Homemade Pickles Shipping',
      description: 'Customs-certified packaging for authentic Andhra homemade delicacies including avakaya, gongura pickles, sweets, karam podi, snacks, and groceries. 100% leak-proof multi-layer vacuum sealed.',
      image: '/assets/images/special_food_packaging.jpg',
      perks: ['Multi-Barrier Vacuum Sealing', 'Food-Grade Airtight Canisters', 'Free Packing Box & Materials', 'US FDA & Customs Compliant'],
      primaryBtn: { text: 'View Food Shipping Guide', link: '/food-shipping', icon: 'fa-utensils' }
    },
    {
      id: 'student-baggage',
      badge: 'Students & Relocation',
      badgeClass: 'teal',
      title: 'University Documents & Student Excess Baggage',
      description: 'Priority dispatch for university application transcripts, WES credential evaluations, I-20/CAS letters, alongside heavily discounted rates for students traveling abroad with heavy personal baggage.',
      image: '/assets/images/express_doorstep_pickup.jpg',
      reverse: true,
      perks: ['Proof-of-Delivery Signature', '3–4 Days Fast Document Transit', 'Special Student Baggage Rates', 'Tamper-Proof Document Envelopes'],
      primaryBtn: { text: 'Student Desk: 90599 49365', href: 'tel:+919059949365', icon: 'fa-graduation-cap', isTeal: true }
    }
  ];

  return (
    <main style={{ paddingTop: '80px' }}>
      <section className="page-hero-banner">
        <div className="container">
          <div className="breadcrumb-trail">
            <Link to="/">Home</Link>
            <span className="separator"><i className="fa-solid fa-chevron-right"></i></span>
            <span className="current">Services Portfolio</span>
          </div>
          <div className="eyebrow-pill teal">{hero.eyebrow || 'End-to-End Solutions'}</div>
          <h1 className="page-hero-title">{hero.heading || 'Comprehensive Global Courier & Cargo Logistics'}</h1>
          <p className="page-hero-desc">
            {hero.lead || 'From time-sensitive document express to heavy air cargo and specialized food vacuum packaging, we deliver your shipments worldwide with speed, security, and door-to-door convenience.'}
          </p>
        </div>
      </section>

      <section className="section section-white reveal-init" ref={catalogRef}>
        <div className="container">
          <div className="services-catalog-grid">
            {servicesList.map((svc, index) => {
              const isReverse = svc.reverse || index % 2 === 1;
              return (
                <div key={svc.id || index} className={`service-catalog-item reveal-init stagger-${(index % 3) + 1}${isReverse ? ' reverse' : ''}`} id={svc.id}>
                  {!isReverse && (
                    <div className="service-catalog-img">
                      <img src={svc.image || '/assets/images/courier_delivery_service.jpg'} alt={svc.title} loading="lazy" />
                    </div>
                  )}
                  <div className="service-catalog-body">
                    <div className={`eyebrow-pill ${svc.badgeClass || ''}`}>{svc.badge}</div>
                    <h2 style={{ fontSize: '1.6rem', color: 'var(--text-slate-dark)', margin: 0 }}>
                      {svc.title}
                    </h2>
                    <p style={{ fontSize: '0.98rem', color: 'var(--text-slate-muted)', lineHeight: 1.65 }}>
                      {svc.description}
                    </p>
                    
                    {svc.perks && (
                      <div className="service-perks-checklist">
                        {svc.perks.map((perk, pIdx) => (
                          <div key={pIdx} className="service-perk-bullet">
                            <i className="fa-solid fa-check-circle"></i> {perk}
                          </div>
                        ))}
                      </div>
                    )}

                    <div style={{ marginTop: '0.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      {svc.primaryBtn && (
                        svc.primaryBtn.link ? (
                          <Link to={svc.primaryBtn.link} className={`btn ${svc.primaryBtn.isTeal ? 'btn-teal' : 'btn-coral'}`}>
                            {svc.primaryBtn.icon && <i className={`fa-solid ${svc.primaryBtn.icon}`}></i>} {svc.primaryBtn.text}
                          </Link>
                        ) : (
                          <a href={svc.primaryBtn.href} className={`btn ${svc.primaryBtn.isTeal ? 'btn-teal' : 'btn-coral'}`}>
                            {svc.primaryBtn.icon && <i className={`fa-solid ${svc.primaryBtn.icon}`}></i>} {svc.primaryBtn.text}
                          </a>
                        )
                      )}
                      {svc.secondaryBtn && (
                        <a href={svc.secondaryBtn.href} target="_blank" rel="noopener noreferrer" className="btn btn-soft-cream">
                          {svc.secondaryBtn.text}
                        </a>
                      )}
                    </div>
                  </div>
                  {isReverse && (
                    <div className="service-catalog-img">
                      <img src={svc.image || '/assets/images/sai_express_cargo_jet.jpg'} alt={svc.title} loading="lazy" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Free Inclusions */}
      <section className="section section-ivory">
        <div className="container">
          <div className="section-header-editorial center">
            <div className="eyebrow-pill">Zero Hidden Cost</div>
            <h2 className="section-title">Included with Every Shipment</h2>
            <p className="section-lead">Premium complimentary perks that make SAI the highest-rated courier service in Andhra Pradesh.</p>
          </div>

          <div className="values-cards-grid">
            <div className="value-item-card">
              <div className="value-icon-box"><i className="fa-solid fa-house-chimney-user"></i></div>
              <h3>Free Doorstep Collection</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-slate-muted)', lineHeight: 1.6 }}>
                Our delivery executives visit your home or office anywhere across Kadapa, Tirupati, Nellore, Proddatur, and Rayachoty at no extra cost.
              </p>
            </div>
            <div className="value-item-card">
              <div className="value-icon-box"><i className="fa-solid fa-box-open"></i></div>
              <h3>Free Box Packing & Vacuum Sealing</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-slate-muted)', lineHeight: 1.6 }}>
                Heavy-duty triple-ply corrugated cardboard boxes, bubble wrap cushioning, and multi-barrier vacuum seal are provided 100% free.
              </p>
            </div>
            <div className="value-item-card">
              <div className="value-icon-box"><i className="fa-solid fa-file-shield"></i></div>
              <h3>End-to-End Customs Assistance</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-slate-muted)', lineHeight: 1.6 }}>
                Our documentation specialists handle invoice formatting, KYC verifications, HS code tariff mapping, and destination country compliances.
              </p>
            </div>
            <div className="value-item-card">
              <div className="value-icon-box"><i className="fa-solid fa-bell"></i></div>
              <h3>Real-Time Tracking & Proactive Alerts</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-slate-muted)', lineHeight: 1.6 }}>
                Receive continuous milestone notifications via SMS and WhatsApp whenever your shipment moves through airline hubs and customs checkpoints.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
