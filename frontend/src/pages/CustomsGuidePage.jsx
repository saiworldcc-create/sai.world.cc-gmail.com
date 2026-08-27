import { Link } from 'react-router-dom';
import usePageContent from '../hooks/usePageContent';

export default function CustomsGuidePage() {
  const { content } = usePageContent('customs-guide', {});
  const hero = content.hero || {};

  return (
    <main style={{ paddingTop: '80px' }}>
      <section className="page-hero-banner">
        <div className="container">
          <div className="breadcrumb-trail">
            <Link to="/">Home</Link>
            <span className="separator"><i className="fa-solid fa-chevron-right"></i></span>
            <span className="current">Customs & KYC Documentation Guide</span>
          </div>
          <div className="eyebrow-pill teal">{hero.eyebrow || 'Compliance & Smooth Clearance'}</div>
          <h1 className="page-hero-title">{hero.heading || 'International Shipping Documentation & Prohibited Goods'}</h1>
          <p className="page-hero-desc">
            {hero.lead || 'Learn what paperwork is needed for international air courier dispatch, how to declare your parcel items, and review restricted goods to avoid foreign customs delays.'}
          </p>
        </div>
      </section>

      {/* Mandatory KYC */}
      <section className="section section-white">
        <div className="container">
          <div className="section-header-editorial center">
            <div className="eyebrow-pill">Mandatory Requirements</div>
            <h2 className="section-title">KYC Documents Needed from Sender</h2>
            <p className="section-lead">As mandated by Indian Customs & International Aviation Security regulations.</p>
          </div>

          <div className="kyc-requirements-grid">
            <div className="kyc-doc-card">
              <div style={{ fontSize: '2rem', color: 'var(--accent-teal)' }}><i className="fa-solid fa-id-card"></i></div>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-slate-dark)', margin: 0 }}>1. Government Photo ID</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-slate-muted)', lineHeight: 1.6, margin: 0 }}>
                One clear self-attested photocopy of the sender's <strong>Aadhaar Card, Passport, or Voter ID Card</strong>. Both front and back pages must be clear.
              </p>
            </div>

            <div className="kyc-doc-card">
              <div style={{ fontSize: '2rem', color: 'var(--accent-coral)' }}><i className="fa-solid fa-file-invoice"></i></div>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-slate-dark)', margin: 0 }}>2. PAN Card Copy</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-slate-muted)', lineHeight: 1.6, margin: 0 }}>
                A copy of the sender's <strong>PAN Card</strong> is required for customs reporting on all international outward personal and commercial air shipments.
              </p>
            </div>

            <div className="kyc-doc-card">
              <div style={{ fontSize: '2rem', color: 'var(--accent-teal)' }}><i className="fa-solid fa-map-location-dot"></i></div>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-slate-dark)', margin: 0 }}>3. Consignee Details</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-slate-muted)', lineHeight: 1.6, margin: 0 }}>
                Complete foreign receiver information including <strong>Full Name, Street Address, City, Zip/Postal Code, Country, and Active Contact Phone Number</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Prohibited Items */}
      <section className="section section-ivory">
        <div className="container">
          <div className="section-header-editorial center">
            <div className="eyebrow-pill" style={{ background: 'rgba(233, 120, 86, 0.15)', color: 'var(--accent-coral)', borderColor: 'rgba(233, 120, 86, 0.3)' }}>
              Aviation Safety Rules
            </div>
            <h2 className="section-title">Prohibited & Restricted Items</h2>
            <p className="section-lead">The following items are strictly banned from international air cargo transport under IATA regulations.</p>
          </div>

          <div className="prohibited-categories-grid">
            <div className="prohibited-category-card">
              <div className="prohibited-icon-danger"><i className="fa-solid fa-fire-flame-curved"></i></div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--text-slate-dark)', margin: 0 }}>Flammable Liquids & Aerosols</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-slate-muted)', lineHeight: 1.55, margin: 0 }}>
                Perfumes, deodorants, nail polish, paints, thinner, lighters, matchboxes, alcohol, and pressurized gas spray cans.
              </p>
            </div>

            <div className="prohibited-category-card">
              <div className="prohibited-icon-danger"><i className="fa-solid fa-coins"></i></div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--text-slate-dark)', margin: 0 }}>Currency & Precious Bullion</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-slate-muted)', lineHeight: 1.55, margin: 0 }}>
                Currency notes (Indian Rupees or foreign cash), coins, gold coins/bars, raw silver, and bearer negotiable bonds.
              </p>
            </div>

            <div className="prohibited-category-card">
              <div className="prohibited-icon-danger"><i className="fa-solid fa-battery-half"></i></div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--text-slate-dark)', margin: 0 }}>Loose Lithium Batteries</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-slate-muted)', lineHeight: 1.55, margin: 0 }}>
                Standalone power banks, loose lithium-ion battery cells, or uninstalled batteries without equipment.
              </p>
            </div>

            <div className="prohibited-category-card">
              <div className="prohibited-icon-danger"><i className="fa-solid fa-skull-crossbones"></i></div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--text-slate-dark)', margin: 0 }}>Dangerous Chemicals & Narcotics</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-slate-muted)', lineHeight: 1.55, margin: 0 }}>
                Bleaches, corrosive acids, toxic pesticides, narcotics, illegal substances, and chemical reagents.
              </p>
            </div>

            <div className="prohibited-category-card">
              <div className="prohibited-icon-danger"><i className="fa-solid fa-gun"></i></div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--text-slate-dark)', margin: 0 }}>Weapons & Replica Arms</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-slate-muted)', lineHeight: 1.55, margin: 0 }}>
                Firearms, ammunition, knives, swords, tactical gear, toy replica guns, fireworks, and explosives.
              </p>
            </div>

            <div className="prohibited-category-card">
              <div className="prohibited-icon-danger"><i className="fa-solid fa-seedling"></i></div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--text-slate-dark)', margin: 0 }}>Raw Seeds, Plants & Live Organisms</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-slate-muted)', lineHeight: 1.55, margin: 0 }}>
                Live plants, fertile agricultural seeds, soil samples, insects, live pets, and fresh raw meat cuts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Proforma Invoice / Packaging Tips */}
      <section className="section section-white">
        <div className="container">
          <div className="section-header-editorial center">
            <div className="eyebrow-pill teal">Smooth Export Process</div>
            <h2 className="section-title">How SAI Simplifies Customs Clearance for You</h2>
            <p className="section-lead">You don't need to worry about complex paperwork — our staff handles it all.</p>
          </div>

          <div className="values-cards-grid">
            <div className="value-item-card">
              <div className="value-icon-box"><i className="fa-solid fa-file-signature"></i></div>
              <h3>Automated Proforma Invoicing</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-slate-muted)', lineHeight: 1.6 }}>
                We generate the official itemized declaration invoice with accurate HS code descriptions for smooth customs green-channel clearance.
              </p>
            </div>

            <div className="value-item-card">
              <div className="value-icon-box"><i className="fa-solid fa-stamp"></i></div>
              <h3>US FDA Prior Notice Assistance</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-slate-muted)', lineHeight: 1.6 }}>
                For food items destined for the United States, our team files all mandatory electronic notifications to prevent border detention.
              </p>
            </div>

            <div className="value-item-card">
              <div className="value-icon-box"><i className="fa-solid fa-shield-halved"></i></div>
              <h3>Authorized Indian Customs Filing</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-slate-muted)', lineHeight: 1.6 }}>
                Operating under valid Indian GSTIN and courier export authorizations ensuring 100% legal, documented transit through international airports.
              </p>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/book-pickup" className="btn btn-coral btn-lg">
              <i className="fa-solid fa-truck-fast"></i> Book Pickup with Complete Customs Support
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
