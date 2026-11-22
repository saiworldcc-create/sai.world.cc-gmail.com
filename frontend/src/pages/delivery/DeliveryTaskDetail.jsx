import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  QrCode, 
  Phone, 
  MapPin, 
  Navigation, 
  Package, 
  Scale, 
  CreditCard, 
  PenTool, 
  Camera, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  RotateCcw, 
  Layers, 
  ShieldCheck, 
  Truck, 
  ArrowRight,
  ExternalLink,
  DollarSign,
  Eraser,
  UploadCloud
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useUser } from '../../context/UserContext';
import { getDeliveryTasks, trackShipment, updateDeliveryStatus, updateLiveLocation, uploadPOD } from '../../services/api';
import { useOfflineQueue } from '../../hooks/useOfflineQueue';
import { extractAwbFromText } from '../../utils/awbExtractor';
import { AppleSquircleBadge, AppleSaiAppIcon } from '../../components/common/AppleIcons';

export default function DeliveryTaskDetail() {
  const params = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [watchId, setWatchId] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Physical Scale & Volumetric Check State
  const [actualWeight, setActualWeight] = useState(5.0);
  const [boxLength, setBoxLength] = useState(30);
  const [boxWidth, setBoxWidth] = useState(25);
  const [boxHeight, setBoxHeight] = useState(20);
  const [ratePerKg, setRatePerKg] = useState(780);
  const [paidAdvance, setPaidAdvance] = useState(0);

  // Digital Signature Canvas
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [signatureDataUrl, setSignatureDataUrl] = useState(null);

  // Photo POD State
  const [podPhotoFile, setPodPhotoFile] = useState(null);
  const [podPhotoPreview, setPodPhotoPreview] = useState(null);

  // Payment Collection State
  const [paymentStatus, setPaymentStatus] = useState('Pending'); // 'Pending' | 'Paid UPI' | 'Paid Cash'

  // Animated Success Modal
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successModalData, setSuccessModalData] = useState({ title: '', message: '', icon: 'check' });

  const { isOnline, queueCount, enqueueUpdate } = useOfflineQueue();

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
        setErrorMsg('Invalid or unreadable AWB barcode.');
        setLoading(false);
        return;
      }

      // 1. Search in assigned driver tasks
      let foundTask = null;
      try {
        const res = await getDeliveryTasks();
        const tasksList = res?.data?.data || [];
        foundTask = tasksList.find(t => t.awb?.toLowerCase() === targetAwb.toLowerCase());
      } catch (e) {
        console.warn('Driver tasks fetch warning:', e);
      }

      // 2. Query tracking API fallback
      if (!foundTask) {
        try {
          const trackRes = await trackShipment(targetAwb);
          if (trackRes && (trackRes.data || trackRes.success)) {
            const data = trackRes.data || trackRes;
            foundTask = {
              _id: data._id || targetAwb,
              awb: data.awb || targetAwb,
              sender: data.sender || data.senderName || 'Sai International Client',
              senderPhone: data.senderPhone || '',
              senderAddress: data.senderAddress || data.origin || 'Hyderabad Central Hub',
              receiver: data.receiver || data.receiverName || 'Recipient',
              receiverPhone: data.receiverPhone || '',
              destination: data.destination || data.receiverAddress || 'International Destination',
              status: data.status || 'In Transit',
              contents: data.contents || 'Express Parcel',
              carrier: data.carrier || 'SAI Worldwide Cargo',
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
        setErrorMsg(`Shipment with AWB "${targetAwb}" could not be located.`);
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
      let locationString = customLocation || 'Local Hub Route';

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

      if (newStatus.toLowerCase().includes('picked up')) {
        setSuccessModalData({
          title: 'Order Picked Up Confirmed',
          message: `AWB ${activeAwb} pickup logged with GPS timestamp. Notification dispatched to operations console.`,
          icon: 'box'
        });
        setShowSuccessModal(true);
      } else if (newStatus.toLowerCase().includes('delivered')) {
        stopLiveTracking();
        setSuccessModalData({
          title: 'Package Successfully Delivered',
          message: `AWB ${activeAwb} marked as Delivered. Proof of Delivery filed in cloud records.`,
          icon: 'check'
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

  // Volumetric & Balance Math
  const volumetricWeight = Math.round(((boxLength * boxWidth * boxHeight) / 5000) * 10) / 10;
  const chargeableWeight = Math.max(actualWeight, volumetricWeight);
  const totalFreight = Math.round(chargeableWeight * ratePerKg);
  const balanceDue = Math.max(0, totalFreight - paidAdvance);

  // Digital Signature Canvas Methods
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;
    
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      const canvas = canvasRef.current;
      if (canvas) {
        setSignatureDataUrl(canvas.toDataURL('image/png'));
      }
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    setSignatureDataUrl(null);
  };

  // Photo POD Capture
  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPodPhotoFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPodPhotoPreview(ev.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFinalPODSubmit = async () => {
    if (!podPhotoFile && !hasSignature) {
      alert('Please capture a Proof of Delivery photo or collect the customer signature.');
      return;
    }

    try {
      setIsUpdating(true);
      const activeAwb = task?.awb || targetAwb;
      const formData = new FormData();
      if (podPhotoFile) formData.append('image', podPhotoFile);
      if (signatureDataUrl) formData.append('signature', signatureDataUrl);
      formData.append('chargeableWeight', chargeableWeight);
      formData.append('paymentStatus', paymentStatus);

      await uploadPOD(activeAwb, formData);
      await handleStatusUpdate('Delivered');
    } catch (err) {
      console.error(err);
      alert('Failed to upload POD. You can re-try or update status directly.');
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="apple-app-shell" style={styles.shell}>
        <div style={styles.centerLoading}>
          <Truck size={36} color="#0284c7" className="fa-bounce" />
          <div style={styles.loadingText}>Retrieving AWB Manifest...</div>
        </div>
      </div>
    );
  }

  if (errorMsg || !task) {
    return (
      <div className="apple-app-shell" style={styles.shell}>
        <div className="apple-mobile-device-viewport" style={styles.viewport}>
          <div style={styles.errorCard}>
            <AlertCircle size={48} color="#ef4444" />
            <h2 style={styles.errorTitle}>Shipment Not Found</h2>
            <p style={styles.errorDesc}>{errorMsg || 'Could not locate details for this AWB.'}</p>
            <div style={styles.errorBtnRow}>
              <button onClick={() => navigate('/delivery/scan')} style={styles.secondaryBtn}>
                <QrCode size={16} /> Scan Other AWB
              </button>
              <button onClick={() => navigate('/delivery')} style={styles.primaryBtn}>
                Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isPickedUp = (task.status || '').toLowerCase().includes('picked');
  const isInTransit = (task.status || '').toLowerCase().includes('transit');
  const isDelivered = (task.status || '').toLowerCase().includes('delivered');

  return (
    <div className="apple-app-shell" style={styles.shell}>
      {/* Animated Success Modal */}
      {showSuccessModal && (
        <div style={styles.modalOverlay} onClick={() => setShowSuccessModal(false)}>
          <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalIconCircle}>
              <CheckCircle2 size={36} color="#ffffff" strokeWidth={2.4} />
            </div>
            <h3 style={styles.modalTitle}>{successModalData.title}</h3>
            <p style={styles.modalMsg}>{successModalData.message}</p>
            <button
              onClick={() => {
                setShowSuccessModal(false);
                navigate('/delivery');
              }}
              style={styles.modalBtn}
            >
              Return to Active Manifest
            </button>
          </div>
        </div>
      )}

      <div className="apple-mobile-device-viewport" style={styles.viewport}>
        {/* Sticky iOS Header */}
        <header style={styles.header}>
          <button onClick={() => navigate('/delivery')} style={styles.headerBackBtn}>
            <ChevronLeft size={22} color="#ffffff" />
          </button>
          <div style={styles.headerTitleBox}>
            <span style={styles.headerSubtitle}>WAYBILL MANIFEST</span>
            <span style={styles.headerAwb}>{task.awb}</span>
          </div>
          <button onClick={() => navigate('/delivery/scan')} style={styles.headerBackBtn} title="Scan Next">
            <QrCode size={20} color="#38bdf8" />
          </button>
        </header>

        {/* Offline Banner */}
        {!isOnline && (
          <div style={styles.offlineWarning}>
            <AlertCircle size={15} color="#fbbf24" />
            <span>Offline Mode Active • {queueCount} changes queued</span>
          </div>
        )}

        {/* Live GPS Active Pill */}
        {isTracking && (
          <div style={styles.gpsActivePill}>
            <Navigation size={14} color="#34d399" className="fa-spin" />
            <span>Live Satellite Route Telemetry Streaming</span>
          </div>
        )}

        <div style={styles.contentScroll}>
          {/* Status Progression Card */}
          <div style={styles.glassCard}>
            <div style={styles.statusRow}>
              <div>
                <span style={styles.cardMiniLabel}>CURRENT STATUS</span>
                <div style={styles.statusBigText}>{task.status}</div>
              </div>
              <span
                style={{
                  ...styles.statusBadge,
                  backgroundColor: isDelivered ? 'rgba(16, 185, 129, 0.15)' : 'rgba(2, 132, 199, 0.15)',
                  color: isDelivered ? '#34d399' : '#38bdf8',
                  borderColor: isDelivered ? 'rgba(16, 185, 129, 0.3)' : 'rgba(56, 189, 248, 0.3)'
                }}
              >
                {isDelivered ? 'COMPLETED' : 'IN PROGRESS'}
              </span>
            </div>

            {/* Stage Progress Pills */}
            <div style={styles.stagesRow}>
              <div style={{ ...styles.stageStep, backgroundColor: isPickedUp || isInTransit || isDelivered ? '#10b981' : '#334155' }}>
                1. Picked Up
              </div>
              <div style={{ ...styles.stageStep, backgroundColor: isInTransit || isDelivered ? '#0284c7' : '#334155' }}>
                2. In Transit
              </div>
              <div style={{ ...styles.stageStep, backgroundColor: isDelivered ? '#10b981' : '#334155' }}>
                3. Delivered
              </div>
            </div>
          </div>

          {/* Consignee / Recipient Card */}
          <div style={styles.glassCard}>
            <div style={styles.cardSectionHeader}>
              <div style={styles.sectionTitleRow}>
                <AppleSquircleBadge palette="orange" size={38}>
                  <MapPin size={20} color="#ffffff" strokeWidth={2.4} />
                </AppleSquircleBadge>
                <span style={styles.sectionTitle}>Consignee / Destination</span>
              </div>
              {task.receiverPhone && (
                <a href={`tel:${task.receiverPhone}`} style={styles.callBadge}>
                  <Phone size={13} color="#34d399" />
                  <span>Call</span>
                </a>
              )}
            </div>

            <div style={styles.dataGroup}>
              <span style={styles.dataLabel}>Recipient Name</span>
              <span style={styles.dataValueLarge}>{task.receiver || 'Recipient'}</span>
            </div>

            {task.receiverPhone && (
              <div style={styles.dataGroup}>
                <span style={styles.dataLabel}>Phone Number</span>
                <span style={styles.dataValue}>{task.receiverPhone}</span>
              </div>
            )}

            <div style={styles.dataGroup}>
              <span style={styles.dataLabel}>Delivery Address</span>
              <span style={styles.dataValue}>{task.destination}</span>
            </div>

            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(task.destination || 'Destination')}`}
              target="_blank"
              rel="noopener noreferrer"
              style={styles.navMapButton}
            >
              <Navigation size={15} color="#ffffff" />
              <span>Launch Google Maps GPS Navigation</span>
            </a>
          </div>

          {/* Shipper Details */}
          <div style={styles.glassCard}>
            <div style={styles.cardSectionHeader}>
              <div style={styles.sectionTitleRow}>
                <AppleSquircleBadge palette="blue" size={38}>
                  <Package size={20} color="#ffffff" strokeWidth={2.4} />
                </AppleSquircleBadge>
                <span style={styles.sectionTitle}>Shipper & Goods Manifest</span>
              </div>
              {task.senderPhone && (
                <a href={`tel:${task.senderPhone}`} style={styles.callBadgeSecondary}>
                  <Phone size={13} color="#38bdf8" />
                  <span>Call Shipper</span>
                </a>
              )}
            </div>

            <div style={styles.dataGroup}>
              <span style={styles.dataLabel}>Sender / Booking Agent</span>
              <span style={styles.dataValue}>{task.sender || 'Sender'}</span>
            </div>

            {task.senderAddress && (
              <div style={styles.dataGroup}>
                <span style={styles.dataLabel}>Pickup Address</span>
                <span style={styles.dataValue}>{task.senderAddress}</span>
              </div>
            )}

            <div style={styles.dataGroup}>
              <span style={styles.dataLabel}>Parcel Category</span>
              <span style={styles.dataValue}>{task.contents || 'Express Air Courier'}</span>
            </div>
          </div>

          {/* Scale Weight & Volumetric Verification Module */}
          <div style={styles.glassCard}>
            <div style={styles.cardSectionHeader}>
              <div style={styles.sectionTitleRow}>
                <AppleSquircleBadge palette="gold" size={38}>
                  <Scale size={20} color="#ffffff" strokeWidth={2.4} />
                </AppleSquircleBadge>
                <span style={styles.sectionTitle}>Doorstep Weight & Scale Audit</span>
              </div>
              <span style={styles.iataBadge}>IATA / 5000 Rule</span>
            </div>

            <div style={styles.scaleGrid}>
              <div style={styles.inputCell}>
                <label style={styles.cellLabel}>ACTUAL SCALE (KG)</label>
                <input
                  type="number"
                  step="0.1"
                  value={actualWeight}
                  onChange={(e) => setActualWeight(parseFloat(e.target.value) || 0)}
                  style={styles.cellInput}
                />
              </div>

              <div style={styles.inputCell}>
                <label style={styles.cellLabel}>LENGTH (CM)</label>
                <input
                  type="number"
                  value={boxLength}
                  onChange={(e) => setBoxLength(parseFloat(e.target.value) || 0)}
                  style={styles.cellInput}
                />
              </div>

              <div style={styles.inputCell}>
                <label style={styles.cellLabel}>WIDTH (CM)</label>
                <input
                  type="number"
                  value={boxWidth}
                  onChange={(e) => setBoxWidth(parseFloat(e.target.value) || 0)}
                  style={styles.cellInput}
                />
              </div>

              <div style={styles.inputCell}>
                <label style={styles.cellLabel}>HEIGHT (CM)</label>
                <input
                  type="number"
                  value={boxHeight}
                  onChange={(e) => setBoxHeight(parseFloat(e.target.value) || 0)}
                  style={styles.cellInput}
                />
              </div>
            </div>

            <div style={styles.weightSummaryBox}>
              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Volumetric Weight:</span>
                <span style={styles.summaryValue}>{volumetricWeight} kg</span>
              </div>
              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Chargeable Weight:</span>
                <span style={{ ...styles.summaryValue, color: '#38bdf8', fontWeight: '800' }}>
                  {chargeableWeight} kg
                </span>
              </div>
              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Total Doorstep Tariff:</span>
                <span style={{ ...styles.summaryValue, color: '#34d399', fontWeight: '800' }}>
                  ₹{totalFreight.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Dynamic UPI Payment Collection on Screen */}
          <div style={styles.glassCard}>
            <div style={styles.cardSectionHeader}>
              <div style={styles.sectionTitleRow}>
                <AppleSquircleBadge palette="green" size={38}>
                  <CreditCard size={20} color="#ffffff" strokeWidth={2.4} />
                </AppleSquircleBadge>
                <span style={styles.sectionTitle}>On-The-Spot UPI Payment QR</span>
              </div>
              <span style={styles.paymentStatusPill}>
                {paymentStatus}
              </span>
            </div>

            <div style={styles.qrContainer}>
              <div style={styles.qrWhiteBox}>
                <QRCodeSVG
                  value={`upi://pay?pa=saiinternationalcouriers@upi&pn=Sai%20International%20Couriers&am=${totalFreight}&cu=INR&tn=AWB-${task.awb}`}
                  size={160}
                  level="H"
                />
              </div>
              <div style={styles.qrMetaBox}>
                <div style={styles.qrAmount}>₹{totalFreight.toLocaleString('en-IN')}</div>
                <div style={styles.qrScanPrompt}>Scan with Google Pay, PhonePe, Paytm, or BHIM</div>
                
                <div style={styles.payBtnRow}>
                  <button
                    type="button"
                    onClick={() => setPaymentStatus('Paid UPI')}
                    style={{
                      ...styles.payChoiceBtn,
                      backgroundColor: paymentStatus === 'Paid UPI' ? '#10b981' : 'rgba(255,255,255,0.08)'
                    }}
                  >
                    Paid via UPI
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentStatus('Paid Cash')}
                    style={{
                      ...styles.payChoiceBtn,
                      backgroundColor: paymentStatus === 'Paid Cash' ? '#f59e0b' : 'rgba(255,255,255,0.08)'
                    }}
                  >
                    Paid Cash
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Digital Signature On Glass (HTML5 Canvas) */}
          <div style={styles.glassCard}>
            <div style={styles.cardSectionHeader}>
              <div style={styles.sectionTitleRow}>
                <AppleSquircleBadge palette="teal" size={38}>
                  <PenTool size={20} color="#ffffff" strokeWidth={2.4} />
                </AppleSquircleBadge>
                <span style={styles.sectionTitle}>Sign on Glass (Customer / Agent)</span>
              </div>
              {hasSignature && (
                <button type="button" onClick={clearSignature} style={styles.clearSignBtn}>
                  <Eraser size={12} /> Clear
                </button>
              )}
            </div>

            <div style={styles.signaturePadWrapper}>
              <canvas
                ref={canvasRef}
                width={360}
                height={160}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                style={styles.signatureCanvas}
              />
              {!hasSignature && (
                <div style={styles.signPromptOverlay}>
                  <span>✍️ Sign finger here to verify handover</span>
                </div>
              )}
            </div>
          </div>

          {/* Proof of Delivery Photo Studio */}
          <div style={styles.glassCard}>
            <div style={styles.cardSectionHeader}>
              <div style={styles.sectionTitleRow}>
                <AppleSquircleBadge palette="red" size={38}>
                  <Camera size={20} color="#ffffff" strokeWidth={2.4} />
                </AppleSquircleBadge>
                <span style={styles.sectionTitle}>Proof of Delivery Photo (POD)</span>
              </div>
              {podPhotoPreview && <span style={styles.photoReadyBadge}>Photo Ready</span>}
            </div>

            {podPhotoPreview ? (
              <div style={styles.previewContainer}>
                <img src={podPhotoPreview} alt="POD Preview" style={styles.previewImage} />
                <div style={styles.previewWatermark}>
                  <span>AWB: {task.awb}</span>
                  <span>{new Date().toLocaleString('en-IN')}</span>
                </div>
                <label htmlFor="pod-camera-input" style={styles.retakeLabel}>
                  <RotateCcw size={14} /> Retake Photo
                </label>
              </div>
            ) : (
              <label htmlFor="pod-camera-input" style={styles.cameraTriggerBox}>
                <Camera size={32} color="#0284c7" />
                <span style={styles.cameraTriggerTitle}>Tap to Launch Camera</span>
                <span style={styles.cameraTriggerSub}>Photograph parcel with doorstep or recipient</span>
              </label>
            )}

            <input
              id="pod-camera-input"
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handlePhotoSelect}
              style={{ display: 'none' }}
            />
          </div>

          {/* Primary Action Buttons */}
          <div style={styles.actionSection}>
            {/* Step 1: Confirm Pickup */}
            <button
              type="button"
              onClick={() => handleStatusUpdate('Order Picked Up Confirmed')}
              disabled={isUpdating}
              style={{
                ...styles.actionBtnFull,
                backgroundColor: isPickedUp ? '#059669' : '#10b981',
                boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)'
              }}
            >
              <CheckCircle2 size={18} />
              <span>{isUpdating ? 'Saving Update...' : isPickedUp ? '✓ Pickup Already Confirmed' : 'Confirm Order Picked Up'}</span>
            </button>

            {/* In Transit & Route */}
            <div style={styles.actionTwoCol}>
              <button
                type="button"
                onClick={() => handleStatusUpdate('In Transit')}
                disabled={isUpdating}
                style={{ ...styles.actionBtnHalf, backgroundColor: '#d97706' }}
              >
                <Truck size={16} /> Mark In Transit
              </button>

              <button
                type="button"
                onClick={() => handleStatusUpdate('Out for Delivery')}
                disabled={isUpdating}
                style={{ ...styles.actionBtnHalf, backgroundColor: '#2563eb' }}
              >
                <Navigation size={16} /> Out for Delivery
              </button>
            </div>

            {/* Final POD Submission */}
            <button
              type="button"
              onClick={handleFinalPODSubmit}
              disabled={isUpdating}
              style={{
                ...styles.actionBtnFull,
                background: 'linear-gradient(135deg, #0284c7 0%, #ff6b4a 100%)',
                boxShadow: '0 10px 28px rgba(2, 132, 199, 0.5)'
              }}
            >
              <UploadCloud size={18} />
              <span>{isUpdating ? 'Uploading POD & Closing...' : 'Submit POD & Complete Delivery'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  shell: {
    minHeight: '100vh',
    minHeight: '100dvh',
    backgroundColor: '#070b12',
    display: 'flex',
    justifyContent: 'center'
  },
  viewport: {
    width: '100%',
    maxWidth: '440px',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    paddingBottom: '30px'
  },
  centerLoading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    gap: '12px'
  },
  loadingText: {
    fontSize: '0.86rem',
    color: '#94a3b8'
  },
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 40,
    background: 'rgba(9, 14, 23, 0.9)',
    backdropFilter: 'blur(25px)',
    WebkitBackdropFilter: 'blur(25px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  headerBackBtn: {
    width: '36px',
    height: '36px',
    borderRadius: '11px',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
  },
  headerTitleBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  headerSubtitle: {
    fontSize: '0.64rem',
    fontWeight: '800',
    color: '#94a3b8',
    letterSpacing: '0.6px'
  },
  headerAwb: {
    fontSize: '0.96rem',
    fontWeight: '800',
    color: '#38bdf8',
    letterSpacing: '0.4px'
  },
  offlineWarning: {
    padding: '8px 16px',
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    borderBottom: '1px solid rgba(245, 158, 11, 0.25)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontSize: '0.74rem',
    color: '#fbbf24',
    fontWeight: '600'
  },
  gpsActivePill: {
    padding: '8px 16px',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderBottom: '1px solid rgba(16, 185, 129, 0.25)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontSize: '0.74rem',
    color: '#34d399',
    fontWeight: '600'
  },
  contentScroll: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px'
  },
  glassCard: {
    backgroundColor: 'rgba(18, 27, 43, 0.72)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 8px 24px -4px rgba(0, 0, 0, 0.4)',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  statusRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  cardMiniLabel: {
    fontSize: '0.62rem',
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: '0.6px'
  },
  statusBigText: {
    fontSize: '1.25rem',
    fontWeight: '800',
    color: '#ffffff',
    marginTop: '2px'
  },
  statusBadge: {
    padding: '4px 10px',
    borderRadius: '12px',
    border: '1px solid',
    fontSize: '0.72rem',
    fontWeight: '800'
  },
  stagesRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '6px',
    marginTop: '4px'
  },
  stageStep: {
    padding: '6px 4px',
    borderRadius: '8px',
    textAlign: 'center',
    fontSize: '0.68rem',
    fontWeight: '700',
    color: '#ffffff'
  },
  cardSectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  sectionTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  sectionTitle: {
    fontSize: '0.88rem',
    fontWeight: '800',
    color: '#ffffff'
  },
  callBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 10px',
    borderRadius: '12px',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    color: '#34d399',
    fontSize: '0.72rem',
    fontWeight: '700',
    textDecoration: 'none'
  },
  callBadgeSecondary: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 10px',
    borderRadius: '12px',
    backgroundColor: 'rgba(2, 132, 199, 0.15)',
    border: '1px solid rgba(56, 189, 248, 0.3)',
    color: '#38bdf8',
    fontSize: '0.72rem',
    fontWeight: '700',
    textDecoration: 'none'
  },
  dataGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
  },
  dataLabel: {
    fontSize: '0.64rem',
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase'
  },
  dataValue: {
    fontSize: '0.82rem',
    color: '#cbd5e1',
    lineHeight: 1.4
  },
  dataValueLarge: {
    fontSize: '0.98rem',
    fontWeight: '700',
    color: '#ffffff'
  },
  navMapButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '11px 14px',
    borderRadius: '14px',
    background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
    color: '#ffffff',
    fontSize: '0.8rem',
    fontWeight: '700',
    textDecoration: 'none',
    boxShadow: '0 6px 18px rgba(2, 132, 199, 0.4)',
    marginTop: '4px'
  },
  iataBadge: {
    fontSize: '0.65rem',
    fontWeight: '700',
    color: '#fbbf24',
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    padding: '3px 8px',
    borderRadius: '10px'
  },
  scaleGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '6px'
  },
  inputCell: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  cellLabel: {
    fontSize: '0.58rem',
    fontWeight: '800',
    color: '#94a3b8'
  },
  cellInput: {
    width: '100%',
    padding: '8px 4px',
    borderRadius: '10px',
    backgroundColor: 'rgba(10, 16, 26, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#ffffff',
    fontSize: '0.88rem',
    fontWeight: '700',
    textAlign: 'center',
    boxSizing: 'border-box'
  },
  weightSummaryBox: {
    padding: '10px 12px',
    borderRadius: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  summaryItem: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.78rem'
  },
  summaryLabel: {
    color: '#94a3b8'
  },
  summaryValue: {
    color: '#ffffff'
  },
  paymentStatusPill: {
    fontSize: '0.7rem',
    fontWeight: '800',
    color: '#34d399',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    padding: '3px 8px',
    borderRadius: '10px'
  },
  qrContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    padding: '8px 0'
  },
  qrWhiteBox: {
    padding: '12px',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)'
  },
  qrMetaBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
    textAlign: 'center'
  },
  qrAmount: {
    fontSize: '1.4rem',
    fontWeight: '900',
    color: '#ffffff'
  },
  qrScanPrompt: {
    fontSize: '0.74rem',
    color: '#94a3b8'
  },
  payBtnRow: {
    display: 'flex',
    gap: '8px',
    marginTop: '6px'
  },
  payChoiceBtn: {
    padding: '7px 14px',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    color: '#ffffff',
    fontSize: '0.74rem',
    fontWeight: '700',
    cursor: 'pointer'
  },
  signaturePadWrapper: {
    position: 'relative',
    width: '100%',
    height: '160px',
    backgroundColor: '#070f1e',
    borderRadius: '14px',
    border: '1px dashed rgba(56, 189, 248, 0.35)',
    overflow: 'hidden'
  },
  signatureCanvas: {
    width: '100%',
    height: '100%',
    touchAction: 'none'
  },
  signPromptOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
    color: '#64748b',
    fontSize: '0.78rem'
  },
  clearSignBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    background: 'none',
    border: 'none',
    color: '#ef4444',
    fontSize: '0.74rem',
    cursor: 'pointer',
    fontWeight: '700'
  },
  photoReadyBadge: {
    fontSize: '0.68rem',
    color: '#10b981',
    fontWeight: '700'
  },
  cameraTriggerBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '24px 16px',
    borderRadius: '16px',
    backgroundColor: 'rgba(2, 132, 199, 0.08)',
    border: '2px dashed rgba(2, 132, 199, 0.3)',
    cursor: 'pointer'
  },
  cameraTriggerTitle: {
    fontSize: '0.88rem',
    fontWeight: '700',
    color: '#ffffff'
  },
  cameraTriggerSub: {
    fontSize: '0.72rem',
    color: '#94a3b8'
  },
  previewContainer: {
    position: 'relative',
    borderRadius: '14px',
    overflow: 'hidden'
  },
  previewImage: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    borderRadius: '14px'
  },
  previewWatermark: {
    position: 'absolute',
    bottom: '10px',
    left: '10px',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    backdropFilter: 'blur(8px)',
    padding: '4px 8px',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    fontSize: '0.65rem',
    color: '#34d399',
    fontWeight: '700'
  },
  retakeLabel: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: '#ffffff',
    padding: '6px 10px',
    borderRadius: '10px',
    fontSize: '0.7rem',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  },
  actionSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginTop: '6px'
  },
  actionBtnFull: {
    width: '100%',
    padding: '14px',
    borderRadius: '16px',
    border: 'none',
    color: '#ffffff',
    fontSize: '0.9rem',
    fontWeight: '800',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    cursor: 'pointer'
  },
  actionTwoCol: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px'
  },
  actionBtnHalf: {
    padding: '12px',
    borderRadius: '14px',
    border: 'none',
    color: '#ffffff',
    fontSize: '0.8rem',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    cursor: 'pointer'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(7, 11, 18, 0.85)',
    backdropFilter: 'blur(10px)',
    zIndex: 999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
  },
  modalCard: {
    width: '100%',
    maxWidth: '340px',
    backgroundColor: 'rgba(18, 27, 43, 0.95)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    borderRadius: '24px',
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)',
    padding: '24px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px'
  },
  modalIconCircle: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    backgroundColor: '#10b981',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 24px rgba(16, 185, 129, 0.5)'
  },
  modalTitle: {
    margin: 0,
    fontSize: '1.15rem',
    fontWeight: '800',
    color: '#ffffff'
  },
  modalMsg: {
    margin: 0,
    fontSize: '0.82rem',
    color: '#94a3b8',
    lineHeight: 1.4
  },
  modalBtn: {
    width: '100%',
    padding: '12px',
    borderRadius: '14px',
    backgroundColor: '#10b981',
    border: 'none',
    color: '#ffffff',
    fontSize: '0.86rem',
    fontWeight: '800',
    cursor: 'pointer',
    marginTop: '6px'
  },
  errorCard: {
    padding: '40px 20px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px'
  },
  errorTitle: {
    fontSize: '1.2rem',
    fontWeight: '800',
    color: '#ffffff',
    margin: 0
  },
  errorDesc: {
    fontSize: '0.84rem',
    color: '#94a3b8',
    margin: 0
  },
  errorBtnRow: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px'
  },
  secondaryBtn: {
    padding: '10px 16px',
    borderRadius: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    color: '#ffffff',
    fontSize: '0.8rem',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  primaryBtn: {
    padding: '10px 18px',
    borderRadius: '12px',
    backgroundColor: '#0284c7',
    border: 'none',
    color: '#ffffff',
    fontSize: '0.8rem',
    fontWeight: '700',
    cursor: 'pointer'
  }
};
