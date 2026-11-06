import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';

const DeliveryScanner = () => {
  const navigate = useNavigate();
  const [scanResult, setScanResult] = useState(null);

  useEffect(() => {
    // Initialize Scanner on mount
    const scanner = new Html5QrcodeScanner(
      'reader',
      { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 },
      false
    );

    scanner.render(
      (decodedText) => {
        // On Success
        setScanResult(decodedText);
        scanner.clear();
        
        // Play beep sound (optional, assuming browser allows)
        try {
          const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-software-interface-start-2574.mp3');
          audio.play();
        } catch (e) {}

        // Navigate to the task page instantly
        setTimeout(() => {
          navigate(`/delivery/task/${decodedText}`);
        }, 500);
      },
      (error) => {
        // Ignore scan failures as it scans continuously
      }
    );

    // Cleanup on unmount
    return () => {
      scanner.clear().catch(e => console.error(e));
    };
  }, [navigate]);

  return (
    <div style={styles.appShell}>
      <div style={styles.appContainer}>
        
        {/* Header */}
        <header style={styles.header}>
          <button onClick={() => navigate('/delivery/dashboard')} style={styles.backBtn}>
            <i className="fa-solid fa-arrow-left"></i> CANCEL
          </button>
          <h2 style={styles.title}>SCAN AWB BARCODE</h2>
        </header>

        {/* Scanner Viewport */}
        <div style={styles.scannerWrapper}>
          <div id="reader" style={styles.readerDiv}></div>
          
          {scanResult && (
            <div style={styles.successOverlay}>
              <i className="fa-solid fa-circle-check" style={{ fontSize: '4rem', color: '#10b981', marginBottom: '1rem' }}></i>
              <h2 style={{ color: '#fff' }}>AWB SCANNED!</h2>
              <p style={{ color: '#38bdf8', fontSize: '1.2rem', fontWeight: 'bold' }}>{scanResult}</p>
              <p style={{ color: '#94a3b8' }}>Redirecting to task...</p>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div style={styles.instructions}>
          <i className="fa-solid fa-crosshairs" style={{ color: '#FF5000', fontSize: '2rem', marginBottom: '1rem' }}></i>
          <h3 style={{ color: '#fff', margin: '0 0 0.5rem 0' }}>ALIGN BARCODE</h3>
          <p style={{ color: '#aaaaaa', fontSize: '0.9rem', margin: 0 }}>
            Point your camera at the shipping label. The system will automatically decode the AWB.
          </p>
        </div>

      </div>
    </div>
  );
};

const styles = {
  appShell: {
    minHeight: '100vh',
    backgroundColor: '#000000',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    fontFamily: "system-ui, -apple-system, sans-serif"
  },
  appContainer: {
    width: '100%',
    maxWidth: '440px',
    minHeight: '100vh',
    backgroundColor: '#000000',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    backgroundColor: '#111111',
    padding: '1.5rem 1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    borderBottom: '4px solid #333333',
  },
  backBtn: {
    backgroundColor: '#333333',
    border: 'none',
    color: '#ffffff',
    padding: '0.8rem 1rem',
    fontWeight: '900',
    fontSize: '0.9rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  title: {
    color: '#ffffff',
    margin: 0,
    fontSize: '1.2rem',
    fontWeight: '900',
    letterSpacing: '1px'
  },
  scannerWrapper: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#0a0a0a',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    borderBottom: '4px solid #FF5000'
  },
  readerDiv: {
    width: '100%',
    border: 'none',
  },
  successOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.9)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10
  },
  instructions: {
    padding: '2rem 1.5rem',
    textAlign: 'center',
    backgroundColor: '#111111'
  }
};

export default DeliveryScanner;
