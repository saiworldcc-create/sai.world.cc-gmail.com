import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const FAQ_DATA = [
  {
    id: 'track-1',
    category: 'tracking',
    categoryLabel: 'Tracking & Transit',
    question: 'Why is my international tracking status not updating?',
    answer: 'International air cargo shipments undergo mandatory export customs clearance, airline ground handling, and cross-continental flights. It is normal for status updates to take 24 to 48 hours while an aircraft is in transit between international hubs or awaiting clearance at destination customs gateways. If your status has not changed for more than 72 hours, please submit a support ticket below or contact our 24/7 helpline.'
  },
  {
    id: 'track-2',
    category: 'tracking',
    categoryLabel: 'Tracking & Transit',
    question: 'What does "Customs Clearance Exception" or "Regulatory Hold" mean?',
    answer: 'This indicates that destination border inspection authorities (such as US FDA/CBP, UK HMRC, Canada CBSA, or Australian Biosecurity) require additional verification, such as importer KYC, invoice value clarification, or specific food product declarations. Sai Logistics has dedicated clearance brokers at major international airports who resolve these notices proactively. If recipient cooperation is required, our local clearance team will contact the receiver directly.'
  },
  {
    id: 'track-3',
    category: 'tracking',
    categoryLabel: 'Tracking & Transit',
    question: 'Can I modify the destination address after my package is booked?',
    answer: 'Address amendments are permitted without additional charge before the consignment departs our Hyderabad (RGIA) international cargo terminal. Once the airway bill is uplifted by the international carrier or arrives at the destination country, rerouting is subject to airline approval and carrier redirection administrative fees.'
  },
  {
    id: 'food-1',
    category: 'nri-food',
    categoryLabel: 'NRI Food Shipping',
    question: 'How does Sai Logistics pack homemade Andhra pickles and sweets for international transit?',
    answer: 'We provide commercial multi-tier packaging for all food parcels. Items are first enclosed in commercial-grade 120-micron oxygen-barrier vacuum pouches, heat-sealed, placed in leak-proof sealed containers, and packed in corrugated export boxes lined with absorbent padding. This guarantees zero odor, zero oil leakage, and complete compliance with airline aviation security guidelines.'
  },
  {
    id: 'food-2',
    category: 'nri-food',
    categoryLabel: 'NRI Food Shipping',
    question: 'Can I ship homemade non-veg pickles (mutton, chicken, prawn) to the USA, UK, or Australia?',
    answer: 'Regulations vary strictly by destination: Non-vegetarian food products (meat, poultry, egg) are prohibited by US FDA/USDA and Australian Quarantine regulations for personal courier import. However, veg pickles (mango, lime, gongura, tomato), homemade sweets, spices, and podis are fully permitted with proper commercial vacuum packing and declared commercial invoices. Please check our Prohibited Items guide for exact country restrictions.'
  },
  {
    id: 'food-3',
    category: 'nri-food',
    categoryLabel: 'NRI Food Shipping',
    question: 'Do you charge extra for multi-layer vacuum sealing?',
    answer: 'Standard vacuum packing and tamper-evident sealing are provided complimentary with our NRI Express Food Shipping service when you book doorstep pickup or drop off your parcel at any Sai International branch in Kadapa, Hyderabad, or Vijayawada.'
  },
  {
    id: 'customs-1',
    category: 'customs',
    categoryLabel: 'Customs & Documentation',
    question: 'What documents are required to send an international parcel from India?',
    answer: 'Under Directorate General of Foreign Trade (DGFT) and Indian Customs regulations, every outbound parcel requires: 1) Sender photo ID proof (Aadhaar Card, Passport, or Voter ID), 2) PAN Card copy, 3) Itemized packing list with approximate commercial value, and 4) Consignee (receiver) full legal name, physical address, and local phone number.'
  },
  {
    id: 'customs-2',
    category: 'customs',
    categoryLabel: 'Customs & Documentation',
    question: 'Who pays destination customs duties and import taxes?',
    answer: 'All international courier shipments are booked on DDU/DAP terms (Delivered Duty Unpaid) unless specifically booked as DDP (Delivered Duty Paid). If the destination country assesses customs duty or VAT above their national de minimis threshold, the local customs authority will contact the consignee prior to doorstep delivery to collect payment.'
  },
  {
    id: 'rates-1',
    category: 'rates',
    categoryLabel: 'Rates & Weight',
    question: 'How is volumetric (dimensional) weight calculated?',
    answer: 'In air freight logistics, charges are assessed on the higher of the Actual Gross Weight and Volumetric Weight. Volumetric weight is calculated according to IATA standards: (Length x Width x Height in centimeters) ÷ 5000. For example, a lightweight box measuring 40cm x 30cm x 30cm has a volumetric weight of 7.2 kg.'
  },
  {
    id: 'rates-2',
    category: 'rates',
    categoryLabel: 'Rates & Weight',
    question: 'Are there any hidden doorstep pickup or fuel surcharge fees?',
    answer: 'No. All rates generated through our Rate Calculator or branch managers are fully transparent. They include door-to-door transit, export clearance documentation, airline fuel surcharges, and complimentary tracking.'
  },
  {
    id: 'pickup-1',
    category: 'pickup',
    categoryLabel: 'Pickup & Branches',
    question: 'In which cities and towns is doorstep pickup available?',
    answer: 'We provide doorstep pickup across Kadapa, Proddatur, Rajampet, Pulivendula, Tirupati, Kurnool, Nellore, Anantapur, Vijayawada, Guntur, and Greater Hyderabad. For rural or out-of-town locations, our regional dispatch vans coordinate convenient collection points.'
  },
  {
    id: 'pickup-2',
    category: 'pickup',
    categoryLabel: 'Pickup & Branches',
    question: 'How do I schedule a same-day doorstep collection?',
    answer: 'You can submit a pickup request online via our "Book Pickup" portal or call our central dispatch desk at +91 90599 49365 before 2:00 PM for guaranteed same-day collection. Our representative will bring weighing scales, packing material, and official consignment receipts.'
  }
];

export default function HelpCenterPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [quickAwb, setQuickAwb] = useState('');

  // Ticket Form State
  const [ticketData, setTicketData] = useState({
    name: '',
    phone: '',
    email: '',
    awb: '',
    category: 'Tracking & Delivery Delay',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [ticketResult, setTicketResult] = useState(null);
  const [ticketError, setTicketError] = useState('');

  const filteredFaqs = FAQ_DATA.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const query = searchTerm.toLowerCase().trim();
    const matchesSearch = !query || 
      item.question.toLowerCase().includes(query) || 
      item.answer.toLowerCase().includes(query) ||
      item.categoryLabel.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (quickAwb.trim()) {
      navigate(`/tracking?awb=${encodeURIComponent(quickAwb.trim())}`);
    }
  };

  const handleTicketSubmit = async (e) => {
    e.preventDefault();
    setTicketError('');

    if (!ticketData.name.trim() || !ticketData.phone.trim() || !ticketData.message.trim()) {
      setTicketError('Please provide your name, phone number, and a description of your issue.');
      return;
    }

    try {
      setSubmitting(true);
      const ticketId = 'TIC-' + Math.floor(100000 + Math.random() * 900000);
      const payload = {
        name: ticketData.name.trim(),
        phone: ticketData.phone.trim(),
        email: ticketData.email.trim(),
        branch: 'Central Helpdesk',
        destCountry: ticketData.awb ? `AWB: ${ticketData.awb.trim()}` : 'General Inquiry',
        shipmentCategory: ticketData.category,
        message: `[Ticket ID: ${ticketId}] ${ticketData.message.trim()}`,
        source: 'help_center_ticket'
      };

      await api.post('/contact', payload);
      setTicketResult({
        ticketId,
        name: ticketData.name,
        phone: ticketData.phone
      });
      setTicketData({
        name: '',
        phone: '',
        email: '',
        awb: '',
        category: 'Tracking & Delivery Delay',
        message: ''
      });
    } catch (err) {
      setTicketError(err.message || 'Failed to submit support request. Please call our 24/7 hotline directly.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main style={{ paddingTop: '80px', minHeight: '85vh', background: '#F8FAFC' }}>
      
      {/* Hero Banner */}
      <section style={{ background: 'linear-gradient(135deg, #0A192F 0%, #172A45 100%)', color: '#fff', padding: '4rem 1.5rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#94A3B8', marginBottom: '1.25rem' }}>
            <Link to="/" style={{ color: '#94A3B8', textDecoration: 'none' }}>Home</Link>
            <i className="fa-solid fa-chevron-right" style={{ fontSize: '0.7rem' }}></i>
            <span style={{ color: '#38BDF8', fontWeight: '600' }}>Help & Support Center</span>
          </div>

          <span style={{ display: 'inline-block', padding: '0.35rem 1rem', background: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '20px', fontSize: '0.82rem', fontWeight: '700', letterSpacing: '0.5px', marginBottom: '1rem' }}>
            24/7 CUSTOMER SUPPORT & KNOWLEDGE BASE
          </span>

          <h1 style={{ fontSize: '2.4rem', fontWeight: '800', margin: '0 0 1rem 0', letterSpacing: '-0.5px' }}>
            How Can We Assist Your Shipment Today?
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#CBD5E1', maxWidth: '700px', margin: '0 auto 2.5rem auto', lineHeight: 1.6 }}>
            Instant answers for international courier tracking, customs clearance, vacuum packaging guidelines for NRI food parcels, and doorstep pickup.
          </p>

          {/* Search Box */}
          <div style={{ maxWidth: '650px', margin: '0 auto', position: 'relative' }}>
            <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#64748B', fontSize: '1.1rem' }}></i>
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search help by topic (e.g., pickles packaging, tracking status, customs KYC, volumetric weight)..."
              style={{
                width: '100%',
                padding: '1.1rem 1.25rem 1.1rem 3.25rem',
                fontSize: '1rem',
                borderRadius: '10px',
                border: 'none',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
                outline: 'none',
                color: '#0F172A'
              }}
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                style={{ position: 'absolute', right: '1.25rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '1rem' }}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            )}
          </div>

        </div>
      </section>

      {/* Quick Action Cards Bar */}
      <section style={{ maxWidth: '1200px', margin: '-2rem auto 3rem auto', padding: '0 1.5rem', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          
          <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#E0F2FE', color: '#0284C7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>
                <i className="fa-solid fa-satellite-dish"></i>
              </div>
              <strong style={{ color: '#0F172A', fontSize: '0.95rem' }}>Live AWB Track</strong>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#64748B', margin: '0 0 1rem 0', lineHeight: 1.4 }}>Check real-time milestone checkpoints and delivery ETA.</p>
            <form onSubmit={handleTrackSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
              <input 
                type="text" 
                placeholder="Enter AWB" 
                value={quickAwb} 
                onChange={(e) => setQuickAwb(e.target.value)}
                style={{ width: '100%', padding: '0.45rem 0.6rem', fontSize: '0.85rem', border: '1px solid #CBD5E1', borderRadius: '6px', outline: 'none' }}
              />
              <button type="submit" style={{ padding: '0.45rem 0.8rem', background: '#0284C7', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }}>
                Go
              </button>
            </form>
          </div>

          <Link to="/calculator" style={{ textDecoration: 'none', background: '#fff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'transform 0.2s, box-shadow 0.2s' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#DCFCE7', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>
                  <i className="fa-solid fa-calculator"></i>
                </div>
                <strong style={{ color: '#0F172A', fontSize: '0.95rem' }}>Rate Calculator</strong>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#64748B', margin: '0', lineHeight: 1.4 }}>Estimate international door-to-door courier charges across 195+ countries.</p>
            </div>
            <div style={{ marginTop: '1rem', color: '#16A34A', fontSize: '0.85rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              Calculate Rates <i className="fa-solid fa-arrow-right"></i>
            </div>
          </Link>

          <Link to="/food-shipping" style={{ textDecoration: 'none', background: '#fff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'transform 0.2s, box-shadow 0.2s' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>
                  <i className="fa-solid fa-jar"></i>
                </div>
                <strong style={{ color: '#0F172A', fontSize: '0.95rem' }}>NRI Food Parcels</strong>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#64748B', margin: '0', lineHeight: 1.4 }}>Packaging guidelines for pickles, sweets, spices, and homemade foods.</p>
            </div>
            <div style={{ marginTop: '1rem', color: '#D97706', fontSize: '0.85rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              View Food Guide <i className="fa-solid fa-arrow-right"></i>
            </div>
          </Link>

          <Link to="/book-pickup" style={{ textDecoration: 'none', background: '#fff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'transform 0.2s, box-shadow 0.2s' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#FEE2E2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>
                  <i className="fa-solid fa-truck-ramp-box"></i>
                </div>
                <strong style={{ color: '#0F172A', fontSize: '0.95rem' }}>Book Doorstep Pickup</strong>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#64748B', margin: '0', lineHeight: 1.4 }}>Free home collection across Andhra Pradesh and Telangana hubs.</p>
            </div>
            <div style={{ marginTop: '1rem', color: '#DC2626', fontSize: '0.85rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              Schedule Pickup <i className="fa-solid fa-arrow-right"></i>
            </div>
          </Link>

        </div>
      </section>

      {/* Main Content Area */}
      <section className="help-center-section" style={{ maxWidth: '1200px', margin: '0 auto 4rem auto', padding: '0 1.5rem' }}>
        <div className="help-center-grid">
          
          {/* Left Column: Knowledge Base / FAQs */}
          <div>
            
            {/* Category Filter Pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {[
                { id: 'all', label: 'All Topics' },
                { id: 'tracking', label: 'Tracking & Transit' },
                { id: 'nri-food', label: 'NRI Food Shipping' },
                { id: 'customs', label: 'Customs & KYC' },
                { id: 'rates', label: 'Rates & Weight' },
                { id: 'pickup', label: 'Pickup & Branches' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    border: '1px solid',
                    borderColor: selectedCategory === cat.id ? '#0284C7' : '#CBD5E1',
                    background: selectedCategory === cat.id ? '#0284C7' : '#fff',
                    color: selectedCategory === cat.id ? '#fff' : '#475569',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* FAQs List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filteredFaqs.length === 0 ? (
                <div style={{ background: '#fff', borderRadius: '12px', padding: '3rem 2rem', textAlign: 'center', border: '1px dashed #CBD5E1' }}>
                  <i className="fa-solid fa-magnifying-glass" style={{ fontSize: '2rem', color: '#94A3B8', marginBottom: '1rem' }}></i>
                  <h3 style={{ margin: '0 0 0.5rem 0', color: '#0F172A', fontSize: '1.15rem' }}>No articles match your search</h3>
                  <p style={{ margin: '0 0 1.25rem 0', color: '#64748B', fontSize: '0.9rem' }}>Try using different keywords or submit a support ticket to our 24/7 team.</p>
                  <button 
                    onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
                    style={{ padding: '0.5rem 1rem', background: '#0284C7', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }}
                  >
                    Clear Filter
                  </button>
                </div>
              ) : (
                filteredFaqs.map((faq) => {
                  const isExpanded = expandedFaq === faq.id;
                  return (
                    <div 
                      key={faq.id}
                      style={{
                        background: '#fff',
                        borderRadius: '10px',
                        border: '1px solid #E2E8F0',
                        overflow: 'hidden',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                      }}
                    >
                      <button
                        onClick={() => setExpandedFaq(isExpanded ? null : faq.id)}
                        style={{
                          width: '100%',
                          padding: '1.25rem 1.5rem',
                          background: 'none',
                          border: 'none',
                          textAlign: 'left',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          cursor: 'pointer',
                          gap: '1rem'
                        }}
                      >
                        <div>
                          <span style={{ display: 'inline-block', fontSize: '0.75rem', fontWeight: '700', color: '#0284C7', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.35rem' }}>
                            {faq.categoryLabel}
                          </span>
                          <h4 style={{ margin: 0, fontSize: '1.05rem', color: '#0F172A', fontWeight: '700', lineHeight: 1.4 }}>
                            {faq.question}
                          </h4>
                        </div>
                        <div style={{ flexShrink: 0, width: '28px', height: '28px', borderRadius: '50%', background: isExpanded ? '#0284C7' : '#F1F5F9', color: isExpanded ? '#fff' : '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', transition: 'all 0.2s ease' }}>
                          <i className={`fa-solid ${isExpanded ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                        </div>
                      </button>

                      {isExpanded && (
                        <div style={{ padding: '0 1.5rem 1.25rem 1.5rem', color: '#475569', fontSize: '0.95rem', lineHeight: 1.65, borderTop: '1px solid #F1F5F9' }}>
                          <p style={{ margin: '0.75rem 0 0 0' }}>{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

          </div>

          {/* Right Column: Interactive Support Ticket Form & Helplines */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Submit Ticket Box */}
            <div style={{ background: '#fff', borderRadius: '12px', padding: '1.75rem', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#F0FDF4', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>
                  <i className="fa-solid fa-headset"></i>
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#0F172A', fontWeight: '700' }}>Submit Support Request</h3>
                  <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Average response time: 30 minutes</span>
                </div>
              </div>

              {ticketResult ? (
                <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '8px', padding: '1.5rem', textAlign: 'center' }}>
                  <div style={{ width: '48px', height: '48px', background: '#DCFCE7', color: '#16A34A', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto', fontSize: '1.3rem' }}>
                    <i className="fa-solid fa-circle-check"></i>
                  </div>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: '#166534', fontSize: '1.1rem' }}>Ticket Created Successfully</h4>
                  <div style={{ background: '#fff', border: '1px solid #CBD5E1', borderRadius: '6px', padding: '0.5rem', margin: '0.75rem 0', fontFamily: 'monospace', fontWeight: '700', color: '#0F172A' }}>
                    Reference: {ticketResult.ticketId}
                  </div>
                  <p style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', color: '#334155', lineHeight: 1.5 }}>
                    Thank you, {ticketResult.name}. Our dispatch supervisor has logged this ticket and will contact you at <strong>{ticketResult.phone}</strong> shortly.
                  </p>
                  <button
                    onClick={() => setTicketResult(null)}
                    style={{ padding: '0.45rem 1rem', background: '#16A34A', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }}
                  >
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleTicketSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  
                  {ticketError && (
                    <div style={{ padding: '0.75rem', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '6px', color: '#DC2626', fontSize: '0.82rem' }}>
                      {ticketError}
                    </div>
                  )}

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#334155', marginBottom: '0.3rem' }}>Full Name *</label>
                    <input 
                      type="text" 
                      value={ticketData.name} 
                      onChange={(e) => setTicketData({ ...ticketData, name: e.target.value })}
                      placeholder="Your full name"
                      required
                      style={{ width: '100%', padding: '0.65rem', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '0.88rem', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#334155', marginBottom: '0.3rem' }}>Phone / WhatsApp Number *</label>
                    <input 
                      type="tel" 
                      value={ticketData.phone} 
                      onChange={(e) => setTicketData({ ...ticketData, phone: e.target.value })}
                      placeholder="+91 90599 49365"
                      required
                      style={{ width: '100%', padding: '0.65rem', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '0.88rem', outline: 'none' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#334155', marginBottom: '0.3rem' }}>AWB Number</label>
                      <input 
                        type="text" 
                        value={ticketData.awb} 
                        onChange={(e) => setTicketData({ ...ticketData, awb: e.target.value })}
                        placeholder="Optional"
                        style={{ width: '100%', padding: '0.65rem', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '0.88rem', outline: 'none' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#334155', marginBottom: '0.3rem' }}>Issue Category</label>
                      <select 
                        value={ticketData.category}
                        onChange={(e) => setTicketData({ ...ticketData, category: e.target.value })}
                        style={{ width: '100%', padding: '0.65rem', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '0.85rem', outline: 'none', background: '#fff' }}
                      >
                        <option>Tracking & Delivery Delay</option>
                        <option>Customs & Clearance Hold</option>
                        <option>NRI Food Packaging Query</option>
                        <option>Pickup Scheduling</option>
                        <option>Billing & Payment</option>
                        <option>General Support</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#334155', marginBottom: '0.3rem' }}>Issue Details *</label>
                    <textarea 
                      rows="3"
                      value={ticketData.message}
                      onChange={(e) => setTicketData({ ...ticketData, message: e.target.value })}
                      placeholder="Please describe your question or issue in detail..."
                      required
                      style={{ width: '100%', padding: '0.65rem', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '0.88rem', outline: 'none', resize: 'vertical' }}
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: '#0284C7',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: submitting ? 'not-allowed' : 'pointer',
                      fontWeight: '700',
                      fontSize: '0.92rem',
                      marginTop: '0.5rem'
                    }}
                  >
                    {submitting ? 'Submitting Ticket...' : 'Submit Support Request'}
                  </button>

                </form>
              )}

            </div>

            {/* Direct Helpline Information */}
            <div style={{ background: '#0F172A', borderRadius: '12px', padding: '1.75rem', color: '#fff' }}>
              <h4 style={{ margin: '0 0 1rem 0', color: '#38BDF8', fontSize: '1.05rem', fontWeight: '700' }}>
                <i className="fa-solid fa-phone-volume" style={{ marginRight: '0.5rem' }}></i> Direct Support Helplines
              </h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.88rem' }}>
                <div>
                  <div style={{ color: '#94A3B8', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Central Dispatch (24/7)</div>
                  <a href="tel:+919059949365" style={{ color: '#fff', textDecoration: 'none', fontWeight: '700', fontSize: '1rem' }}>+91 90599 49365</a>
                </div>

                <div>
                  <div style={{ color: '#94A3B8', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Kadapa Main Hub</div>
                  <div style={{ color: '#E2E8F0', marginTop: '0.2rem' }}>Beside SBI, Railway Station Road, Kadapa, AP 516004</div>
                  <div style={{ color: '#94A3B8', fontSize: '0.82rem', marginTop: '0.2rem' }}>Ph: +91 8562 245678 / +91 90599 49365</div>
                </div>

                <div>
                  <div style={{ color: '#94A3B8', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Hyderabad Air Cargo Gateway</div>
                  <div style={{ color: '#E2E8F0', marginTop: '0.2rem' }}>Cargo Terminal, Rajiv Gandhi International Airport (RGIA), Shamshabad, Hyderabad</div>
                </div>

                <div>
                  <div style={{ color: '#94A3B8', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Support Email</div>
                  <a href="mailto:info@sai-couriers.com" style={{ color: '#38BDF8', textDecoration: 'none' }}>info@sai-couriers.com</a>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

    </main>
  );
}

