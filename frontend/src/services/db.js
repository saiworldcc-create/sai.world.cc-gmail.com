// Mock Database using LocalStorage

const DB_KEY = 'sai_shipments_db';

// Helper to get all shipments
export const getShipments = () => {
  const data = localStorage.getItem(DB_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
};

// Helper to save all shipments
const saveShipments = (shipments) => {
  localStorage.setItem(DB_KEY, JSON.stringify(shipments));
};

// Get a single shipment by AWB
export const getShipmentByAwb = (awb) => {
  const shipments = getShipments();
  return shipments.find((s) => s.awb === awb);
};

// Create a new shipment
export const createShipment = (shipmentData) => {
  const shipments = getShipments();
  const newShipment = {
    ...shipmentData,
    createdAt: new Date().toISOString(),
    // Initial tracking milestones
    milestones: [
      {
        id: 1,
        status: 'Picked Up',
        location: shipmentData.originHub || 'Kadapa Hub',
        timestamp: new Date().toISOString(),
        completed: true,
      },
      {
        id: 2,
        status: 'KYC Verified',
        location: 'Customs Ready',
        timestamp: null,
        completed: false,
      },
      {
        id: 3,
        status: 'Departed Facility',
        location: 'Air Cargo Hub',
        timestamp: null,
        completed: false,
      },
      {
        id: 4,
        status: 'In Transit',
        location: 'Destination Country',
        timestamp: null,
        completed: false,
      },
      {
        id: 5,
        status: 'Delivered',
        location: shipmentData.destination || 'Consignee Address',
        timestamp: null,
        completed: false,
      }
    ]
  };
  
  shipments.push(newShipment);
  saveShipments(shipments);
  return newShipment;
};

// Update an existing shipment
export const updateShipment = (awb, updates) => {
  const shipments = getShipments();
  const index = shipments.findIndex((s) => s.awb === awb);
  
  if (index !== -1) {
    shipments[index] = { ...shipments[index], ...updates };
    saveShipments(shipments);
    return shipments[index];
  }
  return null;
};

// Seed database with a sample shipment if empty
export const seedDatabase = () => {
  const shipments = getShipments();
  if (shipments.length === 0) {
    createShipment({
      awb: 'SAI-88492-USA',
      senderName: 'Rajesh Kumar',
      receiverName: 'Priya Patel',
      destination: 'Dallas, TX, USA',
      originHub: 'Kadapa Hub',
      weight: '12.5 kg',
      items: 'Homemade Pickles & Sweets',
      price: '₹14,500'
    });
  }
};

// Run seed immediately
seedDatabase();
