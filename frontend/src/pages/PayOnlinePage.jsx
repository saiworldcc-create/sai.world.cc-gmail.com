import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function PayOnlinePage() {
  const [method, setMethod] = useState('upi');
  const [cardData, setCardData] = useState({ name: 'Venkata Raman', number: '4111 8849 2026 5501', expiry: '08/29', cvv: '849' });
  const [bank, setBank] = useState('sbi');
  const [receiptModal, setReceiptModal] = useState(null);

  const triggerPaymentSuccess = (paymentMethodName) => {
    const txnId = `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`;
    const invId = `INV-2026-${Math.floor(100 + Math.random() * 900)}`;
    setReceiptModal({ txnId, invId, method: paymentMethodName, amount: '₹7,176.00' });
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
            Instant settlement for doorstep collections and international air cargo freight via UPI QR (GPay, PhonePe, Paytm), Debit/Credit Cards, or Net Banking with verified GST receipts.
          </p>
        </div>
      </section>

      <section className="section section-ivory">
        <div className="container" style={{ maxWidth: '960px' }}>
          
          {/* Invoice Lookup Card */}
          <div className="branch-toolbar-card" style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-teal)', textTransform: 'uppercase' }}>Direct Invoice Settlement</span>
                <h3 style={{ fontSize: '1.35rem', color: 'var(--text-slate-dark)', margin: '0.2rem 0 0 0' }}>Pay for AWB: SAI-88492-USA</h3>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-slate-muted)' }}>Payable Amount</span>
                <div style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--accent-coral)' }}>₹7,176.00</div>
              </div>
            </div>
          </div>

          {/* Payment Method Tabs */}
          <div className="payment-checkout-card" style={{ background: '#FFFFFF', borderRadius: 'var(--radius-lg)', padding: '2rem', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-md)' }}>
            
            <div className="payment-method-nav" style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                className={`pay-tab-btn${method === 'upi' ? ' active' : ''}`}
                onClick={() => setMethod('upi')}
                style={{ padding: '0.6rem 1.25rem', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border-light)', background: method === 'upi' ? 'var(--accent-teal)' : '#fff', color: method === 'upi' ? '#fff' : 'var(--text-slate-dark)', fontWeight: 700, cursor: 'pointer' }}
              >
                <i className="fa-solid fa-qrcode" style={{ marginRight: '6px' }}></i> UPI & QR Code
              </button>
              <button
                type="button"
                className={`pay-tab-btn${method === 'card' ? ' active' : ''}`}
                onClick={() => setMethod('card')}
                style={{ padding: '0.6rem 1.25rem', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border-light)', background: method === 'card' ? 'var(--accent-coral)' : '#fff', color: method === 'card' ? '#fff' : 'var(--text-slate-dark)', fontWeight: 700, cursor: 'pointer' }}
              >
                <i className="fa-solid fa-credit-card" style={{ marginRight: '6px' }}></i> Debit / Credit Card
              </button>
              <button
                type="button"
                className={`pay-tab-btn${method === 'netbanking' ? ' active' : ''}`}
                onClick={() => setMethod('netbanking')}
                style={{ padding: '0.6rem 1.25rem', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border-light)', background: method === 'netbanking' ? 'var(--accent-gold)' : '#fff', color: method === 'netbanking' ? '#fff' : 'var(--text-slate-dark)', fontWeight: 700, cursor: 'pointer' }}
              >
                <i className="fa-solid fa-building-columns" style={{ marginRight: '6px' }}></i> Net Banking
              </button>
            </div>

            {/* UPI QR TAB */}
            {method === 'upi' && (
              <div className="upi-qr-card-wrapper" style={{ textAlign: 'center', maxWidth: '420px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
                <span className="eyebrow-pill" style={{ margin: 0, fontSize: '0.78rem' }}>Scan to Pay with Any UPI App</span>

                <div style={{ width: '200px', height: '200px', padding: '10px', background: '#fff', border: '2px dashed var(--accent-teal)', borderRadius: '16px' }}>
                  <svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <rect width="200" height="200" fill="#FFFFFF"/>
                    <rect x="20" y="20" width="45" height="45" fill="#1E3446"/>
                    <rect x="27" y="27" width="31" height="31" fill="#FFFFFF"/>
                    <rect x="34" y="34" width="17" height="17" fill="#E97856"/>
                    <rect x="135" y="20" width="45" height="45" fill="#1E3446"/>
                    <rect x="142" y="27" width="31" height="31" fill="#FFFFFF"/>
                    <rect x="149" y="34" width="17" height="17" fill="#E97856"/>
                    <rect x="20" y="135" width="45" height="45" fill="#1E3446"/>
                    <rect x="27" y="142" width="31" height="31" fill="#FFFFFF"/>
                    <rect x="34" y="149" width="17" height="17" fill="#E97856"/>
                    <rect x="75" y="25" width="10" height="10" fill="#1E3446"/>
                    <rect x="95" y="25" width="10" height="10" fill="#1E3446"/>
                    <rect x="115" y="25" width="10" height="10" fill="#1E3446"/>
                    <rect x="75" y="75" width="20" height="20" fill="#3C9290"/>
                    <rect x="105" y="75" width="20" height="20" fill="#1E3446"/>
                    <rect x="135" y="75" width="10" height="10" fill="#1E3446"/>
                    <rect x="155" y="75" width="20" height="20" fill="#E97856"/>
                    <rect x="75" y="105" width="20" height="10" fill="#1E3446"/>
                    <rect x="105" y="105" width="10" height="20" fill="#3C9290"/>
                    <rect x="135" y="105" width="20" height="20" fill="#1E3446"/>
                  </svg>
                </div>

                <div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-slate-dark)' }}>UPI ID: saiinternational@upi</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-slate-muted)', marginTop: '0.2rem' }}>Official Beneficiary: Sai International Couriers & Cargo</div>
                </div>

                <div className="upi-apps-strip" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <span className="upi-app-badge" style={{ color: '#5F259F', background: 'var(--bg-mist)', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-xs)', fontSize: '0.8rem', fontWeight: 700 }}><i className="fa-solid fa-mobile-screen"></i> PhonePe</span>
                  <span className="upi-app-badge" style={{ color: '#4285F4', background: 'var(--bg-mist)', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-xs)', fontSize: '0.8rem', fontWeight: 700 }}><i className="fa-brands fa-google"></i> Google Pay</span>
                  <span className="upi-app-badge" style={{ color: '#00BAF2', background: 'var(--bg-mist)', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-xs)', fontSize: '0.8rem', fontWeight: 700 }}><i className="fa-solid fa-wallet"></i> Paytm</span>
                </div>

                <button type="button" onClick={() => triggerPaymentSuccess('UPI / QR Code App')} className="btn btn-coral btn-lg" style={{ width: '100%' }}>
                  <i className="fa-solid fa-circle-check"></i> I Have Completed the UPI Payment
                </button>
              </div>
            )}

            {/* CARD TAB */}
            {method === 'card' && (
              <div style={{ maxWidth: '520px', margin: '0 auto' }}>
                <form onSubmit={(e) => { e.preventDefault(); triggerPaymentSuccess('Debit / Credit Card'); }}>
                  <div className="form-group-item">
                    <label className="form-label-title" htmlFor="card-name">
                      <i className="fa-solid fa-user" style={{ color: 'var(--accent-coral)' }}></i> Cardholder Name
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
                      <i className="fa-solid fa-credit-card" style={{ color: 'var(--accent-teal)' }}></i> Card Number
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

                  <div className="form-row-two" style={{ marginTop: '1rem' }}>
                    <div className="form-group-item">
                      <label className="form-label-title" htmlFor="card-expiry">
                        <i className="fa-solid fa-calendar" style={{ color: 'var(--accent-coral)' }}></i> Expiry (MM/YY)
                      </label>
                      <input
                        type="text"
                        id="card-expiry"
                        className="form-input-field"
                        value={cardData.expiry}
                        onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                        maxLength="5"
                        required
                      />
                    </div>

                    <div className="form-group-item">
                      <label className="form-label-title" htmlFor="card-cvv">
                        <i className="fa-solid fa-lock" style={{ color: 'var(--accent-teal)' }}></i> CVV
                      </label>
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

                  <button type="submit" className="btn btn-coral btn-lg" style={{ width: '100%', marginTop: '1.5rem' }}>
                    <i className="fa-solid fa-lock"></i> Pay ₹7,176.00 Securely
                  </button>
                </form>
              </div>
            )}

            {/* NETBANKING TAB */}
            {method === 'netbanking' && (
              <div style={{ maxWidth: '520px', margin: '0 auto' }}>
                <form onSubmit={(e) => { e.preventDefault(); triggerPaymentSuccess(`Net Banking (${bank.toUpperCase()})`); }}>
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

                  <button type="submit" className="btn btn-teal btn-lg" style={{ width: '100%', marginTop: '1.5rem' }}>
                    <i className="fa-solid fa-shield-halved"></i> Proceed to Bank Login
                  </button>
                </form>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* Success Modal */}
      {receiptModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(32, 54, 72, 0.65)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '1.5rem' }}>
          <div style={{ background: '#FFFFFF', border: '1px solid #DDEFF7', borderRadius: '24px', maxWidth: '540px', width: '100%', padding: '2.5rem', textAlign: 'center', color: '#203648', boxShadow: '0 25px 60px rgba(32, 54, 72, 0.22)' }}>
            <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(39, 174, 96, 0.15)', color: '#27AE60', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', margin: '0 auto 1.25rem auto' }}>
              <i className="fa-solid fa-circle-check"></i>
            </div>

            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#27AE60', textTransform: 'uppercase', letterSpacing: '1px' }}>Payment Successful</span>
            <h3 style={{ fontSize: '1.65rem', color: '#1E3446', margin: '0.35rem 0 0.5rem 0' }}>Transaction Completed!</h3>
            
            <div style={{ background: '#F8FBFC', border: '1px solid rgba(41,70,93,0.1)', borderRadius: '12px', padding: '1.25rem', margin: '1.25rem 0', textAlign: 'left', fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#7091A8' }}>Transaction Ref:</span>
                <strong style={{ color: '#1E3446' }}>{receiptModal.txnId}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#7091A8' }}>Tax Invoice No:</span>
                <strong style={{ color: '#E97856' }}>{receiptModal.invId}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#7091A8' }}>Payment Mode:</span>
                <strong style={{ color: '#3C9290' }}>{receiptModal.method}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#7091A8' }}>Authorized GSTIN:</span>
                <strong style={{ color: '#1E3446' }}>37BOPPS1122H1ZS</strong>
              </div>
            </div>

            <p style={{ fontSize: '0.88rem', color: '#4A6B82', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              An official GST tax receipt has been generated and dispatched to your registered WhatsApp number.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => window.print()} className="btn btn-outline-slate btn-sm" style={{ padding: '0.75rem 1.4rem' }}>
                <i className="fa-solid fa-print"></i> Print Receipt
              </button>
              <Link to="/portal" className="btn btn-coral btn-sm" style={{ padding: '0.75rem 1.4rem' }}>
                <i className="fa-solid fa-user"></i> Go to Dashboard
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
