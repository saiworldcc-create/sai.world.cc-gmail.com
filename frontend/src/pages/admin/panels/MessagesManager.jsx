export default function MessagesManager() {
  return (
    <div className="admin-panel-content">
      <div className="admin-editor-header">
        <h2 className="admin-editor-title"><i className="fa-solid fa-envelope"></i> Contact Messages</h2>
      </div>
      <div className="admin-info-box">
        <i className="fa-solid fa-circle-info"></i>
        <div>Contact enquiries submitted via the <strong>Contact Page</strong> are saved to the <code>contactmessages</code> MongoDB collection. Add <code>GET /api/v1/contact</code> (admin-protected) to view them here.</div>
      </div>
      <div className="admin-coming-soon">
        <i className="fa-solid fa-envelope-open-text" style={{ fontSize: '3rem', color: 'var(--accent-coral)', marginBottom: '1rem' }}></i>
        <h3>Messages Inbox</h3>
        <p>All contact form submissions are stored in MongoDB. Connect the messages API to view, reply, and manage customer enquiries here.</p>
      </div>
    </div>
  );
}
