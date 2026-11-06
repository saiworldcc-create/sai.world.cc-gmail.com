import React, { useEffect, useState } from 'react';
import api from '../../services/api';

export default function VendorSupport() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ subject: '', issueType: 'Damaged Goods', message: '' });

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await api.get('/vendor/tickets');
      setTickets(res.data.tickets);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/vendor/tickets', formData);
      setIsModalOpen(false);
      setFormData({ subject: '', issueType: 'Damaged Goods', message: '' });
      fetchTickets();
    } catch (err) {
      alert('Failed to submit ticket');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="vendor-fade-in" style={{ padding: '0', maxWidth: '1200px', margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>
      
      {/* Header */}
      <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.2rem', boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.3)' }}>
            <i className="fa-solid fa-headset"></i>
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.5px' }}>Dispute Resolution & RTO</h2>
            <p style={{ margin: '0.2rem 0 0 0', color: '#64748B', fontSize: '0.95rem' }}>Manage Return-to-Origin requests and report buyer disputes.</p>
          </div>
        </div>
        
        <button onClick={() => setIsModalOpen(true)} style={{ background: '#0F172A', color: '#fff', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600', transition: 'background 0.2s', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
          <i className="fa-solid fa-plus"></i> Open New Ticket
        </button>
      </div>

      <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
            <tr>
              <th style={{ padding: '1rem 2rem', color: '#475569', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Ticket ID</th>
              <th style={{ padding: '1rem 2rem', color: '#475569', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Subject</th>
              <th style={{ padding: '1rem 2rem', color: '#475569', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Issue Type</th>
              <th style={{ padding: '1rem 2rem', color: '#475569', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</th>
              <th style={{ padding: '1rem 2rem', color: '#475569', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>RTO Status</th>
            </tr>
          </thead>
          <tbody>
            {tickets.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '4rem', textAlign: 'center', color: '#94A3B8' }}>
                  <div style={{ width: '64px', height: '64px', background: '#F1F5F9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
                    <i className="fa-solid fa-clipboard-check" style={{ fontSize: '2rem', color: '#CBD5E1' }}></i>
                  </div>
                  <p style={{ margin: 0, fontWeight: '500', color: '#64748B' }}>No active disputes or RTO requests.</p>
                </td>
              </tr>
            ) : (
              tickets.map(ticket => (
                <tr key={ticket._id} style={{ borderBottom: '1px solid #E2E8F0', transition: 'background 0.2s', ':hover': { background: '#F8FAFC' } }}>
                  <td style={{ padding: '1.2rem 2rem', fontWeight: '700', color: '#0EA5E9', fontFamily: 'monospace' }}>#{ticket.ticketId?.substring(0, 8)}</td>
                  <td style={{ padding: '1.2rem 2rem', color: '#0F172A', fontWeight: '500' }}>{ticket.subject}</td>
                  <td style={{ padding: '1.2rem 2rem', color: '#475569' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <i className={`fa-solid ${ticket.issueType.includes('RTO') ? 'fa-truck-fast' : ticket.issueType.includes('Damage') ? 'fa-box-open' : 'fa-triangle-exclamation'}`} style={{ color: '#94A3B8' }}></i>
                      {ticket.issueType}
                    </div>
                  </td>
                  <td style={{ padding: '1.2rem 2rem' }}>
                    <span style={{
                       padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700',
                       background: ticket.status === 'Open' ? '#FEF3C7' : '#E0F2FE',
                       color: ticket.status === 'Open' ? '#B45309' : '#0369A1',
                       border: `1px solid ${ticket.status === 'Open' ? '#FDE68A' : '#BAE6FD'}`
                    }}>
                      {ticket.status}
                    </span>
                  </td>
                  <td style={{ padding: '1.2rem 2rem', color: '#475569', fontWeight: '500' }}>{ticket.rtoStatus || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: '#fff', borderRadius: '20px', width: '100%', maxWidth: '550px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow: 'hidden' }}>
            
            <div style={{ padding: '1.5rem 2rem', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, color: '#0F172A', fontSize: '1.4rem', fontWeight: '700' }}>Open Support Ticket</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', color: '#94A3B8', cursor: 'pointer' }}>&times;</button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', padding: '2rem' }}>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>Issue Category *</label>
                <select name="issueType" value={formData.issueType} onChange={handleChange} style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#fff', color: '#0F172A', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }}>
                  <option value="Damaged Goods">Damaged Goods</option>
                  <option value="Missing Items">Missing Items</option>
                  <option value="Delayed Delivery">Delayed Delivery</option>
                  <option value="RTO Request">RTO (Return to Origin) Request</option>
                  <option value="Payment Dispute">Payment Dispute</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>Subject *</label>
                <input type="text" name="subject" placeholder="Brief summary of the issue" value={formData.subject} onChange={handleChange} required style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#fff', color: '#0F172A', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }} />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>Detailed Description *</label>
                <textarea name="message" placeholder="Provide order IDs, tracking numbers, and specific details..." value={formData.message} onChange={handleChange} required rows="5" style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#fff', color: '#0F172A', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }} />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', paddingTop: '1.5rem', borderTop: '1px solid #E2E8F0' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '0.8rem', background: '#fff', border: '1px solid #CBD5E1', color: '#475569', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: '0.8rem', background: '#0F172A', border: 'none', color: '#fff', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <i className="fa-solid fa-paper-plane"></i> Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
