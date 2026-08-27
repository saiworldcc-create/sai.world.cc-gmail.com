import { Link } from 'react-router-dom';
import usePageContent from '../hooks/usePageContent';
import useScrollReveal from '../hooks/useScrollReveal';

export default function FoodShippingPage() {
  const { content } = usePageContent('food-shipping', {});
  const hero = content.hero || {};
  const protocolRef = useScrollReveal();
  const foodsRef = useScrollReveal();

  return (
    <main style={{ paddingTop: '80px' }}>
      <section className="page-hero-banner reveal-init">
        <div className="container">
          <div className="breadcrumb-trail">
            <Link to="/">Home</Link>
            <span className="separator"><i className="fa-solid fa-chevron-right"></i></span>
            <span className="current">NRI Food & Pickles Special</span>
          </div>
          <div className="eyebrow-pill">{hero.eyebrow || 'Taste of Home, Delivered Worldwide'}</div>
          <h1 className="page-hero-title">{hero.heading || 'Authentic Andhra Delicacies Delivered Overseas in 4–5 Days'}</h1>
          <p className="page-hero-desc">
            {hero.lead || 'Specialized customs-certified packaging for homemade Avakaya pickles, Gongura, Rayalaseema sweets, spice powders, and groceries with guaranteed 100% leak-proof multi-layer vacuum sealing.'}
          </p>
        </div>
      </section>

      {/* 4-Stage Packaging Protocol */}
      <section className="section section-white reveal-init" ref={protocolRef}>
        <div className="container">
          <div className="section-header-editorial center reveal-init">
            <div className="eyebrow-pill teal">Certified Packaging Protocol</div>
            <h2 className="section-title">How We Guarantee 100% Leak-Proof Delivery</h2>
            <p className="section-lead">Our rigorous 4-step packaging process complies with international airline and customs standards.</p>
          </div>

          <div className="food-steps-timeline-grid">
            <div className="food-step-box reveal-init stagger-1">
              <div className="food-step-badge">1</div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--text-slate-dark)', margin: 0 }}>Inspection & Weight</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-slate-muted)', lineHeight: 1.55, margin: 0 }}>
                Every food item is inspected at our Kadapa hub for foreign customs compliance, shelf-life integrity, and proper initial container sealing.
              </p>
            </div>

            <div className="food-step-box">
              <div className="food-step-badge">2</div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--text-slate-dark)', margin: 0 }}>Heavy-Duty Vacuum Seal</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-slate-muted)', lineHeight: 1.55, margin: 0 }}>
                Sealed with multi-layer oil-resistant thermal vacuum barrier film that prevents aroma leakage and preserves authentic flavor freshness.
              </p>
            </div>

            <div className="food-step-box">
              <div className="food-step-badge">3</div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--text-slate-dark)', margin: 0 }}>Hard Airtight Canister</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-slate-muted)', lineHeight: 1.55, margin: 0 }}>
                Placed inside heavy-duty food-grade plastic jars with locking lids and secondary heat-shrink tamper-evident neck bands.
              </p>
            </div>

            <div className="food-step-box">
              <div className="food-step-badge">4</div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--text-slate-dark)', margin: 0 }}>Triple-Wall Carton</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-slate-muted)', lineHeight: 1.55, margin: 0 }}>
                Packed into reinforced corrugated export boxes with bubble cushioning, moisture silica packs, and cross-directional security straps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Allowed vs Prohibited Foods */}
      <section className="section section-ivory">
        <div className="container">
          <div className="section-header-editorial center">
            <div className="eyebrow-pill">Allowed vs. Prohibited Foods</div>
            <h2 className="section-title">What You Can Send Overseas</h2>
            <p className="section-lead">Quick reference guide for USA, UK, Canada, Australia, Singapore, and UAE food shipments.</p>
          </div>

          <div className="food-comparison-table-wrapper">
            <table className="food-comparison-table">
              <thead>
                <tr>
                  <th style={{ width: '25%' }}>Category</th>
                  <th style={{ width: '45%' }}>Items & Examples</th>
                  <th style={{ width: '15%' }}>Status</th>
                  <th style={{ width: '15%' }}>Packaging Requirement</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Homemade Pickles</strong></td>
                  <td>Andhra Mango Avakaya, Gongura, Tomato, Lemon, Ginger, Garlic, Red Chilli (Pandu Mirapakaya) pickles.</td>
                  <td><span className="status-badge-allowed"><i className="fa-solid fa-check"></i> Allowed</span></td>
                  <td>Multi-layer vacuum seal + Food-grade hard canister.</td>
                </tr>
                <tr>
                  <td><strong>Traditional Sweets</strong></td>
                  <td>Tirupati Laddu, Kakinada Kaja, Pootharekulu, Sunnundalu, Mysore Pak, Dry Fruit Halwa, Gulab Jamun.</td>
                  <td><span className="status-badge-allowed"><i className="fa-solid fa-check"></i> Allowed</span></td>
                  <td>Moisture-proof box packing + airtight wrap.</td>
                </tr>
                <tr>
                  <td><strong>Homemade Snacks</strong></td>
                  <td>Murukku, Chekkalu, Mixture, Sev, Ribbons, Boondi, Ribbon Pakoda, Banana Chips.</td>
                  <td><span className="status-badge-allowed"><i className="fa-solid fa-check"></i> Allowed</span></td>
                  <td>Nitrogen flushed / vacuum sealed pouches.</td>
                </tr>
                <tr>
                  <td><strong>Spices & Powders</strong></td>
                  <td>Karam Podi, Kandi Podi, Rasam Powder, Sambar Powder, Turmeric, Guntur Chilli Powder, Garam Masala.</td>
                  <td><span className="status-badge-allowed"><i className="fa-solid fa-check"></i> Allowed</span></td>
                  <td>Airtight leak-proof food pouch.</td>
                </tr>
                <tr>
                  <td><strong>Dry Groceries & Nuts</strong></td>
                  <td>Cashews, Almonds, Pistachios, Raisins, Jaggery (Bellam), Puffed Rice (Maramaralu), Poha.</td>
                  <td><span className="status-badge-allowed"><i className="fa-solid fa-check"></i> Allowed</span></td>
                  <td>Standard dry sealed packing.</td>
                </tr>
                <tr>
                  <td><strong>Fresh Dairy / Perishables</strong></td>
                  <td>Liquid raw milk, fresh homemade curd/yogurt, raw cottage cheese without commercial packaging.</td>
                  <td><span className="status-badge-prohibited"><i className="fa-solid fa-ban"></i> Prohibited</span></td>
                  <td>Not permitted by foreign customs.</td>
                </tr>
                <tr>
                  <td><strong>Raw Meats & Seafood</strong></td>
                  <td>Fresh raw chicken, mutton, raw fish or uncertified homemade meat preparations.</td>
                  <td><span className="status-badge-prohibited"><i className="fa-solid fa-ban"></i> Prohibited</span></td>
                  <td>Strict international quarantine ban.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Destination Country Guidelines */}
      <section className="section section-white">
        <div className="container">
          <div className="section-header-editorial center">
            <div className="eyebrow-pill teal">Global Customs Compliance</div>
            <h2 className="section-title">Destination Country Guidelines</h2>
            <p className="section-lead">We handle all required documentation and declarations so your food parcel clears foreign customs smoothly.</p>
          </div>

          <div className="values-cards-grid">
            <div className="value-item-card">
              <div className="value-icon-box">🇺🇸</div>
              <h3>USA (US FDA Compliance)</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-slate-muted)', lineHeight: 1.6 }}>
                Prior Notice confirmation filed by SAI Couriers for all commercial food items. Homemade non-meat items, pickles, and sweets clear smoothly when sealed under our certified vacuum process.
              </p>
            </div>

            <div className="value-item-card">
              <div className="value-icon-box">🇬🇧 🇪🇺</div>
              <h3>UK & European Union</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-slate-muted)', lineHeight: 1.6 }}>
                Processed homemade spices, Andhra pickles, sweets, and bakery goods enter under personal gift allowances up to threshold limits with itemized declarations.
              </p>
            </div>

            <div className="value-item-card">
              <div className="value-icon-box">🇦🇺 🇳🇿</div>
              <h3>Australia & New Zealand</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-slate-muted)', lineHeight: 1.6 }}>
                Strict biosecurity rules apply. Commercially processed, cooked, and vacuum-sealed food items with proper English labeling are fully accepted.
              </p>
            </div>

            <div className="value-item-card">
              <div className="value-icon-box">🇦🇪 🇸🇦</div>
              <h3>UAE & Gulf Countries</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-slate-muted)', lineHeight: 1.6 }}>
                Quick 3–4 business days air transit. All traditional Indian sweets, snacks, pickles, and groceries are welcomed under personal consumption rules.
              </p>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link to="/book-pickup" className="btn btn-coral btn-lg">
              <i className="fa-solid fa-truck-fast"></i> Book Free Pickup for Food Parcel
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
