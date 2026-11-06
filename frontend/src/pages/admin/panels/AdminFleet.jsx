import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../services/api';

export default function AdminFleet() {
  const queryClient = useQueryClient();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newVehicle, setNewVehicle] = useState({ registrationNumber: '', vehicleType: 'Van', odometer: 0 });

  const { data: fleet = [], isLoading } = useQuery({
    queryKey: ['adminFleet'],
    queryFn: async () => {
      const res = await api.get('/fleet');
      return res.data || [];
    }
  });

  const addMutation = useMutation({
    mutationFn: (vehicle) => api.post('/fleet', vehicle),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminFleet']);
      setShowAddModal(false);
      setNewVehicle({ registrationNumber: '', vehicleType: 'Van', odometer: 0 });
    }
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    addMutation.mutate(newVehicle);
  };

  if (isLoading) return <div style={{ padding: '2rem' }}>Loading Fleet Data...</div>;

  return (
    <div className="admin-panel-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ margin: 0, color: '#1E3446' }}><i className="fa-solid fa-truck"></i> Fleet & Asset Management</h2>
        <button onClick={() => setShowAddModal(true)} className="admin-btn admin-btn-primary">
          <i className="fa-solid fa-plus"></i> Add Vehicle
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {fleet.map(vehicle => (
          <div key={vehicle._id} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E3EDF3', padding: '1.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#1E3446', fontSize: '1.4rem' }}>{vehicle.registrationNumber}</h3>
                <span style={{ background: '#3C929015', color: '#3C9290', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>{vehicle.vehicleType}</span>
              </div>
              <i className={`fa-solid ${vehicle.vehicleType === 'Truck' ? 'fa-truck-moving' : vehicle.vehicleType === 'Bike' ? 'fa-motorcycle' : 'fa-van-shuttle'}`} style={{ fontSize: '2rem', color: '#D5A85F' }}></i>
            </div>
            
            <div style={{ marginTop: '1.5rem', borderTop: '1px solid #E3EDF3', paddingTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                <span style={{ color: '#7091A8' }}>Status:</span>
                <strong style={{ color: vehicle.status === 'Active' ? '#27AE60' : '#E97856' }}>{vehicle.status}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                <span style={{ color: '#7091A8' }}>Odometer:</span>
                <strong style={{ color: '#1E3446' }}>{vehicle.odometer.toLocaleString()} km</strong>
              </div>
            </div>

            {vehicle.maintenanceAlerts?.some(a => !a.resolved) && (
              <div style={{ marginTop: '1rem', background: '#E9785615', color: '#E97856', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '600' }}>
                <i className="fa-solid fa-triangle-exclamation"></i> Maintenance Required!
              </div>
            )}
          </div>
        ))}
        {fleet.length === 0 && <div style={{ color: '#7091A8' }}>No vehicles in fleet.</div>}
      </div>

      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(30, 52, 70, 0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '2rem', borderRadius: '12px', width: '400px' }}>
            <h3 style={{ marginTop: 0 }}>Register New Vehicle</h3>
            <form onSubmit={handleAddSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4A6B82', fontSize: '0.9rem' }}>Registration Number (License Plate)</label>
                <input type="text" required value={newVehicle.registrationNumber} onChange={e => setNewVehicle({...newVehicle, registrationNumber: e.target.value})} style={{ width: '100%', padding: '0.75rem', border: '1px solid #E3EDF3', borderRadius: '6px' }} placeholder="e.g. MH-12-AB-1234" />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4A6B82', fontSize: '0.9rem' }}>Vehicle Type</label>
                <select value={newVehicle.vehicleType} onChange={e => setNewVehicle({...newVehicle, vehicleType: e.target.value})} style={{ width: '100%', padding: '0.75rem', border: '1px solid #E3EDF3', borderRadius: '6px' }}>
                  <option>Van</option>
                  <option>Truck</option>
                  <option>Bike</option>
                </select>
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4A6B82', fontSize: '0.9rem' }}>Current Odometer (km)</label>
                <input type="number" required value={newVehicle.odometer} onChange={e => setNewVehicle({...newVehicle, odometer: parseInt(e.target.value)})} style={{ width: '100%', padding: '0.75rem', border: '1px solid #E3EDF3', borderRadius: '6px' }} />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="submit" disabled={addMutation.isLoading} className="admin-btn admin-btn-primary" style={{ flex: 1 }}>{addMutation.isLoading ? 'Saving...' : 'Add Asset'}</button>
                <button type="button" onClick={() => setShowAddModal(false)} className="admin-btn admin-btn-danger" style={{ flex: 1 }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
