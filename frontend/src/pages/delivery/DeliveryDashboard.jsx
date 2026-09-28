import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { getDeliveryTasks } from '../../services/api';

const DeliveryDashboard = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'pickedup' | 'delivered' | 'cancelled'
  const [isOnDuty, setIsOnDuty] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'delivery_partner') {
      navigate('/delivery/login');
    } else {
      fetchTasks();
      const interval = setInterval(fetchTasks, 5000); // 5-second live task polling
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchTasks = async () => {
    try {
      const res = await getDeliveryTasks();
      setTasks(res.data?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/delivery/login');
  };

  // Metrics Calculation
  const totalTasks = tasks.length;

  const pickedUpTasks = tasks.filter(t =>
    t.status?.toLowerCase().includes('picked up') ||
    t.status?.toLowerCase().includes('pickup')
  ).length;

  const deliveredTasks = tasks.filter(t =>
    t.status?.toLowerCase().includes('delivered')
  ).length;

  const cancelledTasks = tasks.filter(t =>
    t.status?.toLowerCase().includes('cancel') ||
    t.status?.toLowerCase().includes('failed')
  ).length;

  // Tab Filtering
  const filteredTasks = tasks.filter(task => {
    const st = task.status?.toLowerCase() || '';
    if (activeTab === 'pickedup') return st.includes('picked up') || st.includes('pickup');
    if (activeTab === 'delivered') return st.includes('delivered');
    if (activeTab === 'cancelled') return st.includes('cancel') || st.includes('failed');
    return true;
  });

  return (
    <div style={styles.appShell}>
      <div style={styles.appContainer}>
        {/* App Top Header */}
        <header style={styles.header}>
          <div style={styles.driverProfile}>
            <div style={styles.avatarCircle}>
              <i className="fa-solid fa-user-ninja" style={{ fontSize: '1.2rem', color: '#fff' }}></i>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={styles.driverName}>{user?.name || 'Delivery Partner'}</h3>
                <span style={{ ...styles.dutyTag, backgroundColor: isOnDuty ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', color: isOnDuty ? '#10b981' : '#f87171' }}>
                  <i className="fa-solid fa-circle" style={{ fontSize: '6px' }}></i>
                  {isOnDuty ? 'ON DUTY' : 'OFF DUTY'}
                </span>
              </div>
              <span style={styles.driverRole}>Sai Executive Driver</span>
            </div>
          </div>
          <button onClick={handleLogout} style={styles.logoutBtn} title="Sign Out">
            <i className="fa-solid fa-power-off"></i>
          </button>
        </header>

        {/* Real-time Order Metrics Cards Grid */}
        <div style={styles.statsGrid}>
          <div style={{ ...styles.statCard, borderLeft: '3px solid #38bdf8' }}>
            <span style={{ ...styles.statNumber, color: '#38bdf8' }}>{totalTasks}</span>
            <span style={styles.statLabel}>Total Orders</span>
          </div>
          <div style={{ ...styles.statCard, borderLeft: '3px solid #34d399' }}>
            <span style={{ ...styles.statNumber, color: '#34d399' }}>{pickedUpTasks}</span>
            <span style={styles.statLabel}>Picked Up</span>
          </div>
          <div style={{ ...styles.statCard, borderLeft: '3px solid #10b981' }}>
            <span style={{ ...styles.statNumber, color: '#10b981' }}>{deliveredTasks}</span>
            <span style={styles.statLabel}>Delivered</span>
          </div>
          <div style={{ ...styles.statCard, borderLeft: '3px solid #f87171' }}>
            <span style={{ ...styles.statNumber, color: '#f87171' }}>{cancelledTasks}</span>
            <span style={styles.statLabel}>Cancelled</span>
          </div>
        </div>

        {/* Filter Tabs Bar */}
        <div style={styles.tabBar}>
          <button
            style={{ ...styles.tabBtn, ...(activeTab === 'all' ? styles.tabBtnActive : {}) }}
            onClick={() => setActiveTab('all')}
          >
            All ({totalTasks})
          </button>
          <button
            style={{ ...styles.tabBtn, ...(activeTab === 'pickedup' ? styles.tabBtnActive : {}) }}
            onClick={() => setActiveTab('pickedup')}
          >
            Picked Up ({pickedUpTasks})
          </button>
          <button
            style={{ ...styles.tabBtn, ...(activeTab === 'delivered' ? styles.tabBtnActive : {}) }}
            onClick={() => setActiveTab('delivered')}
          >
            Delivered ({deliveredTasks})
          </button>
          <button
            style={{ ...styles.tabBtn, ...(activeTab === 'cancelled' ? styles.tabBtnActive : {}) }}
            onClick={() => setActiveTab('cancelled')}
          >
            Cancelled ({cancelledTasks})
          </button>
        </div>

        {/* Main Task List */}
        <div style={styles.content}>
          {loading ? (
            <div style={styles.loadingState}>
              <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2rem', color: '#ff6b4a' }}></i>
              <p style={{ marginTop: '1rem', color: '#94a3b8' }}>Syncing real-time orders...</p>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div style={styles.emptyState}>
              <i className="fa-solid fa-box-open" style={{ fontSize: '3rem', color: '#475569', marginBottom: '1rem' }}></i>
              <h4 style={{ color: '#f8fafc', margin: '0 0 0.5rem 0' }}>No Orders Found</h4>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0 }}>
                {activeTab === 'pickedup' && 'No picked up orders found yet.'}
                {activeTab === 'delivered' && 'No delivered orders found yet.'}
                {activeTab === 'cancelled' && 'No cancelled orders.'}
                {activeTab === 'all' && 'All clear! Check back soon for new dispatch orders.'}
              </p>
            </div>
          ) : (
            <div style={styles.taskList}>
              {filteredTasks.map(task => {
                const st = task.status?.toLowerCase() || '';
                const isDelivered = st.includes('delivered');
                const isPickedUp = st.includes('picked up') || st.includes('pickup');
                const isCancelled = st.includes('cancel') || st.includes('failed');

                let badgeBg = 'rgba(245, 158, 11, 0.15)';
                let badgeColor = '#fbbf24';
                let badgeBorder = '1px solid rgba(245, 158, 11, 0.3)';

                if (isDelivered) {
                  badgeBg = 'rgba(16, 185, 129, 0.15)';
                  badgeColor = '#34d399';
                  badgeBorder = '1px solid rgba(16, 185, 129, 0.3)';
                } else if (isPickedUp) {
                  badgeBg = 'rgba(56, 189, 248, 0.15)';
                  badgeColor = '#38bdf8';
                  badgeBorder = '1px solid rgba(56, 189, 248, 0.3)';
                } else if (isCancelled) {
                  badgeBg = 'rgba(239, 68, 68, 0.15)';
                  badgeColor = '#f87171';
                  badgeBorder = '1px solid rgba(239, 68, 68, 0.3)';
                }

                return (
                  <div
                    key={task._id || task.awb}
                    style={styles.taskCard}
                    onClick={() => navigate(`/delivery/task/${task.awb}`)}
                  >
                    <div style={styles.taskCardHeader}>
                      <span style={styles.awbBadge}>
                        <i className="fa-solid fa-barcode" style={{ marginRight: '6px', opacity: 0.7 }}></i>
                        {task.awb}
                      </span>
                      <span style={{
                        ...styles.statusBadge,
                        backgroundColor: badgeBg,
                        color: badgeColor,
                        border: badgeBorder
                      }}>
                        {task.status}
                      </span>
                    </div>

                    <h4 style={styles.receiverName}>{task.receiver || 'Recipient'}</h4>

                    <div style={styles.locationRow}>
                      <i className="fa-solid fa-location-dot" style={{ color: '#ff6b4a', marginTop: '3px' }}></i>
                      <span>{task.destination || 'Delivery Address'}</span>
                    </div>

                    <div style={styles.cardFooter}>
                      <span style={styles.tapPrompt}>
                        <i className="fa-solid fa-store" style={{ marginRight: '4px', opacity: 0.6 }}></i>
                        {task.sender || 'Sender'}
                      </span>
                      <i className="fa-solid fa-chevron-right" style={{ fontSize: '0.8rem', color: '#ff6b4a' }}></i>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Bottom Mobile Navigation */}
        <nav style={styles.bottomNav}>
          <div style={styles.navItemActive}>
            <i className="fa-solid fa-list-check" style={{ fontSize: '1.2rem' }}></i>
            <span>Active Orders</span>
          </div>
          <div style={styles.scanFab} onClick={() => navigate('/delivery/scan')} title="Scan AWB Barcode">
            <i className="fa-solid fa-qrcode" style={{ fontSize: '1.4rem' }}></i>
          </div>
          <div style={styles.navItem} onClick={() => alert('GPS Live Tracking active in background')}>
            <i className="fa-solid fa-location-crosshairs" style={{ fontSize: '1.2rem' }}></i>
            <span>GPS Tracking</span>
          </div>
        </nav>
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
    position: 'relative',
    boxShadow: '0 0 40px rgba(0,0,0,0.8)',
    paddingBottom: '85px'
  },
  header: {
    backgroundColor: '#1e293b',
    padding: '1.25rem 1rem 1rem 1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    position: 'sticky',
    top: 0,
    zIndex: 20
  },
  driverProfile: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  avatarCircle: {
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #ff6b4a 0%, #e0481d 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 10px rgba(255, 107, 74, 0.3)'
  },
  driverName: {
    margin: 0,
    fontSize: '0.95rem',
    fontWeight: '700',
    color: '#ffffff'
  },
  driverRole: {
    fontSize: '0.72rem',
    color: '#94a3b8'
  },
  dutyTag: {
    fontSize: '0.65rem',
    fontWeight: '700',
    padding: '0.15rem 0.4rem',
    borderRadius: '12px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px'
  },
  logoutBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    color: '#fca5a5',
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr 1fr',
    gap: '0.4rem',
    padding: '0.85rem 0.75rem'
  },
  statCard: {
    backgroundColor: '#1e293b',
    borderRadius: '10px',
    padding: '0.6rem 0.3rem',
    textAlign: 'center',
    border: '1px solid rgba(255,255,255,0.05)'
  },
  statNumber: {
    display: 'block',
    fontSize: '1.1rem',
    fontWeight: '800',
    color: '#f8fafc'
  },
  statLabel: {
    fontSize: '0.6rem',
    color: '#94a3b8',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.2px'
  },
  tabBar: {
    display: 'flex',
    gap: '0.35rem',
    padding: '0 0.75rem 0.75rem 0.75rem',
    borderBottom: '1px solid rgba(255,255,255,0.05)'
  },
  tabBtn: {
    flex: 1,
    backgroundColor: 'transparent',
    border: 'none',
    color: '#94a3b8',
    padding: '0.5rem 0.2rem',
    borderRadius: '8px',
    fontSize: '0.72rem',
    fontWeight: '700',
    cursor: 'pointer',
    textAlign: 'center'
  },
  tabBtnActive: {
    backgroundColor: '#ff6b4a',
    color: '#ffffff',
    boxShadow: '0 4px 12px rgba(255,107,74,0.3)'
  },
  content: {
    flex: 1,
    padding: '1rem'
  },
  loadingState: {
    textAlign: 'center',
    padding: '3rem 1rem'
  },
  emptyState: {
    textAlign: 'center',
    padding: '3rem 1rem',
    backgroundColor: '#1e293b',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.05)'
  },
  taskList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.85rem'
  },
  taskCard: {
    backgroundColor: '#1e293b',
    borderRadius: '16px',
    padding: '1.1rem',
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
    cursor: 'pointer',
    position: 'relative'
  },
  taskCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.6rem'
  },
  awbBadge: {
    fontSize: '0.8rem',
    fontWeight: '700',
    color: '#38bdf8',
    letterSpacing: '0.5px'
  },
  statusBadge: {
    fontSize: '0.68rem',
    fontWeight: '700',
    padding: '0.2rem 0.55rem',
    borderRadius: '20px'
  },
  receiverName: {
    margin: '0 0 0.4rem 0',
    fontSize: '1rem',
    fontWeight: '700',
    color: '#f8fafc'
  },
  locationRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.5rem',
    fontSize: '0.82rem',
    color: '#cbd5e1',
    lineHeight: 1.4,
    marginBottom: '0.75rem'
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '0.6rem',
    borderTop: '1px solid rgba(255,255,255,0.06)'
  },
  tapPrompt: {
    fontSize: '0.72rem',
    color: '#94a3b8'
  },
  bottomNav: {
    position: 'fixed',
    bottom: 0,
    width: '100%',
    maxWidth: '440px',
    backgroundColor: '#1e293b',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: '0.75rem 0',
    borderTop: '1px solid rgba(255,255,255,0.08)',
    zIndex: 30
  },
  navItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    color: '#64748b',
    fontSize: '0.7rem',
    fontWeight: '600',
    cursor: 'pointer'
  },
  navItemActive: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    color: '#ff6b4a',
    fontSize: '0.7rem',
    fontWeight: '700',
    cursor: 'pointer'
  },
  scanFab: {
    width: '52px',
    height: '52px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #ff6b4a 0%, #e0481d 100%)',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 20px rgba(255, 107, 74, 0.5)',
    marginTop: '-20px',
    cursor: 'pointer',
    border: '3px solid #0f172a'
  }
};

export default DeliveryDashboard;
