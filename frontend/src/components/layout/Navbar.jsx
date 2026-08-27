import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { NAV_LINKS } from '../../constants/appData';
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
  useEffect(() => { setMenuOpen(false); }, [navigate]);

  return (
    <header className={`site-nav-wrapper${(isHome || hasHeroMedia) ? ' home-nav-transparent' : ' subpage-nav'}${scrolled ? ' scrolled' : ''}`}>
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

          {/* Center Menu */}
          <ul className={`nav-menu-list${menuOpen ? ' open' : ''}`}>
            {NAV_LINKS.map(link => (
              <li key={link.to} className="nav-menu-item">
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Right Actions */}
          <div className="nav-actions">
            <Link to="/tracking" className="btn btn-soft-cream btn-sm btn-track-hide">
              <i className="fa-solid fa-magnifying-glass"></i> {header?.trackBtnText || 'Track'}
            </Link>
            <Link to="/book-pickup" className="btn btn-coral btn-sm">
              <i className="fa-solid fa-truck-fast"></i> {header?.bookBtnText || 'Book Pickup'}
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
