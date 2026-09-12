import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if the user has already accepted the cookies
    const consent = localStorage.getItem('sai_cookie_consent');
    if (!consent) {
      // Delay showing the banner slightly for better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('sai_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      width: '100%',
      background: '#0B1622',
      color: '#FFF',
      padding: '1.5rem',
      zIndex: 9999,
      boxShadow: '0 -10px 30px rgba(0,0,0,0.3)',
      borderTop: '1px solid rgba(255,255,255,0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        maxWidth: '1200px',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: '300px' }}>
          <div style={{ 
            width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(60, 200, 200, 0.1)', 
            color: '#3CC8C8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0
          }}>
            <i className="fa-solid fa-cookie-bite"></i>
          </div>
          <div>
            <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem', color: '#FFF' }}>Your Privacy Matters</h4>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#A0B0C0', lineHeight: 1.4 }}>
              We use cookies to enhance your tracking experience, analyze site traffic, and serve targeted logistics solutions. 
              By clicking "Accept All", you consent to our use of cookies as per international GDPR guidelines.
            </p>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', flexShrink: 0 }}>
          <Link to="/about" style={{
            background: 'transparent', border: '1px solid #4A6B82', color: '#A0B0C0', padding: '0.6rem 1.25rem',
            borderRadius: '4px', fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'none', display: 'flex', alignItems: 'center'
          }}>
            Privacy Policy
          </Link>
          <button 
            onClick={handleAccept} 
            style={{
              background: '#3CC8C8', color: '#0B1622', border: 'none', padding: '0.6rem 1.5rem',
              borderRadius: '4px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(60, 200, 200, 0.3)', transition: 'transform 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
