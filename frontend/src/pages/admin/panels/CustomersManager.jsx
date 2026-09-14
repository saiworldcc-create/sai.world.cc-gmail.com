import { useState, useEffect } from 'react';
import { getCustomers } from '../../../services/api';

export default function CustomersManager() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const data = await getCustomers();
      if (data.success) {
        setCustomers(data.customers);
      } else {
        setError('Failed to load customers.');
      }
    } catch (err) {
      console.error(err);
      setError('Server error while loading customers.');
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(c => {
    const term = searchTerm.toLowerCase();
    return (
      c.name?.toLowerCase().includes(term) ||
      c.email?.toLowerCase().includes(term) ||
      c.phone?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="admin-panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ color: '#2C3E50', fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>Registered Customers</h2>
        <div style={{ position: 'relative', width: '300px' }}>
          <i className="fa-solid fa-search" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#7091A8' }}></i>
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="admin-field-input"
            style={{ paddingLeft: '2.5rem', marginBottom: 0 }}
          />
        </div>
      </div>

      {error && <div className="admin-alert admin-alert-danger">{error}</div>}

      <div className="admin-card">
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#7091A8' }}>
            <i className="fa-solid fa-circle-notch fa-spin fa-2x"></i>
            <p style={{ marginTop: '1rem' }}>Loading customers...</p>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#7091A8' }}>
            <i className="fa-solid fa-users-slash fa-3x" style={{ marginBottom: '1rem', opacity: 0.5 }}></i>
            <p>No customers found matching your search.</p>
          </div>
        ) : (
          <div className="admin-table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Customer Name</th>
                  <th>Contact Info</th>
                  <th>Auth Method</th>
                  <th>Joined Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map(customer => (
                  <tr key={customer._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {customer.avatar ? (
                          <img src={customer.avatar} alt={customer.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-card-tint)', color: 'var(--accent-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                            {customer.name?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span style={{ fontWeight: '500', color: 'var(--text-slate-dark)' }}>{customer.name}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <span style={{ fontSize: '0.9rem', color: '#4A6B82' }}>
                          <i className="fa-solid fa-envelope" style={{ width: '16px', opacity: 0.7 }}></i> {customer.email}
                        </span>
                        {customer.phone && (
                          <span style={{ fontSize: '0.85rem', color: '#7091A8' }}>
                            <i className="fa-solid fa-phone" style={{ width: '16px', opacity: 0.7 }}></i> {customer.phone}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      {customer.googleId ? (
                        <span className="admin-status-badge" style={{ background: '#E3F2FD', color: '#1976D2' }}>
                          <i className="fa-brands fa-google"></i> Google Login
                        </span>
                      ) : (
                        <span className="admin-status-badge" style={{ background: '#F5F7FA', color: '#7091A8' }}>
                          <i className="fa-solid fa-envelope"></i> Email Auth
                        </span>
                      )}
                    </td>
                    <td>
                      <span style={{ fontSize: '0.9rem', color: '#4A6B82' }}>
                        {new Date(customer.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
