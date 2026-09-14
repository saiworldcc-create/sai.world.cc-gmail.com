import { useState, useEffect } from 'react';
import { getMessages, updateMessageStatus, deleteMessage } from '../../../services/api';

export default function MessagesManager() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [activeMessage, setActiveMessage] = useState(null);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const res = await getMessages();
      if (res && res.data) {
        setMessages(res.data);
      }
    } catch (err) {
      setMsg(`❌ Error loading messages: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadMessages(); }, []);

  const handleToggleRead = async (id, currentStatus) => {
    try {
      await updateMessageStatus(id, !currentStatus);
      setMessages(messages.map(m => m._id === id ? { ...m, read: !currentStatus } : m));
      setMsg(`✅ Message marked as ${!currentStatus ? 'Read' : 'Unread'}`);
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setMsg(`❌ ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    try {
      await deleteMessage(id);
      setMessages(messages.filter(m => m._id !== id));
      if (activeMessage?._id === id) setActiveMessage(null);
      setMsg('✅ Message deleted');
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setMsg(`❌ ${err.message}`);
    }
  };

  return (
    <div className="admin-panel-content">
      <div className="admin-editor-header">
        <h2 className="admin-editor-title"><i className="fa-solid fa-envelope"></i> Inquiries Inbox</h2>
        <button className="admin-btn admin-btn-secondary" onClick={loadMessages}>
          <i className="fa-solid fa-rotate-right"></i> Refresh
        </button>
      </div>

      {msg && <div className={`admin-save-msg ${msg.startsWith('✅') ? 'success' : 'error'}`}>{msg}</div>}

      {loading ? (
        <div className="admin-loading"><i className="fa-solid fa-circle-notch fa-spin"></i> Loading inquiries…</div>
      ) : messages.length === 0 ? (
        <div className="admin-info-box">
          <i className="fa-solid fa-inbox"></i>
          <div>No messages found in your inbox.</div>
        </div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Date</th>
                <th>Name</th>
                <th>Phone / Email</th>
                <th>Branch</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((m) => (
                <tr key={m._id} style={{ background: m.read ? 'transparent' : 'rgba(233,120,86,0.05)', fontWeight: m.read ? 'normal' : 'bold' }}>
                  <td>
                    <span className="eyebrow-pill" style={{ margin: 0, padding: '0.2rem 0.5rem', background: m.read ? 'var(--bg-powder-blue)' : 'var(--accent-coral-soft)', color: m.read ? 'var(--text-slate-muted)' : 'var(--accent-coral)' }}>
                      {m.read ? 'Read' : 'New'}
                    </span>
                  </td>
                  <td>{new Date(m.createdAt).toLocaleDateString()}</td>
                  <td>{m.name}</td>
                  <td>
                    <div>{m.phone}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-slate-muted)', fontWeight: 'normal' }}>{m.email}</div>
                  </td>
                  <td>{m.branch}</td>
                  <td>
                    <span className="eyebrow-pill" style={{ margin: 0, padding: '0.2rem 0.5rem' }}>{m.source === 'pickup' ? 'Pickup' : 'Contact'}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="admin-btn admin-btn-secondary" onClick={() => setActiveMessage(m)} title="View Details" style={{ padding: '0.4rem 0.6rem' }}>
                        <i className="fa-solid fa-eye"></i>
                      </button>
                      <button className="admin-btn admin-btn-secondary" onClick={() => handleToggleRead(m._id, m.read)} title={m.read ? 'Mark as Unread' : 'Mark as Read'} style={{ padding: '0.4rem 0.6rem' }}>
                        <i className={`fa-solid ${m.read ? 'fa-envelope' : 'fa-envelope-open'}`}></i>
                      </button>
                      <button className="admin-btn admin-btn-danger" onClick={() => handleDelete(m._id)} title="Delete" style={{ padding: '0.4rem 0.6rem' }}>
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Message Detail Modal */}
      {activeMessage && (
        <div className="admin-modal-overlay" onClick={() => setActiveMessage(null)}>
          <div className="admin-modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div className="admin-modal-header">
              <h3><i className="fa-solid fa-envelope-open-text"></i> Message Details</h3>
              <button className="admin-modal-close" onClick={() => setActiveMessage(null)}><i className="fa-solid fa-xmark"></i></button>
            </div>
            <div className="admin-modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <small style={{ color: 'var(--text-slate-muted)' }}>Name</small>
                  <div style={{ fontWeight: 'bold' }}>{activeMessage.name}</div>
                </div>
                <div>
                  <small style={{ color: 'var(--text-slate-muted)' }}>Date</small>
                  <div style={{ fontWeight: 'bold' }}>{new Date(activeMessage.createdAt).toLocaleString()}</div>
                </div>
                <div>
                  <small style={{ color: 'var(--text-slate-muted)' }}>Phone Number</small>
                  <div style={{ fontWeight: 'bold', color: 'var(--accent-teal)' }}><a href={`tel:${activeMessage.phone}`}>{activeMessage.phone}</a></div>
                </div>
                <div>
                  <small style={{ color: 'var(--text-slate-muted)' }}>Email</small>
                  <div style={{ fontWeight: 'bold' }}>{activeMessage.email ? <a href={`mailto:${activeMessage.email}`}>{activeMessage.email}</a> : 'N/A'}</div>
                </div>
              </div>

              <div style={{ background: 'var(--bg-powder-blue)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <small style={{ color: 'var(--text-slate-muted)' }}>Preferred Branch</small>
                    <div style={{ fontWeight: '500' }}>{activeMessage.branch}</div>
                  </div>
                  {activeMessage.destCountry && (
                    <div>
                      <small style={{ color: 'var(--text-slate-muted)' }}>Destination</small>
                      <div style={{ fontWeight: '500' }}>{activeMessage.destCountry}</div>
                    </div>
                  )}
                  {activeMessage.shipmentCategory && (
                    <div>
                      <small style={{ color: 'var(--text-slate-muted)' }}>Shipment Type</small>
                      <div style={{ fontWeight: '500' }}>{activeMessage.shipmentCategory}</div>
                    </div>
                  )}
                  {activeMessage.parcelWeight && (
                    <div>
                      <small style={{ color: 'var(--text-slate-muted)' }}>Estimated Weight</small>
                      <div style={{ fontWeight: '500' }}>{activeMessage.parcelWeight}</div>
                    </div>
                  )}
                </div>
              </div>

              {(activeMessage.pickupAddress || activeMessage.message) && (
                <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
                  {activeMessage.pickupAddress && (
                    <div style={{ marginBottom: '1rem' }}>
                      <small style={{ color: 'var(--text-slate-muted)' }}>Pickup Address / Requirements</small>
                      <p style={{ margin: '0.25rem 0 0 0', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{activeMessage.pickupAddress}</p>
                    </div>
                  )}
                  {activeMessage.message && (
                    <div>
                      <small style={{ color: 'var(--text-slate-muted)' }}>Message</small>
                      <p style={{ margin: '0.25rem 0 0 0', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{activeMessage.message}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="admin-modal-footer">
              {!activeMessage.read && (
                <button className="admin-btn admin-btn-primary" onClick={() => { handleToggleRead(activeMessage._id, false); setActiveMessage(null); }}>
                  <i className="fa-solid fa-check"></i> Mark as Read
                </button>
              )}
              <button className="admin-btn admin-btn-secondary" onClick={() => setActiveMessage(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
