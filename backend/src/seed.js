/**
 * Full seed: Demo shipments + Admin account + All page default content
 * Run: node src/seed.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const dns = require('dns');

// Fix for Windows DNS environments failing on MongoDB SRV lookups
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

const Shipment = require('./models/Shipment');
const Admin = require('./models/Admin');
const PageContent = require('./models/PageContent');

// ─── Demo Shipments ────────────────────────────────────────────────────────
const DEMO_SHIPMENTS = [
  {
    awb: 'SAI-88492-USA', status: 'In Transit', stage: 4,
    sender: 'Venkata Raman (Kadapa, AP)', receiver: 'Prasad Reddy (Dallas, Texas, USA)',
    contents: 'Homemade Mango Pickles & Sweets (Vacuum Sealed)', carrier: 'DHL Express Global Network',
    deadWeight: '8.5 kg', volWeight: '9.2 kg', chargeableWeight: '9.2 kg',
    origin: 'Kadapa Co-operative Colony Hub', destination: 'Dallas, TX, United States',
    eta: '2 Days Remaining',
    history: [
      { status: 'Arrived at Cincinnati Hub & Passed US Customs Inward Inspection', time: 'Today, 09:30 AM', location: 'Cincinnati (CVG) Gateway, USA', completed: true, active: true },
      { status: 'Departed RGIA Hyderabad Air Cargo Gateway via Flight LH-753', time: 'Yesterday, 08:15 PM', location: 'Rajiv Gandhi Int. Airport (RGIA)', completed: true, active: false },
      { status: 'Customs Cleared & Outward KYC Documentation Approved', time: '2 Days ago, 04:30 PM', location: 'Kadapa Central Export Hub', completed: true, active: false },
      { status: 'Multi-Barrier Vacuum Sealing & Triple-Ply Corrugated Box Packing Done', time: '2 Days ago, 02:15 PM', location: 'Kadapa Main Branch', completed: true, active: false },
      { status: 'Doorstep Pickup Completed by Executive Ramesh', time: '3 Days ago, 10:45 AM', location: 'Co-operative Colony, Kadapa', completed: true, active: false },
    ],
  },
  {
    awb: 'SAI-77310-UK', status: 'Out for Delivery', stage: 5,
    sender: 'S. Chandra Sekhar (Tirupati, AP)', receiver: 'Ananya Sharma (London, United Kingdom)',
    contents: 'University Transcripts & Student Relocation Baggage', carrier: 'FedEx Express Worldwide',
    deadWeight: '12.0 kg', volWeight: '11.5 kg', chargeableWeight: '12.0 kg',
    origin: 'Tirupati Regional Center', destination: 'London WC1E, United Kingdom',
    eta: 'Delivering Today before 05:00 PM',
    history: [
      { status: 'Out for Delivery with Local Courier Van', time: 'Today, 08:15 AM', location: 'London Central Depot, UK', completed: true, active: true },
      { status: 'Cleared UK HM Revenue & Customs with Zero Duty', time: 'Yesterday, 03:20 PM', location: 'London Heathrow Airport (LHR)', completed: true, active: false },
      { status: 'Departed RGIA Air Cargo Terminal', time: '3 Days ago, 11:00 PM', location: 'Hyderabad RGIA', completed: true, active: false },
      { status: 'Processed & Document Checked', time: '4 Days ago, 03:00 PM', location: 'Tirupati Regional Hub', completed: true, active: false },
      { status: 'Doorstep Picked Up', time: '4 Days ago, 10:00 AM', location: 'Tirupati Temple City', completed: true, active: false },
    ],
  },
  {
    awb: 'SAI-55201-AUS', status: 'Delivered', stage: 5,
    sender: 'G. Lakshmi (Nellore, AP)', receiver: 'Suresh Kumar (Sydney, NSW, Australia)',
    contents: 'Traditional Andhra Snacks & Dry Groceries', carrier: 'UPS Worldwide Saver',
    deadWeight: '15.0 kg', volWeight: '16.5 kg', chargeableWeight: '16.5 kg',
    origin: 'Nellore Regional Branch', destination: 'Sydney NSW 2000, Australia',
    eta: 'Delivered (Signed by: S. Kumar)',
    history: [
      { status: 'Shipment Successfully Delivered & Signed by Receiver', time: 'Today, 02:45 PM', location: 'Sydney, Australia', completed: true, active: true },
      { status: 'Out for Final Delivery', time: 'Today, 08:30 AM', location: 'Sydney Sorting Hub', completed: true, active: false },
      { status: 'Biosecurity Clearance Completed', time: 'Yesterday, 01:15 PM', location: 'Sydney Kingsford Smith Airport', completed: true, active: false },
      { status: 'Departed Hyderabad Air Cargo Gateway', time: '4 Days ago, 09:30 PM', location: 'Hyderabad RGIA', completed: true, active: false },
      { status: 'Doorstep Collected & Vacuum Sealed', time: '5 Days ago, 11:30 AM', location: 'Nellore Hub', completed: true, active: false },
    ],
  },
];

// ─── Default Page Content ──────────────────────────────────────────────────
const IK_BASE = 'https://ik.imagekit.io/uy5estwss';

const DEFAULT_PAGE_CONTENT = [
  {
    page: 'branding',
    sections: {
      logo: {
        url: '/assets/images/sai_logo_transparent.png',
        alt: 'Sai International Couriers & Cargo',
        height: 48,
        showText: false,
      },
      header: {
        companyName: 'SAI',
        tagline: 'International Couriers & Cargo',
        phone: '+91 90599 49365',
        trackBtnText: 'Track',
        bookBtnText: 'Book Pickup',
      },
    },
  },
  {
    page: 'home',
    sections: {
      hero: {
        badge: 'INTERNATIONAL SHIPPING FROM ANDHRA PRADESH',
        heading: 'From Andhra Pradesh',
        headingHighlight: 'to the World.',
        description: 'Worldwide Express Courier, Air Cargo & Doorstep Delivery to 195+ Countries.',
        features: ['195+ Countries', '4–5 Days Delivery', 'Free Doorstep Pickup'],
        ctaPrimary: { label: 'Book a Pickup', link: '/book-pickup' },
        ctaSecondary: { label: 'Explore Services', link: '/services' },
        heroBgImage: `/assets/images/sai_global_3d_hero.jpg`,
        heroBgMobile: `/assets/images/sai_global_hero_mobile.jpg`,
        videoUrl: '',
      },
      videoSection: {
        enabled: true,
        eyebrow: 'Inside Sai Couriers',
        heading: 'Watch How We Pack & Ship Your Parcels Worldwide',
        description: 'From certified vacuum packaging of authentic Andhra pickles to direct international air cargo flights, see our operations in action.',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        posterImage: '/assets/images/sai_global_3d_hero.jpg',
      },
      brandStory: {
        eyebrow: 'Our Heritage & Commitment',
        heading: 'Connecting Andhra Pradesh with the World',
        paragraph1: 'Founded with the mission to bridge families and businesses across Kadapa, Nellore, Tirupati, Proddutur, and Rayachoty with loved ones globally, Sai International Couriers & Cargo delivers unmatched speed, reliability, and care.',
        paragraph2: 'Whether it\'s essential academic transcripts for overseas universities, confidential legal documents, heavy commercial air cargo, or beloved homemade delicacies, we manage the entire journey with specialized vacuum packaging and seamless customs clearance.',
        image: `/assets/images/express_doorstep_pickup.jpg`,
        features: [
          'Direct Air Cargo Flights',
          'Free Doorstep Collection',
          'End-to-End Customs Support',
          'Live Satellite GPS Tracking',
        ],
      },
      services: {
        eyebrow: 'Comprehensive Logistics',
        heading: 'Worldwide Courier & Air Freight Solutions',
        lead: 'Tailored services engineered for speed, safety, and regulatory compliance across North America, Europe, Asia-Pacific, and the Middle East.',
        featuredService: {
          image: `/assets/images/courier_delivery_service.jpg`,
          badge: 'Priority Delivery',
          deliveryTime: '4–5 Days Guaranteed',
          title: 'International Express Courier',
          description: 'Expedited door-to-door transit for urgent overseas documents, business parcels, sample shipments, and gifts with complete online tracking across 195+ countries.',
          bullets: [
            'Free doorstep pickup across Kadapa & AP region',
            'Proforma invoice & export documentation support',
            'Direct flight connections with SMS & WhatsApp alerts',
          ],
        },
        stackedServices: [
          {
            badge: 'Commercial Cargo & Excess Baggage',
            title: 'International Air Cargo',
            description: 'Heavy freight solutions, palletized cargo shipments, industrial machinery, and personal relocation baggage with complete airline cargo manifesting.',
          },
          {
            badge: 'NRI Family Special',
            title: 'Pickles, Sweets & Snacks Shipping',
            description: 'Specialized vacuum sealing and moisture-proof packing for homemade food items, sweets, snacks, and traditional attire sent to USA, UK, Canada & Gulf.',
          },
          {
            badge: 'Global Supply Chain',
            title: 'E-commerce & B2B Logistics',
            description: 'Fast, reliable fulfillment for local businesses selling globally. Complete API integrations for bulk shipping and real-time order tracking.',
          }
        ],
      },
      foodPackaging: {
        eyebrow: 'Specialized Packaging Standards',
        heading: 'Send the Taste of Home Worldwide',
        highlight: 'Apparel, Homemade Pickles, Sweets, Groceries, Snacks, Gift Items, Brass & Clay Idols',
        paragraph: 'We know how cherished traditional home flavors are for families living abroad. Our multi-stage packaging process prevents spillage, maintains freshness, and clears overseas agricultural customs smoothly.',
        image: `/assets/images/special_food_packaging.jpg`,
        items: [
          { icon: 'fa-jar', title: 'Homemade Pickles', desc: 'Mango, Gongura, Lemon, Ginger in vacuum jars.' },
          { icon: 'fa-candy-cane', title: 'Traditional Sweets', desc: 'Pootharekulu, Laddu, Mysore Pak in sealed boxes.' },
          { icon: 'fa-cookie-bite', title: 'Snacks & Savories', desc: 'Murukku, Chekkalu, Mixture, Spices & Podis.' },
        ],
      },
      globalCoverage: {
        eyebrow: 'Global Network',
        heading: 'Delivering from Andhra Pradesh to 195+ Countries',
        lead: 'Bridging Kadapa and Andhra Pradesh with leading international destinations in 4–5 business days.',
        countries: ['🇺🇸 USA', '🇨🇦 Canada', '🇬🇧 United Kingdom', '🇦🇺 Australia', '🇩🇪 Germany', '🇦🇪 UAE (Dubai)', '🇰🇼 Kuwait', '🇸🇦 Saudi Arabia', '🇸🇬 Singapore', '🇳🇱 Netherlands', '🇸🇪 Sweden', '🇵🇱 Poland', '🇶🇦 Qatar', '🇿🇦 South Africa', '🇱🇰 Sri Lanka', '🇨🇳 China', '🇺🇦 Ukraine'],
      },
      whyChoose: {
        eyebrow: 'Service Standards',
        heading: 'Your Parcel. Our Responsibility.',
        lead: 'Every shipment handled with white-glove care, top-tier global airline connectivity, and personalized support.',
        features: [
          { icon: 'fa-truck-fast', title: 'Free Doorstep Home & Office Pickup', desc: 'Our staff directly collects parcels from your home or office in Kadapa, Nellore, Tirupati, Proddutur, or Rayachoty, verifies paperwork, and delivers straight to the international destination.', span: true },
          { icon: 'fa-satellite', title: 'Live Milestone Tracking', desc: 'Direct updates via website, SMS, and WhatsApp alerts at every flight departure and scan.' },
          { icon: 'fa-globe', title: '195+ Countries Served', desc: 'Global logistics coverage spanning North America, Europe, Asia-Pacific, and Middle East.' },
          { icon: 'fa-shield-halved', title: 'Safe & Secure Packaging (Free Box Packing)', desc: 'Heavy-duty corrugated boxes, moisture-proof vacuum wrapping, and tamper-evident strapping provided completely free of charge.', span: true },
          { icon: 'fa-headset', title: '24x7 Customer Support', desc: 'Dedicated staff to guide you on paperwork, customs rules, and transit updates.' },
        ],
      },
      testimonials: {
        eyebrow: 'Verified Reviews',
        heading: 'Trusted by Families & Businesses',
        lead: 'Read how our 4–5 day international shipping and careful packaging delight families worldwide.',
        items: [
          { text: '"I sent 15 kg of homemade mango pickle and traditional sweets from Kadapa to my son in Dallas, Texas. The vacuum packing was completely leak-proof. The parcel reached in just 4 days via Sai International! Outstanding, trustworthy service."', name: 'V. Ramachandra Reddy', role: 'Kadapa → Dallas, USA (Pickles & Sweets)', initials: 'VR' },
          { text: '"Needed urgent university admission transcripts sent to London, UK. The team picked up the documents from my home in Tirupati, verified the KYC, and it was delivered within 3 days. Live tracking gave me full relief throughout."', name: 'Pooja Sai Priya', role: 'Tirupati → London, UK (Student Documents)', initials: 'PS' },
          { text: '"Our textile export firm regularly books air cargo consignments to Sydney and Dubai through Sai International Couriers. Chandra Babu and his team provide the best rates, punctual flight connections, and clean documentation."', name: 'K. Srinivasulu', role: 'Proddutur → Sydney, Australia (Commercial Cargo)', initials: 'KS' },
        ],
      },
    },
  },
  {
    page: 'about',
    sections: {
      hero: {
        eyebrow: 'Our Story',
        heading: 'About Sai International Couriers & Cargo',
        lead: 'A trusted courier partner serving Andhra Pradesh families & businesses since our founding.',
        breadcrumb: 'About Us',
      },
      story: {
        heading: 'Connecting Andhra Pradesh with the World Since Day One',
        paragraphs: [
          'Sai International Couriers & Cargo was established with one clear mission — to provide Andhra Pradesh families, students, and businesses with a reliable, affordable, and transparent international courier solution.',
          'Under the leadership of Managing Director S. Chandra Babu, we have grown from a single office in Kadapa to a network spanning Tirupati, Nellore, Proddutur, and Rayachoty, serving thousands of satisfied customers every month.',
          'Our specialization in NRI food shipping — particularly homemade pickles, sweets, and traditional snacks — sets us apart in the industry. We understand the emotional value of these packages and treat each one with extraordinary care.',
        ],
        image: `/assets/images/sai_customer_support.jpg`,
        stats: [
          { value: '10+', label: 'Years in Service' },
          { value: '195+', label: 'Countries Served' },
          { value: '50,000+', label: 'Happy Customers' },
          { value: '6', label: 'Branch Locations' },
        ],
      },
      team: {
        heading: 'Leadership',
        members: [
          { name: 'S. Chandra Babu', role: 'Managing Director & Founder', desc: 'Leading Sai Couriers with 10+ years of international logistics expertise.', initials: 'CB' },
        ],
      },
      contact: {
        phone: '+91 90599 49365',
        email: 'saiinternationalcouriers83@gmail.com',
        gstin: '37BOPPS1122H1ZS',
        address: '41/1248, Ratna Sabhapathi Building, Co-operative Colony, Kadapa, AP 516001',
        hours: 'Mon–Sun: 09:00 AM – 09:30 PM',
      },
    },
  },
  {
    page: 'services',
    sections: {
      hero: { heading: 'Our International Courier & Air Cargo Services', lead: 'Premium logistics solutions for individuals, families, students, and businesses from Andhra Pradesh to 195+ countries.', eyebrow: 'Comprehensive Logistics' },
      servicesList: [
        { id: 'express-courier', icon: 'fa-plane-departure', title: 'International Express Courier', transit: '4–5 Days', badge: 'Most Popular', description: 'Door-to-door parcel delivery to 195+ countries via DHL, FedEx, and UPS networks with live tracking.', bullets: ['Free doorstep pickup', 'Full customs documentation', 'Live AWB tracking', 'SMS & WhatsApp updates'] },
        { id: 'air-cargo', icon: 'fa-boxes-stacking', title: 'International Air Cargo', transit: 'Volume Rates', badge: 'Commercial', description: 'Heavy freight, palletized cargo, and industrial shipments with airline cargo manifesting and competitive rates.', bullets: ['Weight from 5kg to 1000kg+', 'Airport-to-airport or doorstep', 'Export documentation support', 'Volume discounts available'] },
        { id: 'food-shipping', icon: 'fa-jar', title: 'Pickles, Sweets & NRI Food', transit: '100% Leak-Proof', badge: 'NRI Specialty', description: 'Specialized vacuum-sealed packaging for homemade food, pickles, sweets, and snacks with customs clearance.', bullets: ['Professional vacuum sealing', 'Moisture-proof packing', 'Customs compliant labeling', 'No spillage guarantee'] },
        { id: 'student-baggage', icon: 'fa-graduation-cap', title: 'Student & Document Courier', transit: '3–5 Days', badge: 'Urgent', description: 'Priority handling for university transcripts, visa documents, passports, and student relocation baggage.', bullets: ['Document tracking', 'Priority processing', 'Signature on delivery', 'Digital delivery confirmation'] },
        { id: 'corporate', icon: 'fa-building', title: 'Corporate & Business Shipping', transit: 'Flexible', badge: 'B2B', description: 'Regular commercial shipments, sample products, business documents, and e-commerce exports managed end-to-end.', bullets: ['Monthly billing available', 'Dedicated account manager', 'Bulk rate agreements', 'E-commerce export solutions'] },
      ],
      image: `/assets/images/hero_cargo_flight.jpg`,
    },
  },
  {
    page: 'food-shipping',
    sections: {
      hero: { heading: 'Send Homemade Pickles, Sweets & Andhra Food Worldwide', lead: 'Specialized vacuum-sealed packaging that sends the taste of home to your loved ones in USA, UK, Australia, Canada & UAE.', eyebrow: 'NRI Food Parcel Specialists' },
      process: {
        heading: 'Our 5-Stage Food Packaging Process',
        steps: [
          { num: 1, title: 'Doorstep Collection', desc: 'Our executive arrives at your home, verifies the food items, and takes inventory.' },
          { num: 2, title: 'Food-Grade Vacuum Sealing', desc: 'Each item is vacuum-sealed in commercial-grade food-safe bags to prevent leakage and preserve freshness.' },
          { num: 3, title: 'Moisture-Proof Wrapping', desc: 'Vacuum packs are wrapped in moisture-barrier material and bubble cushioning.' },
          { num: 4, title: 'Triple-Ply Export Box Packing', desc: 'Items are arranged and secured in heavy-duty corrugated export boxes with padding.' },
          { num: 5, title: 'Customs Labeling & KYC', desc: 'Proper HS codes, ingredient labels, and customs declaration forms are prepared for smooth clearance.' },
        ],
      },
      acceptedItems: {
        heading: 'Items We Ship',
        categories: [
          { icon: 'fa-jar', name: 'Pickles', items: ['Mango Pickle', 'Gongura Pickle', 'Lemon Pickle', 'Ginger Pickle', 'Mixed Pickle'] },
          { icon: 'fa-candy-cane', name: 'Sweets', items: ['Pootharekulu', 'Laddu', 'Mysore Pak', 'Halwa', 'Barfi'] },
          { icon: 'fa-cookie-bite', name: 'Snacks', items: ['Murukku', 'Chekkalu', 'Mixture', 'Chakli', 'Ribbon Pakoda'] },
          { icon: 'fa-seedling', name: 'Dry Groceries', items: ['Spices', 'Podi Masalas', 'Dry Fruits', 'Rice Varieties', 'Lentils'] },
        ],
      },
      image: `/assets/images/special_food_packaging.jpg`,
    },
  },
  {
    page: 'contact',
    sections: {
      hero: { heading: 'Contact Us & Book Pickup', lead: 'Get in touch with our team for parcel inquiries, pickup bookings, or any international shipping questions.', eyebrow: 'We\'re Here to Help' },
      contactInfo: {
        phones: ['+91 90599 49365', '+91 96031 49365', '+91 96030 49365', '+91 99853 23365'],
        email: 'saiinternationalcouriers83@gmail.com',
        address: '41/1248, Ratna Sabhapathi Building, Co-operative Colony, Kadapa, AP 516001',
        hours: '9:00 AM – 9:30 PM (All Days)',
        whatsapp: '919059949365',
      },
      formConfig: {
        title: 'Send Us a Message',
        subtitle: 'Fill in your details and we\'ll call you back within 30 minutes.',
      },
    },
  },
  {
    page: 'calculator',
    sections: {
      hero: { heading: 'International Shipping Rate Calculator', lead: 'Instantly estimate your shipping cost and volumetric weight for any destination country.', eyebrow: 'Rate Calculator' },
      info: {
        note: 'Rates shown are estimates. Final charges depend on actual/volumetric weight. Food handling fee applies only for perishable/food items.',
        volumetricFormula: '(L × W × H) ÷ 5000 = Volumetric Weight (kg)',
      },
    },
  },
  {
    page: 'tracking',
    sections: {
      hero: { heading: 'Live Shipment Tracking', lead: 'Track your parcel\'s real-time journey from Andhra Pradesh to anywhere in the world.', eyebrow: 'Real-Time Global Milestone Radar' },
      demoAWBs: ['SAI-88492-USA', 'SAI-77310-UK', 'SAI-55201-AUS'],
    },
  },
  {
    page: 'book-pickup',
    sections: {
      hero: { heading: 'Book a Free Doorstep Pickup', lead: 'Schedule our pickup executive to collect your parcel from your doorstep — completely free.', eyebrow: 'Pickup Booking' },
      branches: ['Kadapa Main Branch', 'Kadapa Branch 2 (Visweswaraiah Circle)', 'Tirupati Regional Branch', 'Nellore Regional Branch', 'Proddatur Regional Branch', 'Rayachoty Regional Branch'],
      categories: ['NRI Food & Pickles', 'Documents & Certificates', 'Clothing & Apparel', 'Electronics (Non-Lithium)', 'Gifts & Personal Items', 'Commercial Cargo', 'Student Baggage & Relocation', 'Other'],
      timeSlots: ['Morning (09:00 AM – 12:00 PM)', 'Afternoon (12:00 PM – 03:00 PM)', 'Evening (03:00 PM – 06:00 PM)', 'Late Evening (06:00 PM – 09:00 PM)'],
    },
  },
  {
    page: 'branches',
    sections: {
      hero: { heading: 'Our Branch Network Across Andhra Pradesh', lead: 'Find your nearest Sai International Couriers branch for doorstep pickup, parcel submission, and real-time tracking assistance.', eyebrow: 'Branch Locator' },
      branches: [
        { id: 'kadapa-main', name: 'Kadapa Head Office', address: '41/1248, Ratna Sabhapathi Building, Co-operative Colony, Kadapa, AP 516001', phone: '+91 90599 49365', hours: '9 AM – 9:30 PM (All Days)', mapUrl: "https://maps.google.com/maps?q=14.4726874,78.8323784&t=&z=17&ie=UTF8&iwloc=B&output=embed" },
        { id: 'kadapa-2', name: 'Kadapa Branch 2', address: 'Beside MedPlus, Near Visweswaraiah Circle, Kadapa - 516001, A.P.', phone: '+91 96031 49365', hours: '9 AM – 9 PM (All Days)', mapUrl: 'https://maps.google.com/maps?q=Visweswaraiah+Circle,+Kadapa,+Andhra+Pradesh+516001&t=&z=16&ie=UTF8&iwloc=&output=embed' },
        { id: 'tirupati', name: 'Tirupati Regional Branch', address: 'Central Express Center, Tirupati, Andhra Pradesh', phone: '+91 96030 49365', hours: '9 AM – 8 PM', mapUrl: 'https://maps.google.com/maps?q=Tirupati,+Andhra+Pradesh&t=&z=14&ie=UTF8&iwloc=&output=embed' },
        { id: 'nellore', name: 'Nellore Regional Branch', address: 'Main Road Commercial Center, Nellore, Andhra Pradesh', phone: '+91 99853 23365', hours: '9 AM – 8 PM', mapUrl: 'https://maps.google.com/maps?q=Nellore,+Andhra+Pradesh&t=&z=14&ie=UTF8&iwloc=&output=embed' },
        { id: 'proddutur', name: 'Proddutur Regional Branch', address: 'Textile Commercial Hub, Proddatur, Andhra Pradesh', phone: '+91 90599 49365', hours: '9 AM – 8 PM', mapUrl: 'https://maps.google.com/maps?q=Proddatur,+Andhra+Pradesh&t=&z=14&ie=UTF8&iwloc=&output=embed' },
        { id: 'rayachoty', name: 'Rayachoty Regional Branch', address: 'Main Bazar Express Hub, Rayachoty, Andhra Pradesh', phone: '+91 90599 49365', hours: '9 AM – 8 PM', mapUrl: 'https://maps.google.com/maps?q=Rayachoty,+Andhra+Pradesh&t=&z=14&ie=UTF8&iwloc=&output=embed' },
      ],
    },
  },
  {
    page: 'customs-guide',
    sections: {
      hero: { heading: 'International Customs & KYC Documentation Guide', lead: 'Everything you need to know about customs compliance, restricted items, and required documents for smooth international shipping.', eyebrow: 'Customs & KYC Guide' },
      guide: {
        requiredDocs: ['Government ID (Aadhaar / Passport)', 'Recipient\'s full address and contact number', 'Contents declaration form (Proforma Invoice)', 'For food items: ingredient list and HS code', 'For electronics: invoice with serial number'],
        restrictedItems: ['Lithium batteries (standalone)', 'Flammable liquids or gases', 'Firearms and ammunition', 'Narcotics or controlled substances', 'Live animals or plants', 'Currency above ₹5,000 equivalent'],
        countryClearance: [
          { country: 'USA', tip: 'Food items require FDA-compliant labeling. Spices and dry groceries generally clear without issues.' },
          { country: 'UK', tip: 'Post-Brexit customs apply. Commercial items over £135 require formal customs entry.' },
          { country: 'Australia', tip: 'Strict biosecurity. No fresh/wet food, seeds, or soil. Vacuum-sealed dry items generally allowed.' },
          { country: 'UAE/Gulf', tip: 'Pork and alcohol prohibited. Documents and general goods clear quickly.' },
        ],
      },
    },
  },
  {
    page: 'contact',
    sections: {
      branches: {
        'kadapa-main': {
          title: "SAI INTERNATIONAL COURIER'S SERVICE'S (Kadapa Head Office)",
          addr: '41/1248, Ratna Sabhapathi Building, Co-operative Colony, Kadapa, AP 516001',
          url: "https://maps.google.com/maps?q=14.4726874,78.8323784+(SAI+INTERNATIONAL+COURIER'S+SERVICE'S)&t=&z=17&ie=UTF8&iwloc=B&output=embed",
          externalUrl: "https://www.google.com/maps/place/SAI+INTERNATIONAL+COURIER'S+SERVICE'S/@14.4726874,78.8323784,17z",
          phone: '+91 90599 49365',
        },
        'kadapa-branch-2': {
          title: 'Kadapa Branch 2 (Visweswaraiah Circle)',
          addr: 'Beside MedPlus, Near Visweswaraiah Circle, Kadapa - 516001, A.P.',
          url: 'https://maps.google.com/maps?q=Visweswaraiah+Circle,+Kadapa,+Andhra+Pradesh+516001&t=&z=16&ie=UTF8&iwloc=&output=embed',
          externalUrl: 'https://maps.google.com/?q=Visweswaraiah+Circle,+Kadapa,+Andhra+Pradesh+516001',
          phone: '+91 90599 49365',
        },
        tirupati: {
          title: 'Tirupati Regional Branch',
          addr: 'Tirupati, Andhra Pradesh',
          url: 'https://maps.google.com/maps?q=13.6175501,79.4218504&t=&z=17&ie=UTF8&iwloc=&output=embed',
          externalUrl: 'https://maps.app.goo.gl/WU9xbU97gPxXBBKG7',
          phone: '+91 90599 49365',
        },
        nellore: {
          title: 'Nellore Regional Branch',
          addr: 'Nellore, Andhra Pradesh',
          url: 'https://maps.google.com/maps?q=14.4493,79.9874&t=&z=14&ie=UTF8&iwloc=&output=embed',
          externalUrl: 'https://maps.google.com/?q=Nellore,+Andhra+Pradesh',
          phone: '+91 90599 49365',
        },
        proddutur: {
          title: 'Proddutur Drop-off Center',
          addr: 'Proddutur, Andhra Pradesh',
          url: 'https://maps.google.com/maps?q=14.7523,78.5539&t=&z=14&ie=UTF8&iwloc=&output=embed',
          externalUrl: 'https://maps.google.com/?q=Proddutur,+Andhra+Pradesh',
          phone: '+91 90599 49365',
        },
        rayachoty: {
          title: 'Rayachoty Service Point',
          addr: 'Rayachoty, Andhra Pradesh',
          url: 'https://maps.google.com/maps?q=14.0558,78.7526&t=&z=14&ie=UTF8&iwloc=&output=embed',
          externalUrl: 'https://maps.google.com/?q=Rayachoty,+Andhra+Pradesh',
          phone: '+91 90599 49365',
        }
      },
      global: {
        email: 'saiinternationalcouriers83@gmail.com',
        phones: ['+91 90599 49365', '+91 96031 49365', '+91 96030 49365', '+91 99853 23365'],
        hours: '09:00 AM – 09:30 PM (All 7 Days Open)'
      }
    }
  },
];

// ─── Seed Function ─────────────────────────────────────────────────────────
async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // Seed Shipments
    await Shipment.deleteMany({});
    const ships = await Shipment.insertMany(DEMO_SHIPMENTS);
    console.log(`✅ Seeded ${ships.length} shipments`);

    // Seed Admin
    const existingAdmin = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
    if (!existingAdmin) {
      await Admin.create({
        name: 'Sai Admin',
        email: process.env.ADMIN_EMAIL || 'admin@sai-couriers.com',
        password: process.env.ADMIN_PASSWORD || 'SaiAdmin@2026',
        role: 'super-admin',
      });
      console.log(`✅ Admin created: ${process.env.ADMIN_EMAIL}`);
    } else {
      console.log(`ℹ️  Admin already exists: ${existingAdmin.email}`);
    }

    // Seed Page Content
    for (const page of DEFAULT_PAGE_CONTENT) {
      await PageContent.findOneAndUpdate(
        { page: page.page },
        { $set: { sections: page.sections, lastEditedBy: 'seed' } },
        { upsert: true, new: true }
      );
      console.log(`✅ Seeded content for page: ${page.page}`);
    }

    await mongoose.disconnect();
    console.log('\n✅ Full seed complete!');
    console.log(`\n🔐 Admin Login:\n   Email: ${process.env.ADMIN_EMAIL || 'admin@sai-couriers.com'}\n   Password: ${process.env.ADMIN_PASSWORD || 'SaiAdmin@2026'}`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
