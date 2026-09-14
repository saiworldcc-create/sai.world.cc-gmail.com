import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import usePageContent from '../hooks/usePageContent';

const DEFAULT_BRANCHES = [
  {
    id: 'kadapa-ho',
    name: 'Kadapa Head Office (Main Hub)',
    district: 'Kadapa',
    tag: 'Headquarters & Central Hub',
    pincode: '516001',
    address: '41/1248, Ratna Sabhapathi Building, Co-operative Colony, Kadapa, AP - 516001',
    landmark: 'Opposite Cooperative Bank / Near Old Bus Stand',
    phones: ['+91 90599 49365', '+91 96031 49365'],
    manager: 'S. Chandra Babu (MD)',
    email: 'saiinternationalcouriers83@gmail.com',
    hours: 'Mon - Sun: 09:00 AM - 09:30 PM',
    mapEmbed: 'https://maps.google.com/maps?q=14.4726874,78.8323784+(SAI+INTERNATIONAL+COURIER)&t=&z=17&ie=UTF8&iwloc=B&output=embed',
    directionsUrl: "https://www.google.com/maps/place/SAI+INTERNATIONAL+COURIER'S+SERVICE'S/@14.4726874,78.8323784,17z/",
    amenities: ['Commercial Vacuum Sealing', 'Calibrated Digital Scale', '5-Ply Export Box Center', 'Free Customer Parking', 'Doorstep Pickup Dispatch']
  },
  {
    id: 'kadapa-b2',
    name: 'Kadapa Branch 2 (Nagarajupeta)',
    district: 'Kadapa',
    tag: 'City Express Counter',
    pincode: '516001',
    address: 'Beside MedPlus Pharmacy, Near Visweswaraiah Circle, Nagarajupeta, Kadapa, AP - 516001',
    landmark: 'Beside MedPlus Pharmacy',
    phones: ['+91 96030 49365', '+91 90599 49365'],
    manager: 'K. Rajesh Kumar',
    email: 'kadapa2@saiinternationalcouriers.com',
    hours: 'Mon - Sat: 09:30 AM - 09:00 PM',
    mapEmbed: 'https://maps.google.com/maps?q=Visweswaraiah+Circle,+Kadapa,+Andhra+Pradesh+516001&t=&z=16&ie=UTF8&iwloc=&output=embed',
    directionsUrl: 'https://maps.google.com/?q=Visweswaraiah+Circle,+Kadapa,+Andhra+Pradesh+516001',
    amenities: ['Vacuum Packaging', 'Digital Scale', 'Student Transcripts Express', 'Instant KYC Verification']
  },
  {
    id: 'tirupati-hub',
    name: 'Tirupati Regional Center',
    district: 'Tirupati',
    tag: 'Temple City Regional Hub',
    pincode: '517501',
    address: 'Bhavani Nagar Main Road, Near RTC Central Bus Stand, Tirupati, AP - 517501',
    landmark: 'Near RTC Central Bus Stand',
    phones: ['+91 99853 23365', '+91 90599 49365'],
    manager: 'M. Venkat Reddy',
    email: 'tirupati@saiinternationalcouriers.com',
    hours: 'Mon - Sun: 09:00 AM - 09:30 PM',
    mapEmbed: 'https://maps.google.com/maps?q=Tirupati,+Andhra+Pradesh&t=&z=14&ie=UTF8&iwloc=&output=embed',
    directionsUrl: 'https://maps.google.com/?q=Tirupati,+Andhra+Pradesh',
    amenities: ['NRI Prasadam Packaging', 'Industrial Vacuum Sealer', 'Student Visa Baggage Desk', 'Free Doorstep Collection']
  },
  {
    id: 'nellore-hub',
    name: 'Nellore Regional Center',
    district: 'Nellore',
    tag: 'Coastal District Logistics Hub',
    pincode: '524001',
    address: 'Grand Trunk Road, Opp. RTC Complex, Subedarpet, Nellore, AP - 524001',
    landmark: 'Opposite RTC Complex',
    phones: ['+91 96031 49365', '+91 90599 49365'],
    manager: 'P. Srinivasulu',
    email: 'nellore@saiinternationalcouriers.com',
    hours: 'Mon - Sun: 09:00 AM - 09:00 PM',
    mapEmbed: 'https://maps.google.com/maps?q=Nellore,+Andhra+Pradesh&t=&z=14&ie=UTF8&iwloc=&output=embed',
    directionsUrl: 'https://maps.google.com/?q=Nellore,+Andhra+Pradesh',
    amenities: ['Spices & Pickle Sealing', 'Digital Weighing Machine', 'Air Cargo Booking', 'Doorstep Van Service']
  },
  {
    id: 'proddatur-hub',
    name: 'Proddatur Express Counter',
    district: 'Kadapa',
    tag: 'Commercial Gold City Counter',
    pincode: '516360',
    address: 'Gandhi Road, Near Sivalayam Temple, Proddatur, YSR Kadapa Dist, AP - 516360',
    landmark: 'Near Sivalayam Temple',
    phones: ['+91 96030 49365', '+91 90599 49365'],
    manager: 'V. Ramanjaneyulu',
    email: 'proddatur@saiinternationalcouriers.com',
    hours: 'Mon - Sat: 09:30 AM - 08:30 PM',
    mapEmbed: 'https://maps.google.com/maps?q=Proddatur,+Andhra+Pradesh&t=&z=14&ie=UTF8&iwloc=&output=embed',
    directionsUrl: 'https://maps.google.com/?q=Proddatur,+Andhra+Pradesh',
    amenities: ['Vacuum Sealing', 'Commercial Textile Samples', 'Door Pickup Team', 'Express Cargo']
  },
  {
    id: 'rayachoty-hub',
    name: 'Rayachoty Express Branch',
    district: 'Rayachoty',
    tag: 'District Headquarters Express Desk',
    pincode: '516269',
    address: 'Main Bazar Road, Near Old Bus Stand, Rayachoty, Annamayya Dist, AP - 516269',
    landmark: 'Near Old Bus Stand',
    phones: ['+91 90599 49365', '+91 96031 49365'],
    manager: 'K. Subba Reddy',
    email: 'rayachoty@saiinternationalcouriers.com',
    hours: 'Mon - Sat: 09:30 AM - 08:30 PM',
    mapEmbed: 'https://maps.google.com/maps?q=Rayachoty,+Andhra+Pradesh&t=&z=14&ie=UTF8&iwloc=&output=embed',
    directionsUrl: 'https://maps.google.com/?q=Rayachoty,+Andhra+Pradesh',
    amenities: ['Vacuum Packaging', 'Doorstep Pickup Service', 'Commercial Samples', 'Express Air Courier']
  }
];

export default function BranchesPage() {
  const { content } = usePageContent('branches', {});
  const hero = content.hero || {};
  const branchesList = content.branches || DEFAULT_BRANCHES;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [activeMapBranch, setActiveMapBranch] = useState(branchesList[0]?.id || 'kadapa-ho');

  const filteredBranches = useMemo(() => {
    return branchesList.filter(b => {
      const matchesDistrict = selectedDistrict === 'all' || b.district?.toLowerCase() === selectedDistrict.toLowerCase();
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        b.name?.toLowerCase().includes(q) || 
        b.district?.toLowerCase().includes(q) || 
        b.address?.toLowerCase().includes(q) || 
        b.pincode?.includes(q) ||
        b.landmark?.toLowerCase().includes(q);
      return matchesDistrict && matchesSearch;
    });
  }, [branchesList, searchQuery, selectedDistrict]);

  const activeBranchData = useMemo(() => {
    return branchesList.find(b => b.id === activeMapBranch) || branchesList[0];
  }, [branchesList, activeMapBranch]);

  return (
    <main style={{ paddingTop: '80px' }}>
      <section className="page-hero-banner">
        <div className="container">
          <div className="breadcrumb-trail">
            <Link to="/">Home</Link>
            <span className="separator"><i className="fa-solid fa-chevron-right"></i></span>
            <span className="current">Branch Network</span>
          </div>
          <div className="eyebrow-pill teal">
            <i className="fa-solid fa-location-dot"></i> {branchesList.length} Regional Hubs Across Andhra Pradesh
          </div>
          <h1 className="page-hero-title">{hero.heading || 'Find Your Nearest Branch & Drop-off Hub'}</h1>
          <p className="page-hero-desc">
            {hero.lead || 'Search by city, landmark, or 6-digit Pincode, toggle between Card View and Interactive Google Maps, and connect directly with our local logistics managers.'}
          </p>
        </div>
      </section>

      <section className="section section-ivory">
        <div className="container">
          {/* Toolbar */}
          <div className="branch-toolbar-card">
            <div className="branch-search-row">
              <div className="branch-search-input-wrap">
                <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: '1rem', color: 'var(--accent-teal)', fontSize: '1.1rem' }}></i>
                <input
                  type="text"
                  className="branch-search-input"
                  placeholder="Search by City, Branch Name, Area, or 6-Digit Pincode (e.g. 516001, Tirupati)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button 
                type="button" 
                className="btn btn-teal btn-sm" 
                style={{ padding: '0.85rem 1.4rem' }}
                onClick={() => {
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                      () => setSelectedDistrict('Kadapa'),
                      () => alert('Please enable location access in your browser.')
                    );
                  }
                }}
              >
                <i className="fa-solid fa-location-crosshairs"></i> Locate Near Me
              </button>
            </div>

            {/* Filter Pills & View Switcher */}
            <div className="branch-filter-pills-row">
              <div className="district-pills-group">
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-slate-muted)', marginRight: '0.25rem' }}>Filter Region:</span>
                {['all', 'Kadapa', 'Tirupati', 'Nellore', 'Rayachoty'].map(dist => (
                  <button
                    key={dist}
                    type="button"
                    className={`district-pill-btn${selectedDistrict === dist ? ' active' : ''}`}
                    onClick={() => setSelectedDistrict(dist)}
                  >
                    {dist === 'all' ? `All Branches (${branchesList.length})` : dist}
                  </button>
                ))}
              </div>

              <div className="view-mode-toggle-group">
                <button
                  type="button"
                  className={`view-toggle-btn${viewMode === 'grid' ? ' active' : ''}`}
                  onClick={() => setViewMode('grid')}
                >
                  <i className="fa-solid fa-table-cells-large"></i> Grid View
                </button>
                <button
                  type="button"
                  className={`view-toggle-btn${viewMode === 'map' ? ' active' : ''}`}
                  onClick={() => setViewMode('map')}
                >
                  <i className="fa-solid fa-map-location-dot"></i> Interactive Map
                </button>
              </div>
            </div>
          </div>

          {/* Results Counter */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-slate-main)' }}>
              Showing {filteredBranches.length} of {branchesList.length} Regional Branches
            </div>
            <Link to="/book-pickup" className="btn btn-outline-slate btn-sm">
              <i className="fa-solid fa-truck-fast" style={{ color: 'var(--accent-coral)' }}></i> Prefer Free Doorstep Pickup?
            </Link>
          </div>

          {/* Grid View */}
          {viewMode === 'grid' && (
            <div 
              className={searchQuery === '' && selectedDistrict === 'all' ? "quick-hub-marquee-wrapper" : "regional-branches-grid"} 
              style={searchQuery === '' && selectedDistrict === 'all' ? { margin: '2rem 0', padding: '1rem 0' } : { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.75rem' }}
            >
              <div 
                className={searchQuery === '' && selectedDistrict === 'all' ? "quick-hub-marquee-track" : ""} 
                style={searchQuery === '' && selectedDistrict === 'all' ? { gap: '1.75rem' } : { display: 'contents' }}
              >
                {(searchQuery === '' && selectedDistrict === 'all' 
                  ? [...filteredBranches, ...filteredBranches, ...filteredBranches] 
                  : filteredBranches).map((branch, idx) => (
                  <div key={`${branch.id}-${idx}`} className="branch-card-item" style={{ width: (searchQuery === '' && selectedDistrict === 'all') ? '380px' : 'auto', flexShrink: 0, background: 'var(--bg-card-tint)', borderRadius: 'var(--radius-lg)', padding: '1.75rem', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span className="eyebrow-pill teal" style={{ margin: 0, fontSize: '0.75rem' }}>{branch.tag || branch.district}</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-coral)' }}>PIN: {branch.pincode}</span>
                  </div>

                  <div>
                    <h3 style={{ fontSize: '1.25rem', color: 'var(--text-slate-dark)', marginBottom: '0.35rem' }}>{branch.name}</h3>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-slate-muted)', lineHeight: 1.5 }}>{branch.address}</p>
                    {branch.landmark && (
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-slate-light)', marginTop: '0.25rem' }}>
                        <i className="fa-solid fa-landmark" style={{ marginRight: '4px' }}></i> {branch.landmark}
                      </div>
                    )}
                  </div>

                  <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-slate-dark)' }}>
                      <i className="fa-solid fa-phone" style={{ color: 'var(--accent-teal)' }}></i>
                      <span>{(branch.phones || []).join(' / ')}</span>
                    </div>
                    {branch.hours && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-slate-muted)' }}>
                        <i className="fa-solid fa-clock" style={{ color: 'var(--accent-coral)' }}></i>
                        <span>{branch.hours}</span>
                      </div>
                    )}
                  </div>

                  {branch.amenities && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                      {branch.amenities.map(a => (
                        <span key={a} style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', background: 'var(--bg-mist)', borderRadius: 'var(--radius-xs)', color: 'var(--text-slate-dark)' }}>
                          ✓ {a}
                        </span>
                      ))}
                    </div>
                  )}

                  <div style={{ marginTop: 'auto', paddingTop: '0.75rem', display: 'flex', gap: '0.75rem' }}>
                    <a href={`tel:${branch.phones?.[0]?.replace(/\s/g, '') || '+919059949365'}`} className="btn btn-coral btn-sm" style={{ flex: 1 }}>
                      <i className="fa-solid fa-phone"></i> Call
                    </a>
                    <a href={branch.directionsUrl || `https://maps.google.com/?q=${encodeURIComponent(branch.address)}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline-slate btn-sm" style={{ flex: 1 }}>
                      <i className="fa-solid fa-diamond-turn-right"></i> Maps
                    </a>
                  </div>
                </div>
              ))}
              </div>
            </div>
          )}

          {/* Map View */}
          {viewMode === 'map' && (
            <div className="google-maps-card-wrapper">
              <div className="maps-interactive-header">
                <div className="maps-branch-selector-pills">
                  {branchesList.map(b => (
                    <button
                      key={b.id}
                      className={`map-branch-pill-btn${activeMapBranch === b.id ? ' active' : ''}`}
                      onClick={() => setActiveMapBranch(b.id)}
                    >
                      <i className="fa-solid fa-location-dot"></i> {b.name.split('(')[0].trim()}
                    </button>
                  ))}
                </div>
                <div>
                  <a href={activeBranchData?.directionsUrl || '#'} target="_blank" rel="noopener noreferrer" className="btn btn-soft-cream btn-sm">
                    <i className="fa-solid fa-diamond-turn-right" style={{ color: 'var(--accent-coral)' }}></i> Open in Maps
                  </a>
                </div>
              </div>

              <div className="google-map-iframe-container">
                <iframe
                  title="Branch Location"
                  src={activeBranchData?.mapEmbed || 'https://maps.google.com/maps?q=Kadapa&t=&z=14&ie=UTF8&iwloc=&output=embed'}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                ></iframe>
              </div>

              <div style={{ padding: '1rem 1.5rem', background: 'var(--bg-card-tint)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                <div>
                  <strong style={{ color: 'var(--text-slate-dark)', fontSize: '0.95rem' }}>{activeBranchData?.name}</strong>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-slate-muted)' }}>{activeBranchData?.address}</div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <a href={`tel:${activeBranchData?.phones?.[0]?.replace(/\s/g, '') || '+919059949365'}`} className="btn btn-coral btn-sm">
                    Call Branch
                  </a>
                  <Link to="/book-pickup" className="btn btn-teal btn-sm">
                    Book Pickup
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Doorstep Pickup CTA */}
      <section className="section section-peach">
        <div className="container">
          <div className="final-cta-container">
            <div>
              <div className="eyebrow-pill" style={{ marginBottom: '0.6rem' }}>Free Doorstep Collection</div>
              <h2 style={{ fontSize: '1.85rem', color: 'var(--text-slate-dark)', margin: '0 0 0.5rem 0' }}>Can't Visit Our Branch? We Come to You!</h2>
              <p style={{ color: 'var(--text-slate-muted)', maxWidth: '600px', margin: 0, fontSize: '0.95rem' }}>
                Our dedicated mobile pickup vehicles service all residential and commercial zones across Kadapa, Tirupati, Nellore, Proddatur, and Rayachoty with calibrated digital scales and free box packaging.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/book-pickup" className="btn btn-coral btn-lg">
                <i className="fa-solid fa-truck-fast"></i> Schedule Free Pickup
              </Link>
              <a href="tel:+919059949365" className="btn btn-outline-slate btn-lg">
                <i className="fa-solid fa-phone"></i> Call Main Desk
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
