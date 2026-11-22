import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { 
  ChevronLeft, 
  ScanLine, 
  CheckCircle2, 
  Search, 
  ArrowRight, 
  Camera, 
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { AppleSquircleBadge, AppleSaiAppIcon } from '../../components/common/AppleIcons';

export default function DeliveryScanner() {
  const navigate = useNavigate();
  const [scanResult, setScanResult] = useState(null);
  const [manualAwb, setManualAwb] = useState('');
  const [showManualModal, setShowManualModal] = useState(false);

  useEffect(() => {
    // Initialize Scanner on mount
    const scanner = new Html5QrcodeScanner(
      'reader',
      { 
        fps: 15, 
        qrbox: { width: 260, height: 260 }, 
        aspectRatio: 1.0,
        showTorchButtonIfSupported: true
      },
      false
    );

    scanner.render(
      (decodedText) => {
        setScanResult(decodedText);
        scanner.clear();
        
        // Audio Chime feedback
        try {
          const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-software-interface-start-2574.mp3');
          audio.play();
        } catch (e) {}

        // Navigate to the task page instantly
        setTimeout(() => {
          navigate(`/delivery/task/${encodeURIComponent(decodedText.trim())}`);
        }, 600);
      },
      (error) => {
        // Continuous scan tick
      }
    );

    return () => {
      scanner.clear().catch(e => console.error(e));
    };
  }, [navigate]);

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualAwb.trim()) return;
    navigate(`/delivery/task/${encodeURIComponent(manualAwb.trim().toUpperCase())}`);
  };

  return (
    <div className="apple-app-shell" style={styles.shell}>
      <div className="apple-mobile-device-viewport" style={styles.viewport}>
        {/* Header */}
        <header style={styles.header}>
          <button onClick={() => navigate('/delivery')} style={styles.backBtn}>
            <ChevronLeft size={22} color="#ffffff" />
          </button>
          <div style={styles.titleBox}>
            <span style={styles.headerSub}>LASER OPTICAL SCANNER</span>
            <span style={styles.headerTitle}>Scan Waybill Barcode</span>
          </div>
          <button onClick={() => setShowManualModal(!showManualModal)} style={styles.backBtn} title="Manual Input">
            <Search size={18} color="#38bdf8" />
          </button>
        </header>

        {/* Viewfinder Area */}
        <div style={styles.scannerWrapper}>
          <div id="reader" style={styles.readerDiv}></div>

          {/* Success Overlay */}
          {scanResult && (
            <div style={styles.successOverlay}>
              <div style={styles.successIconCircle}>
                <CheckCircle2 size={44} color="#ffffff" />
              </div>
              <h2 style={styles.scannedTitle}>AWB DECODED!</h2>
              <div style={styles.scannedAwb}>{scanResult}</div>
              <p style={styles.scannedSub}>Opening Driver Task Sheet...</p>
            </div>
          )}
        </div>

        {/* Bottom Manual Option Card */}
        <div style={styles.bottomCard}>
          <div style={styles.laserPromptRow}>
            <AppleSquircleBadge palette="orange" size={32}>
              <ScanLine size={18} color="#ffffff" strokeWidth={2.4} />
            </AppleSquircleBadge>
            <span style={styles.laserPromptText}>Point camera steadily at the shipping label or QR pass</span>
          </div>

          <form onSubmit={handleManualSubmit} style={styles.manualForm}>
            <div style={styles.manualInputWrapper}>
              <Search size={16} color="#64748b" style={styles.searchIcon} />
              <input
                type="text"
                value={manualAwb}
                onChange={(e) => setManualAwb(e.target.value)}
                placeholder="Can't scan? Type AWB e.g. SAI-88219..."
                style={styles.manualInput}
              />
            </div>
            <button
              type="submit"
              disabled={!manualAwb.trim()}
              style={{
                ...styles.manualSubmitBtn,
                opacity: manualAwb.trim() ? 1 : 0.6
              }}
            >
              <ArrowRight size={18} />
            </button>
          </form>

          <div style={styles.sampleAwbsRow}>
            <span style={styles.sampleLabel}>Quick Demo AWBs:</span>
            {['SAI-USA-7721', 'SAI-UK-8842', 'SAI-UAE-9931'].map((sample) => (
              <button
                key={sample}
                type="button"
                onClick={() => navigate(`/delivery/task/${sample}`)}
                style={styles.sampleChip}
              >
                {sample}
              </button>
            ))}
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
    position: 'relative'
  },
  header: {
    background: 'rgba(9, 14, 23, 0.95)',
    backdropFilter: 'blur(25px)',
    WebkitBackdropFilter: 'blur(25px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 30
  },
  backBtn: {
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
  titleBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  headerSub: {
    fontSize: '0.62rem',
    fontWeight: '800',
    color: '#94a3b8',
    letterSpacing: '0.6px'
  },
  headerTitle: {
    fontSize: '0.94rem',
    fontWeight: '800',
    color: '#ffffff'
  },
  scannerWrapper: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#0a0f1d',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  },
  readerDiv: {
    width: '100%',
    border: 'none'
  },
  successOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(7, 11, 18, 0.92)',
    backdropFilter: 'blur(16px)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
    gap: '12px',
    padding: '20px',
    textAlign: 'center'
  },
  successIconCircle: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: '#10b981',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 40px rgba(16, 185, 129, 0.6)'
  },
  scannedTitle: {
    margin: 0,
    fontSize: '1.4rem',
    fontWeight: '900',
    color: '#ffffff'
  },
  scannedAwb: {
    fontSize: '1.2rem',
    fontWeight: '800',
    color: '#38bdf8',
    letterSpacing: '1px',
    backgroundColor: 'rgba(2, 132, 199, 0.15)',
    padding: '6px 14px',
    borderRadius: '12px',
    border: '1px solid rgba(56, 189, 248, 0.3)'
  },
  scannedSub: {
    margin: 0,
    fontSize: '0.84rem',
    color: '#94a3b8'
  },
  bottomCard: {
    padding: '18px 16px 28px 16px',
    backgroundColor: 'rgba(18, 27, 43, 0.95)',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  laserPromptRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  laserPromptText: {
    fontSize: '0.78rem',
    color: '#cbd5e1',
    lineHeight: 1.3
  },
  manualForm: {
    display: 'flex',
    gap: '8px'
  },
  manualInputWrapper: {
    position: 'relative',
    flex: 1,
    display: 'flex',
    alignItems: 'center'
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    pointerEvents: 'none'
  },
  manualInput: {
    width: '100%',
    padding: '12px 14px 12px 36px',
    borderRadius: '14px',
    backgroundColor: '#0c1524',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    color: '#ffffff',
    fontSize: '0.84rem',
    outline: 'none',
    boxSizing: 'border-box',
    WebkitTextFillColor: '#ffffff'
  },
  manualSubmitBtn: {
    width: '46px',
    height: '46px',
    borderRadius: '14px',
    background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
    border: 'none',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    flexShrink: 0
  },
  sampleAwbsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: '6px'
  },
  sampleLabel: {
    fontSize: '0.68rem',
    color: '#94a3b8',
    fontWeight: '700'
  },
  sampleChip: {
    padding: '4px 8px',
    borderRadius: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    color: '#38bdf8',
    fontSize: '0.68rem',
    fontWeight: '700',
    cursor: 'pointer'
  }
};
