import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

const SECTIONS = [
  { id: 'privacy-1', num: '01', title: 'Information We Collect' },
  { id: 'privacy-2', num: '02', title: 'Legal Basis & KYC Mandate' },
  { id: 'privacy-3', num: '03', title: 'How We Use Your Data' },
  { id: 'privacy-4', num: '04', title: 'Third-Party Disclosures' },
  { id: 'privacy-5', num: '05', title: 'Data Storage & Encryption' },
  { id: 'privacy-6', num: '06', title: 'Data Retention Period' },
  { id: 'privacy-7', num: '07', title: 'Your Legal Rights (DPDP)' },
  { id: 'privacy-8', num: '08', title: 'Grievance Officer Contact' },
];

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState('privacy-1');
  const [dockSide, setDockSide] = useState('left'); // Default to left side like Apple / Microsoft
  const [beamHeight, setBeamHeight] = useState(0);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);

  const itemRefs = useRef([]);
  const trackRef = useRef(null);

  // Scrollspy to detect active section as user scrolls
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });

    const handleScroll = () => {
      const winScroll = window.scrollY || document.documentElement.scrollTop;
      const scrollPos = winScroll + 170;

      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTIONS[i].id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(SECTIONS[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update Apple/Microsoft animated beam height and auto-scroll left sidebar
  useEffect(() => {
    const activeIdx = SECTIONS.findIndex((s) => s.id === activeSection);
    if (activeIdx >= 0 && itemRefs.current[activeIdx] && itemRefs.current[0]) {
      const firstEl = itemRefs.current[0];
      const activeEl = itemRefs.current[activeIdx];

      const firstCenter = firstEl.offsetTop + firstEl.offsetHeight / 2;
      const activeCenter = activeEl.offsetTop + activeEl.offsetHeight / 2;
      const height = Math.max(0, activeCenter - firstCenter);
      setBeamHeight(height);

      // Auto-scroll left sidebar so active item stays in view
      activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [activeSection]);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -90;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveSection(id);
      setMobileSheetOpen(false);
    }
  };

  const activeIndex = SECTIONS.findIndex((s) => s.id === activeSection);
  const activeNum = activeIndex >= 0 ? activeIndex + 1 : 1;

  return (
    <main style={{ paddingTop: '80px' }}>
      {/* Hero Banner */}
      <section className="page-hero-banner legal-hero-banner">
        <div className="container legal-layout-container">
          <div className="breadcrumb-trail" style={{ marginBottom: '1rem' }}>
            <Link to="/">Home</Link>
            <span className="separator"><i className="fa-solid fa-chevron-right"></i></span>
            <span className="current">Privacy &amp; Data Protection</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div className="eyebrow-pill teal" style={{ margin: 0 }}>
              <i className="fa-solid fa-user-shield" style={{ marginRight: '0.45rem', color: '#2DD4BF' }}></i>
              Data Privacy &bull; DPDP &amp; KYC Governance
            </div>
            <div className="legal-status-badge">
              <span className="status-dot-pulse"></span>
              <span>DPDP Act 2023 &bull; Compliant</span>
            </div>
          </div>

          <h1 className="page-hero-title" style={{ marginBottom: '1rem', fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', letterSpacing: '-0.02em' }}>
            Privacy Policy &amp; Data Protection
          </h1>

          <p className="page-hero-desc" style={{ maxWidth: '920px', color: '#94A3B8', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '1.75rem' }}>
            How Sai International Couriers &amp; Cargo collects, verifies, stores, and safeguards your personal identity and cross-border shipping documentation in accordance with Indian and International privacy laws.
          </p>

          {/* Quick Document Metadata Bar */}
          <div className="legal-meta-bar">
            <div className="legal-meta-items">
              <div className="legal-meta-chip">
                <i className="fa-solid fa-shield-halved" style={{ color: '#2DD4BF' }}></i>
                <span>Framework: <strong>DPDP Act 2023 &amp; IT Act 2000</strong></span>
              </div>
              <div className="legal-meta-chip">
                <i className="fa-solid fa-building-columns" style={{ color: '#2DD4BF' }}></i>
                <span>Entity: <strong>Sai International Couriers &amp; Cargo</strong></span>
              </div>
              <div className="legal-meta-chip">
                <i className="fa-solid fa-stamp" style={{ color: '#2DD4BF' }}></i>
                <span>GSTIN: <strong>37BOPPS1122H1ZS</strong></span>
              </div>
              <div className="legal-meta-chip">
                <i className="fa-solid fa-calendar-check" style={{ color: '#2DD4BF' }}></i>
                <span>Effective: <strong>November 2026</strong></span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => window.print()}
              className="legal-print-btn"
              title="Print or Save PDF"
              style={{ color: '#2DD4BF', borderColor: 'rgba(45, 212, 191, 0.35)', background: 'rgba(45, 212, 191, 0.12)' }}
            >
              <i className="fa-solid fa-print"></i>
              <span>Print / PDF</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Privacy Content with Apple/Microsoft Animated Timeline Navigation */}
      <section className="section section-ivory" style={{ padding: '2.5rem 0 5rem 0' }}>
        <div className="container legal-layout-container">

          <div className={`legal-layout-grid dock-${dockSide}`}>

            {/* APPLE / MICROSOFT STYLE TIMELINE SIDEBAR (Left side by default) */}
            <aside className="legal-sidebar-col">
              <div className="apple-timeline-card">

                {/* Timeline Header */}
                <div className="apple-timeline-header">
                  <div className="apple-timeline-title teal-theme">
                    <i className="fa-solid fa-shield-halved"></i>
                    <span>Privacy Journey</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <span className="apple-timeline-counter teal-theme">
                      {activeNum} of {SECTIONS.length}
                    </span>
                    <button
                      type="button"
                      onClick={() => setDockSide(prev => prev === 'left' ? 'right' : 'left')}
                      className="legal-dock-toggle-btn"
                      title={`Dock to ${dockSide === 'left' ? 'right' : 'left'} side`}
                    >
                      <i className="fa-solid fa-arrows-left-right"></i>
                      <span>{dockSide === 'left' ? 'Right' : 'Left'}</span>
                    </button>
                  </div>
                </div>

                {/* Connected Vertical Timeline Track */}
                <div className="apple-timeline-track-wrap" ref={trackRef}>
                  
                  {/* Static background spine line connecting all points */}
                  <div className="apple-timeline-base-line" />

                  {/* Animated Glowing Progress Beam covering until current point */}
                  <div
                    className="apple-timeline-active-beam teal-theme"
                    style={{ height: `${beamHeight}px` }}
                  />

                  {/* Timeline Points (Nodes) */}
                  {SECTIONS.map((sec, idx) => {
                    const isActive = activeSection === sec.id;
                    const isPassed = idx < activeIndex;

                    return (
                      <button
                        key={sec.id}
                        ref={(el) => (itemRefs.current[idx] = el)}
                        type="button"
                        onClick={() => scrollToSection(sec.id)}
                        className={`apple-timeline-item ${isActive ? 'active teal-theme' : ''} ${isPassed ? 'passed teal-theme' : ''}`}
                        title={sec.title}
                      >
                        {/* Connected Node */}
                        <span className="apple-timeline-node">
                          {isPassed ? (
                            <i className="fa-solid fa-check" style={{ fontSize: '0.62rem' }}></i>
                          ) : (
                            sec.num
                          )}
                        </span>

                        {/* Title Text */}
                        <span className="apple-timeline-text">
                          <span className="apple-timeline-name">{sec.title}</span>
                        </span>

                        {/* Active Glowing Pip */}
                        {isActive && <span className="legal-nav-active-pip teal-theme" />}
                      </button>
                    );
                  })}
                </div>

                {/* Timeline Footer Controls */}
                <div className="apple-timeline-footer">
                  <button
                    type="button"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="legal-sidebar-btn teal-theme"
                    title="Back to Top"
                  >
                    <i className="fa-solid fa-arrow-up"></i>
                    <span>Top</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="legal-sidebar-btn teal-theme"
                    title="Print Document"
                  >
                    <i className="fa-solid fa-print"></i>
                    <span>Print</span>
                  </button>
                </div>

              </div>
            </aside>

            {/* MAIN CONTENT COLUMN */}
            <div className="legal-main-col">

              {/* Privacy Trust Card */}
              <div className="legal-notice-banner teal-theme">
                <div className="legal-notice-header teal-theme">
                  <i className="fa-solid fa-lock"></i>
                  Our Unconditional Privacy Guarantee
                </div>
                <p className="legal-notice-body">
                  <strong>SAI INTERNATIONAL COURIERS &amp; CARGO</strong> is committed to preserving the confidentiality of your personal shipping data and KYC records. We <strong>never sell, lease, or monetize</strong> your personal details or government ID copies to third-party marketing companies. Data is collected solely to execute cross-border air cargo transport, satisfy statutory Indian Customs (CBIC) mandates, and ensure secure doorstep delivery worldwide.
                </p>
              </div>

              {/* Legal Document Card */}
              <div className="legal-document-card">

                {/* Document Header */}
                <div className="legal-document-card-header">
                  <h2 className="legal-document-h2">
                    Customer Data Protection &amp; KYC Privacy Policy
                  </h2>
                  <div className="legal-document-meta-grid">
                    <div>
                      <strong>Statutory Framework:</strong> Digital Personal Data Protection (DPDP) Act, 2023 &amp; IT Act, 2000<br />
                      <strong>Operating Entity:</strong> Sai International Couriers &amp; Cargo
                    </div>
                    <div>
                      <strong>GSTIN:</strong> 37BOPPS1122H1ZS<br />
                      <strong>Head Office:</strong> 41/1248, Ratna Sabhapathi Building, Kadapa, AP - 516001
                    </div>
                    <div>
                      <strong>Executive Oversight:</strong> Managing Directors <strong>S. Junaid Mohuddin</strong> &amp; <strong>S. Chandra Vadu</strong>
                    </div>
                  </div>
                </div>

                {/* Section 1 */}
                <div id="privacy-1" className="legal-section-block">
                  <div className="legal-section-header">
                    <span className="legal-section-badge teal-theme">01</span>
                    <h3 className="legal-section-title teal-theme">Information We Collect</h3>
                  </div>
                  <p className="legal-section-p">
                    To fulfill our logistics obligations and satisfy statutory government aviation and customs rules, Sai Couriers collects the following categories of information:
                  </p>
                  <ul className="legal-section-list">
                    <li><strong>Contact Information:</strong> Full legal names, physical origin and delivery addresses, mobile numbers, and email addresses of both Shipper (Sender) and Consignee (Receiver).</li>
                    <li><strong>Statutory Sender KYC Records:</strong> Government-issued identification (Aadhaar Card, Indian Passport, Driving License, or Voter ID) and PAN Card copies.</li>
                    <li><strong>Shipment Manifest Details:</strong> Item descriptions, declared value, invoice amounts, HS codes, gross weight, volumetric dimensions, and specialized packaging instructions.</li>
                    <li><strong>Digital &amp; Transaction Data:</strong> IP address, browser type, booking timestamps, online payment transaction identifiers (processed securely via PCI-DSS certified gateways; we never store raw credit card numbers or banking passwords).</li>
                  </ul>
                </div>

                {/* Section 2 */}
                <div id="privacy-2" className="legal-section-block">
                  <div className="legal-section-header">
                    <span className="legal-section-badge teal-theme">02</span>
                    <h3 className="legal-section-title teal-theme">Legal Basis &amp; Why We Collect KYC Data</h3>
                  </div>
                  <p className="legal-section-p">
                    2.1. <strong>Customs &amp; Aviation Mandate:</strong> Under regulations prescribed by the <strong>Central Board of Indirect Taxes &amp; Customs (CBIC)</strong> and the <strong>Bureau of Civil Aviation Security (BCAS)</strong>, every international parcel departing India must be accompanied by verified KYC documentation linking the shipment to an identifiable legal individual or entity.
                  </p>
                  <p className="legal-section-p">
                    2.2. KYC data is collected solely to:
                  </p>
                  <ul className="legal-section-list">
                    <li>Generate the official export shipping declaration (Courier Shipping Bill - CSB IV/V);</li>
                    <li>Comply with anti-money laundering (AML) and anti-narcotics screening directives;</li>
                    <li>Ensure smooth customs clearance without destination holding or confiscation.</li>
                  </ul>
                </div>

                {/* Section 3 */}
                <div id="privacy-3" className="legal-section-block">
                  <div className="legal-section-header">
                    <span className="legal-section-badge teal-theme">03</span>
                    <h3 className="legal-section-title teal-theme">How We Use Your Data</h3>
                  </div>
                  <p className="legal-section-p">
                    We process your personal information strictly for legitimate commercial and operational purposes:
                  </p>
                  <ul className="legal-section-list">
                    <li>Generating and printing official Air Waybills (AWBs) and barcoded shipping labels;</li>
                    <li>Dispatching mobile doorstep pickup vehicles to your home or office;</li>
                    <li>Transmitting flight cargo manifests to scheduled international airlines operating from Rajiv Gandhi International Airport (RGIA) Hyderabad;</li>
                    <li>Providing real-time automated tracking alerts via SMS, WhatsApp, and email;</li>
                    <li>Resolving shipment inquiries, claims, and providing customer care assistance.</li>
                  </ul>
                </div>

                {/* Section 4 */}
                <div id="privacy-4" className="legal-section-block">
                  <div className="legal-section-header">
                    <span className="legal-section-badge teal-theme">04</span>
                    <h3 className="legal-section-title teal-theme">Third-Party Disclosures &amp; International Forwarders</h3>
                  </div>
                  <p className="legal-section-p">
                    4.1. <strong>Operational Forwarding Partners:</strong> To execute end-to-end global delivery across 195+ destination countries, consignment manifests and customs invoices are shared securely with verified international logistics networks (such as DHL Express, FedEx, UPS, Aramex, and local national postal authorities).
                  </p>
                  <p className="legal-section-p">
                    4.2. <strong>Statutory Authorities:</strong> We are legally obligated to disclose shipping records and identity credentials to law enforcement, Indian Customs, CISF airport security, and destination customs authorities upon receipt of a lawful warrant or regulatory audit notice.
                  </p>
                </div>

                {/* Section 5 */}
                <div id="privacy-5" className="legal-section-block">
                  <div className="legal-section-header">
                    <span className="legal-section-badge teal-theme">05</span>
                    <h3 className="legal-section-title teal-theme">Data Storage, Security &amp; Encryption</h3>
                  </div>
                  <p className="legal-section-p">
                    5.1. All web traffic between your browser and our booking portals is protected by <strong>HTTPS 256-Bit SSL/TLS Encryption</strong>.
                  </p>
                  <p className="legal-section-p">
                    5.2. Customer KYC files and government identification scans are housed in password-protected, encrypted digital repositories accessible only to authorized customs filing managers. Physical paper manifests are stored under lock and key at our central hub in Kadapa.
                  </p>
                </div>

                {/* Section 6 */}
                <div id="privacy-6" className="legal-section-block">
                  <div className="legal-section-header">
                    <span className="legal-section-badge teal-theme">06</span>
                    <h3 className="legal-section-title teal-theme">Data Retention Period</h3>
                  </div>
                  <p className="legal-section-p">
                    Under the Indian Customs Act and export documentation regulations, international shipping manifests and supporting KYC records must be retained for a statutory audit period of <strong>five (5) to seven (7) years</strong> following the financial year of export. Once the statutory retention period expires, files are permanently shredded or cryptographically deleted.
                  </p>
                </div>

                {/* Section 7 */}
                <div id="privacy-7" className="legal-section-block">
                  <div className="legal-section-header">
                    <span className="legal-section-badge teal-theme">07</span>
                    <h3 className="legal-section-title teal-theme">Your Legal Rights (DPDP Act 2023)</h3>
                  </div>
                  <p className="legal-section-p">
                    Subject to mandatory customs and statutory retention requirements, you have the right to:
                  </p>
                  <ul className="legal-section-list">
                    <li>Request confirmation and summary of personal data held about you;</li>
                    <li>Request correction of inaccurate or outdated contact details;</li>
                    <li>Withdraw consent for optional promotional alerts via SMS or WhatsApp;</li>
                    <li>File a grievance regarding data handling with our designated Data Grievance Officer.</li>
                  </ul>
                </div>

                {/* Section 8 */}
                <div id="privacy-8" className="legal-section-block" style={{ marginBottom: '1.5rem' }}>
                  <div className="legal-section-header">
                    <span className="legal-section-badge teal-theme">08</span>
                    <h3 className="legal-section-title teal-theme">Grievance Officer &amp; Privacy Contact</h3>
                  </div>
                  <p className="legal-section-p">
                    In accordance with the <strong>Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011</strong> and the <strong>DPDP Act, 2023</strong>, the contact details for our Grievance Officer are:
                  </p>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '1.25rem 1.5rem',
                    margin: '1rem 0',
                    lineHeight: 1.75,
                    fontSize: '0.92rem'
                  }}>
                    <strong style={{ color: '#FFFFFF', fontSize: '1rem' }}>Data Protection &amp; Grievance Redressal Desk</strong><br />
                    Attn: <strong>S. Junaid Mohuddin &amp; S. Chandra Vadu (Managing Directors)</strong><br />
                    Entity: <strong>Sai International Couriers &amp; Cargo</strong><br />
                    Address: 41/1248, Ratna Sabhapathi Building, Co-operative Colony, Kadapa, AP - 516001, India<br />
                    Official Email: <strong>saiinternationalcouriers83@gmail.com</strong><br />
                    Direct Privacy Desk: <strong>+91 90599 49365</strong> | <strong>+91 90000 22821</strong> | <strong>+91 90008 67874</strong>
                  </div>
                </div>

                {/* Support and Legal Contact Footer */}
                <div className="legal-card-footer">
                  <div>
                    <strong style={{ color: '#FFFFFF', fontSize: '0.95rem' }}>Need Help with KYC or Tracking Privacy?</strong><br />
                    <span style={{ color: '#94A3B8' }}>Our customer support team is available Mon-Sun: 9:00 AM - 9:30 PM IST</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <Link to="/terms" className="btn btn-teal btn-sm">
                      <i className="fa-solid fa-file-contract"></i> View Terms &amp; Conditions
                    </Link>
                    <Link to="/help-center" className="btn btn-soft-cream btn-sm">
                      <i className="fa-solid fa-circle-question"></i> Help Center
                    </Link>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Mobile Floating Action Button (FAB) */}
      <button
        type="button"
        onClick={() => setMobileSheetOpen(true)}
        className="legal-mobile-fab teal-theme"
        aria-label="Open Privacy Table of Contents"
      >
        <i className="fa-solid fa-list-ol"></i>
        <span>Clauses ({activeNum}/8)</span>
      </button>

      {/* Mobile Bottom Sheet Modal */}
      {mobileSheetOpen && (
        <div
          className="legal-mobile-sheet-backdrop"
          onClick={() => setMobileSheetOpen(false)}
        >
          <div
            className="legal-mobile-sheet"
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#FFFFFF', fontWeight: 800 }}>
                <i className="fa-solid fa-shield-halved" style={{ color: '#2DD4BF' }}></i>
                <span>Privacy Clauses</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileSheetOpen(false)}
                style={{ background: 'none', border: 'none', color: '#94A3B8', fontSize: '1.25rem', cursor: 'pointer' }}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
              {SECTIONS.map((sec) => (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => scrollToSection(sec.id)}
                  className={`legal-nav-link-btn ${activeSection === sec.id ? 'active teal-theme' : ''}`}
                  style={{ padding: '0.75rem' }}
                >
                  <span className="legal-nav-num-badge">{sec.num}</span>
                  <span className="legal-nav-text-col">
                    <span className="legal-nav-title-text">{sec.title}</span>
                  </span>
                  {activeSection === sec.id && <span className="legal-nav-active-pip teal-theme" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
