import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function TermsPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <main style={{ paddingTop: '80px' }}>
      {/* Hero Banner */}
      <section className="page-hero-banner">
        <div className="container">
          <div className="breadcrumb-trail">
            <Link to="/">Home</Link>
            <span className="separator"><i className="fa-solid fa-chevron-right"></i></span>
            <span className="current">Terms &amp; Conditions</span>
          </div>
          <div className="eyebrow-pill teal">
            <i className="fa-solid fa-scale-balanced" style={{ marginRight: '0.4rem', color: '#F7A88B' }}></i>
            Contract of Carriage
          </div>
          <h1 className="page-hero-title">Terms &amp; Conditions of Service</h1>
          <p className="page-hero-desc">
            Official Air Waybill (AWB) Conditions of Carriage, Shipper Warranties, Limitation of Carrier Liability, Destination Customs Governance, and Legal Jurisdiction for International Air Courier &amp; Cargo Operations.
          </p>
        </div>
      </section>

      {/* Main Legal Content */}
      <section className="section section-ivory" style={{ padding: '3.5rem 0 5rem 0' }}>
        <div className="container" style={{ maxWidth: '1000px' }}>

          {/* Legal Notice Callout */}
          <div style={{
            background: 'rgba(56, 189, 248, 0.08)',
            borderLeft: '4px solid #38BDF8',
            borderRadius: '12px',
            padding: '1.5rem 1.75rem',
            marginBottom: '2.5rem',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#38BDF8', fontWeight: 800, fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <i className="fa-solid fa-circle-exclamation"></i>
              Important Legal Notice to Shipper / Consignor
            </div>
            <p style={{ color: '#C2D5E5', fontSize: '0.94rem', lineHeight: 1.7, margin: '0.65rem 0 0 0' }}>
              By tendering goods, documents, or parcels to <strong>SAI INTERNATIONAL COURIERS &amp; CARGO</strong> ("Carrier"), signing any physical or digital Air Waybill ("AWB"), or scheduling an order online/offline, the Sender ("Shipper") unconditionally agrees to be bound by these Terms and Conditions. Carrier's liability is strictly limited under the <em>Indian Carriage by Air Act, 1972</em>, the <em>Warsaw Convention</em>, and the <em>Montreal Convention 1999</em>. For fragile or high-value consignments, independent transit cargo insurance is strongly recommended.
            </p>
          </div>

          {/* Legal Document Card */}
          <div style={{
            background: '#122336',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '18px',
            padding: '3rem 2.5rem',
            color: '#E2E8F0',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
          }}>

            <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.6rem', color: '#FFFFFF', margin: '0 0 0.5rem 0' }}>
                Standard Conditions of International Air Carriage
              </h2>
              <div style={{ fontSize: '0.85rem', color: '#94A3B8' }}>
                Governing Entity: <strong>Sai International Couriers &amp; Cargo</strong> | GSTIN: <strong>37BOPPS1122H1ZS</strong><br />
                Head Office: 41/1248, Ratna Sabhapathi Building, Co-operative Colony, Kadapa, AP - 516001, India<br />
                Executive Leadership: Managing Directors <strong>S. Junaid Mohuddin</strong> &amp; <strong>S. Chandra Vadu</strong>
              </div>
            </div>

            {/* Section 1 */}
            <div className="legal-article" style={{ marginBottom: '2.25rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#38BDF8', margin: '0 0 0.75rem 0' }}>
                1. The Contract of Carriage &amp; Air Waybill (AWB)
              </h3>
              <p style={{ lineHeight: 1.75, fontSize: '0.95rem', color: '#CBD5E1' }}>
                1.1. The Air Waybill (physical or electronically generated AWB reference number) constitutes a non-negotiable legal contract entered into between the Shipper and Sai International Couriers &amp; Cargo ("Sai Couriers").
              </p>
              <p style={{ lineHeight: 1.75, fontSize: '0.95rem', color: '#CBD5E1' }}>
                1.2. This contract encompasses all affiliated regional branches (Kadapa, Hyderabad, Vijayawada, Visakhapatnam, Tirupati, Nellore, Chittoor, Badvel, Rayachoty, Rajampet, Rajahmundry, Guntur, Kurnool, Proddatur), ground transport dispatchers, air cargo handlers, overseas forwarding hubs, and partner carriers (including FedEx, DHL, UPS, Aramex, and commercial international scheduled airlines).
              </p>
            </div>

            {/* Section 2 */}
            <div className="legal-article" style={{ marginBottom: '2.25rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#38BDF8', margin: '0 0 0.75rem 0' }}>
                2. Shipper’s Warranties, Declarations &amp; Packing Obligations
              </h3>
              <p style={{ lineHeight: 1.75, fontSize: '0.95rem', color: '#CBD5E1' }}>
                2.1. The Shipper expressly warrants that all statements and information provided in relation to the consignment—including item descriptions, quantity, commercial invoice values, sender KYC identity, and consignee foreign address/telephone—are true, complete, and accurate in all respects.
              </p>
              <p style={{ lineHeight: 1.75, fontSize: '0.95rem', color: '#CBD5E1' }}>
                2.2. Under <strong>Section 132 &amp; Section 133 of the Indian Customs Act, 1962</strong>, making any false declaration or fraudulent invoice value is a punishable offense. The Shipper agrees to indemnify, defend, and hold harmless Sai Couriers from any fines, seizure costs, airline penalties, legal fees, or government sanctions arising from inaccurate declarations.
              </p>
              <p style={{ lineHeight: 1.75, fontSize: '0.95rem', color: '#CBD5E1' }}>
                2.3. The Shipper is solely responsible for ensuring that all contents are securely packed, padded, and sealed to withstand the standard hazards of international multi-modal transportation, atmospheric changes in cargo aircraft cabins, sorting conveyors, and road transit.
              </p>
            </div>

            {/* Section 3 */}
            <div className="legal-article" style={{ marginBottom: '2.25rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#38BDF8', margin: '0 0 0.75rem 0' }}>
                3. Prohibited, Dangerous &amp; Hazardous Goods
              </h3>
              <p style={{ lineHeight: 1.75, fontSize: '0.95rem', color: '#CBD5E1' }}>
                3.1. Sai Couriers strictly refuses the carriage of any item classified as hazardous material, dangerous goods, or contraband under <strong>IATA Dangerous Goods Regulations (DGR)</strong>, <strong>ICAO guidelines</strong>, or Indian Export Control Laws.
              </p>
              <p style={{ lineHeight: 1.75, fontSize: '0.95rem', color: '#CBD5E1' }}>
                3.2. Prohibited goods include, but are not limited to:
              </p>
              <ul style={{ paddingLeft: '1.5rem', lineHeight: 1.8, fontSize: '0.93rem', color: '#CBD5E1' }}>
                <li>Explosives, fireworks, ammunition, firearms, and weapon replicas;</li>
                <li>Flammable liquids, spirits, aerosols, paints, and pressurized gas cylinders;</li>
                <li>Narcotics, psychotropic substances, prescription drugs without authorized DGFT permits;</li>
                <li>Gold bullion, sovereign currency notes, counterfeit notes, and loose unmounted diamonds;</li>
                <li>Uncertified loose lithium batteries, power banks, and unmanifested hazardous chemicals;</li>
                <li>Biological waste, infectious specimens, live animals, and animal skins/ivory.</li>
              </ul>
              <p style={{ lineHeight: 1.75, fontSize: '0.95rem', color: '#CBD5E1' }}>
                3.3. Any undeclared dangerous goods will be immediately offloaded, confiscated, and handed over to the <strong>Central Industrial Security Force (CISF)</strong>, Airport Police, and Indian Customs authorities for legal prosecution.
              </p>
            </div>

            {/* Section 4 */}
            <div className="legal-article" style={{ marginBottom: '2.25rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#38BDF8', margin: '0 0 0.75rem 0' }}>
                4. Strict Limitation of Carrier Liability
              </h3>
              <p style={{ lineHeight: 1.75, fontSize: '0.95rem', color: '#CBD5E1' }}>
                4.1. <strong>Statutory Capped Liability:</strong> Unless the Shipper has declared a higher monetary valuation on the Air Waybill and paid the requisite cargo transit insurance premium prior to shipment dispatch, Sai Couriers’ total legal liability for any proven direct physical loss or damage to a shipment is strictly capped in accordance with the <em>Carriage by Air Act, 1972</em> and the <em>Montreal Convention 1999</em>, not exceeding <strong>US $100 per consignment</strong> or <strong>US $20.00 per kilogram</strong>, whichever is lower.
              </p>
              <p style={{ lineHeight: 1.75, fontSize: '0.95rem', color: '#CBD5E1' }}>
                4.2. <strong>Complete Exclusion of Consequential Damages:</strong> Under no circumstances—whether in contract, tort, negligence, or strict liability—shall Sai Couriers, its directors, officers, or logistics partners be liable for any indirect, incidental, punitive, or consequential damages. This includes, without limitation: loss of income or revenue, loss of business profits, lost commercial tenders, loss of university admission or academic scholarships, expired overseas visa application dates, or personal mental distress.
              </p>
              <p style={{ lineHeight: 1.75, fontSize: '0.95rem', color: '#CBD5E1' }}>
                4.3. <strong>Valuable Goods:</strong> Senders of irreplaceable items (such as original educational certificates, legal contracts, family heirlooms, or high-value electronic samples) must arrange third-party marine/air cargo transit insurance.
              </p>
            </div>

            {/* Section 5 */}
            <div className="legal-article" style={{ marginBottom: '2.25rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#38BDF8', margin: '0 0 0.75rem 0' }}>
                5. Destination Customs Clearance, Import Duties &amp; Taxes
              </h3>
              <p style={{ lineHeight: 1.75, fontSize: '0.95rem', color: '#CBD5E1' }}>
                5.1. All international shipments are subject to local customs clearance, inspection, and sovereign tax assessments by the destination country's government authorities (such as US Customs and Border Protection / FDA in the USA, HMRC in the UK, Australian Border Force, or Federal Tax Authorities in the UAE).
              </p>
              <p style={{ lineHeight: 1.75, fontSize: '0.95rem', color: '#CBD5E1' }}>
                5.2. <strong>Consignee / Shipper Liability for Duties:</strong> All import tariffs, VAT, GST, formal clearance broker charges, quarantine inspection fees, and bonded warehouse demurrage charges levied by foreign customs are the sole responsibility of the Consignee (Receiver).
              </p>
              <p style={{ lineHeight: 1.75, fontSize: '0.95rem', color: '#CBD5E1' }}>
                5.3. If the Consignee refuses to pay assessed customs duties, fails to provide requested clearance paperwork (such as foreign tax ID or FDA prior notice), or abandons the parcel, the <strong>Shipper remains legally liable</strong> to pay all accrued customs duties, return freight charges, and warehouse fees.
              </p>
            </div>

            {/* Section 6 */}
            <div className="legal-article" style={{ marginBottom: '2.25rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#38BDF8', margin: '0 0 0.75rem 0' }}>
                6. Special NRI Food, Homemade Pickles &amp; Perishables Clause
              </h3>
              <p style={{ lineHeight: 1.75, fontSize: '0.95rem', color: '#CBD5E1' }}>
                6.1. Sai Couriers offers specialized commercial vacuum sealing and heavy-duty 5-ply export packaging for authentic Andhra homemade food parcels, pickles, and sweets.
              </p>
              <p style={{ lineHeight: 1.75, fontSize: '0.95rem', color: '#CBD5E1' }}>
                6.2. However, all homemade food and perishable consignments are accepted strictly at <strong>Shipper’s Sole Risk</strong> regarding natural shelf-life spoilage, temperature fluctuations, atmospheric oil seepage resulting from altitude cabin pressure variations, or agricultural bio-security rejections by destination customs.
              </p>
              <p style={{ lineHeight: 1.75, fontSize: '0.95rem', color: '#CBD5E1' }}>
                6.3. Carrier is not liable for food packages confiscated or destroyed by overseas agricultural or health ministries where import of meat, dairy, seeds, or specific spices is banned by local sovereign statute.
              </p>
            </div>

            {/* Section 7 */}
            <div className="legal-article" style={{ marginBottom: '2.25rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#38BDF8', margin: '0 0 0.75rem 0' }}>
                7. Right to Inspect &amp; Security Screening
              </h3>
              <p style={{ lineHeight: 1.75, fontSize: '0.95rem', color: '#CBD5E1' }}>
                7.1. In accordance with airline security, aviation guidelines (DGCA/BCAS), and Indian Customs export mandates, Sai Couriers, its authorized security personnel, airport ground handling agents, and government customs officials reserve the unqualified right to open, inspect, physically verify, or x-ray scan any shipment without prior notice to the Shipper.
              </p>
            </div>

            {/* Section 8 */}
            <div className="legal-article" style={{ marginBottom: '2.25rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#38BDF8', margin: '0 0 0.75rem 0' }}>
                8. Transit Timelines &amp; Force Majeure
              </h3>
              <p style={{ lineHeight: 1.75, fontSize: '0.95rem', color: '#CBD5E1' }}>
                8.1. Published transit schedules (e.g. 4–5 business days to USA/UK/Europe) represent operational transit estimates and do not form a binding time-guarantee.
              </p>
              <p style={{ lineHeight: 1.75, fontSize: '0.95rem', color: '#CBD5E1' }}>
                8.2. Sai Couriers shall not be liable for any delay, loss, or destruction caused by events beyond its reasonable operational control (<strong>Force Majeure</strong>), including: acts of God, cyclones, earthquakes, volcanic ash clouds, severe winter storms, airline technical groundings, national strikes, customs server outages, war, geopolitical sanctions, civil unrest, or global pandemics.
              </p>
            </div>

            {/* Section 9 */}
            <div className="legal-article" style={{ marginBottom: '2.25rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#38BDF8', margin: '0 0 0.75rem 0' }}>
                9. Claims Procedure &amp; Mandatory Notice Deadlines
              </h3>
              <p style={{ lineHeight: 1.75, fontSize: '0.95rem', color: '#CBD5E1' }}>
                9.1. <strong>Damage or Pilferage Claims:</strong> Any claim for damage, partial loss, or package tampering must be reported in writing to Sai Couriers within <strong>forty-eight (48) hours</strong> of delivery. The original shipping box, inner packing materials, and Air Waybill must be preserved for physical survey and photographic documentation.
              </p>
              <p style={{ lineHeight: 1.75, fontSize: '0.95rem', color: '#CBD5E1' }}>
                9.2. <strong>Total Loss or Non-Delivery:</strong> In case of complete non-delivery, written notice of claim must be submitted within <strong>fourteen (14) calendar days</strong> from the estimated date of arrival.
              </p>
              <p style={{ lineHeight: 1.75, fontSize: '0.95rem', color: '#CBD5E1' }}>
                9.3. No claim will be accepted, processed, or evaluated if any freight charges or customs duties remain outstanding on the account.
              </p>
            </div>

            {/* Section 10 */}
            <div className="legal-article" style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#38BDF8', margin: '0 0 0.75rem 0' }}>
                10. Governing Law &amp; Exclusive Jurisdiction
              </h3>
              <p style={{ lineHeight: 1.75, fontSize: '0.95rem', color: '#CBD5E1' }}>
                10.1. This contract of carriage shall be governed by, interpreted, and construed exclusively in accordance with the substantive laws of the Republic of India.
              </p>
              <p style={{ lineHeight: 1.75, fontSize: '0.95rem', color: '#CBD5E1' }}>
                10.2. The competent civil courts situated in <strong>Kadapa, YSR District, Andhra Pradesh, India</strong> shall have exclusive territorial and subject-matter jurisdiction to adjudicate any suit, dispute, or legal proceeding arising out of or related to shipments handled by Sai International Couriers &amp; Cargo.
              </p>
            </div>

            {/* Support and Legal Contact Footer */}
            <div style={{
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              paddingTop: '1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
              fontSize: '0.9rem'
            }}>
              <div>
                <strong>Legal &amp; Claims Support Desk:</strong><br />
                <span style={{ color: '#94A3B8' }}>Email: saiinternationalcouriers83@gmail.com</span><br />
                <span style={{ color: '#94A3B8' }}>Direct Helplines: +91 90599 49365 | +91 90000 22821 | +91 90008 67874</span>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
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
      </section>
    </main>
  );
}
