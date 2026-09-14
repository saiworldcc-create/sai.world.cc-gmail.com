import { Link } from 'react-router-dom';

export default function EcommerceLogisticsPage() {
  return (
    <main style={{ paddingTop: '80px', minHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
      <section className="page-hero-banner">
        <div className="container">
          <div className="breadcrumb-trail">
            <Link to="/">Home</Link>
            <span className="separator"><i className="fa-solid fa-chevron-right"></i></span>
            <Link to="/services">Services</Link>
            <span className="separator"><i className="fa-solid fa-chevron-right"></i></span>
            <span className="current">E-commerce Logistics</span>
          </div>
          <div className="eyebrow-pill teal">Global Logistics</div>
          <h1 className="page-hero-title">E-commerce Logistics</h1>
          <p className="page-hero-desc">
            Premium, end-to-end e-commerce logistics solutions tailored for your business and personal needs.
          </p>
        </div>
      </section>
      
      <section className="section section-white" style={{ flexGrow: 1 }}>
        <div className="container center">
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--text-slate-dark)' }}>Comprehensive E-commerce Logistics</h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-slate-muted)', maxWidth: '700px', margin: '0 auto 2rem' }}>
            We provide reliable, cost-effective, and highly secure e-commerce logistics across our global network covering 195+ countries.
          </p>
          <Link to="/contact" className="btn btn-coral">Get a Custom Quote</Link>
        </div>
      </section>
    </main>
  );
}