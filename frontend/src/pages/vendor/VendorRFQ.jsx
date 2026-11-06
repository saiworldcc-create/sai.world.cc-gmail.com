import { useState, useEffect } from 'react';
import { getVendorRFQs, vendorCounterOffer, vendorAcceptRFQ } from '../../services/api';

export default function VendorRFQ() {
  const [rfqs, setRfqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [counterData, setCounterData] = useState({});

  useEffect(() => {
    loadRFQs();
  }, []);

  const loadRFQs = async () => {
    try {
      setLoading(true);
      const res = await getVendorRFQs();
      setRfqs(res.rfqs || []);
    } catch (err) {
      setMsg({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleCounter = async (rfqId) => {
    if (!counterData[rfqId]?.price) return alert('Enter a counter price');
    try {
      await vendorCounterOffer(rfqId, {
        counterPricePerUnit: counterData[rfqId].price,
        message: counterData[rfqId].msg || ''
      });
      setMsg({ type: 'success', text: 'Counter offer submitted to buyer.' });
      loadRFQs();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAccept = async (rfqId) => {
    try {
      await vendorAcceptRFQ(rfqId);
      setMsg({ type: 'success', text: 'RFQ accepted successfully. Buyer has been notified.' });
      loadRFQs();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="vendor-fade-in" style={{ padding: '0', maxWidth: '1200px', margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>
      
      {/* Header */}
      <div style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.2rem', boxShadow: '0 4px 6px -1px rgba(14, 165, 233, 0.3)' }}>
          <i className="fa-solid fa-handshake"></i>
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.5px' }}>Negotiations (RFQ)</h1>
          <p style={{ margin: '0.2rem 0 0 0', color: '#64748B', fontSize: '0.95rem' }}>Review quote requests from B2B buyers and submit counter-offers.</p>
        </div>
      </div>
      
      {msg?.text && (
        <div style={{ padding: '1rem 1.5rem', background: msg.type === 'success' ? '#DCFCE7' : '#FEE2E2', borderLeft: `4px solid ${msg.type === 'success' ? '#10B981' : '#EF4444'}`, color: msg.type === 'success' ? '#166534' : '#991B1B', borderRadius: '8px', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.8rem', fontWeight: '500' }}>
          <i className={`fa-solid ${msg.type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}`}></i>
          {msg.text}
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2rem', color: '#0EA5E9' }}></i>
        </div>
      ) : rfqs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 2rem', background: '#fff', borderRadius: '16px', border: '1px dashed #CBD5E1', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
          <div style={{ width: '80px', height: '80px', background: '#F1F5F9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
            <i className="fa-solid fa-envelope-open-text" style={{ fontSize: '2.5rem', color: '#94A3B8' }}></i>
          </div>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#0F172A', fontSize: '1.2rem' }}>No RFQs Received Yet</h3>
          <p style={{ color: '#64748B', margin: 0 }}>When enterprise buyers request bulk quotes for your products, they will appear here.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {rfqs.map(rfq => (
            <div key={rfq._id} style={{ background: '#fff', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
              
              <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', background: '#F8FAFC' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.5rem' }}>
                    <h3 style={{ margin: 0, color: '#0F172A', fontSize: '1.3rem', fontWeight: '700' }}>{rfq.product?.name || 'Unknown Product'}</h3>
                    <span style={{ 
                      padding: '0.3rem 0.8rem', 
                      borderRadius: '20px', 
                      fontSize: '0.75rem', 
                      fontWeight: '700',
                      letterSpacing: '0.5px',
                      background: rfq.status === 'Pending' ? '#FEF3C7' : rfq.status === 'Buyer_Accepted' ? '#DCFCE7' : '#E0E7FF',
                      color: rfq.status === 'Pending' ? '#D97706' : rfq.status === 'Buyer_Accepted' ? '#059669' : '#4F46E5',
                      border: `1px solid ${rfq.status === 'Pending' ? '#FDE68A' : rfq.status === 'Buyer_Accepted' ? '#A7F3D0' : '#C7D2FE'}`
                    }}>
                      {rfq.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem' }}>
                    <div>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748B', textTransform: 'uppercase', fontWeight: '600' }}>Buyer</p>
                      <p style={{ margin: '0.2rem 0 0 0', color: '#0F172A', fontWeight: '500' }}>{rfq.buyer?.name} <span style={{ color: '#94A3B8', fontWeight: 'normal' }}>({rfq.buyer?.email})</span></p>
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748B', textTransform: 'uppercase', fontWeight: '600' }}>Requested Qty</p>
                      <p style={{ margin: '0.2rem 0 0 0', color: '#0F172A', fontWeight: '600' }}>{rfq.requestedQuantity} Units</p>
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748B', textTransform: 'uppercase', fontWeight: '600' }}>Target Price</p>
                      <p style={{ margin: '0.2rem 0 0 0', color: '#EF4444', fontWeight: '700', fontSize: '1.1rem' }}>${rfq.targetPricePerUnit} <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 'normal' }}>/ unit</span></p>
                    </div>
                  </div>
                </div>
              </div>

              {rfq.status === 'Pending' && (
                <div style={{ padding: '1.5rem 2rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'flex-end', background: '#fff' }}>
                  <div style={{ flex: 1, minWidth: '150px' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>Counter Price ($) *</label>
                    <input type="number" 
                      style={{ width: '100%', padding: '0.8rem 1rem', border: '1px solid #CBD5E1', borderRadius: '8px', outline: 'none', color: '#0F172A', fontWeight: '500', boxSizing: 'border-box' }}
                      placeholder="e.g. 45.00" 
                      onChange={e => setCounterData({ ...counterData, [rfq._id]: { ...counterData[rfq._id], price: e.target.value }})}
                    />
                  </div>
                  <div style={{ flex: 2, minWidth: '250px' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>Message to Buyer (Optional)</label>
                    <input type="text" 
                      style={{ width: '100%', padding: '0.8rem 1rem', border: '1px solid #CBD5E1', borderRadius: '8px', outline: 'none', color: '#0F172A', boxSizing: 'border-box' }}
                      placeholder="e.g. I can accept this price if you increase MOQ to 500."
                      onChange={e => setCounterData({ ...counterData, [rfq._id]: { ...counterData[rfq._id], msg: e.target.value }})}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', flex: 1, minWidth: '300px' }}>
                    <button onClick={() => handleCounter(rfq._id)} style={{ flex: 1, padding: '0.8rem', background: '#0F172A', color: '#FFF', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      <i className="fa-solid fa-reply"></i> Send Counter Offer
                    </button>
                    <button onClick={() => handleAccept(rfq._id)} style={{ flex: 1, padding: '0.8rem', background: '#10B981', color: '#FFF', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.2)' }}>
                      <i className="fa-solid fa-check"></i> Accept Target Price
                    </button>
                  </div>
                </div>
              )}

              {rfq.messages?.length > 0 && (
                <div style={{ padding: '1.5rem 2rem', background: '#F8FAFC', borderTop: '1px solid #E2E8F0' }}>
                  <h4 style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Negotiation History</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {rfq.messages.map((m, idx) => (
                      <div key={idx} style={{ 
                        alignSelf: m.senderRole === 'vendor' ? 'flex-end' : 'flex-start',
                        background: m.senderRole === 'vendor' ? '#0F172A' : '#fff',
                        border: m.senderRole === 'vendor' ? 'none' : '1px solid #E2E8F0',
                        color: m.senderRole === 'vendor' ? '#fff' : '#0F172A',
                        padding: '1rem 1.2rem',
                        borderRadius: '12px',
                        borderBottomRightRadius: m.senderRole === 'vendor' ? '0' : '12px',
                        borderBottomLeftRadius: m.senderRole !== 'vendor' ? '0' : '12px',
                        maxWidth: '80%',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                      }}>
                        <div style={{ fontSize: '0.75rem', color: m.senderRole === 'vendor' ? '#94A3B8' : '#64748B', marginBottom: '0.4rem', fontWeight: '700', textTransform: 'uppercase' }}>
                          {m.senderRole}
                        </div>
                        <div style={{ lineHeight: '1.5' }}>{m.text}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
