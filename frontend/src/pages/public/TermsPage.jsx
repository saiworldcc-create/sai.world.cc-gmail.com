import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

const TABS = [
  { id: 'section-1', title: 'Terms of Carriage', isRoute: false },
  { id: 'privacy-link', title: 'Privacy Policy', isRoute: true, path: '/privacy' },
  { id: 'section-2', title: 'Shipper Warranties', isRoute: false },
  { id: 'section-3', title: 'Dangerous Goods', isRoute: false },
  { id: 'section-4', title: 'Limited Liability', isRoute: false },
  { id: 'section-5', title: 'Customs & Duties', isRoute: false },
  { id: 'section-6', title: 'NRI Food & Pickles', isRoute: false },
  { id: 'section-7', title: 'Security Inspection', isRoute: false },
  { id: 'section-8', title: 'Force Majeure', isRoute: false },
  { id: 'section-9', title: 'Claims & Notice', isRoute: false },
  { id: 'section-10', title: 'Jurisdiction', isRoute: false },
  { id: 'branches-link', title: 'Branch Network', isRoute: true, path: '/branches' },
];

export default function TermsPage() {
  const [activeTab, setActiveTab] = useState('section-1');
  const navRef = useRef(null);
  const tabRefs = useRef({});

  // Real-time Scrollspy & Auto-scroll of top tab bar
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });

    const handleScroll = () => {
      const winScroll = window.scrollY || document.documentElement.scrollTop;
      const scrollPos = winScroll + 170;

      const clauseSections = TABS.filter(t => !t.isRoute);
      for (let i = clauseSections.length - 1; i >= 0; i--) {
        const el = document.getElementById(clauseSections[i].id);
        if (el && el.offsetTop <= scrollPos) {
          const currentId = clauseSections[i].id;
          setActiveTab(currentId);

          // Auto-scroll the top navigation bar to keep the active tab visible
          const tabEl = tabRefs.current[currentId];
          const navEl = navRef.current;
          if (tabEl && navEl) {
            const tabLeft = tabEl.offsetLeft;
            const tabWidth = tabEl.offsetWidth;
            const navScroll = navEl.scrollLeft;
            const navWidth = navEl.offsetWidth;
            if (tabLeft < navScroll || (tabLeft + tabWidth) > (navScroll + navWidth)) {
              navEl.scrollTo({
                left: tabLeft - (navWidth / 2) + (tabWidth / 2),
                behavior: 'smooth'
              });
            }
          }
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -135;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveTab(id);
    }
  };

  const scrollNav = (direction) => {
    if (navRef.current) {
      const amount = direction === 'left' ? -280 : 280;
      navRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  const handleWheel = (e) => {
    if (navRef.current && e.deltaY !== 0) {
      e.preventDefault();
      navRef.current.scrollLeft += e.deltaY;
    }
  };

  return (
    <main style={{ paddingTop: '72px' }}>
      {/* Scrollable Horizontal Sub-Navigation Tab Bar */}
      <nav className="oracle-subnav-bar" aria-label="Legal Navigation">
        <div className="oracle-subnav-wrapper">
          <button
            type="button"
            className="oracle-subnav-arrow"
            onClick={() => scrollNav('left')}
            aria-label="Scroll left"
            title="Scroll left"
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>

          <div
            className="oracle-subnav-scroll"
            ref={navRef}
            onWheel={handleWheel}
          >
            {TABS.map((tab) => {
              if (tab.isRoute) {
                return (
                  <Link
                    key={tab.id}
                    to={tab.path}
                    className="oracle-subnav-tab"
                  >
                    {tab.title}
                  </Link>
                );
              }

              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  ref={(el) => (tabRefs.current[tab.id] = el)}
                  type="button"
                  onClick={() => scrollToSection(tab.id)}
                  className={`oracle-subnav-tab ${isActive ? 'active' : ''}`}
                >
                  {tab.title}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            className="oracle-subnav-arrow"
            onClick={() => scrollNav('right')}
            aria-label="Scroll right"
            title="Scroll right"
          >
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      </nav>

      {/* Wide Responsive Hero Banner */}
      <section className="oracle-hero-banner">
        <div className="oracle-hero-container">
          <div className="breadcrumb-trail" style={{ marginBottom: '1.25rem' }}>
            <Link to="/">Home</Link>
            <span className="separator"><i className="fa-solid fa-chevron-right"></i></span>
            <span>Legal &amp; Compliance</span>
            <span className="separator"><i className="fa-solid fa-chevron-right"></i></span>
            <span className="current">Terms &amp; Conditions</span>
          </div>

          <h1 className="oracle-hero-title">
            Terms &amp; Conditions of Service
          </h1>

          <p className="oracle-hero-lead">
            Official Air Waybill (AWB) Conditions of Carriage, Shipper Declarations, Statutory Limitation of Carrier Liability under Montreal &amp; Warsaw Conventions, Customs Governance, and Legal Jurisdiction for International Air Courier &amp; Cargo Operations.
          </p>

          <div className="oracle-meta-strip">
            <div className="oracle-meta-item">
              Operating Entity: <strong>Sai International Couriers &amp; Cargo</strong>
            </div>
            <div className="oracle-meta-item">
              GSTIN: <strong>37BOPPS1122H1ZS</strong>
            </div>
            <div className="oracle-meta-item">
              Head Office: <strong>Kadapa, Andhra Pradesh, India</strong>
            </div>
            <div className="oracle-meta-item">
              Executive Leadership: Managing Directors <strong>S. Chandra Babu</strong> &amp; <strong>S. Junaid Mohuddin</strong>
            </div>
          </div>
        </div>
      </section>

      {/* Wide Responsive Single-Column Legal Document */}
      <section className="oracle-doc-section">
        <div className="oracle-doc-container">

          {/* Legal Notice Callout */}
          <div className="oracle-notice-box">
            <div className="oracle-notice-title">
              <i className="fa-solid fa-circle-exclamation"></i>
              Important Legal Notice to Shipper / Consignor
            </div>
            <p className="oracle-notice-text">
              By tendering goods, documents, or parcels to <strong>SAI INTERNATIONAL COURIERS &amp; CARGO</strong> ("Carrier"), signing any physical or digital Air Waybill ("AWB"), or scheduling an order online/offline, the Sender ("Shipper") unconditionally agrees to be bound by these Terms and Conditions. Carrier's liability is strictly limited under the <em>Indian Carriage by Air Act, 1972</em>, the <em>Warsaw Convention</em>, and the <em>Montreal Convention 1999</em>. For fragile or high-value consignments, independent transit cargo insurance is strongly recommended.
            </p>
          </div>

          {/* Section 1 */}
          <article id="section-1" className="oracle-clause-item">
            <h2 className="oracle-clause-heading">
              <span className="num">1.</span> The Contract of Carriage &amp; Air Waybill (AWB)
            </h2>
            <p className="oracle-clause-p">
              1.1. The Air Waybill (physical or electronically generated AWB reference number) constitutes a non-negotiable legal contract entered into between the Shipper and Sai International Couriers &amp; Cargo ("Sai Couriers").
            </p>
            <p className="oracle-clause-p">
              1.2. This contract encompasses all affiliated regional branches (Kadapa, Hyderabad, Vijayawada, Visakhapatnam, Tirupati, Nellore, Chittoor, Badvel, Rayachoty, Rajampet, Rajahmundry, Guntur, Kurnool, Proddatur), ground transport dispatchers, air cargo handlers, overseas forwarding hubs, and partner carriers (including FedEx, DHL, UPS, Aramex, and commercial international scheduled airlines).
            </p>
          </article>

          {/* Section 2 */}
          <article id="section-2" className="oracle-clause-item">
            <h2 className="oracle-clause-heading">
              <span className="num">2.</span> Shipper’s Warranties, Declarations &amp; Packing Obligations
            </h2>
            <p className="oracle-clause-p">
              2.1. The Shipper expressly warrants that all statements and information provided in relation to the consignment—including item descriptions, quantity, commercial invoice values, sender KYC identity, and consignee foreign address/telephone—are true, complete, and accurate in all respects.
            </p>
            <p className="oracle-clause-p">
              2.2. Under <strong>Section 132 &amp; Section 133 of the Indian Customs Act, 1962</strong>, making any false declaration or fraudulent invoice value is a punishable offense. The Shipper agrees to indemnify, defend, and hold harmless Sai Couriers from any fines, seizure costs, airline penalties, legal fees, or government sanctions arising from inaccurate declarations.
            </p>
            <p className="oracle-clause-p">
              2.3. The Shipper is solely responsible for ensuring that all contents are securely packed, padded, and sealed to withstand the standard hazards of international multi-modal transportation, atmospheric changes in cargo aircraft cabins, sorting conveyors, and road transit.
            </p>
          </article>

          {/* Section 3 */}
          <article id="section-3" className="oracle-clause-item">
            <h2 className="oracle-clause-heading">
              <span className="num">3.</span> Prohibited, Dangerous &amp; Hazardous Goods
            </h2>
            <p className="oracle-clause-p">
              3.1. Sai Couriers strictly refuses the carriage of any item classified as hazardous material, dangerous goods, or contraband under <strong>IATA Dangerous Goods Regulations (DGR)</strong>, <strong>ICAO guidelines</strong>, or Indian Export Control Laws.
            </p>
            <p className="oracle-clause-p">
              3.2. Prohibited goods include, but are not limited to:
            </p>
            <ul className="oracle-clause-list">
              <li>Explosives, fireworks, ammunition, firearms, and weapon replicas;</li>
              <li>Flammable liquids, spirits, aerosols, paints, and pressurized gas cylinders;</li>
              <li>Narcotics, psychotropic substances, prescription drugs without authorized DGFT permits;</li>
              <li>Gold bullion, sovereign currency notes, counterfeit notes, and loose unmounted diamonds;</li>
              <li>Uncertified loose lithium batteries, power banks, and unmanifested hazardous chemicals;</li>
              <li>Biological waste, infectious specimens, live animals, and animal skins/ivory.</li>
            </ul>
            <p className="oracle-clause-p">
              3.3. Any undeclared dangerous goods will be immediately offloaded, confiscated, and handed over to the <strong>Central Industrial Security Force (CISF)</strong>, Airport Police, and Indian Customs authorities for legal prosecution.
            </p>
          </article>

          {/* Section 4 */}
          <article id="section-4" className="oracle-clause-item">
            <h2 className="oracle-clause-heading">
              <span className="num">4.</span> Strict Limitation of Carrier Liability
            </h2>
            <p className="oracle-clause-p">
              4.1. <strong>Statutory Capped Liability:</strong> Unless the Shipper has declared a higher monetary valuation on the Air Waybill and paid the requisite cargo transit insurance premium prior to shipment dispatch, Sai Couriers' total legal liability for any proven direct physical loss or damage to a shipment is strictly capped in accordance with the <em>Carriage by Air Act, 1972</em> and the <em>Montreal Convention 1999</em>, not exceeding <strong>US $100 per consignment</strong> or <strong>US $20.00 per kilogram</strong>, whichever is lower.
            </p>
            <p className="oracle-clause-p">
              4.2. <strong>Complete Exclusion of Consequential Damages:</strong> Under no circumstances—whether in contract, tort, negligence, or strict liability—shall Sai Couriers, its directors, officers, or logistics partners be liable for any indirect, incidental, punitive, or consequential damages. This includes, without limitation: loss of income or revenue, loss of business profits, lost commercial tenders, loss of university admission or academic scholarships, expired overseas visa application dates, or personal mental distress.
            </p>
            <p className="oracle-clause-p">
              4.3. <strong>Valuable Goods:</strong> Senders of irreplaceable items (such as original educational certificates, legal contracts, family heirlooms, or high-value electronic samples) must arrange third-party marine/air cargo transit insurance.
            </p>
          </article>

          {/* Section 5 */}
          <article id="section-5" className="oracle-clause-item">
            <h2 className="oracle-clause-heading">
              <span className="num">5.</span> Destination Customs Clearance, Import Duties &amp; Taxes
            </h2>
            <p className="oracle-clause-p">
              5.1. All international shipments are subject to local customs clearance, inspection, and sovereign tax assessments by the destination country's government authorities (such as US Customs and Border Protection / FDA in the USA, HMRC in the UK, Australian Border Force, or Federal Tax Authorities in the UAE).
            </p>
            <p className="oracle-clause-p">
              5.2. <strong>Consignee / Shipper Liability for Duties:</strong> All import tariffs, value-added taxes (VAT), goods and services tax (GST), customs broker processing charges, and statutory destination clearance penalties are strictly payable by the consignee (receiver). In the event that the consignee refuses, neglects, or defaults on payment of these taxes, the Shipper unconditionally remains jointly and severally liable to immediately settle all outstanding amounts upon first written notice from Sai Couriers.
            </p>
            <p className="oracle-clause-p">
              5.3. Sai Couriers exercises no jurisdiction over sovereign customs inspections, border holds, regulatory quarantines, or physical sample confiscations conducted by foreign border agencies.
            </p>
          </article>

          {/* Section 6 */}
          <article id="section-6" className="oracle-clause-item">
            <h2 className="oracle-clause-heading">
              <span className="num">6.</span> Special Conditions for Homemade Food, Pickles &amp; Sweets
            </h2>
            <p className="oracle-clause-p">
              6.1. Homemade Andhra sweets, snacks, and non-commercial pickles dispatched to overseas family members are carried on an <strong>"At Shipper’s Risk"</strong> basis with respect to perishable shelf-life.
            </p>
            <p className="oracle-clause-p">
              6.2. All food items must be presented at our branch counters for mandatory multi-layer vacuum sealing and liquid-leak containment wrapping in accordance with international air cargo standards.
            </p>
            <p className="oracle-clause-p">
              6.3. Senders must ensure that food parcels do not contain prohibited meats, unpasteurized dairy, or restricted bio-organic materials prohibited by destination biosecurity authorities (such as USDA / FDA or Australian Biosecurity DAFF). Confiscation or destruction of unapproved agricultural items by foreign biosecurity agencies carries no carrier liability.
            </p>
          </article>

          {/* Section 7 */}
          <article id="section-7" className="oracle-clause-item">
            <h2 className="oracle-clause-heading">
              <span className="num">7.</span> Right of Inspection &amp; Aviation Security Screening
            </h2>
            <p className="oracle-clause-p">
              7.1. In accordance with <strong>BCAS (Bureau of Civil Aviation Security, India)</strong> and international civil aviation mandates, Sai Couriers and statutory airport screening authorities reserve the unqualified right to open, inspect, physically verify, and X-ray scan any shipment without prior notice to the Shipper.
            </p>
          </article>

          {/* Section 8 */}
          <article id="section-8" className="oracle-clause-item">
            <h2 className="oracle-clause-heading">
              <span className="num">8.</span> Transit Timelines &amp; Force Majeure
            </h2>
            <p className="oracle-clause-p">
              8.1. Published transit schedules (e.g. 4–5 business days to USA/UK/Europe) represent operational transit estimates and do not form a binding time-guarantee.
            </p>
            <p className="oracle-clause-p">
              8.2. Sai Couriers shall not be liable for any delay, loss, or destruction caused by events beyond its reasonable operational control (<strong>Force Majeure</strong>), including: acts of God, cyclones, earthquakes, volcanic ash clouds, severe winter storms, airline technical groundings, national strikes, customs server outages, war, geopolitical sanctions, civil unrest, or global pandemics.
            </p>
          </article>

          {/* Section 9 */}
          <article id="section-9" className="oracle-clause-item">
            <h2 className="oracle-clause-heading">
              <span className="num">9.</span> Claims Procedure &amp; Mandatory Notice Deadlines
            </h2>
            <p className="oracle-clause-p">
              9.1. <strong>Damage or Pilferage Claims:</strong> Any claim for damage, partial loss, or package tampering must be reported in writing to Sai Couriers within <strong>forty-eight (48) hours</strong> of delivery. The original shipping box, inner packing materials, and Air Waybill must be preserved for physical survey and photographic documentation.
            </p>
            <p className="oracle-clause-p">
              9.2. <strong>Total Loss or Non-Delivery:</strong> In case of complete non-delivery, written notice of claim must be submitted within <strong>fourteen (14) calendar days</strong> from the estimated date of arrival.
            </p>
            <p className="oracle-clause-p">
              9.3. No claim will be accepted, processed, or evaluated if any freight charges or customs duties remain outstanding on the account.
            </p>
          </article>

          {/* Section 10 */}
          <article id="section-10" className="oracle-clause-item">
            <h2 className="oracle-clause-heading">
              <span className="num">10.</span> Governing Law &amp; Exclusive Jurisdiction
            </h2>
            <p className="oracle-clause-p">
              10.1. This contract of carriage shall be governed by, interpreted, and construed exclusively in accordance with the substantive laws of the Republic of India.
            </p>
            <p className="oracle-clause-p">
              10.2. The competent civil courts situated in <strong>Kadapa, YSR District, Andhra Pradesh, India</strong> shall have exclusive territorial and subject-matter jurisdiction to adjudicate any suit, dispute, or legal proceeding arising out of or related to shipments handled by Sai International Couriers &amp; Cargo.
            </p>
          </article>

          {/* Support and Legal Contact Footer */}
          <div className="oracle-doc-footer">
            <div>
              <strong style={{ color: '#FFFFFF', fontSize: '0.95rem' }}>Legal &amp; Claims Support Desk:</strong><br />
              <span style={{ color: '#94A3B8' }}>Official Email: saiinternationalcouriers83@gmail.com</span><br />
              <span style={{ color: '#94A3B8' }}>Direct Helplines: +91 90599 49365 | +91 90000 22821 | +91 90008 67874</span>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Link to="/privacy" className="btn btn-teal btn-sm">
                <i className="fa-solid fa-shield-halved"></i> View Privacy Policy
              </Link>
              <button onClick={() => window.print()} className="btn btn-soft-cream btn-sm">
                <i className="fa-solid fa-print"></i> Print Document
              </button>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
