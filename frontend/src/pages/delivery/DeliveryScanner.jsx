import React, { useEffect, useState, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';
import { extractAwbFromText } from '../../utils/awbExtractor';

const DeliveryScanner = () => {
  const navigate = useNavigate();
  const [scanMode, setScanMode] = useState('none'); // 'none' | 'camera' | 'upload'
  const [scanResult, setScanResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [manualAwb, setManualAwb] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const qrScannerRef = useRef(null);
  const fileInputRef = useRef(null);

  // Handle successful scan
  const handleSuccess = (decodedText) => {
    const cleanAwb = extractAwbFromText(decodedText);
    const finalAwb = cleanAwb || decodedText;
    setScanResult(finalAwb);

    if (navigator.vibrate) navigator.vibrate(200);

    setTimeout(() => {
      navigate(`/delivery/task/${encodeURIComponent(finalAwb)}`);
    }, 800);
  };

  // Start Camera Scanning
  const startCameraScan = async () => {
    setErrorMsg('');
    setScanMode('camera');

    // Give DOM time to render #reader element
    setTimeout(async () => {
      try {
        if (qrScannerRef.current) {
          try { await qrScannerRef.current.stop(); } catch (e) {}
        }

        const html5QrCode = new Html5Qrcode("reader");
        qrScannerRef.current = html5QrCode;

        await html5QrCode.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText) => {
            handleSuccess(decodedText);
            html5QrCode.stop().catch(console.error);
          },
          () => {} // Frame errors ignored
        );
      } catch (err) {
        console.error('Camera start error:', err);
        setErrorMsg('Camera access denied or unavailable. Please check camera permissions or try image upload.');
        setScanMode('none');
      }
    }, 100);
  };

  // Stop Camera Scanning
  const stopCameraScan = async () => {
    if (qrScannerRef.current) {
      try {
        await qrScannerRef.current.stop();
        qrScannerRef.current = null;
      } catch (e) {
        console.error(e);
      }
    }
    setScanMode('none');
  };

  // Handle Image File Selection
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setErrorMsg('');
    setIsProcessing(true);

    try {
      // Create hidden temp scanner instance for file scanning
      const html5QrCode = new Html5Qrcode("reader-hidden");
      const decodedText = await html5QrCode.scanFile(file, true);
      setIsProcessing(false);
      handleSuccess(decodedText);
    } catch (err) {
      console.error('File scan error:', err);
      setIsProcessing(false);
      setErrorMsg('No QR code or Barcode detected in the selected image. Please upload a clearer photo or use Live Camera.');
    }
  };

  // Trigger File Input Click
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Manual AWB Submit
  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualAwb.trim()) return;
    const clean = extractAwbFromText(manualAwb);
    navigate(`/delivery/task/${encodeURIComponent(clean || manualAwb.trim())}`);
  };

  useEffect(() => {
    return () => {
      if (qrScannerRef.current) {
        qrScannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  return (
    <div style={styles.appShell}>
      {/* Hidden container required for html5-qrcode file scanning */}
      <div id="reader-hidden" style={{ display: 'none' }}></div>

      <div style={styles.appContainer}>
        {/* Header */}
        <header style={styles.header}>
          <button onClick={() => navigate('/delivery')} style={styles.iconBackBtn}>
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '1.05rem', fontWeight: '800' }}>Package QR Scanner</h3>
          <div style={{ width: '36px' }}></div>
        </header>

        <div style={styles.content}>
          {scanResult ? (
            <div style={styles.successCard}>
              <i className="fa-solid fa-circle-check" style={{ fontSize: '3.5rem', color: '#10b981', marginBottom: '1rem' }}></i>
              <h3 style={{ color: '#f8fafc', margin: '0 0 0.5rem 0' }}>Scan Successful!</h3>
              <p style={{ fontSize: '1.1rem', fontWeight: '800', color: '#38bdf8', margin: '0 0 1rem 0' }}>AWB: {scanResult}</p>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Opening delivery details...</p>
            </div>
          ) : (
            <>
              {errorMsg && (
                <div style={styles.errorBox}>
                  <i className="fa-solid fa-circle-exclamation" style={{ marginRight: '8px', fontSize: '1.1rem' }}></i>
                  <div>{errorMsg}</div>
                </div>
              )}

              {/* Camera Mode Active View */}
              {scanMode === 'camera' && (
                <div style={styles.cameraViewWrapper}>
                  <div id="reader" style={styles.scannerViewport}></div>
                  <button onClick={stopCameraScan} style={styles.stopCameraBtn}>
                    <i className="fa-solid fa-xmark" style={{ marginRight: '8px' }}></i> Stop Camera
                  </button>
                </div>
              )}

              {/* Main Selection Menu (when not actively in camera mode) */}
              {scanMode !== 'camera' && (
                <div style={styles.optionsContainer}>
                  <p style={styles.sectionSubtitle}>Select an option below to locate package details:</p>

                  {/* Option 1: Upload QR Image */}
                  <div style={styles.optionCard} onClick={triggerFileInput}>
                    <div style={{ ...styles.optionIconBadge, backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
                      <i className="fa-solid fa-image" style={{ fontSize: '1.4rem' }}></i>
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={styles.optionTitle}>1. Upload QR Image File</h4>
                      <p style={styles.optionDesc}>Choose a saved QR screenshot or parcel photo from gallery</p>
                    </div>
                    <i className="fa-solid fa-chevron-right" style={{ color: '#64748b' }}></i>
                  </div>

                  {/* Hidden File Input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleFileUpload}
                  />

                  {/* Option 2: Live Camera Scan */}
                  <div style={styles.optionCardPrimary} onClick={startCameraScan}>
                    <div style={{ ...styles.optionIconBadge, backgroundColor: 'rgba(255, 107, 74, 0.2)', color: '#ff6b4a' }}>
                      <i className="fa-solid fa-camera" style={{ fontSize: '1.4rem' }}></i>
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={styles.optionTitlePrimary}>2. Scan QR with Camera</h4>
                      <p style={styles.optionDescPrimary}>Point live camera viewfinder at package barcode or QR label</p>
                    </div>
                    <i className="fa-solid fa-arrow-right" style={{ color: '#ff6b4a' }}></i>
                  </div>

                  {/* Option 3: Manual AWB Search */}
                  <div style={styles.manualCard}>
                    <h4 style={{ ...styles.optionTitle, marginBottom: '0.6rem' }}>
                      <i className="fa-solid fa-keyboard" style={{ color: '#f59e0b', marginRight: '6px' }}></i>
                      Or Enter AWB Number Manually
                    </h4>
                    <form onSubmit={handleManualSubmit} style={styles.manualForm}>
                      <input
                        type="text"
                        value={manualAwb}
                        onChange={(e) => setManualAwb(e.target.value)}
                        placeholder="e.g. SAI-IN-5I1MXK2"
                        style={styles.manualInput}
                      />
                      <button type="submit" style={styles.manualSubmitBtn}>
                        Open
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {isProcessing && (
                <div style={styles.processingOverlay}>
                  <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2rem', color: '#38bdf8' }}></i>
                  <p style={{ color: '#f8fafc', marginTop: '1rem', fontWeight: '600' }}>Scanning uploaded image...</p>
                </div>
              )}
            </>
          )}
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
    position: 'relative'
  },
  header: {
    backgroundColor: '#1e293b',
    padding: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid rgba(255,255,255,0.08)'
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
  content: {
    padding: '1.25rem 1rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  sectionSubtitle: {
    color: '#94a3b8',
    fontSize: '0.82rem',
    margin: '0 0 1.25rem 0',
    textAlign: 'center'
  },
  optionsContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  optionCard: {
    backgroundColor: '#1e293b',
    borderRadius: '16px',
    padding: '1.1rem',
    border: '1px solid rgba(255,255,255,0.08)',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
  },
  optionCardPrimary: {
    backgroundColor: '#1e293b',
    borderRadius: '16px',
    padding: '1.1rem',
    border: '1px solid rgba(255, 107, 74, 0.4)',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 8px 20px rgba(255, 107, 74, 0.15)'
  },
  optionIconBadge: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  optionTitle: {
    margin: '0 0 0.2rem 0',
    fontSize: '0.95rem',
    fontWeight: '700',
    color: '#f8fafc'
  },
  optionTitlePrimary: {
    margin: '0 0 0.2rem 0',
    fontSize: '0.95rem',
    fontWeight: '700',
    color: '#ff6b4a'
  },
  optionDesc: {
    margin: 0,
    fontSize: '0.78rem',
    color: '#94a3b8',
    lineHeight: 1.35
  },
  optionDescPrimary: {
    margin: 0,
    fontSize: '0.78rem',
    color: '#cbd5e1',
    lineHeight: 1.35
  },
  manualCard: {
    backgroundColor: '#1e293b',
    borderRadius: '16px',
    padding: '1.1rem',
    border: '1px solid rgba(255,255,255,0.08)',
    marginTop: '0.5rem'
  },
  manualForm: {
    display: 'flex',
    gap: '0.5rem',
    marginTop: '0.5rem'
  },
  manualInput: {
    flex: 1,
    padding: '0.7rem 0.85rem',
    backgroundColor: '#0f172a',
    border: '1px solid #334155',
    borderRadius: '10px',
    fontSize: '0.9rem',
    color: '#f8fafc',
    outline: 'none'
  },
  manualSubmitBtn: {
    backgroundColor: '#38bdf8',
    color: '#0f172a',
    border: 'none',
    padding: '0 1.25rem',
    borderRadius: '10px',
    fontWeight: '800',
    fontSize: '0.85rem',
    cursor: 'pointer'
  },
  cameraViewWrapper: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  scannerViewport: {
    width: '100%',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
    border: '2px solid #ff6b4a',
    backgroundColor: '#000'
  },
  stopCameraBtn: {
    marginTop: '1.25rem',
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    color: '#fca5a5',
    border: '1px solid rgba(239, 68, 68, 0.4)',
    padding: '0.75rem 1.5rem',
    borderRadius: '12px',
    fontWeight: '700',
    fontSize: '0.88rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center'
  },
  errorBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    color: '#fca5a5',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    padding: '0.85rem 1rem',
    borderRadius: '12px',
    marginBottom: '1.25rem',
    fontSize: '0.82rem',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    boxSizing: 'border-box'
  },
  successCard: {
    backgroundColor: '#1e293b',
    padding: '2.5rem 1.5rem',
    borderRadius: '20px',
    textAlign: 'center',
    border: '1px solid rgba(255,255,255,0.1)',
    width: '100%',
    boxSizing: 'border-box'
  },
  processingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50
  }
};

export default DeliveryScanner;
