import { useState } from 'react';
import { createMockShipment } from '../../services/api';
import InvoiceGenerator from './InvoiceGenerator';

export default function AdminCreateShipment() {
  const [formData, setFormData] = useState({
    senderName: '',
    receiverName: '',
    destination: '',
    originHub: 'Kadapa Hub (Main)',
    weight: '',
    items: '',
    price: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [createdShipment, setCreatedShipment] = useState(null);
  
  // Generate a random AWB number
  const generateAwb = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 7; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
    return `SAI-IN-${result}`;
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        awb: generateAwb(),
      };
      const res = await createMockShipment(payload);
      setCreatedShipment(res.data);
    } catch (err) {
      alert('Failed to create shipment.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCreatedShipment(null);
    setFormData({
      senderName: '', receiverName: '', destination: '', originHub: 'Kadapa Hub (Main)', weight: '', items: '', price: ''
    });
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '2rem', color: '#1E3446' }}>Create New Shipment</h2>
      
      {createdShipment ? (
        <div style={{ background: '#E6F4F1', padding: '2rem', borderRadius: '8px', border: '1px solid #B8D5E5' }}>
          <h3 style={{ color: '#3C9290', marginBottom: '1rem' }}><i className="fa-solid fa-circle-check"></i> Shipment Successfully Created!</h3>
          <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Tracking Number: <strong style={{ color: '#1E3446' }}>{createdShipment.awb}</strong></p>
          <p style={{ color: '#4A6B82', marginBottom: '2rem' }}>This shipment is now live in the database and can be tracked by the customer.</p>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            {/* The Print Component will be injected here */}
            <InvoiceGenerator shipment={createdShipment} />
            <button onClick={resetForm} className="btn btn-outline-slate">Create Another</button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem', background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Sender Name</label>
              <input type="text" name="senderName" value={formData.senderName} onChange={handleChange} required style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Receiver Name</label>
              <input type="text" name="receiverName" value={formData.receiverName} onChange={handleChange} required style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px' }} />
            </div>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Destination (City, Country)</label>
            <input type="text" name="destination" placeholder="e.g. London, UK" value={formData.destination} onChange={handleChange} required style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Total Weight</label>
              <input type="text" name="weight" placeholder="e.g. 15 kg" value={formData.weight} onChange={handleChange} required style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Price Quoted</label>
              <input type="text" name="price" placeholder="e.g. ₹12,000" value={formData.price} onChange={handleChange} required style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Origin Hub</label>
              <select name="originHub" value={formData.originHub} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px' }}>
                <option>Kadapa Hub (Main)</option>
                <option>Tirupati Branch</option>
                <option>Proddatur Drop-off</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Declared Items (Contents)</label>
            <textarea name="items" placeholder="e.g. Homemade Sweets, Pickles, Clothes" value={formData.items} onChange={handleChange} required rows="3" style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px' }}></textarea>
          </div>

          <button type="submit" disabled={loading} className="btn btn-teal" style={{ padding: '1rem', fontSize: '1.1rem', marginTop: '1rem' }}>
            {loading ? 'Generating...' : 'Generate AWB & Create Shipment'}
          </button>
        </form>
      )}
    </div>
  );
}
