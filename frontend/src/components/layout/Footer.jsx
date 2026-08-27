import { Link } from 'react-router-dom';
import useScrollReveal from '../../hooks/useScrollReveal';

export default function Footer() {
  const ctaRef = useScrollReveal();
  const footerRef = useScrollReveal();

  return (
    <>
      {/* Final CTA */}
      <div className="container" style={{ marginBottom: '5rem' }}>
        <section className="final-cta-container reveal-init" ref={ctaRef}>
          <div style={{ maxWidth: '620px' }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.4rem)', marginBottom: '0.5rem', color: 'var(--text-slate-dark)' }}>
              Ready to Send Your Parcel Worldwide?
            </h2>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-slate-muted)' }}>
              Book a free doorstep pickup and let SAI handle the journey from Andhra Pradesh to 195+ countries.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/book-pickup" className="btn btn-coral btn-lg">
              <i className="fa-solid fa-truck-fast"></i> Book Free Pickup
            </Link>
            <a href="https://wa.me/919059949365?text=Hello%20Sai%20Couriers,%20I%20want%20to%20book%20a%20pickup." target="_blank" rel="noopener noreferrer" className="btn btn-teal btn-lg">
              <i className="fa-brands fa-whatsapp"></i> WhatsApp Us
            </a>
            <a href="tel:+919059949365" className="btn btn-outline-slate btn-lg">
              Call: 90599 49365
            </a>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="site-footer-deep-slate reveal-init" id="footer-contact" ref={footerRef}>
        <div className="container footer-main-grid">

          {/* Col 1: Brand */}
          <div className="footer-col">
            <div style={{ display: 'inline-flex', alignItems: 'center', background: '#FFFFFF', padding: '6px 12px', borderRadius: '12px', marginBottom: '0.75rem', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
              <img
                src="/assets/images/sai_logo_transparent.png"
                alt="Sai International Couriers & Cargo"
                style={{ height: '40px', width: 'auto', objectFit: 'contain', display: 'block' }}
              />
            </div>
            <p style={{ fontSize: '0.88rem', color: '#C2D5E5', lineHeight: '1.6', marginTop: '0.5rem' }}>
              Managing Director: <strong style={{ color: '#FFFFFF' }}>S. Chandra Babu</strong><br />
              Serving 195+ international destinations with door-to-door express parcel delivery, specialized food/pickle packaging, and air cargo solutions.
            </p>
            <div style={{ fontSize: '0.85rem', color: '#9FB8CC' }}>
              GSTIN: <strong style={{ color: '#FFFFFF' }}>37BOPPS1122H1ZS</strong>
            </div>
            <div className="footer-social-icons-row">
              <a href="https://wa.me/919059949365" className="social-brand-btn wa" aria-label="WhatsApp"><i className="fa-brands fa-whatsapp"></i></a>
              <a href="#" className="social-brand-btn fb" aria-label="Facebook"><i className="fa-brands fa-facebook-f"></i></a>
              <a href="#" className="social-brand-btn ig" aria-label="Instagram"><i className="fa-brands fa-instagram"></i></a>
              <a href="#" className="social-brand-btn x" aria-label="X"><i className="fa-brands fa-x-twitter"></i></a>
            </div>
          </div>

          {/* Col 2: Services */}
          <div className="footer-col">
            <h4 className="footer-col-title">Quick Services</h4>
            <div className="footer-links-list">
              <Link to="/services" className="footer-link-item">› International Courier</Link>
              <Link to="/services" className="footer-link-item">› International Air Cargo</Link>
              <Link to="/food-shipping" className="footer-link-item">› Pickles & Sweets Shipping</Link>
              <Link to="/services" className="footer-link-item">› University & Student Docs</Link>
              <Link to="/customs-guide" className="footer-link-item">› Customs & KYC Guide</Link>
              <Link to="/branches" className="footer-link-item">› Branch Network Directory</Link>
            </div>
          </div>

          {/* Col 3: Country Routes */}
          <div className="footer-col">
            <h4 className="footer-col-title">Top Country Routes</h4>
            <div className="footer-links-list">
              <Link to="/calculator" className="footer-link-item">› Courier to USA (4–5 Days)</Link>
              <Link to="/calculator" className="footer-link-item">› Courier to United Kingdom</Link>
              <Link to="/calculator" className="footer-link-item">› Courier to Canada</Link>
              <Link to="/calculator" className="footer-link-item">› Courier to Australia</Link>
              <Link to="/calculator" className="footer-link-item">› Courier to UAE & Dubai</Link>
              <Link to="/calculator" className="footer-link-item">› Courier to Germany & Europe</Link>
            </div>
          </div>

          {/* Col 4: Contact */}
          <div className="footer-col">
            <h4 className="footer-col-title">Branch Contact Info</h4>
            <div className="footer-info-row">
              <i className="fa-solid fa-location-dot"></i>
              <div>
                <strong style={{ color: '#FFFFFF' }}>Main Branch (Kadapa):</strong><br />
                41/1248, Ratna Sabhapathi Building, Co-operative Colony, Kadapa.
              </div>
            </div>
            <div className="footer-info-row">
              <i className="fa-solid fa-location-dot"></i>
              <div>
                <strong style={{ color: '#FFFFFF' }}>Branch 2 (Kadapa):</strong><br />
                Beside MedPlus, Near Visweswaraiah Circle, Kadapa - 516001, A.P.
              </div>
            </div>
            <div className="footer-info-row">
              <i className="fa-solid fa-phone"></i>
              <div>
                <strong>Phones:</strong><br />
                <a href="tel:+919059949365" style={{ color: '#F7A88B' }}>+91 90599 49365</a> | <a href="tel:+919603149365" style={{ color: '#F7A88B' }}>+91 96031 49365</a><br />
                <a href="tel:+919603049365" style={{ color: '#F7A88B' }}>+91 96030 49365</a> | <a href="tel:+919985323365" style={{ color: '#F7A88B' }}>+91 99853 23365</a>
              </div>
            </div>
            <div className="footer-info-row">
              <i className="fa-solid fa-envelope"></i>
              <div>
                <strong>Email:</strong><br />
                <a href="mailto:saiinternationalcouriers83@gmail.com" style={{ color: '#C2D5E5' }}>saiinternationalcouriers83@gmail.com</a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="container footer-bottom-bar">
          <div>© 2026 <strong>Sai International Couriers & Cargo</strong>. All Rights Reserved. GSTIN: 37BOPPS1122H1ZS.</div>
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            <span style={{ color: 'var(--accent-teal)', fontWeight: '600' }}>
              <i className="fa-solid fa-lock" style={{ marginRight: '4px' }}></i> HTTPS SSL 256-Bit Protected
            </span>
            <a href="#" style={{ color: '#9FB8CC' }}>Terms & Conditions</a>
            <a href="#" style={{ color: '#9FB8CC' }}>Privacy Policy</a>
          </div>
        </div>
      </footer>
    </>
  );
}
