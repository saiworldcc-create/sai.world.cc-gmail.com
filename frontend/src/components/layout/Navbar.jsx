import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { MEGA_MENU_LINKS } from '../../constants/appData';
import usePageContent from '../../hooks/usePageContent';

const DEFAULT_BRANDING = {
  logo: {
    url: '/assets/images/sai_logo_transparent.png',
    alt: 'Sai International Couriers & Cargo',
    height: 46,
    showText: false,
  },
  header: {
    companyName: 'SAI',
    tagline: 'International Couriers',
    phone: '+91 90599 49365',
    trackBtnText: 'Track',
    bookBtnText: 'Book Pickup',
  },
};

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [regionOpen, setRegionOpen] = useState(false);
  
  // Read current language from cookie or default to English
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };
  
  const [selectedRegion, setSelectedRegion] = useState(() => {
    const langCookie = getCookie('googtrans');
    if (langCookie === '/en/te') return 'India - Telugu';
    if (langCookie === '/en/hi') return 'India - Hindi';
    if (langCookie === '/en/ar') return 'UAE - Arabic';
    if (langCookie === '/en/es') return 'Global - Spanish';
    return 'Global - English';
  });
  
  const languageOptions = [
    { label: 'Global - English', code: '/en/en' },
    { label: 'India - Telugu', code: '/en/te' },
    { label: 'India - Hindi', code: '/en/hi' },
    { label: 'UAE - Arabic', code: '/en/ar' },
    { label: 'Global - Spanish', code: '/en/es' }
  ];

  const handleLanguageChange = (label, code) => {
    // Set cookie for google translate
    document.cookie = `googtrans=${code}; path=/; domain=${window.location.hostname}`;
    document.cookie = `googtrans=${code}; path=/;`; // For localhost
    setSelectedRegion(label);
    setRegionOpen(false);
    window.location.reload(); // Reload to apply translation
  };
  
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  const { content } = usePageContent('branding', DEFAULT_BRANDING);
  const logo = content?.logo || DEFAULT_BRANDING.logo;
  const header = content?.header || DEFAULT_BRANDING.header;

  const [hasHeroMedia, setHasHeroMedia] = useState(isHome);

  useEffect(() => {
    const checkHero = () => {
      const heroEl = document.getElementById('hero') || document.querySelector('#about-hero.has-bg-media');
      setHasHeroMedia(isHome || !!heroEl);
    };
    checkHero();
    const t = setTimeout(checkHero, 150);
    return () => clearTimeout(t);
  }, [location.pathname, isHome]);

  useEffect(() => {
    const checkScroll = () => {
      const heroEl = document.getElementById('hero') || document.querySelector('#about-hero.has-bg-media');
      if (heroEl) {
        const heroHeight = heroEl.offsetHeight;
        const threshold = Math.max(heroHeight - 75, 150);
        setScrolled(window.scrollY >= threshold);
      } else {
        setScrolled(window.scrollY > 40);
      }
    };

    window.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll, { passive: true });
    checkScroll();
    return () => {
      window.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [location.pathname, isHome]);

  // Close menu on route change
  useEffect(() => { 
    setMenuOpen(false); 
    setActiveDropdown(null);
    setRegionOpen(false);
  }, [location.pathname]);

  return (
    <header className={`site-nav-wrapper${(isHome || hasHeroMedia) ? ' home-nav-transparent' : ' subpage-nav'}${scrolled ? ' scrolled' : ''}`}>
      
      {/* ── Top Utility Bar (Enterprise Feature) ── */}
      <div className={`top-utility-bar ${scrolled ? 'hidden' : ''}`}>
        <div className="container-wide">
          <div className="utility-bar-inner">
            <div className="utility-left">
              <div 
                className="utility-region-selector" 
                onMouseEnter={() => setRegionOpen(true)}
                onMouseLeave={() => setRegionOpen(false)}
                style={{ position: 'relative' }}
              >
                <button className="utility-item" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem 0' }}>
                  <i className="fa-solid fa-globe"></i> {selectedRegion} <i className="fa-solid fa-chevron-down" style={{ fontSize: '0.6rem', marginLeft: '4px' }}></i>
                </button>
                
                {regionOpen && (
                  <div className="region-dropdown" style={{
                    position: 'absolute', top: '100%', left: 0, background: '#0B1622', 
                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', padding: '0.5rem',
                    minWidth: '160px', zIndex: 100, display: 'flex', flexDirection: 'column', gap: '0.25rem',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
                  }}>
                    {languageOptions.map(lang => (
                      <button 
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.label, lang.code)}
                        style={{
                          background: 'none', border: 'none', color: lang.label === selectedRegion ? '#3CC8C8' : '#A0B0C0',
                          padding: '0.5rem 0.75rem', textAlign: 'left', fontSize: '0.8rem', cursor: 'pointer',
                          borderRadius: '3px', width: '100%', transition: 'background 0.2s, color 0.2s'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#FFF'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = lang.label === selectedRegion ? '#3CC8C8' : '#A0B0C0'; }}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="utility-right">
              <a href="tel:+919059949365" className="utility-item"><i className="fa-solid fa-phone"></i> +91 90599 49365</a>
              <Link to="/contact" className="utility-item"><i className="fa-solid fa-circle-info"></i> Help Center</Link>
              <div className="utility-divider"></div>
              <Link to="/portal" className="utility-item login-btn"><i className="fa-regular fa-user"></i> Customer Portal</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container-wide">
        <nav
          className={`site-nav-panel${scrolled ? ' scrolled' : ''}${(isHome || hasHeroMedia) && !scrolled ? ' transparent-home' : ''}`}
          aria-label="Main Navigation"
        >

          {/* Brand Logo Section */}
          <Link to="/" className="nav-brand" aria-label="Sai International Couriers Home">
            {logo?.url ? (
              <img
                src={logo.url}
                alt={logo.alt || "Sai International Couriers & Cargo"}
                className="nav-brand-logo-img"
                style={{ height: `${logo.height || 48}px` }}
              />
            ) : (
              <div className="nav-brand-icon">
                <i className="fa-solid fa-plane-departure"></i>
              </div>
            )}
            <div className="nav-brand-text">
              <span className="nav-brand-eng">SAI International Couriers & Cargo</span>
              <span className="nav-brand-tag">Worldwide Air Cargo & NRI Logistics</span>
            </div>
          </Link>

          {/* Center Mega Menu */}
          <ul className={`nav-menu-list${menuOpen ? ' open' : ''}`}>
            
            {/* Mobile-only Home Link */}
            <li className="nav-menu-item mobile-only-item">
              <NavLink to="/" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} onClick={() => { setMenuOpen(false); setActiveDropdown(null); }}>
                Home
              </NavLink>
            </li>

            {MEGA_MENU_LINKS.map(menu => (
              <li 
                key={menu.id} 
                className="nav-menu-item has-dropdown"
                onMouseEnter={() => window.innerWidth > 992 && setActiveDropdown(menu.id)}
                onMouseLeave={() => window.innerWidth > 992 && setActiveDropdown(null)}
              >
                <button 
                  className={`nav-link mega-menu-toggle ${activeDropdown === menu.id ? 'active' : ''}`}
                  onClick={() => setActiveDropdown(activeDropdown === menu.id ? null : menu.id)}
                >
                  {menu.label} <i className="fa-solid fa-chevron-down dropdown-arrow"></i>
                </button>
                
                {/* Mega Dropdown Panel */}
                <div className={`mega-dropdown-panel ${activeDropdown === menu.id ? 'show' : ''}`}>
                  <div className="mega-dropdown-inner">
                    {menu.columns.map((col, idx) => (
                      <div key={idx} className="mega-column">
                        <h4 className="mega-column-title">{col.title}</h4>
                        <ul className="mega-link-list">
                          {col.links.map(link => (
                            <li key={link.to}>
                              <Link to={link.to} onClick={() => { setMenuOpen(false); setActiveDropdown(null); }}>
                                <i className={`fa-solid ${link.icon}`}></i> {link.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* Right Actions */}
          <div className="nav-actions">
            <button className="btn btn-ghost nav-search-btn" aria-label="Search">
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
            <Link to="/tracking" className="btn btn-soft-cream btn-sm btn-track-hide">
               Track
            </Link>
            <Link to="/calculator" className="btn btn-outline-teal btn-sm btn-quote-hide">
               Get a Quote
            </Link>
            <Link to="/book-pickup" className="btn btn-coral btn-sm">
               Ship Now
            </Link>

            {/* Mobile Toggle */}
            <button
              className="mobile-nav-toggle"
              aria-label="Toggle Menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(prev => !prev)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
