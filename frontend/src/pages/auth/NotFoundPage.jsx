import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '7rem 1.5rem 3rem' }}>
      <div style={{ maxWidth: '580px', width: '100%', textAlign: 'center', background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(14px)', border: '1.5px solid rgba(255, 255, 255, 0.95)', borderRadius: '28px', padding: '2.5rem 2rem', boxShadow: '0 20px 50px rgba(32, 54, 72, 0.1)' }}>
        <div style={{ width: '70px', height: '70px', margin: '0 auto 1.25rem', background: 'rgba(0, 86, 179, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0056B3', fontSize: '2rem' }}>
          <i className="fa-solid fa-plane-circle-exclamation"></i>
        </div>
        <h1 style={{ fontSize: '2.8rem', fontWeight: 800, color: '#0F2537', marginBottom: '0.5rem', lineHeight: 1 }}>404</h1>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#0056B3', marginBottom: '0.85rem' }}>Shipment Route Not Found</h2>
        <p style={{ color: '#36536C', fontSize: '0.95rem', marginBottom: '1.75rem', lineHeight: 1.55 }}>
          The page you are looking for might have been moved, renamed, or is temporarily unavailable. Let's get you back on track!
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn-coral">
            <i className="fa-solid fa-house"></i> Return Home
          </Link>
          <Link to="/tracking" className="btn btn-soft-cream">
            <i className="fa-solid fa-magnifying-glass"></i> Track Shipment
          </Link>
        </div>
      </div>
    </main>
  );
}
