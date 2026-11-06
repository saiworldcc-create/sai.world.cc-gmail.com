import React, { useState } from 'react';

export default function EnterpriseAWBManager() {
  const [formData, setFormData] = useState({
    senderName: '',
    receiverName: '',
    items: '',
    weight: '',
    length: '',
    width: '',
    height: '',
    destination: '',
    originHub: 'Kadapa Global Hub',
    provider: 'SaiNetwork',
    ewayBillNumber: '',
    insuranceValue: '',
    corporateWalletId: '',
    aisle: '',
    bin: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('/api/v1/enterprise/awb/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.message || 'Failed to generate AWB');
      }
    } catch (err) {
      setError('Network error');
    }
    setLoading(false);
  };

  return (
    <div className="admin-panel" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ color: '#1E3446', margin: 0 }}>
          <i className="fa-solid fa-globe" style={{ marginRight: '10px', color: '#3C9290' }}></i>
          Enterprise AWB Generation Engine
        </h2>
      </div>

      <div style={{ background: '#fff', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        {error && <div style={{ background: '#FEE2E2', color: '#991B1B', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>{error}</div>}
        {result && (
          <div style={{ background: '#ECFDF5', border: '1px solid #10B981', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
            <h3 style={{ color: '#065F46', margin: '0 0 1rem 0' }}>✅ Success! Enterprise Manifest Generated</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div><strong>AWB:</strong> <span style={{ color: '#3C9290', fontSize: '1.2rem', fontWeight: 800 }}>{result.awb}</span></div>
              <div><strong>Provider:</strong> {result.thirdPartyLogistics?.provider}</div>
              {result.thirdPartyLogistics?.externalAwb && <div><strong>External AWB:</strong> {result.thirdPartyLogistics.externalAwb}</div>}
              <div><strong>Volumetric Wt:</strong> {result.volWeight}</div>
              <div><strong>Chargeable Wt:</strong> {result.chargeableWeight}</div>
              <div><strong>E-Way Bill:</strong> {result.finance?.ewayBillNumber}</div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <h4 style={{ color: '#3C9290', borderBottom: '2px solid #E8EDF2', paddingBottom: '0.5rem', marginBottom: '1rem' }}>1. Basic Consignment</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' }}>Sender (Corporate)</label>
              <input type="text" name="senderName" value={formData.senderName} onChange={handleChange} required style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #E8EDF2' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' }}>Receiver</label>
              <input type="text" name="receiverName" value={formData.receiverName} onChange={handleChange} required style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #E8EDF2' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' }}>Contents (HSN)</label>
              <input type="text" name="items" value={formData.items} onChange={handleChange} required style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #E8EDF2' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' }}>Destination</label>
              <input type="text" name="destination" value={formData.destination} onChange={handleChange} required style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #E8EDF2' }} />
            </div>
          </div>

          <h4 style={{ color: '#3C9290', borderBottom: '2px solid #E8EDF2', paddingBottom: '0.5rem', marginBottom: '1rem' }}>2. Dynamic Volumetric Calculations</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' }}>Dead Wt (kg)</label>
              <input type="number" name="weight" value={formData.weight} onChange={handleChange} required style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #E8EDF2' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' }}>Length (cm)</label>
              <input type="number" name="length" value={formData.length} onChange={handleChange} required style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #E8EDF2' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' }}>Width (cm)</label>
              <input type="number" name="width" value={formData.width} onChange={handleChange} required style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #E8EDF2' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' }}>Height (cm)</label>
              <input type="number" name="height" value={formData.height} onChange={handleChange} required style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #E8EDF2' }} />
            </div>
          </div>

          <h4 style={{ color: '#3C9290', borderBottom: '2px solid #E8EDF2', paddingBottom: '0.5rem', marginBottom: '1rem' }}>3. Enterprise & WMS Parameters</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' }}>Logistics Provider</label>
              <select name="provider" value={formData.provider} onChange={handleChange} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #E8EDF2' }}>
                <option value="SaiNetwork">Sai Internal Fleet</option>
                <option value="FedEx">FedEx (3PL)</option>
                <option value="DHL">DHL (3PL)</option>
                <option value="BlueDart">BlueDart (3PL)</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' }}>Corporate Wallet ID (Optional)</label>
              <input type="text" name="corporateWalletId" value={formData.corporateWalletId} onChange={handleChange} placeholder="WAL-XXXX" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #E8EDF2' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' }}>Cargo Insurance Value ($)</label>
              <input type="number" name="insuranceValue" value={formData.insuranceValue} onChange={handleChange} placeholder="0" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #E8EDF2' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' }}>WMS Aisle</label>
              <input type="text" name="aisle" value={formData.aisle} onChange={handleChange} placeholder="A1" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #E8EDF2' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' }}>WMS Bin</label>
              <input type="text" name="bin" value={formData.bin} onChange={handleChange} placeholder="B05" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #E8EDF2' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' }}>Manual E-Way Bill (Optional)</label>
              <input type="text" name="ewayBillNumber" value={formData.ewayBillNumber} onChange={handleChange} placeholder="Leave blank for auto-generate" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #E8EDF2' }} />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              background: 'linear-gradient(135deg, #3C9290 0%, #2A6B69 100%)', 
              color: 'white', 
              padding: '1rem 2rem', 
              border: 'none', 
              borderRadius: '8px', 
              fontWeight: 800, 
              fontSize: '1.1rem', 
              cursor: loading ? 'not-allowed' : 'pointer',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-bolt"></i>}
            {loading ? 'Processing through Kafka...' : 'Generate Enterprise AWB & Manifest'}
          </button>
        </form>
      </div>
    </div>
  );
}
