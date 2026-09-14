import { Link } from 'react-router-dom';

export default function TrackingFaqsPage() {
  return (
    <main style={{ paddingTop: '80px', minHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
      <section className="page-hero-banner">
        <div className="container">
          <div className="breadcrumb-trail">
            <Link to="/">Home</Link>
            <span className="separator"><i className="fa-solid fa-chevron-right"></i></span>
            <Link to="/tracking">Tracking</Link>
            <span className="separator"><i className="fa-solid fa-chevron-right"></i></span>
            <span className="current">FAQs</span>
          </div>
          <div className="eyebrow-pill">Support Center</div>
          <h1 className="page-hero-title">Tracking Support & FAQs</h1>
          <p className="page-hero-desc">
            Find answers to common questions about your shipment's journey, customs clearance, and delivery updates.
          </p>
        </div>
      </section>

      <section className="section section-white" style={{ flexGrow: 1 }}>
        <div className="container">
          <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div className="faq-premium-card" style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', background: 'var(--bg-ivory)', padding: '2rem', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--accent-coral)' }}>
              <div style={{ flexShrink: 0, width: '60px', height: '60px', marginTop: '-0.5rem' }}>
                <img src="/assets/rocket.png" className="rocket-float" style={{ height: '100%', width: '100%', objectFit: 'contain' }} alt="Rocket" />
              </div>
              <div>
                <h4 style={{ fontSize: '1.15rem', color: 'var(--text-slate-dark)', marginBottom: '0.75rem' }}>Why is my tracking status not updating?</h4>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-slate-muted)', margin: 0, lineHeight: 1.6 }}>
                  International shipments may not show updates for 24-48 hours while they are in mid-flight transit or awaiting physical customs clearance at the destination gateway. If there are no updates for more than 3 business days, please contact our support team.
                </p>
              </div>
            </div>
            
            <div className="faq-premium-card" style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', background: 'var(--bg-ivory)', padding: '2rem', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--accent-teal)' }}>
              <div style={{ flexShrink: 0, width: '60px', height: '60px', marginTop: '-0.5rem' }}>
                <img src="/assets/rocket.png" className="rocket-float" style={{ height: '100%', width: '100%', objectFit: 'contain' }} alt="Rocket" />
              </div>
              <div>
                <h4 style={{ fontSize: '1.15rem', color: 'var(--text-slate-dark)', marginBottom: '0.75rem' }}>What does "Customs Clearance Exception" mean?</h4>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-slate-muted)', margin: 0, lineHeight: 1.6 }}>
                  This indicates that the destination customs authorities require additional documentation (such as an importer KYC, commercial invoice, or recipient ID) before releasing the parcel. Our dedicated clearance team proactively handles these exceptions, but we may reach out to the receiver if their direct intervention is required.
                </p>
              </div>
            </div>

            <div className="faq-premium-card" style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', background: 'var(--bg-ivory)', padding: '2rem', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--text-slate-dark)' }}>
              <div style={{ flexShrink: 0, width: '60px', height: '60px', marginTop: '-0.5rem' }}>
                <img src="/assets/rocket.png" className="rocket-float" style={{ height: '100%', width: '100%', objectFit: 'contain' }} alt="Rocket" />
              </div>
              <div>
                <h4 style={{ fontSize: '1.15rem', color: 'var(--text-slate-dark)', marginBottom: '0.75rem' }}>Can I change the delivery address after dispatch?</h4>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-slate-muted)', margin: 0, lineHeight: 1.6 }}>
                  Address modifications are strictly only possible before the parcel departs from our central Hyderabad (RGIA) hub. Once the parcel is in flight or has reached the destination country, local carrier address rerouting fees may apply and delivery may be delayed.
                </p>
              </div>
            </div>

            <div className="faq-premium-card" style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', background: 'var(--bg-ivory)', padding: '2rem', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--accent-teal)' }}>
              <div style={{ flexShrink: 0, width: '60px', height: '60px', marginTop: '-0.5rem' }}>
                <img src="/assets/rocket.png" className="rocket-float" style={{ height: '100%', width: '100%', objectFit: 'contain' }} alt="Rocket" />
              </div>
              <div>
                <h4 style={{ fontSize: '1.15rem', color: 'var(--text-slate-dark)', marginBottom: '0.75rem' }}>What happens if nobody is home during delivery?</h4>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-slate-muted)', margin: 0, lineHeight: 1.6 }}>
                  Our local delivery partners usually attempt delivery up to 3 times. If nobody is available, they will leave a "Missed Delivery" card with instructions on how to schedule a redelivery or collect the parcel from a nearby local depot.
                </p>
              </div>
            </div>
            
            <div style={{ textAlign: 'center', marginTop: '2rem', padding: '2rem', borderTop: '1px solid var(--border-light)' }}>
              <h4 style={{ fontSize: '1.2rem', color: 'var(--text-slate-dark)', marginBottom: '1rem' }}>Still need help with your shipment?</h4>
              <Link to="/contact" className="btn btn-coral">
                <i className="fa-solid fa-headset"></i> Contact Customer Support
              </Link>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
