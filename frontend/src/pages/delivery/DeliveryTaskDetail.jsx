import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { getDeliveryTasks, trackShipment, updateDeliveryStatus, updateLiveLocation, uploadPOD } from '../../services/api';
import { useOfflineQueue } from '../../hooks/useOfflineQueue';
import { extractAwbFromText } from '../../utils/awbExtractor';

const DeliveryTaskDetail = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [watchId, setWatchId] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Animated Success Modal State
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successModalData, setSuccessModalData] = useState({ title: '', message: '', icon: 'fa-circle-check' });

  const { isOnline, queueCount, enqueueUpdate } = useOfflineQueue();

  // Extract clean AWB from route params or pathname
  const rawParam = params.awb || params['*'] || window.location.pathname;
  const targetAwb = extractAwbFromText(rawParam);

  useEffect(() => {
    if (!user || user.role !== 'delivery_partner') {
      navigate('/delivery/login');
    } else {
      fetchTask();
    }
    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [user, rawParam]);

  const fetchTask = async () => {
    try {
      setLoading(true);
      setErrorMsg('');

      if (!targetAwb) {
        setErrorMsg('Invalid or unreadable AWB barcode scanned.');
        setLoading(false);
        return;
      }

      // 1. First search in assigned driver tasks
      let foundTask = null;
      try {
        const res = await getDeliveryTasks();
        const tasksList = res?.data?.data || [];
        foundTask = tasksList.find(t =>
          t.awb?.toLowerCase() === targetAwb.toLowerCase()
        );
      } catch (e) {
        console.warn('Driver tasks fetch warning:', e);
      }

      // 2. If not found in assigned tasks, query tracking API (supports any Shipment/Ecom/Booking AWB)
      if (!foundTask) {
        try {
          const trackRes = await trackShipment(targetAwb);
          if (trackRes && (trackRes.data || trackRes.success)) {
            const data = trackRes.data || trackRes;
            foundTask = {
              _id: data._id || targetAwb,
              awb: data.awb || targetAwb,
              sender: data.sender || data.senderName || 'Sender (Store / Origin)',
              senderPhone: data.senderPhone || '',
              senderAddress: data.senderAddress || data.origin || '',
              receiver: data.receiver || data.receiverName || 'Recipient',
              receiverPhone: data.receiverPhone || '',
              destination: data.destination || data.receiverAddress || 'Destination',
              status: data.status || 'In Transit',
              contents: data.contents || 'Express Parcel',
              carrier: data.carrier || 'SAI Logistics',
              eta: data.eta || 'N/A',
              history: data.history || []
            };
          }
        } catch (err) {
          console.error('Tracking fallback error:', err);
        }
      }

      if (foundTask) {
        setTask(foundTask);
        if (foundTask.status && foundTask.status.includes('Out for Delivery')) {
          startLiveTracking();
        }
      } else {
        setErrorMsg(`Shipment with AWB "${targetAwb}" not found.`);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to load shipment details.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus, customLocation = '') => {
    try {
      setIsUpdating(true);
      let locationString = customLocation || 'Local Hub';
      
      if (navigator.geolocation) {
        const pos = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
        }).catch(() => null);
        if (pos) {
          locationString = `Lat: ${pos.coords.latitude.toFixed(4)}, Lng: ${pos.coords.longitude.toFixed(4)}`;
        }
      }

      const activeAwb = task?.awb || targetAwb;

      if (!isOnline) {
        enqueueUpdate(activeAwb, newStatus, locationString);
        setTask({ ...task, status: newStatus });
      } else {
        await updateDeliveryStatus(activeAwb, { status: newStatus, location: locationString });
      }
      
      if (newStatus === 'Out for Delivery') {
        startLiveTracking();
      }

      // Trigger Animated Success Popup for Pickup / Delivery
      if (newStatus.toLowerCase().includes('picked up')) {
        setSuccessModalData({
          title: 'Order Picked Up Successfully! 🎉',
          message: `Shipment ${activeAwb} pickup confirmed. Admin & Super Admin have been notified in real-time.`,
          icon: 'fa-box-check'
        });
        setShowSuccessModal(true);
      } else if (newStatus.toLowerCase().includes('delivered')) {
        stopLiveTracking();
        setSuccessModalData({
          title: 'Package Delivered Successfully! 🏆',
          message: `Shipment ${activeAwb} has been marked as Delivered. Proof of Delivery stored.`,
          icon: 'fa-circle-check'
        });
        setShowSuccessModal(true);
      }
      
      fetchTask();
    } catch (err) {
      alert('Failed to update status.');
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const startLiveTracking = () => {
    if (isTracking || !navigator.geolocation) return;
    
    setIsTracking(true);
    const id = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        updateLiveLocation({ lat: latitude, lng: longitude }).catch(console.error);
      },
      (error) => console.error('GPS Error:', error),
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
    );
    setWatchId(id);
  };

  const stopLiveTracking = () => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setIsTracking(false);
  };

  const handlePODUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsUpdating(true);
      const formData = new FormData();
      formData.append('image', file);
      
      const activeAwb = task?.awb || targetAwb;
      await uploadPOD(activeAwb, formData);

      if (task?.status !== 'Delivered') {
        await handleStatusUpdate('Delivered');
      } else {
        setSuccessModalData({
          title: 'POD Uploaded Successfully! 📸',
          message: `Proof of delivery photo saved for shipment ${activeAwb}.`,
          icon: 'fa-camera'
        });
        setShowSuccessModal(true);
        fetchTask();
      }
    } catch (err) {
      console.error(err);
      alert('Failed to upload POD image.');
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) return (
    <div style={styles.appShell}>
      <div style={{ ...styles.appContainer, justifyContent: 'center', alignItems: 'center' }}>
        <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2rem', color: '#ff6b4a' }}></i>
        <p style={{ color: '#94a3b8', marginTop: '1rem', fontSize: '0.9rem' }}>Locating shipment details...</p>
      </div>
    </div>
  );

  if (errorMsg || !task) return (
    <div style={styles.appShell}>
      <div style={{ ...styles.appContainer, justifyContent: 'center', alignItems: 'center', padding: '2rem', textAlign: 'center' }}>
        <i className="fa-solid fa-box-open" style={{ fontSize: '3.5rem', color: '#f87171', marginBottom: '1rem' }}></i>
        <h3 style={{ color: '#f8fafc', margin: '0 0 0.5rem 0' }}>Shipment Not Found</h3>
        <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
          {errorMsg || `Could not find order details for scanned code.`}
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', width: '100%' }}>
          <button onClick={() => navigate('/delivery/scan')} style={styles.btnSecondary}>
            <i className="fa-solid fa-qrcode" style={{ marginRight: '6px' }}></i> Rescan Code
          </button>
          <button onClick={() => navigate('/delivery')} style={styles.btnPrimary}>
            <i className="fa-solid fa-house" style={{ marginRight: '6px' }}></i> Dashboard
          </button>
        </div>
      </div>
    </div>
  );

  const isPickedUp = task.status?.toLowerCase().includes('picked up');
  const isDelivered = task.status?.toLowerCase().includes('delivered');

  return (
    <div style={styles.appShell}>
      <style>{`
        @keyframes popupBounce {
          0% { transform: scale(0.5) translateY(30px); opacity: 0; }
          70% { transform: scale(1.05) translateY(-5px); opacity: 1; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes iconPulse {
          0% { transform: scale(0.8); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.6); }
          70% { transform: scale(1.1); box-shadow: 0 0 0 20px rgba(16, 185, 129, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
      `}</style>

      {/* Animated Pickup Success Modal Overlay */}
      {showSuccessModal && (
        <div style={styles.modalOverlay} onClick={() => setShowSuccessModal(false)}>
          <div style={styles.modalCard} onClick={e => e.stopPropagation()}>
            <div style={styles.animatedIconWrapper}>
              <i className={`fa-solid ${successModalData.icon}`} style={{ fontSize: '2.5rem', color: '#ffffff' }}></i>
            </div>

            <h2 style={styles.modalTitle}>{successModalData.title}</h2>
            <p style={styles.modalMessage}>{successModalData.message}</p>

            <div style={styles.badgeRow}>
              <span style={styles.notifTag}>
                <i className="fa-solid fa-bell" style={{ marginRight: '5px', color: '#38bdf8' }}></i>
                Admin & Super Admin Notified
              </span>
            </div>

            <button
              onClick={() => { setShowSuccessModal(false); navigate('/delivery'); }}
              style={styles.modalBtn}
            >
              Back to Task List <i className="fa-solid fa-arrow-right" style={{ marginLeft: '6px' }}></i>
            </button>
          </div>
        </div>
      )}

      <div style={styles.appContainer}>
        {/* Header */}
        <header style={styles.header}>
          <button onClick={() => navigate('/delivery')} style={styles.iconBackBtn}>
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>SHIPMENT DETAILS</span>
            <h3 style={{ margin: 0, color: '#38bdf8', fontSize: '1.05rem', fontWeight: '800', letterSpacing: '0.5px' }}>
              {task.awb}
            </h3>
          </div>
          <button onClick={() => navigate('/delivery/scan')} style={styles.iconBackBtn} title="Rescan">
            <i className="fa-solid fa-qrcode"></i>
          </button>
        </header>

        {/* Offline Warning */}
        {!isOnline && (
          <div style={styles.offlineBanner}>
            <i className="fa-solid fa-plane-slash" style={{ marginRight: '8px' }}></i>
            Offline Mode Active ({queueCount} pending syncs)
          </div>
        )}

        <div style={styles.content}>
          {isTracking && (
            <div style={styles.trackingBanner}>
              <i className="fa-solid fa-location-crosshairs fa-fade" style={{ marginRight: '8px', color: '#34d399' }}></i>
              Live GPS Route Tracking Active
            </div>
          )}

          {/* Status Badge Banner */}
          <div style={styles.statusBox}>
            <div>
              <span style={styles.statusLabel}>Current Status</span>
              <h2 style={{ ...styles.statusTitle, color: isDelivered ? '#34d399' : isPickedUp ? '#38bdf8' : '#fbbf24' }}>
                {task.status}
              </h2>
            </div>
            <span style={{
              ...styles.statusBadgePill,
              backgroundColor: isDelivered ? 'rgba(16, 185, 129, 0.2)' : isPickedUp ? 'rgba(56, 189, 248, 0.2)' : 'rgba(245, 158, 11, 0.2)',
              color: isDelivered ? '#34d399' : isPickedUp ? '#38bdf8' : '#fbbf24'
            }}>
              <i className="fa-solid fa-circle" style={{ fontSize: '6px', marginRight: '5px' }}></i>
              {isDelivered ? 'DELIVERED' : isPickedUp ? 'PICKED UP' : 'IN PROGRESS'}
            </span>
          </div>

          {/* Recipient Details Card */}
          <div style={styles.card}>
            <div style={styles.cardHeaderRow}>
              <span style={styles.cardCategory}>
                <i className="fa-solid fa-user-check" style={{ color: '#ff6b4a', marginRight: '6px' }}></i>
                Consignee / Recipient
              </span>
              {task.receiverPhone && (
                <a href={`tel:${task.receiverPhone}`} style={styles.callBtn}>
                  <i className="fa-solid fa-phone" style={{ marginRight: '4px' }}></i> Call
                </a>
              )}
            </div>

            <div style={styles.detailBlock}>
              <span style={styles.label}>Recipient Name</span>
              <span style={styles.valueLarge}>{task.receiver || 'Recipient'}</span>
            </div>

            {task.receiverPhone && (
              <div style={styles.detailBlock}>
                <span style={styles.label}>Phone Number</span>
                <span style={styles.valueText}>{task.receiverPhone}</span>
              </div>
            )}

            <div style={styles.detailBlock}>
              <span style={styles.label}>Delivery Address / Destination</span>
              <div style={styles.addressBox}>
                <i className="fa-solid fa-location-dot" style={{ color: '#ff6b4a', marginTop: '3px' }}></i>
                <span style={styles.valueText}>{task.destination}</span>
              </div>
            </div>
          </div>

          {/* Sender Details Card */}
          <div style={styles.card}>
            <div style={styles.cardHeaderRow}>
              <span style={styles.cardCategory}>
                <i className="fa-solid fa-warehouse" style={{ color: '#38bdf8', marginRight: '6px' }}></i>
                Shipper / Sender Information
              </span>
              {task.senderPhone && (
                <a href={`tel:${task.senderPhone}`} style={styles.callBtnSecondary}>
                  <i className="fa-solid fa-phone" style={{ marginRight: '4px' }}></i> Call Sender
                </a>
              )}
            </div>

            <div style={styles.detailBlock}>
              <span style={styles.label}>Sender / Store</span>
              <span style={styles.valueMedium}>{task.sender || 'Sender'}</span>
            </div>

            {task.senderAddress && (
              <div style={styles.detailBlock}>
                <span style={styles.label}>Origin Address</span>
                <span style={styles.valueText}>{task.senderAddress}</span>
              </div>
            )}

            <div style={styles.detailBlock}>
              <span style={styles.label}>Package Contents</span>
              <span style={styles.valueText}>{task.contents || 'Express Parcel'}</span>
            </div>
          </div>

          {/* Tracking History Timeline */}
          {task.history && task.history.length > 0 && (
            <div style={styles.card}>
              <span style={styles.cardCategory}>
                <i className="fa-solid fa-clock-rotate-left" style={{ color: '#10b981', marginRight: '6px' }}></i>
                Tracking History
              </span>
              <div style={styles.timelineList}>
                {task.history.map((h, idx) => (
                  <div key={idx} style={styles.timelineItem}>
                    <div style={{ ...styles.timelineDot, backgroundColor: h.active ? '#ff6b4a' : '#64748b' }}></div>
                    <div>
                      <span style={{ ...styles.timelineStatus, color: h.active ? '#f8fafc' : '#cbd5e1' }}>
                        {h.status}
                      </span>
                      <span style={styles.timelineMeta}>
                        {h.time} • {h.location}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons Suite */}
          <div style={styles.actionGridContainer}>
            <h4 style={styles.actionSectionTitle}>Driver Actions</h4>

            {/* Step 1: Confirm Order Picked Up (Full Width Prominent Action) */}
            <button
              style={{
                ...styles.actionBtnFull,
                backgroundColor: isPickedUp ? '#059669' : '#10b981',
                boxShadow: isPickedUp ? 'none' : '0 8px 20px rgba(16, 185, 129, 0.3)'
              }}
              onClick={() => handleStatusUpdate('Order Picked Up Confirmed')}
              disabled={isUpdating}
            >
              <i className="fa-solid fa-box-archive" style={{ fontSize: '1.4rem' }}></i>
              <span>{isUpdating ? 'Updating Status...' : isPickedUp ? '✅ Pickup Confirmed' : '📦 Confirm Order Picked Up'}</span>
            </button>

            {/* Step 2 & 3: Transit & Route */}
            <div style={styles.actionGridTwo}>
              <button
                style={{ ...styles.actionBtn, backgroundColor: '#d97706' }}
                onClick={() => handleStatusUpdate('In Transit')}
                disabled={isUpdating}
              >
                <i className="fa-solid fa-truck-fast" style={{ fontSize: '1.3rem' }}></i>
                <span>Mark In Transit</span>
              </button>

              <button
                style={{ ...styles.actionBtn, backgroundColor: '#2563eb' }}
                onClick={() => handleStatusUpdate('Out for Delivery')}
                disabled={isUpdating || isTracking}
              >
                <i className="fa-solid fa-route" style={{ fontSize: '1.3rem' }}></i>
                <span>Start Delivery Route</span>
              </button>
            </div>

            {/* Step 4: Capture POD Photo */}
            <label
              htmlFor="pod-upload"
              style={{ ...styles.actionBtnFull, backgroundColor: '#0284c7', cursor: 'pointer' }}
            >
              <i className="fa-solid fa-camera" style={{ fontSize: '1.4rem' }}></i>
              <span>{isUpdating ? 'Uploading POD...' : '📸 Capture Proof of Delivery (POD Photo)'}</span>
            </label>
            <input
              id="pod-upload"
              type="file"
              accept="image/*"
              capture="environment"
              style={{ display: 'none' }}
              onChange={handlePODUpload}
              disabled={isUpdating}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  appShell: {
    minHeight: '100vh',
    backgroundColor: '#070f1e',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    fontFamily: "'Outfit', 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
  },
  appContainer: {
    width: '100%',
    maxWidth: '440px',
    minHeight: '100vh',
    backgroundColor: '#0f172a',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 0 40px rgba(0,0,0,0.8)',
    paddingBottom: '2rem',
    position: 'relative'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(7, 15, 30, 0.85)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
    padding: '1.5rem'
  },
  modalCard: {
    backgroundColor: '#0f172a',
    borderRadius: '24px',
    border: '1px solid rgba(16, 185, 129, 0.4)',
    padding: '2rem 1.5rem',
    textAlign: 'center',
    maxWidth: '360px',
    width: '100%',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 40px rgba(16, 185, 129, 0.25)',
    animation: 'popupBounce 0.4s ease forwards'
  },
  animatedIconWrapper: {
    width: '70px',
    height: '70px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1.25rem',
    animation: 'iconPulse 2s infinite'
  },
  modalTitle: {
    margin: '0 0 0.5rem 0',
    fontSize: '1.25rem',
    fontWeight: '800',
    color: '#f8fafc'
  },
  modalMessage: {
    fontSize: '0.85rem',
    color: '#cbd5e1',
    lineHeight: 1.5,
    margin: '0 0 1.25rem 0'
  },
  badgeRow: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '1.5rem'
  },
  notifTag: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: '#38bdf8',
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    padding: '0.35rem 0.85rem',
    borderRadius: '20px',
    border: '1px solid rgba(56, 189, 248, 0.25)'
  },
  modalBtn: {
    width: '100%',
    backgroundColor: '#10b981',
    color: '#ffffff',
    border: 'none',
    padding: '0.9rem',
    borderRadius: '12px',
    fontWeight: '800',
    fontSize: '0.9rem',
    cursor: 'pointer',
    boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)'
  },
  header: {
    backgroundColor: '#1e293b',
    padding: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    position: 'sticky',
    top: 0,
    zIndex: 20
  },
  iconBackBtn: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    backgroundColor: 'rgba(255,255,255,0.08)',
    border: 'none',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
  },
  btnPrimary: {
    flex: 1,
    backgroundColor: '#ff6b4a',
    color: '#ffffff',
    border: 'none',
    padding: '0.8rem',
    borderRadius: '10px',
    fontWeight: '700',
    fontSize: '0.85rem',
    cursor: 'pointer'
  },
  btnSecondary: {
    flex: 1,
    backgroundColor: '#1e293b',
    color: '#38bdf8',
    border: '1px solid rgba(56, 189, 248, 0.3)',
    padding: '0.8rem',
    borderRadius: '10px',
    fontWeight: '700',
    fontSize: '0.85rem',
    cursor: 'pointer'
  },
  offlineBanner: {
    backgroundColor: '#d97706',
    color: '#ffffff',
    padding: '0.6rem',
    textAlign: 'center',
    fontSize: '0.8rem',
    fontWeight: '700'
  },
  trackingBanner: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    color: '#34d399',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    padding: '0.75rem',
    borderRadius: '12px',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: '0.85rem',
    marginBottom: '1rem'
  },
  content: {
    padding: '1.25rem'
  },
  statusBox: {
    backgroundColor: '#1e293b',
    borderRadius: '16px',
    padding: '1.1rem 1.25rem',
    border: '1px solid rgba(255,255,255,0.08)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.1rem'
  },
  statusLabel: {
    fontSize: '0.7rem',
    color: '#94a3b8',
    fontWeight: '700',
    textTransform: 'uppercase'
  },
  statusTitle: {
    margin: '0.2rem 0 0 0',
    fontSize: '1.15rem',
    fontWeight: '800'
  },
  statusBadgePill: {
    fontSize: '0.68rem',
    fontWeight: '800',
    padding: '0.3rem 0.65rem',
    borderRadius: '20px',
    letterSpacing: '0.5px'
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: '16px',
    padding: '1.25rem',
    border: '1px solid rgba(255,255,255,0.08)',
    marginBottom: '1.1rem'
  },
  cardHeaderRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.85rem',
    paddingBottom: '0.65rem',
    borderBottom: '1px solid rgba(255,255,255,0.06)'
  },
  cardCategory: {
    fontSize: '0.78rem',
    color: '#f8fafc',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center'
  },
  callBtn: {
    backgroundColor: 'rgba(255, 107, 74, 0.15)',
    color: '#ff6b4a',
    border: '1px solid rgba(255, 107, 74, 0.3)',
    borderRadius: '20px',
    padding: '0.3rem 0.75rem',
    fontSize: '0.75rem',
    fontWeight: '700',
    textDecoration: 'none'
  },
  callBtnSecondary: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    color: '#38bdf8',
    border: '1px solid rgba(56, 189, 248, 0.3)',
    borderRadius: '20px',
    padding: '0.3rem 0.75rem',
    fontSize: '0.75rem',
    fontWeight: '700',
    textDecoration: 'none'
  },
  detailBlock: {
    marginBottom: '0.85rem'
  },
  label: {
    fontSize: '0.72rem',
    color: '#64748b',
    fontWeight: '600',
    textTransform: 'uppercase'
  },
  valueLarge: {
    display: 'block',
    fontSize: '1.15rem',
    fontWeight: '700',
    color: '#f8fafc',
    marginTop: '0.2rem'
  },
  valueMedium: {
    display: 'block',
    fontSize: '0.98rem',
    fontWeight: '700',
    color: '#f8fafc',
    marginTop: '0.2rem'
  },
  addressBox: {
    display: 'flex',
    gap: '0.5rem',
    backgroundColor: '#0f172a',
    padding: '0.75rem',
    borderRadius: '10px',
    marginTop: '0.3rem',
    border: '1px solid rgba(255,255,255,0.05)'
  },
  valueText: {
    fontSize: '0.88rem',
    color: '#cbd5e1',
    lineHeight: 1.4
  },
  timelineList: {
    marginTop: '0.85rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.85rem'
  },
  timelineItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem'
  },
  timelineDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    marginTop: '4px',
    flexShrink: 0
  },
  timelineStatus: {
    display: 'block',
    fontSize: '0.85rem',
    fontWeight: '700'
  },
  timelineMeta: {
    fontSize: '0.72rem',
    color: '#94a3b8'
  },
  actionGridContainer: {
    marginTop: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.85rem'
  },
  actionSectionTitle: {
    fontSize: '0.8rem',
    color: '#94a3b8',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    margin: '0 0 0.2rem 0'
  },
  actionBtnFull: {
    width: '100%',
    border: 'none',
    color: '#ffffff',
    padding: '1.1rem 1rem',
    borderRadius: '14px',
    fontSize: '0.95rem',
    fontWeight: '800',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    boxSizing: 'border-box'
  },
  actionGridTwo: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.85rem'
  },
  actionBtn: {
    border: 'none',
    color: '#ffffff',
    padding: '1rem 0.75rem',
    borderRadius: '14px',
    fontSize: '0.85rem',
    fontWeight: '700',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.4rem',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
  }
};

export default DeliveryTaskDetail;
