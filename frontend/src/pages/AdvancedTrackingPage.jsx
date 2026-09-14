import { Link } from 'react-router-dom';

export default function AdvancedTrackingPage() {
  return (
    <main style={{ paddingTop: '80px', minHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
      <section className="page-hero-banner">
        <div className="container">
          <div className="breadcrumb-trail">
            <Link to="/">Home</Link>
            <span className="separator"><i className="fa-solid fa-chevron-right"></i></span>
            <Link to="/tracking">Tracking</Link>
            <span className="separator"><i className="fa-solid fa-chevron-right"></i></span>
            <span className="current">Advanced Tracking</span>
          </div>
          <div className="eyebrow-pill">B2B & Bulk Logistics</div>
          <h1 className="page-hero-title">Advanced Tracking Dashboard</h1>
          <p className="page-hero-desc">
            For commercial partners, e-commerce vendors, and bulk dispatchers handling multiple consignments.
          </p>
        </div>
      </section>

      <section className="section section-ivory" style={{ flexGrow: 1 }}>
        <div className="container">
          <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center', background: 'var(--bg-card-tint)', padding: '3.5rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-light)' }}>
            <i className="fa-solid fa-network-wired" style={{ fontSize: '3.5rem', color: 'var(--accent-teal)', marginBottom: '1.5rem' }}></i>
            <h3 style={{ fontSize: '1.6rem', color: 'var(--text-slate-dark)', marginBottom: '1rem' }}>Track Multiple Consignments</h3>
            <p style={{ color: 'var(--text-slate-muted)', marginBottom: '2rem', lineHeight: 1.6, fontSize: '1.05rem' }}>
              Need to track more than one Air Waybill? Use our advanced partner dashboard to trace up to 50 shipments simultaneously, download consolidated PDF reports, and set up automated API webhook alerts for your systems.
            </p>
            <Link to="/dashboard" className="btn btn-teal btn-lg">
              <i className="fa-regular fa-user"></i> Login to Partner Dashboard
            </Link>
            
            <div style={{ marginTop: '2.5rem', paddingTop: '2.5rem', borderTop: '1px solid var(--border-subtle)' }}>
              <h4 style={{ fontSize: '1.1rem', color: 'var(--text-slate-dark)', marginBottom: '0.75rem' }}>Don't have a commercial account?</h4>
              <p style={{ color: 'var(--text-slate-muted)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                Contact our sales team to open a B2B account with volume discounts and API access.
              </p>
              <Link to="/contact" className="btn btn-outline-slate">
                <i className="fa-solid fa-headset"></i> Contact Sales Team
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
