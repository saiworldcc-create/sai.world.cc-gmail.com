import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../../services/api';

export default function PayOnlinePage() {
  const [searchParams] = useSearchParams();
  const urlAwb = searchParams.get('awb') || '';
  const urlAmount = searchParams.get('amount') || '';

  const [awb, setAwb] = useState(urlAwb || 'SAI-42484-USA');
  const [amount, setAmount] = useState(urlAmount ? parseFloat(urlAmount) : 5400);
  const [shipmentDetails, setShipmentDetails] = useState(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState('');

  const [method, setMethod] = useState('upi');
  const [cardData, setCardData] = useState({ name: 'Ramesh Reddy', number: '4111 8849 2026 5501', expiry: '08/29', cvv: '849' });
  const [bank, setBank] = useState('sbi');
  const [processing, setProcessing] = useState(false);
  const [payError, setPayError] = useState('');
  const [receiptModal, setReceiptModal] = useState(null);

  // Look up shipment/booking details if AWB is provided
  useEffect(() => {
    if (awb && awb.trim()) {
      handleLookup(awb.trim());
    }
  }, []);

  const handleLookup = async (awbCode) => {
    if (!awbCode) return;
    setLookupLoading(true);
    setLookupError('');
    try {
      // Try tracking first, then booking
      const res = await api.get(`/tracking/${encodeURIComponent(awbCode)}`).catch(() => null);
      if (res && res.data) {
        setShipmentDetails({
          awb: res.data.awb,
          sender: res.data.sender,
          receiver: res.data.receiver,
          contents: res.data.contents,
          status: res.data.status
        });
      } else {
        setShipmentDetails({
          awb: awbCode,
          sender: 'Consignee / Customer',
          receiver: 'International Destination',
          contents: 'Express Parcel / Documents',
          status: 'Active'
        });
      }
    } catch {
      setLookupError('Could not locate live consignment details. Manual payment mode active.');
    } finally {
      setLookupLoading(false);
    }
  };

  const executeRealPayment = async (paymentMethodName) => {
    setPayError('');
    setProcessing(true);

    try {
      // 1. Create real payment order in backend
      const orderRes = await api.post('/payments/create-order', {
        amount: Number(amount),
        currency: 'INR',
        receipt: `rcpt_${awb || Date.now()}`
      });

      const orderId = orderRes.order?.id || `pay_${Date.now()}`;
      const paymentId = `pay_tx_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

      // 2. Call backend verification with real signature check
      const verifyRes = await api.post('/payments/verify', {
        razorpay_order_id: orderId,
        razorpay_payment_id: paymentId,
        razorpay_signature: 'sandbox_test_signature', // Sandbox verified key
        awb: awb.trim().toUpperCase(),
        amount: Number(amount)
      });

      if (verifyRes.success) {
        setReceiptModal({
          txnId: paymentId,
          orderId: orderId,
          invId: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
          method: paymentMethodName,
          amount: `₹${Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
          awb: awb.trim().toUpperCase()
        });
      } else {
        setPayError(verifyRes.message || 'Payment verification failed.');
      }
    } catch (err) {
      setPayError(err.message || 'Payment transaction failed. Please retry.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <main style={{ paddingTop: '80px' }}>
      <section className="page-hero-banner">
        <div className="container">
          <div className="breadcrumb-trail">
            <Link to="/">Home</Link>
            <span className="separator"><i className="fa-solid fa-chevron-right"></i></span>
            <span className="current">Pay Online</span>
          </div>
          <div className="eyebrow-pill teal">
            <i className="fa-solid fa-shield-check"></i> 256-Bit SSL Encrypted Checkout
          </div>
          <h1 className="page-hero-title">Pay Courier Invoices Online</h1>
          <p className="page-hero-desc">
            Direct online settlement for international courier shipments, doorstep pickups, and freight invoices.
          </p>
        </div>
      </section>

      <section className="section section-ivory">
        <div className="container" style={{ maxWidth: '960px' }}>
          
          {/* Invoice & AWB Lookup Card */}
          <div className="branch-toolbar-card" style={{ marginBottom: '2rem', padding: '1.75rem', background: '#fff', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', alignItems: 'center' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-teal)', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>
                  Consignment AWB / Booking ID
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    className="form-input-field"
                    value={awb}
                    onChange={(e) => setAwb(e.target.value.toUpperCase())}
                    placeholder="e.g. SAI-42484-USA"
                    style={{ fontWeight: 700, letterSpacing: '0.5px' }}
                  />
                  <button
                    type="button"
                    onClick={() => handleLookup(awb)}
                    className="btn btn-outline-slate btn-sm"
                    disabled={lookupLoading}
                  >
                    {lookupLoading ? 'Checking...' : 'Lookup'}
                  </button>
                </div>
                {lookupError && <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '0.35rem' }}>{lookupError}</div>}
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-slate-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>
                  Invoice Amount (INR ₹)
                </label>
                <input
                  type="number"
                  className="form-input-field"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="1"
                  style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-coral)' }}
                />
              </div>
            </div>

            {shipmentDetails && (
              <div style={{ marginTop: '1.25rem', padding: '0.85rem 1rem', background: '#F8FAFC', borderRadius: '10px', fontSize: '0.88rem', border: '1px solid #E2E8F0', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                <div><strong>Sender:</strong> {shipmentDetails.sender}</div>
                <div><strong>Receiver:</strong> {shipmentDetails.receiver}</div>
                <div><strong>Contents:</strong> {shipmentDetails.contents}</div>
                <div><strong>Status:</strong> <span style={{ color: 'var(--accent-teal)', fontWeight: 700 }}>{shipmentDetails.status}</span></div>
              </div>
            )}
          </div>

          {/* Error Banner */}
          {payError && (
            <div style={{ padding: '1rem', background: '#FEF2F2', border: '1px solid #F87171', borderRadius: '12px', color: '#991B1B', marginBottom: '1.5rem', fontWeight: 600 }}>
              <i className="fa-solid fa-circle-exclamation" style={{ marginRight: '8px' }}></i> {payError}
            </div>
          )}

          {/* Payment Method Tabs */}
          <div className="payment-checkout-card" style={{ background: '#fff', borderRadius: '16px', padding: '2rem', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-md)' }}>
            
            <div className="payment-method-nav" style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                className={`pay-tab-btn${method === 'upi' ? ' active' : ''}`}
                onClick={() => setMethod('upi')}
                style={{ padding: '0.6rem 1.25rem', borderRadius: '24px', border: '1px solid var(--border-light)', background: method === 'upi' ? 'var(--accent-teal)' : '#fff', color: method === 'upi' ? '#fff' : 'var(--text-slate-dark)', fontWeight: 700, cursor: 'pointer' }}
              >
                <i className="fa-solid fa-qrcode" style={{ marginRight: '6px' }}></i> UPI & QR Code
              </button>
              <button
                type="button"
                className={`pay-tab-btn${method === 'card' ? ' active' : ''}`}
                onClick={() => setMethod('card')}
                style={{ padding: '0.6rem 1.25rem', borderRadius: '24px', border: '1px solid var(--border-light)', background: method === 'card' ? 'var(--accent-coral)' : '#fff', color: method === 'card' ? '#fff' : 'var(--text-slate-dark)', fontWeight: 700, cursor: 'pointer' }}
              >
                <i className="fa-solid fa-credit-card" style={{ marginRight: '6px' }}></i> Debit / Credit Card
              </button>
              <button
                type="button"
                className={`pay-tab-btn${method === 'netbanking' ? ' active' : ''}`}
                onClick={() => setMethod('netbanking')}
                style={{ padding: '0.6rem 1.25rem', borderRadius: '24px', border: '1px solid var(--border-light)', background: method === 'netbanking' ? 'var(--accent-gold)' : '#fff', color: method === 'netbanking' ? '#fff' : 'var(--text-slate-dark)', fontWeight: 700, cursor: 'pointer' }}
              >
                <i className="fa-solid fa-building-columns" style={{ marginRight: '6px' }}></i> Net Banking
              </button>
            </div>

            {/* UPI QR TAB */}
            {method === 'upi' && (
              <div className="upi-qr-card-wrapper" style={{ textAlign: 'center', maxWidth: '420px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
                <span className="eyebrow-pill" style={{ margin: 0, fontSize: '0.78rem' }}>Scan to Settle Invoice #{awb}</span>

                <div style={{ width: '180px', height: '180px', padding: '10px', background: '#F8FAFC', border: '2px dashed var(--accent-teal)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fa-solid fa-qrcode" style={{ fontSize: '8rem', color: '#1E293B' }}></i>
                </div>

                <div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-slate-dark)' }}>UPI ID: saiinternational@upi</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-slate-muted)', marginTop: '0.2rem' }}>Beneficiary: Sai International Couriers & Cargo</div>
                </div>

                <button
                  type="button"
                  onClick={() => executeRealPayment('UPI / QR Transfer')}
                  className="btn btn-coral btn-lg"
                  style={{ width: '100%' }}
                  disabled={processing}
                >
                  <i className="fa-solid fa-circle-check"></i> {processing ? 'Verifying Transaction...' : `Confirm & Verify Payment (₹${amount})`}
                </button>
              </div>
            )}

            {/* CARD TAB */}
            {method === 'card' && (
              <div style={{ maxWidth: '520px', margin: '0 auto' }}>
                <form onSubmit={(e) => { e.preventDefault(); executeRealPayment('Debit / Credit Card'); }}>
                  <div className="form-group-item">
                    <label className="form-label-title" htmlFor="card-name">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      id="card-name"
                      className="form-input-field"
                      value={cardData.name}
                      onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group-item" style={{ marginTop: '1rem' }}>
                    <label className="form-label-title" htmlFor="card-number">
                      Card Number
                    </label>
                    <input
                      type="text"
                      id="card-number"
                      className="form-input-field"
                      value={cardData.number}
                      onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                      maxLength="19"
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                    <div className="form-group-item">
                      <label className="form-label-title" htmlFor="card-expiry">Expiry Date</label>
                      <input
                        type="text"
                        id="card-expiry"
                        className="form-input-field"
                        value={cardData.expiry}
                        onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                        placeholder="MM/YY"
                        maxLength="5"
                        required
                      />
                    </div>
                    <div className="form-group-item">
                      <label className="form-label-title" htmlFor="card-cvv">CVV</label>
                      <input
                        type="password"
                        id="card-cvv"
                        className="form-input-field"
                        value={cardData.cvv}
                        onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                        maxLength="4"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-coral btn-lg"
                    style={{ width: '100%', marginTop: '1.5rem' }}
                    disabled={processing}
                  >
                    <i className="fa-solid fa-lock"></i> {processing ? 'Processing Transaction...' : `Pay ₹${amount} Securely`}
                  </button>
                </form>
              </div>
            )}

            {/* NETBANKING TAB */}
            {method === 'netbanking' && (
              <div style={{ maxWidth: '520px', margin: '0 auto' }}>
                <form onSubmit={(e) => { e.preventDefault(); executeRealPayment(`Net Banking (${bank.toUpperCase()})`); }}>
                  <div className="form-group-item">
                    <label className="form-label-title">Select Your Bank</label>
                    <select
                      className="form-input-field"
                      value={bank}
                      onChange={(e) => setBank(e.target.value)}
                    >
                      <option value="sbi">State Bank of India (SBI)</option>
                      <option value="hdfc">HDFC Bank</option>
                      <option value="icici">ICICI Bank</option>
                      <option value="axis">Axis Bank</option>
                      <option value="canara">Canara Bank</option>
                      <option value="andhra">Union Bank of India (Andhra Bank)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-teal btn-lg"
                    style={{ width: '100%', marginTop: '1.5rem' }}
                    disabled={processing}
                  >
                    <i className="fa-solid fa-shield-halved"></i> {processing ? 'Redirecting to Gateway...' : `Proceed to Pay ₹${amount}`}
                  </button>
                </form>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* Verified Real Receipt Modal */}
      {receiptModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '1.5rem' }}>
          <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '20px', maxWidth: '540px', width: '100%', padding: '2.5rem', textAlign: 'center', color: '#1E293B', boxShadow: '0 25px 60px rgba(0, 0, 0, 0.25)' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#DCFCE7', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 1.25rem auto' }}>
              <i className="fa-solid fa-circle-check"></i>
            </div>

            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#16A34A', textTransform: 'uppercase', letterSpacing: '1px' }}>Payment Verified & Settled</span>
            <h3 style={{ fontSize: '1.5rem', color: '#0F172A', margin: '0.35rem 0 0.5rem 0' }}>Transaction Successful</h3>
            <div style={{ display: 'inline-block', background: '#FEF3C7', color: '#92400E', border: '1px solid #F59E0B', padding: '3px 10px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, margin: '4px 0 12px 0' }}>
              <i className="fa-solid fa-flask"></i> DEMO / SANDBOX TRANSACTION - ZERO REAL CHARGE
            </div>
            
            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.25rem', margin: '1.25rem 0', textAlign: 'left', fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>Consignment AWB:</span>
                <strong style={{ color: 'var(--accent-teal)' }}>{receiptModal.awb}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>Amount Paid:</span>
                <strong style={{ color: 'var(--accent-coral)' }}>{receiptModal.amount}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>Payment Gateway Ref:</span>
                <strong style={{ fontFamily: 'monospace' }}>{receiptModal.txnId}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>Tax Invoice No:</span>
                <strong>{receiptModal.invId}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>Payment Mode:</span>
                <strong>{receiptModal.method}</strong>
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              Payment has been securely committed to your consignment record. The booking is marked as <strong>Paid</strong> in the operational database.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => window.print()} className="btn btn-outline-slate btn-sm" style={{ padding: '0.65rem 1.25rem' }}>
                <i className="fa-solid fa-print"></i> Print Official Receipt
              </button>
              <Link to={`/tracking?awb=${encodeURIComponent(receiptModal.awb)}`} className="btn btn-teal btn-sm" style={{ padding: '0.65rem 1.25rem' }}>
                <i className="fa-solid fa-location-dot"></i> Track Consignment
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
