import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useUser } from '../../context/UserContext';

export default function VendorAPI() {
  const { user } = useUser();
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newKeyName, setNewKeyName] = useState('');
  const [creating, setCreating] = useState(false);
  const [copiedKey, setCopiedKey] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchKeys();
  }, []);

  const fetchKeys = async () => {
    try {
      setLoading(true);
      const res = await api.get('/vendor/api-keys');
      setKeys(res.apiKeys || []);
    } catch (err) {
      console.error('Failed to fetch API keys:', err);
      setMessage({ type: 'error', text: err.message || 'Failed to load API keys' });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateKey = async (e) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    try {
      setCreating(true);
      setMessage({ type: '', text: '' });
      const res = await api.post('/vendor/api-keys', { name: newKeyName.trim() });
      if (res.success && res.apiKey) {
        setKeys([res.apiKey, ...keys]);
        setNewKeyName('');
        setMessage({ type: 'success', text: 'New API Key generated and activated.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to generate key.' });
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteKey = async (keyId) => {
    if (!window.confirm('Are you sure you want to revoke this API key? Any active system integration using it will immediately stop functioning.')) {
      return;
    }

    try {
      await api.delete(`/vendor/api-keys/${keyId}`);
      setKeys(keys.filter(k => k._id !== keyId && k.key !== keyId));
      setMessage({ type: 'success', text: 'API key revoked successfully.' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to revoke key.' });
    }
  };

  const copyToClipboard = (keyText) => {
    navigator.clipboard.writeText(keyText);
    setCopiedKey(keyText);
    setTimeout(() => setCopiedKey(null), 3000);
  };

  return (
    <div className="vendor-fade-in" style={{ padding: '0', maxWidth: '1200px', margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.2rem', boxShadow: '0 4px 6px -1px rgba(2, 132, 199, 0.3)' }}>
          <i className="fa-solid fa-code"></i>
        </div>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.5px' }}>B2B Developer API & Webhooks</h2>
          <p style={{ margin: '0.2rem 0 0 0', color: '#64748B', fontSize: '0.95rem' }}>Generate authenticated REST API keys for programmatic shipment booking and tracking from your Shopify, WooCommerce, or ERP systems.</p>
        </div>
      </div>

      {message.text && (
        <div style={{
          padding: '1rem 1.25rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          fontSize: '0.92rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          background: message.type === 'success' ? '#F0FDF4' : '#FEF2F2',
          border: `1px solid ${message.type === 'success' ? '#BBF7D0' : '#FECACA'}`,
          color: message.type === 'success' ? '#166534' : '#991B1B'
        }}>
          <i className={`fa-solid ${message.type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}`}></i>
          <span>{message.text}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.7fr', gap: '2rem' }}>
        {/* Left Column: Key Generation */}
        <div>
          <div style={{ background: '#fff', padding: '1.75rem', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#0F172A', fontSize: '1.15rem', fontWeight: '700' }}>Create API Key</h3>
            <p style={{ color: '#64748B', fontSize: '0.88rem', margin: '0 0 1.25rem 0' }}>Assign an identifier to recognize which platform is making requests.</p>
            
            <form onSubmit={handleGenerateKey}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#334155', marginBottom: '0.4rem' }}>Application Name</label>
                <input 
                  type="text" 
                  value={newKeyName} 
                  onChange={e => setNewKeyName(e.target.value)} 
                  placeholder="e.g., Shopify Production Store" 
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '0.92rem', outline: 'none' }} 
                  required 
                />
              </div>
              <button 
                type="submit" 
                disabled={creating}
                style={{ 
                  width: '100%', 
                  padding: '0.75rem', 
                  background: '#0284C7', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: '6px', 
                  cursor: creating ? 'not-allowed' : 'pointer', 
                  fontWeight: '600',
                  fontSize: '0.95rem'
                }}
              >
                {creating ? 'Generating...' : 'Generate API Key'}
              </button>
            </form>
          </div>

          <div style={{ background: '#F8FAFC', padding: '1.5rem', borderRadius: '12px', border: '1px solid #E2E8F0', marginTop: '1.5rem' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#0F172A', fontSize: '0.95rem', fontWeight: '700' }}>Authentication Specification</h4>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569', lineHeight: 1.5 }}>
              Pass your key in the HTTP request headers:
              <br />
              <code style={{ display: 'inline-block', marginTop: '0.5rem', background: '#E2E8F0', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.82rem', color: '#0F172A' }}>
                x-api-key: your_key_here
              </code>
            </p>
          </div>
        </div>

        {/* Right Column: Active Keys & Docs */}
        <div>
          <div style={{ background: '#fff', padding: '1.75rem', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ margin: 0, color: '#0F172A', fontSize: '1.15rem', fontWeight: '700' }}>Active API Keys</h3>
              <span style={{ fontSize: '0.82rem', background: '#F1F5F9', color: '#475569', padding: '0.2rem 0.6rem', borderRadius: '12px', fontWeight: '600' }}>
                {keys.length} {keys.length === 1 ? 'key' : 'keys'}
              </span>
            </div>

            {loading ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#64748B' }}>Loading API keys...</div>
            ) : keys.length === 0 ? (
              <div style={{ padding: '2.5rem 1rem', textAlign: 'center', background: '#F8FAFC', borderRadius: '8px', border: '1px dashed #CBD5E1' }}>
                <p style={{ margin: 0, color: '#64748B', fontSize: '0.92rem' }}>No API keys generated yet. Use the form on the left to create your first integration key.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {keys.map((k) => (
                  <div key={k._id || k.key} style={{ padding: '1rem', border: '1px solid #E2E8F0', borderRadius: '8px', background: '#FAFAFA' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <div>
                        <strong style={{ fontSize: '0.95rem', color: '#0F172A' }}>{k.name}</strong>
                        <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '0.15rem' }}>
                          Created: {new Date(k.createdAt || Date.now()).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDeleteKey(k._id || k.key)}
                        title="Revoke API key"
                        style={{ background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer', padding: '0.3rem 0.5rem', borderRadius: '4px', fontSize: '0.88rem' }}
                      >
                        <i className="fa-solid fa-trash-can"></i> Revoke
                      </button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#fff', border: '1px solid #CBD5E1', borderRadius: '6px', padding: '0.4rem 0.75rem' }}>
                      <code style={{ fontSize: '0.85rem', color: '#0284C7', flexGrow: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {k.key}
                      </code>
                      <button 
                        onClick={() => copyToClipboard(k.key)}
                        style={{ background: copiedKey === k.key ? '#10B981' : '#F1F5F9', color: copiedKey === k.key ? '#fff' : '#334155', border: 'none', borderRadius: '4px', padding: '0.25rem 0.6rem', fontSize: '0.78rem', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s ease' }}
                      >
                        {copiedKey === k.key ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Endpoint Reference */}
          <div style={{ background: '#0F172A', padding: '1.5rem', borderRadius: '12px', marginTop: '1.5rem', color: '#fff' }}>
            <h4 style={{ margin: '0 0 0.75rem 0', color: '#38BDF8', fontSize: '0.95rem', fontWeight: '700' }}>
              <i className="fa-solid fa-terminal" style={{ marginRight: '0.5rem' }}></i> Headless Dispatch API Endpoint
            </h4>
            <div style={{ background: '#020617', padding: '0.85rem', borderRadius: '6px', fontSize: '0.82rem', fontFamily: 'monospace', color: '#94A3B8', overflowX: 'auto', lineHeight: 1.5 }}>
              <div><span style={{ color: '#38BDF8' }}>POST</span> /api/v2/external/shipments</div>
              <div style={{ color: '#64748B' }}>Header: x-api-key: [Your API Key]</div>
              <div style={{ marginTop: '0.5rem', color: '#CBD5E1' }}>Payload:</div>
              <div>&#123;</div>
              <div style={{ paddingLeft: '1rem', color: '#E2E8F0' }}>
                "receiverName": "John Doe",<br />
                "destination": "London, UK",<br />
                "contents": "Food & Pickles",<br />
                "weight": 2.5<br />
              </div>
              <div>&#125;</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
