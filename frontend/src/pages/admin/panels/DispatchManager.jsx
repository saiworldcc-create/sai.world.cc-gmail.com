import React, { useState, useEffect } from 'react';
import { getAdminShipments, getDeliveryPartners, assignShipmentToDriver } from '../../../services/api';

export default function DispatchManager() {
  const [shipments, setShipments] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [shipmentsRes, driversRes] = await Promise.all([
        getAdminShipments(),
        getDeliveryPartners()
      ]);
      // Support both data architectures (axios interceptor unwraps res.data)
      const allShipments = shipmentsRes.shipments || shipmentsRes.data || [];
      const activeShipments = allShipments.filter(s => s.status !== 'Delivered');
      setShipments(activeShipments);
      setDrivers(driversRes.data || []);
    } catch (error) {
      console.error('Error fetching dispatch data:', error);
      alert('Failed to load dispatch data');
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (shipmentId, driverId) => {
    if (!driverId) return alert('Please select a driver first.');
    setAssigning(shipmentId);
    try {
      await assignShipmentToDriver(shipmentId, driverId);
      // alert('Driver assigned successfully!');
      fetchData(); // Refresh the list
    } catch (error) {
      console.error(error);
      alert('Failed to assign driver.');
    } finally {
      setAssigning(null);
    }
  };

  if (loading) {
    return <div className="admin-panel"><div className="loading-spinner"><i className="fa-solid fa-circle-notch fa-spin"></i> Loading Dispatch Center...</div></div>;
  }

  return (
    <div className="admin-panel">
      <div className="panel-header" style={{ marginBottom: '2rem' }}>
        <h2 style={{ color: '#1E3446' }}><i className="fa-solid fa-map-location-dot"></i> Fleet Dispatch Center</h2>
        <p style={{ color: '#64748B' }}>Assign shipments to delivery boys and monitor active routes.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        {/* Left Side: Active Fleet */}
        <div>
          <h3 style={{ marginBottom: '1rem', color: '#1E3446' }}><i className="fa-solid fa-helmet-safety"></i> Active Fleet ({drivers.length})</h3>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '1rem', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
            {drivers.length === 0 ? (
              <p style={{ color: '#888' }}>No delivery partners registered.</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {drivers.map(driver => (
                  <li key={driver._id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.8rem 0', borderBottom: '1px solid #eee' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-powder-blue)', color: 'var(--accent-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                      <i className="fa-solid fa-user"></i>
                    </div>
                    <div>
                      <strong style={{ display: 'block', color: '#333' }}>{driver.name}</strong>
                      <span style={{ fontSize: '0.8rem', color: '#666' }}>{driver.email}</span>
                    </div>
                    <div style={{ marginLeft: 'auto' }}>
                      <span style={{ fontSize: '0.75rem', background: '#e8f5e9', color: '#2e7d32', padding: '0.2rem 0.6rem', borderRadius: '12px', fontWeight: 'bold' }}>Active</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Right Side: Unassigned / Active Shipments */}
        <div>
          <h3 style={{ marginBottom: '1rem', color: '#1E3446' }}><i className="fa-solid fa-cubes"></i> Pending Dispatch ({shipments.length})</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {shipments.length === 0 ? (
              <div style={{ background: '#fff', borderRadius: '12px', padding: '2rem', textAlign: 'center', border: '1px solid var(--border-light)' }}>
                <i className="fa-solid fa-check-double" style={{ fontSize: '2.5rem', color: '#ccc', marginBottom: '1rem' }}></i>
                <p style={{ color: '#64748B' }}>All shipments have been delivered or none are active!</p>
              </div>
            ) : (
              shipments.map(shipment => {
                const currentDriver = drivers.find(d => d._id === shipment.assignedTo);
                
                return (
                  <div key={shipment._id} style={{ background: '#fff', borderRadius: '12px', padding: '1.2rem', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                      <strong style={{ fontSize: '1.1rem', color: '#1E3446' }}>{shipment.awb}</strong>
                      <span style={{ fontSize: '0.8rem', background: '#fff3e0', color: '#e65100', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>{shipment.status}</span>
                    </div>
                    <p style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: '#666' }}>
                      <strong>Dest:</strong> {shipment.destination} <br/>
                      <strong>Receiver:</strong> {shipment.receiver}
                    </p>
                    
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <select 
                        id={`driver-${shipment._id}`}
                        defaultValue={shipment.assignedTo || ""}
                        style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
                      >
                        <option value="" disabled>Select Driver...</option>
                        {drivers.map(d => (
                          <option key={d._id} value={d._id}>{d.name}</option>
                        ))}
                      </select>
                      
                      <button 
                        className="btn btn-teal btn-sm"
                        disabled={assigning === shipment._id}
                        onClick={() => {
                          const select = document.getElementById(`driver-${shipment._id}`);
                          handleAssign(shipment._id, select.value);
                        }}
                      >
                        {assigning === shipment._id ? 'Assigning...' : (shipment.assignedTo ? 'Reassign' : 'Assign')}
                      </button>
                    </div>
                    {currentDriver && (
                      <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#2e7d32' }}>
                        <i className="fa-solid fa-truck"></i> Currently with: <strong>{currentDriver.name}</strong>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
