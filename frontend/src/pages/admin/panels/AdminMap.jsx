import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { io } from 'socket.io-client';

// Fix for default Leaflet icon paths in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Icon for Truck
const truckIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3256/3256166.png', // Generic truck icon
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

export default function AdminMap({ drivers = [], shipments = [] }) {
  const [liveLocations, setLiveLocations] = useState({});

  useEffect(() => {
    // Generate dummy initial coordinates for drivers (focused around a central point, e.g., Hyderabad)
    const initialLocs = {};
    const centerLat = 17.3850;
    const centerLng = 78.4867;

    drivers.forEach((driver, idx) => {
      initialLocs[driver._id] = {
        lat: centerLat + (Math.random() - 0.5) * 0.2,
        lng: centerLng + (Math.random() - 0.5) * 0.2,
        name: driver.name,
      };
    });
    setLiveLocations(initialLocs);

    // Socket.io integration for Phase 15 Live GPS Pings
    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');
    
    socket.on('connect', () => {
      socket.emit('admin_join');
    });

    socket.on('admin_fleet_update', (data) => {
      // Expecting data: { driverId, lat, lng }
      setLiveLocations(prev => ({
        ...prev,
        [data.driverId]: { ...prev[data.driverId], lat: data.lat, lng: data.lng }
      }));
    });

    return () => socket.disconnect();
  }, [drivers]);

  return (
    <div style={{ height: '400px', width: '100%', borderRadius: '12px', overflow: 'hidden', border: '2px solid #1E3446', marginBottom: '2rem' }}>
      <MapContainer center={[17.3850, 78.4867]} zoom={11} style={{ height: '100%', width: '100%' }}>
        {/* Dark Mode CartoDB Map layer */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
        />
        
        {/* Render Drivers */}
        {Object.keys(liveLocations).map(driverId => {
          const loc = liveLocations[driverId];
          return (
            <Marker key={driverId} position={[loc.lat, loc.lng]} icon={truckIcon}>
              <Popup>
                <strong style={{ color: '#E97856' }}>{loc.name}</strong><br />
                Status: In Transit<br />
                Speed: ~45 km/h
              </Popup>
            </Marker>
          );
        })}

        {/* Render Shipment Destinations (Simulated as yellow dots) */}
        {shipments.slice(0, 10).map(shipment => (
          <CircleMarker 
            key={shipment._id}
            center={[17.3850 + (Math.random() - 0.5) * 0.3, 78.4867 + (Math.random() - 0.5) * 0.3]} 
            pathOptions={{ color: '#D5A85F', fillColor: '#D5A85F', fillOpacity: 0.8 }} 
            radius={6}
          >
            <Popup>
              <strong>{shipment.awb}</strong><br/>
              Dest: {shipment.destination}
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
