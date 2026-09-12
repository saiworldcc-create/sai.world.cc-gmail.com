import { useUser } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';

export default function UserDashboard() {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="section" style={{ minHeight: 'calc(100vh - 80px)' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ color: 'var(--text-slate-dark)' }}>Welcome back, {user.name}</h1>
          <button onClick={handleLogout} className="btn btn-outline">Sign Out</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          
          <div style={{ background: 'var(--bg-card-tint)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--accent-teal)' }}><i className="fa-solid fa-box-open"></i> My Shipments</h3>
            <p style={{ color: 'var(--text-slate-muted)' }}>You don't have any active shipments yet.</p>
            <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => navigate('/book-pickup')}>Book a Pickup</button>
          </div>

          <div style={{ background: 'var(--bg-card-tint)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--accent-teal)' }}><i className="fa-solid fa-address-book"></i> Address Book</h3>
            <p style={{ color: 'var(--text-slate-muted)' }}>No saved addresses.</p>
            <button className="btn btn-outline" style={{ marginTop: '1rem' }}>+ Add Address</button>
          </div>

        </div>
      </div>
    </div>
  );
}
