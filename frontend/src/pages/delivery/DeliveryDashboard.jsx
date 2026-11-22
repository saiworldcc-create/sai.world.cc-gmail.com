import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Truck, 
  Package, 
  MapPin, 
  Navigation, 
  Phone, 
  QrCode, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Search, 
  Power, 
  RefreshCw, 
  Copy, 
  Check, 
  ChevronRight, 
  ShieldCheck, 
  Smartphone, 
  Calendar,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { getDeliveryTasks } from '../../services/api';

export default function DeliveryDashboard() {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'pending' | 'transit' | 'delivered'
  const [isOnDuty, setIsOnDuty] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedAwb, setCopiedAwb] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'delivery_partner') {
      navigate('/delivery/login');
    } else {
      fetchTasks();
      const interval = setInterval(fetchTasks, 6000); // 6s live polling
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchTasks = async (showLoader = false) => {
    if (showLoader) setRefreshing(true);
    try {
      const res = await getDeliveryTasks();
      setTasks(res.data?.data || []);
    } catch (err) {
      console.error('Error fetching driver tasks:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/delivery/login');
  };

  const handleCopyAwb = (awb, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(awb);
    setCopiedAwb(awb);
    setTimeout(() => setCopiedAwb(null), 2000);
  };

  // Metrics
  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter(t => {
    const s = (t.status || '').toLowerCase();
    return s.includes('booked') || s.includes('confirmed') || s.includes('ready') || s.includes('pending') || (!s.includes('picked') && !s.includes('transit') && !s.includes('delivered'));
  }).length;

  const transitTasks = tasks.filter(t => {
    const s = (t.status || '').toLowerCase();
    return s.includes('picked') || s.includes('transit') || s.includes('out for delivery');
  }).length;

  const deliveredTasks = tasks.filter(t => {
    const s = (t.status || '').toLowerCase();
    return s.includes('delivered');
  }).length;

  // Filtered List
  const filteredTasks = tasks.filter(task => {
    const s = (task.status || '').toLowerCase();
    
    // Tab filtering
    if (activeTab === 'pending') {
      if (!(s.includes('booked') || s.includes('confirmed') || s.includes('ready') || s.includes('pending') || (!s.includes('picked') && !s.includes('transit') && !s.includes('delivered')))) {
        return false;
      }
    } else if (activeTab === 'transit') {
      if (!(s.includes('picked') || s.includes('transit') || s.includes('out for delivery'))) {
        return false;
      }
    } else if (activeTab === 'delivered') {
      if (!s.includes('delivered')) return false;
    }

    // Search query filtering
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchAwb = (task.awb || '').toLowerCase().includes(q);
      const matchReceiver = (task.receiver || '').toLowerCase().includes(q);
      const matchSender = (task.sender || '').toLowerCase().includes(q);
      const matchDest = (task.destination || '').toLowerCase().includes(q);
      const matchPhone = (task.receiverPhone || '').includes(q) || (task.senderPhone || '').includes(q);
      return matchAwb || matchReceiver || matchSender || matchDest || matchPhone;
    }

    return true;
  });

  return (
    <div className="apple-app-shell" style={styles.shell}>
      <div className="apple-mobile-device-viewport" style={styles.viewport}>
        {/* Top iOS Header */}
        <header style={styles.header}>
          <div style={styles.driverInfoRow}>
            <div style={styles.avatar}>
              <Truck size={20} color="#ffffff" strokeWidth={2.4} />
            </div>
            <div>
              <div style={styles.driverNameRow}>
                <span style={styles.driverName}>{user?.name || 'Driver Executive'}</span>
                <button
                  type="button"
                  onClick={() => setIsOnDuty(!isOnDuty)}
                  style={{
                    ...styles.dutyBadge,
                    backgroundColor: isOnDuty ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    borderColor: isOnDuty ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)',
                    color: isOnDuty ? '#34d399' : '#f87171'
                  }}
                  title="Toggle Driver Duty Status"
                >
                  <span style={{
                    ...styles.dutyDot,
                    backgroundColor: isOnDuty ? '#10b981' : '#ef4444',
                    boxShadow: isOnDuty ? '0 0 6px #10b981' : '0 0 6px #ef4444'
                  }}></span>
                  <span>{isOnDuty ? 'ON DUTY' : 'OFF DUTY'}</span>
                </button>
              </div>
              <div style={styles.hubLocation}>Sai Logistics • Kadapa & Hyderabad Hub</div>
            </div>
          </div>

          <div style={styles.headerActionBtns}>
            <button
              onClick={() => fetchTasks(true)}
              style={styles.iconBtn}
              title="Sync Tasks"
              disabled={refreshing}
            >
              <RefreshCw size={17} color="#94a3b8" className={refreshing ? 'fa-spin' : ''} />
            </button>
            <button
              onClick={handleLogout}
              style={{ ...styles.iconBtn, color: '#ef4444' }}
              title="Sign Out"
            >
              <Power size={17} color="#f87171" />
            </button>
          </div>
        </header>

        {/* Real-time Order Cockpit Stats Grid */}
        <div style={styles.statsContainer}>
          <div 
            style={{ ...styles.statCard, borderBottom: activeTab === 'all' ? '2px solid #38bdf8' : 'none' }}
            onClick={() => setActiveTab('all')}
          >
            <span style={{ ...styles.statNum, color: '#38bdf8' }}>{totalTasks}</span>
            <span style={styles.statLabel}>ALL ORDERS</span>
          </div>

          <div 
            style={{ ...styles.statCard, borderBottom: activeTab === 'pending' ? '2px solid #f59e0b' : 'none' }}
            onClick={() => setActiveTab('pending')}
          >
            <span style={{ ...styles.statNum, color: '#fbbf24' }}>{pendingTasks}</span>
            <span style={styles.statLabel}>PICKUPS</span>
          </div>

          <div 
            style={{ ...styles.statCard, borderBottom: activeTab === 'transit' ? '2px solid #0284c7' : 'none' }}
            onClick={() => setActiveTab('transit')}
          >
            <span style={{ ...styles.statNum, color: '#38bdf8' }}>{transitTasks}</span>
            <span style={styles.statLabel}>IN TRANSIT</span>
          </div>

          <div 
            style={{ ...styles.statCard, borderBottom: activeTab === 'delivered' ? '2px solid #10b981' : 'none' }}
            onClick={() => setActiveTab('delivered')}
          >
            <span style={{ ...styles.statNum, color: '#34d399' }}>{deliveredTasks}</span>
            <span style={styles.statLabel}>DELIVERED</span>
          </div>
        </div>

        {/* Live Search Bar */}
        <div style={styles.searchRow}>
          <div style={styles.searchWrapper}>
            <Search size={18} color="#64748b" style={styles.searchIcon} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by AWB, customer, city or phone..."
              style={styles.searchInput}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={styles.clearSearchBtn}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Segmented iOS Tabs */}
        <div style={styles.segmentedControl}>
          {[
            { id: 'all', label: `All (${totalTasks})` },
            { id: 'pending', label: `Pickups (${pendingTasks})` },
            { id: 'transit', label: `Transit (${transitTasks})` },
            { id: 'delivered', label: `Done (${deliveredTasks})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                ...styles.segmentedBtn,
                ...(activeTab === tab.id ? styles.segmentedBtnActive : {})
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Task List */}
        <div style={styles.taskListContainer}>
          {loading ? (
            <div style={styles.loadingBox}>
              <RefreshCw size={28} color="#0284c7" className="fa-spin" />
              <span style={styles.loadingText}>Syncing live assignment dispatch...</span>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div style={styles.emptyCard}>
              <Package size={44} color="#475569" strokeWidth={1.5} />
              <div style={styles.emptyTitle}>No Shipments in this Queue</div>
              <div style={styles.emptySub}>
                {searchQuery ? 'No orders match your search keyword.' : 'All tasks in this category are completed or pending assignment.'}
              </div>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={styles.resetFilterBtn}
                >
                  Clear Search Filter
                </button>
              )}
            </div>
          ) : (
            filteredTasks.map((task) => {
              const statusStr = (task.status || '').toLowerCase();
              const isDone = statusStr.includes('delivered');
              const isInTransit = statusStr.includes('transit') || statusStr.includes('out for delivery');
              const isPickup = !isDone && !isInTransit;

              return (
                <div
                  key={task._id || task.awb}
                  style={styles.taskCard}
                  onClick={() => navigate(`/delivery/task/${task.awb}`)}
                >
                  {/* Card Header */}
                  <div style={styles.cardHeaderRow}>
                    <div style={styles.awbBadge}>
                      <span style={styles.awbText}>{task.awb}</span>
                      <button
                        type="button"
                        onClick={(e) => handleCopyAwb(task.awb, e)}
                        style={styles.copyBtn}
                        title="Copy AWB Tracking Code"
                      >
                        {copiedAwb === task.awb ? (
                          <Check size={13} color="#10b981" />
                        ) : (
                          <Copy size={13} color="#94a3b8" />
                        )}
                      </button>
                    </div>

                    <span
                      style={{
                        ...styles.statusTag,
                        backgroundColor: isDone
                          ? 'rgba(16, 185, 129, 0.12)'
                          : isInTransit
                          ? 'rgba(2, 132, 199, 0.14)'
                          : 'rgba(245, 158, 11, 0.14)',
                        color: isDone ? '#34d399' : isInTransit ? '#38bdf8' : '#fbbf24',
                        borderColor: isDone
                          ? 'rgba(16, 185, 129, 0.25)'
                          : isInTransit
                          ? 'rgba(2, 132, 199, 0.3)'
                          : 'rgba(245, 158, 11, 0.3)'
                      }}
                    >
                      <span
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: isDone ? '#10b981' : isInTransit ? '#38bdf8' : '#f59e0b'
                        }}
                      ></span>
                      {task.status || 'Active Task'}
                    </span>
                  </div>

                  {/* Customer & Location */}
                  <div style={styles.partyRow}>
                    <div style={styles.partyBlock}>
                      <span style={styles.partyRole}>CONSIGNEE / RECIPIENT</span>
                      <span style={styles.partyName}>{task.receiver || 'Recipient'}</span>
                      {task.destination && (
                        <div style={styles.addressLine}>
                          <MapPin size={13} color="#ff6b4a" style={{ flexShrink: 0 }} />
                          <span style={styles.addressText}>{task.destination}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Parcel Details info chips */}
                  <div style={styles.infoChipsRow}>
                    <span style={styles.chip}>
                      <Package size={12} color="#94a3b8" />
                      <span>{task.contents || 'Express Courier'}</span>
                    </span>
                    <span style={styles.chip}>
                      <Layers size={12} color="#94a3b8" />
                      <span>{task.source === 'booking' ? 'Customer Self-Booking' : 'Sai Hub Dispatch'}</span>
                    </span>
                  </div>

                  {/* Quick Action Button Suite */}
                  <div style={styles.cardActionsRow} onClick={(e) => e.stopPropagation()}>
                    {task.receiverPhone ? (
                      <a
                        href={`tel:${task.receiverPhone}`}
                        style={styles.quickCallBtn}
                        title={`Call ${task.receiver || 'Customer'}`}
                      >
                        <Phone size={14} color="#34d399" />
                        <span>Call Customer</span>
                      </a>
                    ) : (
                      <a
                        href="tel:+919059949365"
                        style={styles.quickCallBtn}
                        title="Call Hub Dispatch"
                      >
                        <Phone size={14} color="#38bdf8" />
                        <span>Call Dispatch</span>
                      </a>
                    )}

                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(task.destination || 'Hyderabad')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={styles.quickMapBtn}
                      title="Turn-by-turn Navigation via Google Maps"
                    >
                      <Navigation size={14} color="#38bdf8" />
                      <span>GPS Route</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => navigate(`/delivery/task/${task.awb}`)}
                      style={styles.openTaskBtn}
                    >
                      <span>Task Sheet</span>
                      <ChevronRight size={15} color="#ffffff" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Cupertino Floating Quick Launch Dock */}
        <div style={styles.floatingDock}>
          <button
            type="button"
            onClick={() => navigate('/delivery/scan')}
            style={styles.dockScannerBtn}
          >
            <QrCode size={20} color="#ffffff" />
            <span>SCAN AWB BARCODE</span>
          </button>
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
    justifyContent: 'center',
    position: 'relative'
  },
  viewport: {
    width: '100%',
    maxWidth: '440px',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    paddingBottom: '90px', // space for dock
    boxSizing: 'border-box'
  },
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 40,
    background: 'rgba(9, 14, 23, 0.88)',
    backdropFilter: 'blur(25px)',
    WebkitBackdropFilter: 'blur(25px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    padding: '14px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  driverInfoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  avatar: {
    width: '42px',
    height: '42px',
    borderRadius: '13px',
    background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 14px rgba(2, 132, 199, 0.4)'
  },
  driverNameRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  driverName: {
    fontSize: '0.92rem',
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: '-0.01em'
  },
  dutyBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    padding: '3px 8px',
    borderRadius: '14px',
    border: '1px solid',
    fontSize: '0.65rem',
    fontWeight: '800',
    cursor: 'pointer'
  },
  dutyDot: {
    width: '5px',
    height: '5px',
    borderRadius: '50%'
  },
  hubLocation: {
    fontSize: '0.7rem',
    color: '#94a3b8',
    marginTop: '2px'
  },
  headerActionBtns: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  iconBtn: {
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
  statsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '8px',
    padding: '14px 16px',
    backgroundColor: 'rgba(18, 27, 43, 0.5)'
  },
  statCard: {
    padding: '10px 4px',
    borderRadius: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    cursor: 'pointer'
  },
  statNum: {
    fontSize: '1.25rem',
    fontWeight: '800',
    lineHeight: 1
  },
  statLabel: {
    fontSize: '0.62rem',
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: '0.4px'
  },
  searchRow: {
    padding: '10px 16px 6px 16px'
  },
  searchWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    pointerEvents: 'none'
  },
  searchInput: {
    width: '100%',
    padding: '10px 36px 10px 38px',
    borderRadius: '14px',
    backgroundColor: 'rgba(18, 27, 43, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#ffffff',
    fontSize: '0.84rem',
    outline: 'none',
    boxSizing: 'border-box'
  },
  clearSearchBtn: {
    position: 'absolute',
    right: '10px',
    background: 'none',
    border: 'none',
    color: '#94a3b8',
    fontSize: '0.9rem',
    cursor: 'pointer',
    padding: '4px'
  },
  segmentedControl: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '4px',
    padding: '6px 16px 12px 16px'
  },
  segmentedBtn: {
    padding: '7px 4px',
    borderRadius: '10px',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    color: '#94a3b8',
    fontSize: '0.72rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'center'
  },
  segmentedBtnActive: {
    backgroundColor: '#0284c7',
    color: '#ffffff',
    borderColor: '#38bdf8',
    boxShadow: '0 4px 12px rgba(2, 132, 199, 0.4)'
  },
  taskListContainer: {
    padding: '0 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  loadingBox: {
    padding: '40px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px'
  },
  loadingText: {
    fontSize: '0.84rem',
    color: '#94a3b8'
  },
  emptyCard: {
    padding: '40px 20px',
    borderRadius: '20px',
    backgroundColor: 'rgba(18, 27, 43, 0.6)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '8px'
  },
  emptyTitle: {
    fontSize: '1rem',
    fontWeight: '800',
    color: '#f8fafc',
    marginTop: '6px'
  },
  emptySub: {
    fontSize: '0.8rem',
    color: '#94a3b8',
    maxWidth: '280px',
    lineHeight: 1.4
  },
  resetFilterBtn: {
    marginTop: '10px',
    padding: '8px 16px',
    borderRadius: '12px',
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    border: '1px solid rgba(56, 189, 248, 0.3)',
    color: '#38bdf8',
    fontSize: '0.78rem',
    fontWeight: '700',
    cursor: 'pointer'
  },
  taskCard: {
    backgroundColor: 'rgba(18, 27, 43, 0.72)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 10px 28px -6px rgba(0, 0, 0, 0.45)',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    cursor: 'pointer',
    transition: 'transform 0.18s ease, border-color 0.18s ease'
  },
  cardHeaderRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px'
  },
  awbBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: 'rgba(2, 132, 199, 0.12)',
    border: '1px solid rgba(56, 189, 248, 0.25)',
    padding: '4px 8px',
    borderRadius: '10px'
  },
  awbText: {
    fontSize: '0.82rem',
    fontWeight: '800',
    color: '#38bdf8',
    letterSpacing: '0.4px'
  },
  copyBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '2px',
    display: 'flex',
    alignItems: 'center'
  },
  statusTag: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    padding: '4px 9px',
    borderRadius: '12px',
    border: '1px solid',
    fontSize: '0.7rem',
    fontWeight: '700'
  },
  partyRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  partyBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3px'
  },
  partyRole: {
    fontSize: '0.62rem',
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: '0.5px'
  },
  partyName: {
    fontSize: '0.94rem',
    fontWeight: '700',
    color: '#ffffff'
  },
  addressLine: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '5px',
    marginTop: '2px'
  },
  addressText: {
    fontSize: '0.78rem',
    color: '#94a3b8',
    lineHeight: 1.35
  },
  infoChipsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px'
  },
  chip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    padding: '3px 8px',
    borderRadius: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    fontSize: '0.7rem',
    color: '#cbd5e1'
  },
  cardActionsRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1.2fr',
    gap: '6px',
    paddingTop: '6px',
    borderTop: '1px solid rgba(255, 255, 255, 0.06)'
  },
  quickCallBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    padding: '8px 6px',
    borderRadius: '12px',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    border: '1px solid rgba(16, 185, 129, 0.25)',
    color: '#34d399',
    fontSize: '0.74rem',
    fontWeight: '700',
    textDecoration: 'none'
  },
  quickMapBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    padding: '8px 6px',
    borderRadius: '12px',
    backgroundColor: 'rgba(2, 132, 199, 0.12)',
    border: '1px solid rgba(56, 189, 248, 0.25)',
    color: '#38bdf8',
    fontSize: '0.74rem',
    fontWeight: '700',
    textDecoration: 'none'
  },
  openTaskBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    padding: '8px 8px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
    border: 'none',
    color: '#ffffff',
    fontSize: '0.76rem',
    fontWeight: '800',
    cursor: 'pointer'
  },
  floatingDock: {
    position: 'fixed',
    bottom: '16px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: 'calc(100% - 32px)',
    maxWidth: '408px',
    zIndex: 50
  },
  dockScannerBtn: {
    width: '100%',
    padding: '14px 20px',
    borderRadius: '18px',
    background: 'linear-gradient(135deg, #0284c7 0%, #ff6b4a 100%)',
    border: 'none',
    color: '#ffffff',
    fontSize: '0.9rem',
    fontWeight: '800',
    letterSpacing: '0.5px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    boxShadow: '0 12px 30px -4px rgba(2, 132, 199, 0.6)',
    cursor: 'pointer'
  }
};
