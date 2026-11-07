import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

const SECTIONS = [
  { id: 'section-1', num: '01', title: 'Carriage Contract & AWB' },
  { id: 'section-2', num: '02', title: "Shipper's Warranties & KYC" },
  { id: 'section-3', num: '03', title: 'Dangerous & Prohibited Goods' },
  { id: 'section-4', num: '04', title: 'Limitation of Liability' },
  { id: 'section-5', num: '05', title: 'Customs Clearance & Duties' },
  { id: 'section-6', num: '06', title: 'Homemade Food & Pickles' },
  { id: 'section-7', num: '07', title: 'Security & X-Ray Inspection' },
  { id: 'section-8', num: '08', title: 'Transit & Force Majeure' },
  { id: 'section-9', num: '09', title: 'Claims & Notice Deadlines' },
  { id: 'section-10', num: '10', title: 'Governing Law & Jurisdiction' },
];

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState('section-1');
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
            <span className="current">Terms &amp; Conditions</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div className="eyebrow-pill teal" style={{ margin: 0 }}>
              <i className="fa-solid fa-scale-balanced" style={{ marginRight: '0.45rem', color: '#38BDF8' }}></i>
              Contract of Carriage &bull; Air Waybill Terms
            </div>
            <div className="legal-status-badge">
              <span className="status-dot-pulse"></span>
              <span>Legally Binding &bull; Verified 2026</span>
            </div>
          </div>

          <h1 className="page-hero-title" style={{ marginBottom: '1rem', fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', letterSpacing: '-0.02em' }}>
            Terms &amp; Conditions of Service
          </h1>

          <p className="page-hero-desc" style={{ maxWidth: '920px', color: '#94A3B8', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '1.75rem' }}>
            Official Air Waybill (AWB) Conditions of Carriage, Shipper Warranties, Limitation of Carrier Liability under Montreal &amp; Warsaw Conventions, Customs Governance, and Legal Jurisdiction for International Air Courier &amp; Cargo Operations.
          </p>

          {/* Quick Document Metadata Bar */}
          <div className="legal-meta-bar">
            <div className="legal-meta-items">
              <div className="legal-meta-chip">
                <i className="fa-solid fa-building-columns"></i>
                <span>Entity: <strong>Sai International Couriers &amp; Cargo</strong></span>
              </div>
              <div className="legal-meta-chip">
                <i className="fa-solid fa-stamp"></i>
                <span>GSTIN: <strong>37BOPPS1122H1ZS</strong></span>
              </div>
              <div className="legal-meta-chip">
                <i className="fa-solid fa-location-dot"></i>
                <span>Jurisdiction: <strong>Kadapa, AP, India</strong></span>
              </div>
              <div className="legal-meta-chip">
                <i className="fa-solid fa-clock-rotate-left"></i>
                <span>Last Updated: <strong>January 2026</strong></span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => window.print()}
              className="legal-print-btn"
              title="Print or Save PDF"
            >
              <i className="fa-solid fa-print"></i>
              <span>Print / PDF</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content with Apple/Microsoft Animated Timeline Navigation */}
      <section className="section section-ivory" style={{ padding: '2.5rem 0 5rem 0' }}>
        <div className="container legal-layout-container">

          <div className={`legal-layout-grid dock-${dockSide}`}>

            {/* APPLE / MICROSOFT STYLE TIMELINE SIDEBAR (Left side by default) */}
            <aside className="legal-sidebar-col">
              <div className="apple-timeline-card">

                {/* Timeline Header */}
                <div className="apple-timeline-header">
                  <div className="apple-timeline-title">
                    <i className="fa-solid fa-timeline"></i>
                    <span>Document Journey</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <span className="apple-timeline-counter">
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
                    className="apple-timeline-active-beam"
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
                        className={`apple-timeline-item ${isActive ? 'active' : ''} ${isPassed ? 'passed' : ''}`}
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
                        {isActive && <span className="legal-nav-active-pip" />}
                      </button>
                    );
                  })}
                </div>

                {/* Timeline Footer Controls */}
                <div className="apple-timeline-footer">
                  <button
                    type="button"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="legal-sidebar-btn"
                    title="Back to Top"
                  >
                    <i className="fa-solid fa-arrow-up"></i>
                    <span>Top</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="legal-sidebar-btn"
                    title="Print Document"
                  >
                    <i className="fa-solid fa-print"></i>
                    <span>Print</span>
                  </button>
                </div>

              </div>
            </aside>

            {/* MAIN LEGAL DOCUMENT COLUMN */}
            <div className="legal-main-col">

              {/* Legal Notice Callout */}
              <div className="legal-notice-banner">
                <div className="legal-notice-header">
                  <i className="fa-solid fa-circle-exclamation"></i>
                  Important Legal Notice to Shipper / Consignor
                </div>
                <p className="legal-notice-body">
                  By tendering goods, documents, or parcels to <strong>SAI INTERNATIONAL COURIERS &amp; CARGO</strong> ("Carrier"), signing any physical or digital Air Waybill ("AWB"), or scheduling an order online/offline, the Sender ("Shipper") unconditionally agrees to be bound by these Terms and Conditions. Carrier's liability is strictly limited under the <em>Indian Carriage by Air Act, 1972</em>, the <em>Warsaw Convention</em>, and the <em>Montreal Convention 1999</em>. For fragile or high-value consignments, independent transit cargo insurance is strongly recommended.
                </p>
              </div>

              {/* Legal Document Card */}
              <div className="legal-document-card">

                {/* Document Header */}
                <div className="legal-document-card-header">
                  <h2 className="legal-document-h2">
                    Standard Conditions of International Air Carriage
                  </h2>
                  <div className="legal-document-meta-grid">
                    <div>
                      <strong>Governing Entity:</strong> Sai International Couriers &amp; Cargo<br />
                      <strong>GSTIN:</strong> 37BOPPS1122H1ZS
                    </div>
                    <div>
                      <strong>Head Office:</strong> 41/1248, Ratna Sabhapathi Building, Co-operative Colony, Kadapa, AP - 516001, India
                    </div>
                    <div>
                      <strong>Executive Leadership:</strong> Managing Directors <strong>S. Junaid Mohuddin</strong> &amp; <strong>S. Chandra Vadu</strong>
                    </div>
                  </div>
                </div>

                {/* Section 1 */}
                <div id="section-1" className="legal-section-block">
                  <div className="legal-section-header">
                    <span className="legal-section-badge">01</span>
                    <h3 className="legal-section-title">The Contract of Carriage &amp; Air Waybill (AWB)</h3>
                  </div>
                  <p className="legal-section-p">
                    1.1. The Air Waybill (physical or electronically generated AWB reference number) constitutes a non-negotiable legal contract entered into between the Shipper and Sai International Couriers &amp; Cargo ("Sai Couriers").
                  </p>
                  <p className="legal-section-p">
                    1.2. This contract encompasses all affiliated regional branches (Kadapa, Hyderabad, Vijayawada, Visakhapatnam, Tirupati, Nellore, Chittoor, Badvel, Rayachoty, Rajampet, Rajahmundry, Guntur, Kurnool, Proddatur), ground transport dispatchers, air cargo handlers, overseas forwarding hubs, and partner carriers (including FedEx, DHL, UPS, Aramex, and commercial international scheduled airlines).
                  </p>
                </div>

                {/* Section 2 */}
                <div id="section-2" className="legal-section-block">
                  <div className="legal-section-header">
                    <span className="legal-section-badge">02</span>
                    <h3 className="legal-section-title">Shipper’s Warranties, Declarations &amp; Packing Obligations</h3>
                  </div>
                  <p className="legal-section-p">
                    2.1. The Shipper expressly warrants that all statements and information provided in relation to the consignment—including item descriptions, quantity, commercial invoice values, sender KYC identity, and consignee foreign address/telephone—are true, complete, and accurate in all respects.
                  </p>
                  <p className="legal-section-p">
                    2.2. Under <strong>Section 132 &amp; Section 133 of the Indian Customs Act, 1962</strong>, making any false declaration or fraudulent invoice value is a punishable offense. The Shipper agrees to indemnify, defend, and hold harmless Sai Couriers from any fines, seizure costs, airline penalties, legal fees, or government sanctions arising from inaccurate declarations.
                  </p>
                  <p className="legal-section-p">
                    2.3. The Shipper is solely responsible for ensuring that all contents are securely packed, padded, and sealed to withstand the standard hazards of international multi-modal transportation, atmospheric changes in cargo aircraft cabins, sorting conveyors, and road transit.
                  </p>
                </div>

                {/* Section 3 */}
                <div id="section-3" className="legal-section-block">
                  <div className="legal-section-header">
                    <span className="legal-section-badge">03</span>
                    <h3 className="legal-section-title">Prohibited, Dangerous &amp; Hazardous Goods</h3>
                  </div>
                  <p className="legal-section-p">
                    3.1. Sai Couriers strictly refuses the carriage of any item classified as hazardous material, dangerous goods, or contraband under <strong>IATA Dangerous Goods Regulations (DGR)</strong>, <strong>ICAO guidelines</strong>, or Indian Export Control Laws.
                  </p>
                  <p className="legal-section-p">
                    3.2. Prohibited goods include, but are not limited to:
                  </p>
                  <ul className="legal-section-list">
                    <li>Explosives, fireworks, ammunition, firearms, and weapon replicas;</li>
                    <li>Flammable liquids, spirits, aerosols, paints, and pressurized gas cylinders;</li>
                    <li>Narcotics, psychotropic substances, prescription drugs without authorized DGFT permits;</li>
                    <li>Gold bullion, sovereign currency notes, counterfeit notes, and loose unmounted diamonds;</li>
                    <li>Uncertified loose lithium batteries, power banks, and unmanifested hazardous chemicals;</li>
                    <li>Biological waste, infectious specimens, live animals, and animal skins/ivory.</li>
                  </ul>
                  <p className="legal-section-p">
                    3.3. Any undeclared dangerous goods will be immediately offloaded, confiscated, and handed over to the <strong>Central Industrial Security Force (CISF)</strong>, Airport Police, and Indian Customs authorities for legal prosecution.
                  </p>
                </div>

                {/* Section 4 */}
                <div id="section-4" className="legal-section-block">
                  <div className="legal-section-header">
                    <span className="legal-section-badge">04</span>
                    <h3 className="legal-section-title">Strict Limitation of Carrier Liability</h3>
                  </div>
                  <p className="legal-section-p">
                    4.1. <strong>Statutory Capped Liability:</strong> Unless the Shipper has declared a higher monetary valuation on the Air Waybill and paid the requisite cargo transit insurance premium prior to shipment dispatch, Sai Couriers' total legal liability for any proven direct physical loss or damage to a shipment is strictly capped in accordance with the <em>Carriage by Air Act, 1972</em> and the <em>Montreal Convention 1999</em>, not exceeding <strong>US $100 per consignment</strong> or <strong>US $20.00 per kilogram</strong>, whichever is lower.
                  </p>
                  <p className="legal-section-p">
                    4.2. <strong>Complete Exclusion of Consequential Damages:</strong> Under no circumstances—whether in contract, tort, negligence, or strict liability—shall Sai Couriers, its directors, officers, or logistics partners be liable for any indirect, incidental, punitive, or consequential damages. This includes, without limitation: loss of income or revenue, loss of business profits, lost commercial tenders, loss of university admission or academic scholarships, expired overseas visa application dates, or personal mental distress.
                  </p>
                  <p className="legal-section-p">
                    4.3. <strong>Valuable Goods:</strong> Senders of irreplaceable items (such as original educational certificates, legal contracts, family heirlooms, or high-value electronic samples) must arrange third-party marine/air cargo transit insurance.
                  </p>
                </div>

                {/* Section 5 */}
                <div id="section-5" className="legal-section-block">
                  <div className="legal-section-header">
                    <span className="legal-section-badge">05</span>
                    <h3 className="legal-section-title">Destination Customs Clearance, Import Duties &amp; Taxes</h3>
                  </div>
                  <p className="legal-section-p">
                    5.1. All international shipments are subject to local customs clearance, inspection, and sovereign tax assessments by the destination country's government authorities (such as US Customs and Border Protection / FDA in the USA, HMRC in the UK, Australian Border Force, or Federal Tax Authorities in the UAE).
                  </p>
                  <p className="legal-section-p">
                    5.2. <strong>Consignee / Shipper Liability for Duties:</strong> All import tariffs, value-added taxes (VAT), goods and services tax (GST), customs broker processing charges, and statutory destination clearance penalties are strictly payable by the consignee (receiver). In the event that the consignee refuses, neglects, or defaults on payment of these taxes, the Shipper unconditionally remains jointly and severally liable to immediately settle all outstanding amounts upon first written notice from Sai Couriers.
                  </p>
                  <p className="legal-section-p">
                    5.3. Sai Couriers exercises no jurisdiction over sovereign customs inspections, border holds, regulatory quarantines, or physical sample confiscations conducted by foreign border agencies.
                  </p>
                </div>

                {/* Section 6 */}
                <div id="section-6" className="legal-section-block">
                  <div className="legal-section-header">
                    <span className="legal-section-badge">06</span>
                    <h3 className="legal-section-title">Special Conditions for Homemade Food, Pickles &amp; Sweets</h3>
                  </div>
                  <p className="legal-section-p">
                    6.1. Homemade Andhra sweets, snacks, and non-commercial pickles dispatched to overseas family members are carried on an <strong>"At Shipper’s Risk"</strong> basis with respect to perishable shelf-life.
                  </p>
                  <p className="legal-section-p">
                    6.2. All food items must be presented at our branch counters for mandatory multi-layer vacuum sealing and liquid-leak containment wrapping in accordance with international air cargo standards.
                  </p>
                  <p className="legal-section-p">
                    6.3. Senders must ensure that food parcels do not contain prohibited meats, unpasteurized dairy, or restricted bio-organic materials prohibited by destination biosecurity authorities (such as USDA / FDA or Australian Biosecurity DAFF). Confiscation or destruction of unapproved agricultural items by foreign biosecurity agencies carries no carrier liability.
                  </p>
                </div>

                {/* Section 7 */}
                <div id="section-7" className="legal-section-block">
                  <div className="legal-section-header">
                    <span className="legal-section-badge">07</span>
                    <h3 className="legal-section-title">Right of Inspection &amp; Aviation Security Screening</h3>
                  </div>
                  <p className="legal-section-p">
                    7.1. In accordance with <strong>BCAS (Bureau of Civil Aviation Security, India)</strong> and international civil aviation mandates, Sai Couriers and statutory airport screening authorities reserve the unqualified right to open, inspect, physically verify, and X-ray scan any shipment without prior notice to the Shipper.
                  </p>
                </div>

                {/* Section 8 */}
                <div id="section-8" className="legal-section-block">
                  <div className="legal-section-header">
                    <span className="legal-section-badge">08</span>
                    <h3 className="legal-section-title">Transit Timelines &amp; Force Majeure</h3>
                  </div>
                  <p className="legal-section-p">
                    8.1. Published transit schedules (e.g. 4–5 business days to USA/UK/Europe) represent operational transit estimates and do not form a binding time-guarantee.
                  </p>
                  <p className="legal-section-p">
                    8.2. Sai Couriers shall not be liable for any delay, loss, or destruction caused by events beyond its reasonable operational control (<strong>Force Majeure</strong>), including: acts of God, cyclones, earthquakes, volcanic ash clouds, severe winter storms, airline technical groundings, national strikes, customs server outages, war, geopolitical sanctions, civil unrest, or global pandemics.
                  </p>
                </div>

                {/* Section 9 */}
                <div id="section-9" className="legal-section-block">
                  <div className="legal-section-header">
                    <span className="legal-section-badge">09</span>
                    <h3 className="legal-section-title">Claims Procedure &amp; Mandatory Notice Deadlines</h3>
                  </div>
                  <p className="legal-section-p">
                    9.1. <strong>Damage or Pilferage Claims:</strong> Any claim for damage, partial loss, or package tampering must be reported in writing to Sai Couriers within <strong>forty-eight (48) hours</strong> of delivery. The original shipping box, inner packing materials, and Air Waybill must be preserved for physical survey and photographic documentation.
                  </p>
                  <p className="legal-section-p">
                    9.2. <strong>Total Loss or Non-Delivery:</strong> In case of complete non-delivery, written notice of claim must be submitted within <strong>fourteen (14) calendar days</strong> from the estimated date of arrival.
                  </p>
                  <p className="legal-section-p">
                    9.3. No claim will be accepted, processed, or evaluated if any freight charges or customs duties remain outstanding on the account.
                  </p>
                </div>

                {/* Section 10 */}
                <div id="section-10" className="legal-section-block" style={{ marginBottom: '1.5rem' }}>
                  <div className="legal-section-header">
                    <span className="legal-section-badge">10</span>
                    <h3 className="legal-section-title">Governing Law &amp; Exclusive Jurisdiction</h3>
                  </div>
                  <p className="legal-section-p">
                    10.1. This contract of carriage shall be governed by, interpreted, and construed exclusively in accordance with the substantive laws of the Republic of India.
                  </p>
                  <p className="legal-section-p">
                    10.2. The competent civil courts situated in <strong>Kadapa, YSR District, Andhra Pradesh, India</strong> shall have exclusive territorial and subject-matter jurisdiction to adjudicate any suit, dispute, or legal proceeding arising out of or related to shipments handled by Sai International Couriers &amp; Cargo.
                  </p>
                </div>

                {/* Support and Legal Contact Footer */}
                <div className="legal-card-footer">
                  <div>
                    <strong style={{ color: '#FFFFFF', fontSize: '0.95rem' }}>Legal &amp; Claims Support Desk:</strong><br />
                    <span style={{ color: '#94A3B8' }}>Official Email: saiinternationalcouriers83@gmail.com</span><br />
                    <span style={{ color: '#94A3B8' }}>Direct Helplines: +91 90599 49365 | +91 90000 22821 | +91 90008 67874</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <Link to="/privacy" className="btn btn-teal btn-sm">
                      <i className="fa-solid fa-shield-halved"></i> View Privacy Policy
                    </Link>
                    <Link to="/contact" className="btn btn-soft-cream btn-sm">
                      <i className="fa-solid fa-headset"></i> Contact Legal Desk
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
        className="legal-mobile-fab"
        aria-label="Open Table of Contents"
      >
        <i className="fa-solid fa-list-ol"></i>
        <span>Clauses ({activeNum}/10)</span>
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
                <i className="fa-solid fa-list-check" style={{ color: '#38BDF8' }}></i>
                <span>Table of Contents</span>
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
                  className={`legal-nav-link-btn ${activeSection === sec.id ? 'active' : ''}`}
                  style={{ padding: '0.75rem' }}
                >
                  <span className="legal-nav-num-badge">{sec.num}</span>
                  <span className="legal-nav-text-col">
                    <span className="legal-nav-title-text">{sec.title}</span>
                  </span>
                  {activeSection === sec.id && <span className="legal-nav-active-pip" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
