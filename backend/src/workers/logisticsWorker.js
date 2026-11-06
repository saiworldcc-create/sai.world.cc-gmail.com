const eventBus = require('../utils/eventBus');
const Shipment = require('../models/Shipment');

console.log('🚛 Enterprise Logistics Worker initialized and listening for events...');

// Asynchronous Consumer for 'ORDER_PACKED' event
eventBus.on('ORDER_PACKED', async (orderData) => {
  try {
    console.log(`[Logistics Worker] Received ORDER_PACKED event for AWB: ${orderData.awbNumber}`);
    
    // Simulate delay or external API call to 3PL provider
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    await Shipment.create({
      awb: orderData.awbNumber,
      sender: {
        name: orderData.shop.name,
        phone: 'N/A', 
        address: orderData.shop.tradeLicense || 'Vendor Warehouse' 
      },
      receiver: {
        name: orderData.shippingAddress.name,
        phone: orderData.shippingAddress.phone,
        address: `${orderData.shippingAddress.address}, ${orderData.shippingAddress.city}`
      },
      packageDetails: {
        weight: orderData.items.reduce((acc, i) => acc + i.quantity, 0),
        dimensions: 'Standard B2B Box',
        contentDescription: 'B2B Procurement Goods'
      },
      status: 'Pickup Pending',
      paymentStatus: 'Paid',
      pricing: { total: orderData.financials.shippingCost }
    });
    
    console.log(`[Logistics Worker] Successfully created Shipment for AWB: ${orderData.awbNumber}`);
  } catch (error) {
    console.error(`[Logistics Worker] Failed to process ORDER_PACKED event:`, error.message);
  }
});
