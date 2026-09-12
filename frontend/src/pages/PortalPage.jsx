import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DEMO_USER } from '../constants/appData';

export default function PortalPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [phone, setPhone] = useState('+91 90599 49365');
  const [otp, setOtp] = useState('1234');
  const [activeTab, setActiveTab] = useState('shipments');
  const [error, setError] = useState('');

  useEffect(() => {
    const saved = sessionStorage.getItem('sai_portal_logged_in') === 'true';
    if (saved) setIsLoggedIn(true);
  }, []);

  const handleLogin = (e) => {
    e?.preventDefault();
    if (otp === '1234' || otp.length === 4) {
      sessionStorage.setItem('sai_portal_logged_in', 'true');
      setIsLoggedIn(true);
      setError('');
    } else {
      setError('Invalid OTP. Please enter demo OTP: 1234');
    }
  };

  const handleDemoLogin = () => {
    sessionStorage.setItem('sai_portal_logged_in', 'true');
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('sai_portal_logged_in');
    setIsLoggedIn(false);
  };

  return (
    <main style={{ paddingTop: '80px' }}>
      <section className="page-hero-banner">
        <div className="container">
          <div className="breadcrumb-trail">
            <Link to="/">Home</Link>
            <span className="separator"><i className="fa-solid fa-chevron-right"></i></span>
            <span className="current">Customer Portal</span>
          </div>
          <div className="eyebrow-pill teal">
            <i className="fa-solid fa-user-shield"></i> Secure Self-Service Desk
          </div>
          <h1 className="page-hero-title">Customer Logistics Dashboard</h1>
          <p className="page-hero-desc">
            Manage your active overseas consignments, view real-time transit telemetry, download GST tax receipts, and access your saved international address book.
          </p>
        </div>
      </section>

      {!isLoggedIn ? (
        /* Auth View */
        <div className="section section-ivory">
          <div className="container" style={{ maxWidth: '580px' }}>
            <div className="contact-form-container" style={{ textAlign: 'center', padding: '3rem 2.5rem', background: 'var(--bg-card-tint)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border-light)' }}>
              <div style={{ width: '68px', height: '68px', borderRadius: '50%', background: 'var(--bg-powder-blue)', color: 'var(--accent-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 1.25rem auto' }}>
                <i className="fa-solid fa-user-lock"></i>
              </div>

              <h2 style={{ fontSize: '1.6rem', color: 'var(--text-slate-dark)', marginBottom: '0.4rem' }}>Customer Portal Login</h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-slate-muted)', marginBottom: '2rem' }}>
                Access your bookings and invoices using your registered mobile number.
              </p>

              {error && (
                <div style={{ padding: '0.75rem', background: '#FDEDEC', color: '#E74C3C', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} style={{ textAlign: 'left' }}>
                <div className="form-group-item">
                  <label className="form-label-title" htmlFor="portal-phone">
                    <i className="fa-solid fa-mobile-screen" style={{ color: 'var(--accent-coral)' }}></i> Mobile Number
                  </label>
                  <input
                    type="tel"
                    id="portal-phone"
                    className="form-input-field"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter 10-digit number"
                    required
                  />
                </div>

                <div className="form-group-item">
                  <label className="form-label-title" htmlFor="portal-otp">
                    <i className="fa-solid fa-key" style={{ color: 'var(--accent-teal)' }}></i> One-Time Password (OTP)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      id="portal-otp"
                      className="form-input-field"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter 4-digit OTP"
                      maxLength="4"
                      required
                    />
                    <span style={{ position: 'absolute', right: '1rem', top: '0.75rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-coral)' }}>
                      Demo OTP: 1234
                    </span>
                  </div>
                </div>

                <button type="submit" className="btn btn-coral btn-lg" style={{ width: '100%', marginTop: '1rem' }}>
                  <i className="fa-solid fa-arrow-right-to-bracket"></i> Login with OTP
                </button>
              </form>

              <div style={{ margin: '1.5rem 0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }}></div>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-slate-light)', textTransform: 'uppercase' }}>Or Quick Demo</span>
                <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }}></div>
              </div>

              <button type="button" onClick={handleDemoLogin} className="btn btn-outline-slate" style={{ width: '100%' }}>
                <i className="fa-solid fa-bolt" style={{ color: 'var(--accent-teal)' }}></i> 1-Click Instant Demo Login
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Dashboard View */
        <div className="section section-ivory">
          <div className="container">
            {/* Top Welcome Bar */}
            <div className="branch-toolbar-card" style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--bg-mist)', color: 'var(--accent-teal)', border: '2px solid var(--accent-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', fontWeight: 900 }}>
                    VR
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.35rem', color: 'var(--text-slate-dark)', margin: 0 }}>{DEMO_USER.name}</h3>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-slate-muted)' }}>
                      <span>{DEMO_USER.phone}</span> • <span style={{ background: 'rgba(213, 168, 95, 0.18)', color: 'var(--accent-gold)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-pill)', fontWeight: 700 }}>{DEMO_USER.tier}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <Link to="/book-pickup" className="btn btn-coral btn-sm">
                    <i className="fa-solid fa-truck-fast"></i> Book Pickup
                  </Link>
                  <Link to="/pay-online" className="btn btn-teal btn-sm">
                    <i className="fa-solid fa-credit-card"></i> Pay Invoice
                  </Link>
                  <button type="button" onClick={handleLogout} className="btn btn-outline-slate btn-sm">
                    <i className="fa-solid fa-arrow-right-from-bracket"></i> Logout
                  </button>
                </div>
              </div>
            </div>

            {/* Stat Cards */}
            <div className="portal-dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
              <div className="portal-stat-card">
                <div className="portal-stat-icon"><i className="fa-solid fa-boxes-packing"></i></div>
                <div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--accent-teal)', lineHeight: 1 }}>{DEMO_USER.stats.activeShipments}</div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-slate-muted)', marginTop: '0.2rem' }}>Active In Transit</div>
                </div>
              </div>

              <div className="portal-stat-card">
                <div className="portal-stat-icon" style={{ background: 'rgba(39, 174, 96, 0.15)', color: '#27AE60' }}><i className="fa-solid fa-circle-check"></i></div>
                <div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#27AE60', lineHeight: 1 }}>{DEMO_USER.stats.delivered}</div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-slate-muted)', marginTop: '0.2rem' }}>Delivered Overseas</div>
                </div>
              </div>

              <div className="portal-stat-card">
                <div className="portal-stat-icon" style={{ background: 'rgba(233, 120, 86, 0.15)', color: 'var(--accent-coral)' }}><i className="fa-solid fa-weight-hanging"></i></div>
                <div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--accent-coral)', lineHeight: 1 }}>{DEMO_USER.stats.totalWeight}</div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-slate-muted)', marginTop: '0.2rem' }}>Total Weight Sent</div>
                </div>
              </div>

              <div className="portal-stat-card">
                <div className="portal-stat-icon" style={{ background: 'rgba(213, 168, 95, 0.18)', color: 'var(--accent-gold)' }}><i className="fa-solid fa-award"></i></div>
                <div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--accent-gold)', lineHeight: 1 }}>5% Off</div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-slate-muted)', marginTop: '0.2rem' }}>NRI Family Discount</div>
                </div>
              </div>
            </div>

            {/* Dashboard Tabs Toolbar */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem', flexWrap: 'wrap' }}>
              {[
                { id: 'shipments', label: 'My Shipments', icon: 'fa-box-archive' },
                { id: 'addresses', label: 'Address Book', icon: 'fa-address-book' },
                { id: 'invoices', label: 'Tax Invoices', icon: 'fa-file-invoice-dollar' },
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  className={`portal-tab-pill${activeTab === tab.id ? ' active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.25rem', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border-light)', background: activeTab === tab.id ? 'var(--accent-teal)' : '#fff', color: activeTab === tab.id ? '#fff' : 'var(--text-slate-dark)', fontWeight: 700, cursor: 'pointer' }}
                >
                  <i className={`fa-solid ${tab.icon}`}></i> {tab.label}
                </button>
              ))}
            </div>

            {/* TAB 1: SHIPMENTS */}
            {activeTab === 'shipments' && (
              <div style={{ background: 'var(--bg-card-tint)', borderRadius: 'var(--radius-md)', padding: '1.5rem', border: '1px solid var(--border-light)', overflowX: 'auto' }}>
                <table className="food-comparison-table" style={{ width: '100%' }}>
                  <thead>
                    <tr>
                      <th>AWB / Date</th>
                      <th>Receiver & Destination</th>
                      <th>Parcel Contents</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DEMO_USER.shipments.map(s => {
                      const statusColor = s.status === 'Delivered' ? '#27AE60' : s.status === 'Out for Delivery' ? '#E97856' : '#3C9290';
                      return (
                        <tr key={s.awb}>
                          <td>
                            <Link to={`/tracking?awb=${s.awb}`} style={{ fontWeight: 800, color: 'var(--accent-coral)' }}>{s.awb}</Link>
                            <div style={{ fontSize: '0.75rem', color: '#7091A8' }}>{s.date}</div>
                          </td>
                          <td>
                            <strong>{s.receiver}</strong>
                            <div style={{ fontSize: '0.8rem', color: '#4A6B82' }}>{s.dest}</div>
                          </td>
                          <td>{s.contents} ({s.weight})</td>
                          <td>
                            <span style={{ display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: 800, color: statusColor, background: `${statusColor}18` }}>
                              {s.status}
                            </span>
                          </td>
                          <td>
                            <Link to={`/tracking?awb=${s.awb}`} className="btn btn-outline-slate btn-sm" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
                              <i className="fa-solid fa-location-crosshairs"></i> Track
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB 2: ADDRESS BOOK */}
            {activeTab === 'addresses' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {DEMO_USER.addresses.map(a => (
                  <div key={a.id} className="address-item-card" style={{ background: 'var(--bg-card-tint)', borderRadius: 'var(--radius-md)', padding: '1.5rem', border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="eyebrow-pill teal" style={{ margin: 0, fontSize: '0.72rem', padding: '0.2rem 0.6rem' }}>{a.tag}</span>
                      <i className="fa-solid fa-bookmark" style={{ color: 'var(--accent-coral)' }}></i>
                    </div>
                    <h4 style={{ fontSize: '1.05rem', color: '#1E3446', margin: 0 }}>{a.name}</h4>
                    <p style={{ fontSize: '0.82rem', color: '#4A6B82', lineHeight: 1.45, margin: 0 }}>{a.address}</p>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#3C9290' }}>
                      <i className="fa-solid fa-phone"></i> {a.phone}
                    </div>
                    <Link to="/book-pickup" className="btn btn-soft-cream btn-sm" style={{ marginTop: 'auto', textAlign: 'center' }}>
                      <i className="fa-solid fa-truck-fast"></i> Ship to this Address
                    </Link>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 3: INVOICES */}
            {activeTab === 'invoices' && (
              <div style={{ background: 'var(--bg-card-tint)', borderRadius: 'var(--radius-md)', padding: '1.5rem', border: '1px solid var(--border-light)', overflowX: 'auto' }}>
                <table className="food-comparison-table" style={{ width: '100%' }}>
                  <thead>
                    <tr>
                      <th>Invoice ID</th>
                      <th>AWB Reference</th>
                      <th>Billing Date</th>
                      <th>Amount</th>
                      <th>Payment Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DEMO_USER.invoices.map(inv => (
                      <tr key={inv.id}>
                        <td><strong>{inv.id}</strong></td>
                        <td><Link to={`/tracking?awb=${inv.awb}`} style={{ color: 'var(--accent-teal)', fontWeight: 700 }}>{inv.awb}</Link></td>
                        <td>{inv.date}</td>
                        <td><strong style={{ color: 'var(--accent-coral)' }}>{inv.amount}</strong></td>
                        <td><span style={{ color: '#27AE60', fontWeight: 700 }}><i className="fa-solid fa-circle-check"></i> {inv.status}</span></td>
                        <td>
                          <button onClick={() => window.print()} className="btn btn-outline-slate btn-sm" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
                            <i className="fa-solid fa-download"></i> Tax Invoice
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        </div>
      )}
    </main>
  );
}
