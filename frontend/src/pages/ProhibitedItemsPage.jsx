import { Link } from 'react-router-dom';
import usePageContent from '../hooks/usePageContent';

export default function ProhibitedItemsPage() {
  const { content } = usePageContent('prohibited-items', {});
  const hero = content.hero || {};

  return (
    <main style={{ paddingTop: '80px' }}>
      <section className="page-hero-banner" style={{ background: 'var(--bg-slate-darker)' }}>
        <div className="container">
          <div className="breadcrumb-trail">
            <Link to="/">Home</Link>
            <span className="separator"><i className="fa-solid fa-chevron-right"></i></span>
            <span className="current">Prohibited & Restricted Items</span>
          </div>
          <div className="eyebrow-pill" style={{ background: 'rgba(233, 120, 86, 0.15)', color: 'var(--accent-coral)', borderColor: 'rgba(233, 120, 86, 0.3)' }}>
            {hero.eyebrow || 'Aviation Safety Rules'}
          </div>
          <h1 className="page-hero-title">{hero.heading || 'Prohibited & Restricted Items'}</h1>
          <p className="page-hero-desc">
            {hero.lead || 'The following items are strictly banned from international air cargo transport under IATA regulations.'}
          </p>
        </div>
      </section>

      <section className="section section-ivory">
        <div className="container">
          <div style={{ background: '#FFF', borderRadius: '12px', padding: '2.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #F1F5F9' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem 2rem' }}>
              
              {/* Column 1 */}
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {[
                  "Medicines (Unprescribed & Hidden)",
                  "Gold & Silver Ornaments",
                  "Precious Stones & Gems",
                  "Currency Notes & Coins",
                  "Dry Coconut (Copra) & Coconut Powder",
                  "Lipsticks, Perfumes, Body Sprays",
                  "Magnets & Magnetic Items",
                  "Agarbathi (Incense Sticks)",
                  "Matchboxes, Fire Lighters",
                  "Sandalwood & Sandal Powder",
                  "Batteries & Power Banks",
                  "Knives, Swords, Toy Guns",
                  "Milk & Dairy Products",
                  "Radioactive Materials"
                ].map((item, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem', color: '#334155', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.5rem' }}>
                    <i className="fa-solid fa-ban" style={{ color: '#E74C3C', fontSize: '1.1rem' }}></i> {item}
                  </li>
                ))}
              </ul>

              {/* Column 2 */}
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {[
                  "Narcotics, Weed, Cocaine, Drugs",
                  "Nail Polish, Nail Cutters",
                  "Camphor, Leaves, Scissors",
                  "Carbon Papers, Fevikwik, Adhesives",
                  "Cooking Oil, Detergent, Washing Powder",
                  "Seeds, Plant Saplings, Soil",
                  "SIM Cards, Battery Toys, Cell Watches",
                  "Poisonous & Toxic Substances",
                  "Acids, Alkalis, Bleaches",
                  "Flammable Items, Explosives",
                  "Naphthalene Balls",
                  "Wax & Wax Items",
                  "Medicinal Oils, Creams, Powders",
                  "White Flours & Unmarked Powders",
                  "Oxidizing Substances"
                ].map((item, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem', color: '#334155', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.5rem' }}>
                    <i className="fa-solid fa-ban" style={{ color: '#E74C3C', fontSize: '1.1rem' }}></i> {item}
                  </li>
                ))}
              </ul>
              
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
