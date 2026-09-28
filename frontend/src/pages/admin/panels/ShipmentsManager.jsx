import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAdminShipments, createMockShipment, updateShipment } from '../../../services/api';

export default function ShipmentsManager() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ awb: '', status: 'In Transit', stage: 1, sender: '', receiver: '', contents: '', carrier: '', origin: '', destination: '', eta: '', deadWeight: '', volWeight: '', chargeableWeight: '' });
  const [msg, setMsg] = useState('');

  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [updateForm, setUpdateForm] = useState({ awb: '', status: '', stage: 1, location: '', newLog: '' });

  // React Query: Fetch shipments
  const { data: shipments = [], isLoading } = useQuery({
    queryKey: ['adminShipments'],
    queryFn: async () => {
      const res = await getAdminShipments();
      return res.success ? res.shipments : [];
    },
    refetchInterval: 15000, // Auto refresh every 15s
  });

  // React Query: Create Shipment
  const createMutation = useMutation({
    mutationFn: createMockShipment,
    onSuccess: () => {
      setMsg('✅ Shipment created successfully!');
      setShowForm(false);
      queryClient.invalidateQueries(['adminShipments']);
      setTimeout(() => setMsg(''), 4000);
    },
    onError: (err) => {
      setMsg(`❌ ${err.message}`);
      setTimeout(() => setMsg(''), 4000);
    }
  });

  // React Query: Update Shipment
  const updateMutation = useMutation({
    mutationFn: (data) => updateShipment(data.awb, data),
    onSuccess: () => {
      setMsg('✅ Tracking updated successfully!');
      setShowUpdateForm(false);
      queryClient.invalidateQueries(['adminShipments']);
      setTimeout(() => setMsg(''), 4000);
    },
    onError: (err) => {
      setMsg(`❌ ${err.message}`);
      setTimeout(() => setMsg(''), 4000);
    }
  });

  const handleSave = (e) => {
    e.preventDefault();
    createMutation.mutate(form);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    updateMutation.mutate(updateForm);
  };

  const openUpdate = (s) => {
    setUpdateForm({
      awb: s.awb,
      status: s.status,
      stage: s.stage || 1,
      location: s.destination,
      newLog: ''
    });
    setShowUpdateForm(true);
  };

  const statusColor = { 'In Transit': '#3C9290', 'Out for Delivery': '#E97856', 'Delivered': '#27AE60', 'Pending': '#D5A85F' };

  return (
    <div className="admin-panel-content">
      <div className="admin-editor-header">
        <h2 className="admin-editor-title"><i className="fa-solid fa-box-archive"></i> Shipments Management</h2>
        <button className="admin-btn admin-btn-primary" onClick={() => setShowForm(true)}>
          <i className="fa-solid fa-plus"></i> Add Shipment
        </button>
      </div>

      {msg && <div className={`admin-save-msg ${msg.startsWith('✅') ? 'success' : 'error'}`}>{msg}</div>}

      {isLoading ? (
        <div className="admin-loading"><i className="fa-solid fa-circle-notch fa-spin"></i> Loading shipments…</div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>AWB Number</th>
                <th>Origin → Destination</th>
                <th>Status</th>
                <th>Stage</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {shipments.map(s => (
                <tr key={s.awb}>
                  <td><strong>{s.awb}</strong></td>
                  <td>{s.origin} → {s.destination}</td>
                  <td>
                    <span className="admin-status-badge" style={{ background: `${statusColor[s.status] || '#888'}20`, color: statusColor[s.status] || '#888' }}>
                      {s.status}
                    </span>
                  </td>
                  <td>{s.stage}/5</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <a href={`/tracking?awb=${s.awb}`} target="_blank" rel="noreferrer" className="admin-btn admin-btn-sm admin-btn-outline">
                        <i className="fa-solid fa-eye"></i> Track
                      </a>
                      <button className="admin-btn admin-btn-sm admin-btn-primary" onClick={() => openUpdate(s)}>
                        <i className="fa-solid fa-pen"></i> Update
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Shipment Form */}
      {showForm && (
        <div className="admin-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>Add New Shipment</h3>
              <button onClick={() => setShowForm(false)}><i className="fa-solid fa-xmark"></i></button>
            </div>
            <form onSubmit={handleSave} className="admin-modal-body">
              {['awb', 'sender', 'receiver', 'contents', 'carrier', 'origin', 'destination', 'eta', 'deadWeight', 'volWeight', 'chargeableWeight'].map(field => (
                <div key={field} className="admin-field">
                  <label className="admin-field-label">{field}</label>
                  <input type="text" className="admin-field-input" value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })} required={['awb', 'sender', 'receiver', 'origin', 'destination'].includes(field)} />
                </div>
              ))}
              <div className="admin-field">
                <label className="admin-field-label">Status</label>
                <select className="admin-field-input" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                  {['Pending', 'In Transit', 'Out for Delivery', 'Delivered', 'Cancelled'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="admin-field">
                <label className="admin-field-label">Stage (1–5)</label>
                <input type="number" min={1} max={5} className="admin-field-input" value={form.stage} onChange={e => setForm({ ...form, stage: parseInt(e.target.value) })} />
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="admin-btn admin-btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="admin-btn admin-btn-primary" disabled={createMutation.isLoading}>
                  {createMutation.isLoading ? 'Saving…' : 'Save Shipment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Shipment Form */}
      {showUpdateForm && (
        <div className="admin-modal-overlay" onClick={() => setShowUpdateForm(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>Update Tracking: {updateForm.awb}</h3>
              <button onClick={() => setShowUpdateForm(false)}><i className="fa-solid fa-xmark"></i></button>
            </div>
            <form onSubmit={handleUpdate} className="admin-modal-body">
              <div className="admin-field">
                <label className="admin-field-label">General Status</label>
                <select className="admin-field-input" value={updateForm.status} onChange={e => setUpdateForm({ ...updateForm, status: e.target.value })}>
                  {['Pending', 'In Transit', 'In Transit (Express Cargo)', 'Out for Delivery', 'Delivered', 'Cancelled', 'Exception'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="admin-field">
                <label className="admin-field-label">Current Stage (1 = Picked Up ... 5 = Delivered)</label>
                <input type="number" min={1} max={5} className="admin-field-input" value={updateForm.stage} onChange={e => setUpdateForm({ ...updateForm, stage: parseInt(e.target.value) })} />
              </div>
              
              <hr style={{ border: 'none', borderTop: '1px solid #E8EDF2', margin: '1rem 0' }} />
              <h4 style={{ margin: '0 0 1rem 0', color: '#1E3446', fontSize: '0.9rem' }}>Add New Log Entry</h4>

              <div className="admin-field">
                <label className="admin-field-label">Log Activity / Detail</label>
                <input type="text" className="admin-field-input" placeholder="e.g. Departed RGIA Hyderabad" value={updateForm.newLog} onChange={e => setUpdateForm({ ...updateForm, newLog: e.target.value })} />
              </div>
              <div className="admin-field">
                <label className="admin-field-label">Location</label>
                <input type="text" className="admin-field-input" placeholder="e.g. Hyderabad Hub" value={updateForm.location} onChange={e => setUpdateForm({ ...updateForm, location: e.target.value })} />
              </div>

              <div className="admin-modal-footer">
                <button type="button" className="admin-btn admin-btn-outline" onClick={() => setShowUpdateForm(false)}>Cancel</button>
                <button type="submit" className="admin-btn admin-btn-primary" disabled={updateMutation.isLoading}>
                  {updateMutation.isLoading ? 'Updating…' : 'Update Shipment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
