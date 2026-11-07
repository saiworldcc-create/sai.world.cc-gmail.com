import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function PrivacyPolicyPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <main style={{ paddingTop: '72px' }}>
      {/* Oracle-Style Legal Sub-Navigation Tab Bar */}
      <nav className="oracle-subnav-bar" aria-label="Privacy Navigation">
        <div className="oracle-subnav-container">
          <Link to="/terms" className="oracle-subnav-tab">
            Terms of Carriage
          </Link>
          <Link to="/privacy" className="oracle-subnav-tab active teal-theme">
            Privacy Policy
          </Link>
          <a href="#data-collected" className="oracle-subnav-tab">
            Data Collected
          </a>
          <a href="#kyc-mandate" className="oracle-subnav-tab">
            KYC Mandate
          </a>
          <a href="#data-usage" className="oracle-subnav-tab">
            Data Usage
          </a>
          <a href="#forwarders" className="oracle-subnav-tab">
            Airline &amp; Customs Sharing
          </a>
          <a href="#data-retention" className="oracle-subnav-tab">
            Retention Rules
          </a>
          <a href="#grievance-officer" className="oracle-subnav-tab">
            Grievance Officer
          </a>
          <Link to="/branches" className="oracle-subnav-tab">
            Branch Network
          </Link>
        </div>
      </nav>

      {/* Oracle-Style Clean Hero Banner */}
      <section className="oracle-hero-banner">
        <div className="oracle-hero-container">
          <div className="breadcrumb-trail" style={{ marginBottom: '1.25rem' }}>
            <Link to="/">Home</Link>
            <span className="separator"><i className="fa-solid fa-chevron-right"></i></span>
            <span>Legal &amp; Compliance</span>
            <span className="separator"><i className="fa-solid fa-chevron-right"></i></span>
            <span className="current">Privacy Policy</span>
          </div>

          <h1 className="oracle-hero-title">
            Privacy Policy &amp; Data Protection
          </h1>

          <p className="oracle-hero-lead">
            How Sai International Couriers &amp; Cargo collects, verifies, stores, and safeguards your personal identity and cross-border shipping documentation in accordance with Indian and International privacy laws.
          </p>

          <div className="oracle-meta-strip">
            <div className="oracle-meta-item">
              Statutory Framework: <strong>DPDP Act 2023 &amp; IT Act 2000</strong>
            </div>
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
              Executive Governance: Managing Directors <strong>S. Junaid Mohuddin</strong> &amp; <strong>S. Chandra Vadu</strong>
            </div>
          </div>
        </div>
      </section>

      {/* Oracle-Style Clean Single-Column Document */}
      <section className="oracle-doc-section">
        <div className="oracle-doc-container">

          {/* Privacy Trust Card */}
          <div className="oracle-notice-box teal-theme">
            <div className="oracle-notice-title teal-theme">
              <i className="fa-solid fa-lock"></i>
              Our Unconditional Privacy Guarantee
            </div>
            <p className="oracle-notice-text">
              <strong>SAI INTERNATIONAL COURIERS &amp; CARGO</strong> is committed to preserving the confidentiality of your personal shipping data and KYC records. We <strong>never sell, lease, or monetize</strong> your personal details or government ID copies to third-party marketing companies. Data is collected solely to execute cross-border air cargo transport, satisfy statutory Indian Customs (CBIC) mandates, and ensure secure doorstep delivery worldwide.
            </p>
          </div>

          {/* Section 1 */}
          <article id="data-collected" className="oracle-clause-item">
            <h2 className="oracle-clause-heading teal-theme">
              <span className="num">1.</span> Information We Collect
            </h2>
            <p className="oracle-clause-p">
              To fulfill our logistics obligations and satisfy statutory government aviation and customs rules, Sai Couriers collects the following categories of information:
            </p>
            <ul className="oracle-clause-list teal-theme">
              <li><strong>Contact Information:</strong> Full legal names, physical origin and delivery addresses, mobile numbers, and email addresses of both Shipper (Sender) and Consignee (Receiver).</li>
              <li><strong>Statutory Sender KYC Records:</strong> Government-issued identification (Aadhaar Card, Indian Passport, Driving License, or Voter ID) and PAN Card copies.</li>
              <li><strong>Shipment Manifest Details:</strong> Item descriptions, declared value, invoice amounts, HS codes, gross weight, volumetric dimensions, and specialized packaging instructions.</li>
              <li><strong>Digital &amp; Transaction Data:</strong> IP address, browser type, booking timestamps, online payment transaction identifiers (processed securely via PCI-DSS certified gateways; we never store raw credit card numbers or banking passwords).</li>
            </ul>
          </article>

          {/* Section 2 */}
          <article id="kyc-mandate" className="oracle-clause-item">
            <h2 className="oracle-clause-heading teal-theme">
              <span className="num">2.</span> Legal Basis &amp; Why We Collect KYC Data
            </h2>
            <p className="oracle-clause-p">
              2.1. <strong>Customs &amp; Aviation Mandate:</strong> Under regulations prescribed by the <strong>Central Board of Indirect Taxes &amp; Customs (CBIC)</strong> and the <strong>Bureau of Civil Aviation Security (BCAS)</strong>, every international parcel departing India must be accompanied by verified KYC documentation linking the shipment to an identifiable legal individual or entity.
            </p>
            <p className="oracle-clause-p">
              2.2. KYC data is collected solely to:
            </p>
            <ul className="oracle-clause-list teal-theme">
              <li>Generate the official export shipping declaration (Courier Shipping Bill - CSB IV/V);</li>
              <li>Comply with anti-money laundering (AML) and anti-narcotics screening directives;</li>
              <li>Ensure smooth customs clearance without destination holding or confiscation.</li>
            </ul>
          </article>

          {/* Section 3 */}
          <article id="data-usage" className="oracle-clause-item">
            <h2 className="oracle-clause-heading teal-theme">
              <span className="num">3.</span> How We Use Your Data
            </h2>
            <p className="oracle-clause-p">
              We process your personal information strictly for legitimate commercial and operational purposes:
            </p>
            <ul className="oracle-clause-list teal-theme">
              <li>Generating and printing official Air Waybills (AWBs) and barcoded shipping labels;</li>
              <li>Dispatching mobile doorstep pickup vehicles to your home or office;</li>
              <li>Transmitting flight cargo manifests to scheduled international airlines operating from Rajiv Gandhi International Airport (RGIA) Hyderabad;</li>
              <li>Providing real-time automated tracking alerts via SMS, WhatsApp, and email;</li>
              <li>Resolving shipment inquiries, claims, and providing customer care assistance.</li>
            </ul>
          </article>

          {/* Section 4 */}
          <article id="forwarders" className="oracle-clause-item">
            <h2 className="oracle-clause-heading teal-theme">
              <span className="num">4.</span> Third-Party Disclosures &amp; International Forwarders
            </h2>
            <p className="oracle-clause-p">
              4.1. <strong>Operational Forwarding Partners:</strong> To execute end-to-end global delivery across 195+ destination countries, consignment manifests and customs invoices are shared securely with verified international logistics networks (such as DHL Express, FedEx, UPS, Aramex, and local national postal authorities).
            </p>
            <p className="oracle-clause-p">
              4.2. <strong>Statutory Authorities:</strong> We are legally obligated to disclose shipping records and identity credentials to law enforcement, Indian Customs, CISF airport security, and destination customs authorities upon receipt of a lawful warrant or regulatory audit notice.
            </p>
          </article>

          {/* Section 5 */}
          <article id="data-security" className="oracle-clause-item">
            <h2 className="oracle-clause-heading teal-theme">
              <span className="num">5.</span> Data Storage, Security &amp; Encryption
            </h2>
            <p className="oracle-clause-p">
              5.1. All web traffic between your browser and our booking portals is protected by <strong>HTTPS 256-Bit SSL/TLS Encryption</strong>.
            </p>
            <p className="oracle-clause-p">
              5.2. Customer KYC files and government identification scans are housed in password-protected, encrypted digital repositories accessible only to authorized customs filing managers. Physical paper manifests are stored under lock and key at our central hub in Kadapa.
            </p>
          </article>

          {/* Section 6 */}
          <article id="data-retention" className="oracle-clause-item">
            <h2 className="oracle-clause-heading teal-theme">
              <span className="num">6.</span> Data Retention Period
            </h2>
            <p className="oracle-clause-p">
              Under the Indian Customs Act and export documentation regulations, international shipping manifests and supporting KYC records must be retained for a statutory audit period of <strong>five (5) to seven (7) years</strong> following the financial year of export. Once the statutory retention period expires, files are permanently shredded or cryptographically deleted.
            </p>
          </article>

          {/* Section 7 */}
          <article id="shipper-rights" className="oracle-clause-item">
            <h2 className="oracle-clause-heading teal-theme">
              <span className="num">7.</span> Your Legal Rights (DPDP Act 2023)
            </h2>
            <p className="oracle-clause-p">
              Subject to mandatory customs and statutory retention requirements, you have the right to:
            </p>
            <ul className="oracle-clause-list teal-theme">
              <li>Request confirmation and summary of personal data held about you;</li>
              <li>Request correction of inaccurate or outdated contact details;</li>
              <li>Withdraw consent for optional promotional alerts via SMS or WhatsApp;</li>
              <li>File a grievance regarding data handling with our designated Data Grievance Officer.</li>
            </ul>
          </article>

          {/* Section 8 */}
          <article id="grievance-officer" className="oracle-clause-item">
            <h2 className="oracle-clause-heading teal-theme">
              <span className="num">8.</span> Grievance Officer &amp; Privacy Contact
            </h2>
            <p className="oracle-clause-p">
              In accordance with the <strong>Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011</strong> and the <strong>DPDP Act, 2023</strong>, the contact details for our Grievance Officer are:
            </p>
            <div style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '8px',
              padding: '1.25rem 1.5rem',
              margin: '1.25rem 0',
              lineHeight: 1.8,
              fontSize: '0.93rem'
            }}>
              <strong style={{ color: '#FFFFFF', fontSize: '1rem' }}>Data Protection &amp; Grievance Redressal Desk</strong><br />
              Attn: <strong>S. Junaid Mohuddin &amp; S. Chandra Vadu (Managing Directors)</strong><br />
              Operating Entity: <strong>Sai International Couriers &amp; Cargo</strong><br />
              Registered Head Office: 41/1248, Ratna Sabhapathi Building, Co-operative Colony, Kadapa, AP - 516001, India<br />
              Official Email: <strong>saiinternationalcouriers83@gmail.com</strong><br />
              Direct Privacy Desk: <strong>+91 90599 49365</strong> | <strong>+91 90000 22821</strong> | <strong>+91 90008 67874</strong>
            </div>
          </article>

          {/* Clean Support and Legal Contact Footer */}
          <div className="oracle-doc-footer">
            <div>
              <strong style={{ color: '#FFFFFF', fontSize: '0.95rem' }}>Need Help with KYC or Tracking Privacy?</strong><br />
              <span style={{ color: '#94A3B8' }}>Our customer support desk is available Mon-Sun: 9:00 AM - 9:30 PM IST</span>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Link to="/terms" className="btn btn-teal btn-sm">
                <i className="fa-solid fa-file-contract"></i> View Terms of Carriage
              </Link>
              <button onClick={() => window.print()} className="btn btn-soft-cream btn-sm">
                <i className="fa-solid fa-print"></i> Print Policy
              </button>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
