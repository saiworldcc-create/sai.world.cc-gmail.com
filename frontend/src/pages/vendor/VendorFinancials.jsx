import React, { useEffect, useState } from 'react';
import api from '../../services/api';

export default function VendorFinancials() {
  const [data, setData] = useState({ summary: {}, transactions: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFinancials();
  }, []);

  const fetchFinancials = async () => {
    try {
      setLoading(true);
      const res = await api.get('/vendor/financials');
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading financials...</div>;

  const { summary, transactions } = data;

  return (
    <div className="vendor-fade-in" style={{ padding: '0', maxWidth: '1200px', margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>
      
      {/* Header */}
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.2rem', boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.3)' }}>
          <i className="fa-solid fa-wallet"></i>
        </div>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.5px' }}>Financial Ledger</h2>
          <p style={{ margin: '0.2rem 0 0 0', color: '#64748B', fontSize: '0.95rem' }}>Track your payouts, commissions, and escrow balance securely.</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        
        <div style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', padding: '1.8rem', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', color: '#fff', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: '-20px', top: '-20px', opacity: 0.1, fontSize: '8rem' }}><i className="fa-solid fa-sack-dollar"></i></div>
          <p style={{ margin: 0, color: '#94A3B8', fontSize: '0.9rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Earnings (Settled)</p>
          <h3 style={{ margin: '0.8rem 0 0 0', fontSize: '2.5rem', fontWeight: '800', color: '#fff' }}>
            ${summary?.totalEarnings?.toFixed(2) || '0.00'}
          </h3>
        </div>
        
        <div style={{ background: '#fff', padding: '1.8rem', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)', border: '1px solid #E2E8F0', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: '-10px', top: '20px', opacity: 0.03, fontSize: '6rem', color: '#000' }}><i className="fa-solid fa-hourglass-half"></i></div>
          <p style={{ margin: 0, color: '#64748B', fontSize: '0.9rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pending Escrow / Payouts</p>
          <h3 style={{ margin: '0.8rem 0 0 0', fontSize: '2.5rem', fontWeight: '800', color: '#F59E0B' }}>
            ${summary?.pendingPayout?.toFixed(2) || '0.00'}
          </h3>
        </div>
        
        <div style={{ background: '#fff', padding: '1.8rem', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)', border: '1px solid #E2E8F0', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: '-10px', top: '20px', opacity: 0.03, fontSize: '6rem', color: '#000' }}><i className="fa-solid fa-building-columns"></i></div>
          <p style={{ margin: 0, color: '#64748B', fontSize: '0.9rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Withdrawn</p>
          <h3 style={{ margin: '0.8rem 0 0 0', fontSize: '2.5rem', fontWeight: '800', color: '#0EA5E9' }}>
            ${summary?.totalWithdrawn?.toFixed(2) || '0.00'}
          </h3>
        </div>

      </div>

      {/* Transactions Table */}
      <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #E2E8F0', background: '#F8FAFC', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#0F172A', fontWeight: '700' }}>Recent Transactions</h3>
            <p style={{ margin: '0.2rem 0 0 0', color: '#64748B', fontSize: '0.85rem' }}>Detailed history of your incoming and outgoing funds.</p>
          </div>
          <button style={{ background: '#fff', border: '1px solid #CBD5E1', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#475569', fontWeight: '600' }}>
            <i className="fa-solid fa-download"></i> Export CSV
          </button>
        </div>
        
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
            <tr>
              <th style={{ padding: '1rem 2rem', color: '#475569', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Date</th>
              <th style={{ padding: '1rem 2rem', color: '#475569', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Description</th>
              <th style={{ padding: '1rem 2rem', color: '#475569', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Type</th>
              <th style={{ padding: '1rem 2rem', color: '#475569', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Amount</th>
              <th style={{ padding: '1rem 2rem', color: '#475569', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>
                  <i className="fa-solid fa-receipt" style={{ fontSize: '2.5rem', marginBottom: '1rem', opacity: 0.5 }}></i>
                  <p style={{ margin: 0, fontWeight: '500' }}>No financial transactions found.</p>
                </td>
              </tr>
            ) : (
              transactions.map(tx => (
                <tr key={tx._id} style={{ borderBottom: '1px solid #E2E8F0', transition: 'background 0.2s', ':hover': { background: '#F8FAFC' } }}>
                  <td style={{ padding: '1.2rem 2rem', color: '#64748B', fontSize: '0.9rem' }}>{new Date(tx.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                  <td style={{ padding: '1.2rem 2rem', color: '#0F172A', fontWeight: '500' }}>{tx.description}</td>
                  <td style={{ padding: '1.2rem 2rem' }}>
                    <span style={{
                      padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                      background: tx.type === 'Credit' ? '#DCFCE7' : tx.type === 'Debit' ? '#FEE2E2' : '#F1F5F9',
                      color: tx.type === 'Credit' ? '#166534' : tx.type === 'Debit' ? '#991B1B' : '#334155'
                    }}>
                      <i className={`fa-solid ${tx.type === 'Credit' ? 'fa-arrow-down' : tx.type === 'Debit' ? 'fa-arrow-up' : 'fa-minus'}`}></i> {tx.type}
                    </span>
                  </td>
                  <td style={{ padding: '1.2rem 2rem', fontWeight: '700', fontSize: '1.05rem', color: tx.type === 'Credit' || tx.type === 'Payout' ? '#10B981' : '#EF4444' }}>
                    {tx.type === 'Debit' || tx.type === 'Fee' ? '-' : '+'}${tx.amount.toFixed(2)}
                  </td>
                  <td style={{ padding: '1.2rem 2rem' }}>
                    <span style={{
                       padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700',
                       background: tx.status === 'Completed' ? '#E0F2FE' : '#FEF3C7',
                       color: tx.status === 'Completed' ? '#0369A1' : '#B45309',
                       border: `1px solid ${tx.status === 'Completed' ? '#BAE6FD' : '#FDE68A'}`
                    }}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
