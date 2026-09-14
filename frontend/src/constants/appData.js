
export const COUNTRY_RATES = {
  USA: { ratePerKg: 780, transit: '4–5 Days', minCharge: 1800, foodHandling: 250 },
  UK: { ratePerKg: 690, transit: '4–5 Days', minCharge: 1600, foodHandling: 200 },
  Canada: { ratePerKg: 820, transit: '4–5 Days', minCharge: 1900, foodHandling: 250 },
  Australia: { ratePerKg: 850, transit: '4–5 Days', minCharge: 2000, foodHandling: 300 },
  UAE: { ratePerKg: 490, transit: '3–4 Days', minCharge: 1200, foodHandling: 150 },
  Germany: { ratePerKg: 740, transit: '4–5 Days', minCharge: 1750, foodHandling: 220 },
  Singapore: { ratePerKg: 520, transit: '3–4 Days', minCharge: 1300, foodHandling: 180 },
  'New Zealand': { ratePerKg: 890, transit: '5–6 Days', minCharge: 2100, foodHandling: 300 },
  Other: { ratePerKg: 790, transit: '4–6 Days', minCharge: 1850, foodHandling: 250 },
};

export const MEGA_MENU_LINKS = [
  {
    id: 'ship',
    label: 'Ship',
    icon: 'fa-box',
    columns: [
      {
        title: 'Send a Parcel',
        links: [
          { to: '/book-pickup', label: 'Book a Pickup', icon: 'fa-truck-fast' },
          { to: '/calculator', label: 'Get a Quote', icon: 'fa-calculator' },
          { to: '/branches', label: 'Find a Location', icon: 'fa-location-dot' }
        ]
      },
      {
        title: 'Specialty Shipping',
        links: [
          { to: '/food-shipping', label: 'NRI Food Special', icon: 'fa-bowl-food' },
          { to: '/services', label: 'Commercial Cargo', icon: 'fa-pallet' },
          { to: '/services', label: 'Medicine Delivery', icon: 'fa-pills' }
        ]
      }
    ]
  },
  {
    id: 'track',
    label: 'Track',
    icon: 'fa-location-crosshairs',
    columns: [
      {
        title: 'Tracking Tools',
        links: [
          { to: '/tracking', label: 'Track Shipment', icon: 'fa-magnifying-glass' },
          { to: '/advanced-tracking', label: 'Advanced Tracking', icon: 'fa-satellite-dish' },
          { to: '/tracking-faqs', label: 'Tracking FAQs', icon: 'fa-circle-question' }
        ]
      }
    ]
  },
  {
    id: 'services',
    label: 'Services',
    icon: 'fa-plane-departure',
    columns: [
      {
        title: 'Our Solutions',
        links: [
          { to: '/express-courier', label: 'Express Courier', icon: 'fa-bolt' },
          { to: '/air-freight', label: 'Air Freight', icon: 'fa-plane-up' },
          { to: '/sea-freight', label: 'Sea Freight', icon: 'fa-ship' },
          { to: '/ecommerce-logistics', label: 'E-commerce Logistics', icon: 'fa-cart-shopping' }
        ]
      }
    ]
  },
  {
    id: 'support',
    label: 'Support',
    icon: 'fa-headset',
    columns: [
      {
        title: 'Customer Service',
        links: [
          { to: '/contact', label: 'Contact Us', icon: 'fa-envelope' },
          { to: '/about', label: 'About SAI', icon: 'fa-building' },
          { to: '/customs-guide', label: 'Customs Guidelines', icon: 'fa-file-shield' },
          { to: '/prohibited-items', label: 'Prohibited Items', icon: 'fa-ban' }
        ]
      }
    ]
  }
];

export const SERVICE_HUB_LINKS = [
  {
    to: '/services',
    title: 'Courier & Air Freight Services',
    eyebrow: 'Worldwide Logistics',
    desc: 'Express international courier, parcel forwarding, and commercial air cargo to 195+ countries.',
    icon: 'fa-boxes-packing',
    badge: '195+ Countries',
    cta: 'Explore Services',
  },
  {
    to: '/food-shipping',
    title: 'NRI Food Shipping Special',
    eyebrow: 'Taste of Home',
    desc: 'Homemade Andhra pickles, sweets, and snacks with certified multi-layer commercial vacuum sealing.',
    icon: 'fa-jar',
    badge: 'Certified Sealing',
    cta: 'Ship Food Parcels',
  },
  {
    to: '/tracking',
    title: 'Live GPS Satellite Tracking',
    eyebrow: 'Real-Time Visibility',
    desc: 'Real-time satellite GPS shipment tracking, airline flight status, and instant delivery verification.',
    icon: 'fa-satellite-dish',
    badge: '24/7 Live AWB',
    cta: 'Track Shipment',
  },
  {
    to: '/calculator',
    title: 'Instant Rate Calculator',
    eyebrow: 'Transparent Pricing',
    desc: 'Estimate exact door-to-door courier charges across all international weight brackets and destination zones.',
    icon: 'fa-calculator',
    badge: 'Best Rates',
    cta: 'Calculate Shipping',
  },
  {
    to: '/customs-guide',
    title: 'Customs & KYC Document Guide',
    eyebrow: 'Hassle-Free Clearance',
    desc: 'Complete export documentation checklist, KYC verification requirements, and restricted goods guide.',
    icon: 'fa-file-shield',
    badge: 'Customs Support',
    cta: 'View Customs Guide',
  },
];

export const TESTIMONIALS = [
  {
    text: 'Sai Couriers delivered my mother\'s homemade mango pickles and murukku to my doorstep in Dallas in just 4 days! Perfectly vacuum-packed with zero leakage.',
    name: 'Venkata Ramana Reddy',
    location: 'Dallas, Texas, USA',
    rating: 5,
  },
  {
    text: 'I needed urgent university transcripts sent to London. Sai International handled all customs documentation and the package reached in 5 days. Absolutely reliable!',
    name: 'S. Anitha Chandra',
    location: 'London, United Kingdom',
    rating: 5,
  },
  {
    text: 'From Tirupati to Sydney in 5 days — incredible! The vacuum sealing for the Andhra snacks was excellent, everything arrived fresh. Highly recommend Sai Couriers.',
    name: 'P. Suresh Kumar',
    location: 'Sydney, NSW, Australia',
    rating: 5,
  },
  {
    text: 'Used Sai International for air cargo to UAE three times now. Their door-to-door service from Kadapa is unmatched. Professional, punctual, and transparent pricing.',
    name: 'Laxmi Narasimha Rao',
    location: 'Dubai, UAE',
    rating: 5,
  },
];

export const DEMO_USER = {
  name: 'Venkata Raman',
  phone: '+91 90599 49365',
  email: 'raman.venkata@gmail.com',
  city: 'Kadapa, Andhra Pradesh',
  tier: 'Gold Loyalty Member',
  stats: { activeShipments: 2, delivered: 14, totalWeight: '128.5 kg', savedAddresses: 3 },
  shipments: [
    { awb: 'SAI-88492-USA', date: 'Aug 22, 2026', dest: 'Dallas, TX, United States', receiver: 'Prasad Reddy', contents: 'Pickles & Traditional Sweets', weight: '9.2 kg', status: 'In Transit', carrier: 'DHL Express' },
    { awb: 'SAI-77310-UK', date: 'Aug 21, 2026', dest: 'London WC1E, United Kingdom', receiver: 'Ananya Sharma', contents: 'University Documents & Baggage', weight: '12.0 kg', status: 'Out for Delivery', carrier: 'FedEx Express' },
    { awb: 'SAI-55201-AUS', date: 'Aug 18, 2026', dest: 'Sydney NSW, Australia', receiver: 'Suresh Kumar', contents: 'Dry Groceries & Snacks', weight: '16.5 kg', status: 'Delivered', carrier: 'UPS Worldwide' },
  ],
  addresses: [
    { id: 1, tag: 'Family (USA)', name: 'Prasad Reddy', address: '742 Evergreen Terrace, Apt 4B, Dallas, TX 75201, USA', phone: '+1 (469) 555-0192' },
    { id: 2, tag: 'Daughter (UK)', name: 'Ananya Sharma', address: 'Flat 12, Russell Square Mansions, Bloomsbury, London WC1B 5EH, UK', phone: '+44 20 7946 0912' },
    { id: 3, tag: 'Brother (Australia)', name: 'Suresh Kumar', address: '24 George Street, Haymarket, Sydney NSW 2000, Australia', phone: '+61 2 9264 1234' },
  ],
  invoices: [
    { id: 'INV-2026-088', awb: 'SAI-88492-USA', date: 'Aug 22, 2026', amount: '₹7,176', status: 'Paid Online' },
    { id: 'INV-2026-074', awb: 'SAI-77310-UK', date: 'Aug 21, 2026', amount: '₹8,280', status: 'Paid Online' },
    { id: 'INV-2026-051', awb: 'SAI-55201-AUS', date: 'Aug 18, 2026', amount: '₹14,025', status: 'Paid Online' },
  ],
};
