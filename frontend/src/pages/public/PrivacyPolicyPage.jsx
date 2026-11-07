import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function PrivacyPolicyPage() {
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
            <span className="current">Privacy &amp; Data Protection Policy</span>
          </div>
          <div className="eyebrow-pill teal">
            <i className="fa-solid fa-user-shield" style={{ marginRight: '0.4rem', color: '#F7A88B' }}></i>
            Data Privacy &amp; KYC Governance
          </div>
          <h1 className="page-hero-title">Privacy Policy &amp; Data Protection</h1>
          <p className="page-hero-desc">
            How Sai International Couriers &amp; Cargo collects, verifies, stores, and safeguards your personal identity and cross-border shipping documentation in accordance with Indian and International privacy laws.
          </p>
        </div>
      </section>

      {/* Main Privacy Content */}
      <section className="section section-ivory" style={{ padding: '3.5rem 0 5rem 0' }}>
        <div className="container" style={{ maxWidth: '1000px' }}>

          {/* Privacy Trust Card */}
          <div style={{
            background: 'rgba(20, 184, 166, 0.08)',
            borderLeft: '4px solid #14B8A6',
            borderRadius: '12px',
            padding: '1.5rem 1.75rem',
            marginBottom: '2.5rem',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#2DD4BF', fontWeight: 800, fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <i className="fa-solid fa-lock"></i>
              Our Unconditional Privacy Guarantee
            </div>
            <p style={{ color: '#C2D5E5', fontSize: '0.94rem', lineHeight: 1.7, margin: '0.65rem 0 0 0' }}>
              <strong>SAI INTERNATIONAL COURIERS &amp; CARGO</strong> is committed to preserving the confidentiality of your personal shipping data and KYC records. We <strong>never sell, lease, or monetize</strong> your personal details or government ID copies to third-party marketing companies. Data is collected solely to execute cross-border air cargo transport, satisfy statutory Indian Customs (CBIC) mandates, and ensure secure doorstep delivery worldwide.
            </p>
          </div>

          {/* Legal Document Container */}
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
                Customer Data Protection &amp; KYC Privacy Policy
              </h2>
              <div style={{ fontSize: '0.85rem', color: '#94A3B8' }}>
                Statutory Compliance: <strong>Digital Personal Data Protection (DPDP) Act, 2023</strong> &amp; <strong>Information Technology Act, 2000 (India)</strong><br />
                Operating Entity: <strong>Sai International Couriers &amp; Cargo</strong> | GSTIN: <strong>37BOPPS1122H1ZS</strong><br />
                Effective Date: November 2026 | Last Reviewed: Annual Legal Review Cycle
              </div>
            </div>

            {/* Section 1 */}
            <div className="legal-article" style={{ marginBottom: '2.25rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#38BDF8', margin: '0 0 0.75rem 0' }}>
                1. Information We Collect
              </h3>
              <p style={{ lineHeight: 1.75, fontSize: '0.95rem', color: '#CBD5E1' }}>
                To fulfill our logistics obligations and satisfy statutory government aviation and customs rules, Sai Couriers collects the following categories of information:
              </p>
              <ul style={{ paddingLeft: '1.5rem', lineHeight: 1.8, fontSize: '0.93rem', color: '#CBD5E1' }}>
                <li><strong>Contact Information:</strong> Full legal names, physical origin and delivery addresses, mobile numbers, and email addresses of both Shipper (Sender) and Consignee (Receiver).</li>
                <li><strong>Statutory Sender KYC Records:</strong> Government-issued identification (Aadhaar Card, Indian Passport, Driving License, or Voter ID) and PAN Card copies.</li>
                <li><strong>Shipment Manifest Details:</strong> Item descriptions, declared value, invoice amounts, HS codes, gross weight, volumetric dimensions, and specialized packaging instructions.</li>
                <li><strong>Digital &amp; Transaction Data:</strong> IP address, browser type, booking timestamps, online payment transaction identifiers (processed securely via PCI-DSS certified gateways; we never store raw credit card numbers or banking passwords).</li>
              </ul>
            </div>

            {/* Section 2 */}
            <div className="legal-article" style={{ marginBottom: '2.25rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#38BDF8', margin: '0 0 0.75rem 0' }}>
                2. Legal Basis &amp; Why We Collect KYC Data
              </h3>
              <p style={{ lineHeight: 1.75, fontSize: '0.95rem', color: '#CBD5E1' }}>
                2.1. <strong>Customs &amp; Aviation Mandate:</strong> Under regulations prescribed by the <strong>Central Board of Indirect Taxes &amp; Customs (CBIC)</strong> and the <strong>Bureau of Civil Aviation Security (BCAS)</strong>, every international parcel departing India must be accompanied by verified KYC documentation linking the shipment to an identifiable legal individual or entity.
              </p>
              <p style={{ lineHeight: 1.75, fontSize: '0.95rem', color: '#CBD5E1' }}>
                2.2. KYC data is collected solely to:
              </p>
              <ul style={{ paddingLeft: '1.5rem', lineHeight: 1.8, fontSize: '0.93rem', color: '#CBD5E1' }}>
                <li>Generate the official export shipping declaration (Courier Shipping Bill - CSB IV/V);</li>
                <li>Comply with anti-money laundering (AML) and anti-narcotics screening directives;</li>
                <li>Ensure smooth customs clearance without destination holding or confiscation.</li>
              </ul>
            </div>

            {/* Section 3 */}
            <div className="legal-article" style={{ marginBottom: '2.25rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#38BDF8', margin: '0 0 0.75rem 0' }}>
                3. How We Use Your Data
              </h3>
              <p style={{ lineHeight: 1.75, fontSize: '0.95rem', color: '#CBD5E1' }}>
                We process your personal information strictly for legitimate commercial and operational purposes:
              </p>
              <ul style={{ paddingLeft: '1.5rem', lineHeight: 1.8, fontSize: '0.93rem', color: '#CBD5E1' }}>
                <li>Generating and printing official Air Waybills (AWBs) and barcoded shipping labels;</li>
                <li>Dispatching mobile doorstep pickup vehicles to your home or office;</li>
                <li>Transmitting flight cargo manifests to scheduled international airlines operating from Rajiv Gandhi International Airport (RGIA) Hyderabad;</li>
                <li>Providing real-time automated tracking alerts via SMS, WhatsApp, and our online Tracking Portal;</li>
                <li>Coordinating with overseas delivery personnel for final physical handover.</li>
              </ul>
            </div>

            {/* Section 4 */}
            <div className="legal-article" style={{ marginBottom: '2.25rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#38BDF8', margin: '0 0 0.75rem 0' }}>
                4. Third-Party Sharing (Logistics Execution Only)
              </h3>
              <p style={{ lineHeight: 1.75, fontSize: '0.95rem', color: '#CBD5E1' }}>
                4.1. Sai Couriers does not sell, rent, trade, or distribute your data. Information is shared strictly on a need-to-know basis with authorized entities involved in the carriage chain:
              </p>
              <ul style={{ paddingLeft: '1.5rem', lineHeight: 1.8, fontSize: '0.93rem', color: '#CBD5E1' }}>
                <li><strong>International Airlines:</strong> Air cargo handlers and airline cargo security screening teams;</li>
                <li><strong>Sovereign Customs Authorities:</strong> Indian Customs (EDI system) and foreign border control agencies (e.g. US CBP, UK Border Force, Australian Customs);</li>
                <li><strong>Last-Mile Delivery Partners:</strong> Licensed global express logistics networks (including FedEx, DHL, UPS, Aramex, and national postal administrations);</li>
                <li><strong>Law Enforcement:</strong> If mandated by a formal warrant, court order, or national security directive under the laws of India.</li>
              </ul>
            </div>

            {/* Section 5 */}
            <div className="legal-article" style={{ marginBottom: '2.25rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#38BDF8', margin: '0 0 0.75rem 0' }}>
                5. Data Security &amp; Encryption Standards
              </h3>
              <p style={{ lineHeight: 1.75, fontSize: '0.95rem', color: '#CBD5E1' }}>
                5.1. <strong>SSL 256-Bit Encryption:</strong> All data transmitted through our website, online quote calculator, and booking tools is encrypted using industry-standard TLS 1.3 / 256-bit SSL protocols.
              </p>
              <p style={{ lineHeight: 1.75, fontSize: '0.95rem', color: '#CBD5E1' }}>
                5.2. <strong>Restricted Internal Access:</strong> Customer KYC documents and ID cards are stored in secure, permission-controlled digital repositories accessible only to authorized customs filing managers. Physical paper manifests are stored under lock and key at our central hub in Kadapa.
              </p>
            </div>

            {/* Section 6 */}
            <div className="legal-article" style={{ marginBottom: '2.25rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#38BDF8', margin: '0 0 0.75rem 0' }}>
                6. Data Retention Period
              </h3>
              <p style={{ lineHeight: 1.75, fontSize: '0.95rem', color: '#CBD5E1' }}>
                Under the Indian Customs Act and export documentation regulations, international shipping manifests and supporting KYC records must be retained for a statutory audit period of <strong>five (5) to seven (7) years</strong> following the financial year of export. Once the statutory retention period expires, files are permanently shredded or cryptographically deleted.
              </p>
            </div>

            {/* Section 7 */}
            <div className="legal-article" style={{ marginBottom: '2.25rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#38BDF8', margin: '0 0 0.75rem 0' }}>
                7. Your Legal Rights (DPDP Act 2023)
              </h3>
              <p style={{ lineHeight: 1.75, fontSize: '0.95rem', color: '#CBD5E1' }}>
                Subject to mandatory customs and statutory retention requirements, you have the right to:
              </p>
              <ul style={{ paddingLeft: '1.5rem', lineHeight: 1.8, fontSize: '0.93rem', color: '#CBD5E1' }}>
                <li>Request confirmation and summary of personal data held about you;</li>
                <li>Request correction of inaccurate or outdated contact details;</li>
                <li>Withdraw consent for optional promotional alerts via SMS or WhatsApp;</li>
                <li>File a grievance regarding data handling with our designated Data Grievance Officer.</li>
              </ul>
            </div>

            {/* Section 8 */}
            <div className="legal-article" style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#38BDF8', margin: '0 0 0.75rem 0' }}>
                8. Grievance Officer &amp; Privacy Contact
              </h3>
              <p style={{ lineHeight: 1.75, fontSize: '0.95rem', color: '#CBD5E1' }}>
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
                <strong>Data Protection &amp; Grievance Redressal Desk</strong><br />
                Attn: <strong>S. Junaid Mohuddin &amp; S. Chandra Vadu (Managing Directors)</strong><br />
                Entity: <strong>Sai International Couriers &amp; Cargo</strong><br />
                Address: 41/1248, Ratna Sabhapathi Building, Co-operative Colony, Kadapa, AP - 516001, India<br />
                Official Email: <strong>saiinternationalcouriers83@gmail.com</strong><br />
                Direct Privacy Desk: <strong>+91 90599 49365</strong> | <strong>+91 90000 22821</strong> | <strong>+91 90008 67874</strong>
              </div>
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
                <strong>Need Help with KYC or Tracking Privacy?</strong><br />
                <span style={{ color: '#94A3B8' }}>Our customer support team is available Mon-Sun: 9:00 AM - 9:30 PM IST</span>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
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
      </section>
    </main>
  );
}
