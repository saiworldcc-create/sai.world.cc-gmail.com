import { useState, useEffect } from 'react';
import { getBuyerRFQs, acceptVendorCounter } from '../../services/api';
import { useNavigate } from 'react-router-dom';

export default function UserRFQ() {
  const [rfqs, setRfqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadRFQs();
  }, []);

  const loadRFQs = async () => {
    try {
      setLoading(true);
      const res = await getBuyerRFQs();
      setRfqs(res.rfqs || []);
    } catch (err) {
      setMsg(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (rfqId) => {
    try {
      await acceptVendorCounter(rfqId);
      setMsg('✅ Offer accepted! The vendor will process your PO.');
      loadRFQs();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.8rem', color: '#1E3446', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <i className="fa-solid fa-file-invoice-dollar" style={{ color: '#3CC8C8' }}></i> My Bulk Quotes (RFQs)
      </h1>
      
      {msg && <div style={{ padding: '1rem', background: msg.includes('✅') ? '#ECFDF5' : '#FEF2F2', color: msg.includes('✅') ? '#059669' : '#DC2626', borderRadius: '8px', marginBottom: '1rem' }}>{msg}</div>}

      {loading ? (
        <div>Loading Quotes...</div>
      ) : rfqs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: '#FFF', borderRadius: '12px' }}>
          <i className="fa-solid fa-box-open" style={{ fontSize: '3rem', color: '#CBD5E1', marginBottom: '1rem' }}></i>
          <p style={{ color: '#64748B' }}>You haven't requested any bulk quotes yet.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {rfqs.map(rfq => (
            <div key={rfq._id} style={{ background: '#FFF', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.5rem 0', color: '#1E3446' }}>{rfq.product?.name}</h3>
                  <div style={{ fontSize: '0.9rem', color: '#64748B' }}>Vendor: <strong>{rfq.shop?.name}</strong></div>
                  <div style={{ fontSize: '0.9rem', color: '#64748B' }}>Requested Qty: <strong>{rfq.requestedQuantity} Units</strong></div>
                  <div style={{ fontSize: '0.9rem', color: '#64748B' }}>Your Target Price: <strong>₹{rfq.targetPricePerUnit} / unit</strong></div>
                </div>
                <span style={{ 
                  padding: '0.5rem 1rem', 
                  borderRadius: '20px', 
                  fontSize: '0.8rem', 
                  fontWeight: '700',
                  background: rfq.status === 'Vendor_Countered' ? '#FEF3C7' : rfq.status === 'Buyer_Accepted' ? '#D1FAE5' : '#E0E7FF',
                  color: rfq.status === 'Vendor_Countered' ? '#D97706' : rfq.status === 'Buyer_Accepted' ? '#059669' : '#4F46E5'
                }}>
                  {rfq.status.replace('_', ' ')}
                </span>
              </div>

              {rfq.status === 'Vendor_Countered' && (
                <div style={{ background: '#FFFBEB', padding: '1.5rem', borderRadius: '8px', borderLeft: '4px solid #F59E0B' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: '#B45309' }}>Vendor Counter Offer Received!</h4>
                  <p style={{ margin: '0 0 1rem 0', color: '#92400E', fontSize: '1.1rem' }}>
                    <strong>₹{rfq.counterPricePerUnit}</strong> / unit
                  </p>
                  <button onClick={() => handleAccept(rfq._id)} style={{ padding: '0.75rem 1.5rem', background: '#10B981', color: '#FFF', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                    Accept Offer & Finalize PO
                  </button>
                </div>
              )}

              {rfq.messages?.length > 0 && (
                <div style={{ marginTop: '1.5rem', borderTop: '1px solid #F1F5F9', paddingTop: '1rem' }}>
                  <h4 style={{ fontSize: '0.9rem', color: '#1E3446', marginBottom: '1rem' }}>Negotiation History</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {rfq.messages.map((m, idx) => (
                      <div key={idx} style={{ 
                        alignSelf: m.senderRole === 'buyer' ? 'flex-end' : 'flex-start',
                        background: m.senderRole === 'buyer' ? '#E0F2FE' : '#F1F5F9',
                        padding: '0.75rem 1rem',
                        borderRadius: '12px',
                        maxWidth: '80%'
                      }}>
                        <div style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '0.25rem', fontWeight: 'bold' }}>
                          {m.senderRole.toUpperCase()}
                        </div>
                        <div style={{ color: '#1E3446' }}>{m.text}</div>
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
