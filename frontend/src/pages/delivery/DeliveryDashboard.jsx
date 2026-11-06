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
    position: 'relative',
    paddingBottom: '90px'
  },
  header: {
    backgroundColor: '#111111',
    padding: '1.5rem 1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '4px solid #333333',
    position: 'sticky',
    top: 0,
    zIndex: 20
  },
  driverProfile: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  avatarCircle: {
    width: '48px',
    height: '48px',
    backgroundColor: '#FF5000', // Flat safety orange
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px' // Boxy
  },
  driverName: {
    margin: 0,
    fontSize: '1.1rem',
    fontWeight: '900',
    color: '#FFFFFF',
    textTransform: 'uppercase'
  },
  driverRole: {
    fontSize: '0.8rem',
    color: '#AAAAAA',
    fontWeight: '700',
    textTransform: 'uppercase'
  },
  dutyTag: {
    fontSize: '0.75rem',
    fontWeight: '900',
    padding: '2px 6px',
    borderRadius: '2px', // Boxy
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px'
  },
  logoutBtn: {
    backgroundColor: '#FF0000', // Flat pure red
    border: 'none',
    color: '#FFFFFF',
    width: '44px', // Bigger touch target
    height: '44px',
    borderRadius: '4px', // Boxy
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '1.2rem'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr 1fr',
    gap: '0.5rem',
    padding: '1rem'
  },
  statCard: {
    backgroundColor: '#111111',
    padding: '1rem 0.5rem',
    textAlign: 'center',
    border: '2px solid #333333'
  },
  statNumber: {
    display: 'block',
    fontSize: '1.4rem',
    fontWeight: '900',
    color: '#FFFFFF'
  },
  statLabel: {
    fontSize: '0.7rem',
    color: '#AAAAAA',
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  tabBar: {
    display: 'flex',
    gap: '0.5rem',
    padding: '0 1rem 1rem 1rem',
    borderBottom: '4px solid #333333',
    overflowX: 'auto'
  },
  tabBtn: {
    flex: '0 0 auto',
    backgroundColor: '#111111',
    border: '2px solid #333333',
    color: '#AAAAAA',
    padding: '0.75rem 1rem',
    fontSize: '0.9rem',
    fontWeight: '800',
    cursor: 'pointer',
    textAlign: 'center',
    textTransform: 'uppercase'
  },
  tabBtnActive: {
    backgroundColor: '#FF5000',
    border: '2px solid #FF5000',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: '1rem'
  },
  loadingState: {
    textAlign: 'center',
    padding: '4rem 1rem'
  },
  emptyState: {
    textAlign: 'center',
    padding: '4rem 1rem',
    backgroundColor: '#111111',
    border: '2px dashed #555555'
  },
  taskList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  taskCard: {
    backgroundColor: '#111111',
    padding: '1.5rem',
    border: '3px solid #333333', // Chunky border
    cursor: 'pointer',
    position: 'relative'
  },
  taskCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    borderBottom: '2px solid #333333',
    paddingBottom: '0.5rem'
  },
  awbBadge: {
    fontSize: '1.2rem',
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: '1px'
  },
  statusBadge: {
    fontSize: '0.85rem',
    fontWeight: '900',
    padding: '0.3rem 0.6rem',
    textTransform: 'uppercase',
    border: '2px solid'
  },
  receiverName: {
    margin: '0 0 0.5rem 0',
    fontSize: '1.2rem',
    fontWeight: '800',
    color: '#FFFFFF',
    textTransform: 'uppercase'
  },
  locationRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.5rem',
    fontSize: '1rem',
    color: '#CCCCCC',
    lineHeight: 1.5,
    marginBottom: '1rem',
    fontWeight: '700'
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '1rem',
    borderTop: '2px solid #333333'
  },
  tapPrompt: {
    fontSize: '0.9rem',
    color: '#AAAAAA',
    fontWeight: '800',
    textTransform: 'uppercase'
  },
  bottomNav: {
    position: 'fixed',
    bottom: 0,
    width: '100%',
    maxWidth: '440px',
    backgroundColor: '#000000',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: '1rem 0',
    borderTop: '4px solid #333333',
    zIndex: 30
  },
  navItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    color: '#555555',
    fontSize: '0.8rem',
    fontWeight: '800',
    cursor: 'pointer',
    textTransform: 'uppercase'
  },
  navItemActive: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    color: '#FFFFFF',
    fontSize: '0.8rem',
    fontWeight: '900',
    cursor: 'pointer',
    textTransform: 'uppercase'
  },
  scanFab: {
    width: '64px',
    height: '64px',
    backgroundColor: '#FF5000', // Flat safety orange
    color: '#000000', // Max contrast
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '-32px',
    cursor: 'pointer',
    border: '4px solid #000000',
    borderRadius: '4px' // Boxy industrial
  }
};

export default DeliveryDashboard;
