import React, { useState, useEffect } from "react";
import api from "../../services/api";
import "./UserPages.css";

function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/user/notifications");
      setNotifications(res.data);
    } catch (err) {
      console.error("Error fetching notifications", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAllRead = async () => {
  try {
    await api.post("/user/notifications/mark-all-read");

    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) => ({
        ...notification,
        isRead: true,
      }))
    );
  } catch (err) {
    console.error(
      "Error marking all notifications as read:",
      err.response?.data || err.message
    );
  }
};

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">📢 Notifications & Schemes</h1>
        <p className="page-subtitle">Stay updated with latest announcements and government schemes</p>
      </div>

      <div className="content-card">
        <h3 className="form-section-title">
          <span>📬</span>
          <span>All Notifications {notifications.length}</span>
        </h3>
        
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p className="loading-text">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📢</div>
            <h3 className="empty-state-title">No Notifications</h3>
            <p className="empty-state-text">
              You don't have any notifications yet. Check back later for updates and announcements.
            </p>
          </div>
        ) : (
          <div className="items-list">
            <div>
              <button className="mark-all-read-btn" onClick={markAllRead}>
                Mark All as Read
              </button>
            </div>
            {notifications.map((notification) => (
              <div key={notification._id} className="item-card">
                <div className="item-header">
                  <h4 className="item-title">{notification.notificationTitle}</h4>
                  <span className="item-badge badge-success">
                    📢 Announcement
                  </span>
                </div>
                
                <p className="item-content">{notification.notificationBody}</p>
                
                <div className="item-meta">
                  <div className="meta-item">
                    <span>📅</span>
                    <span>Posted: {new Date(notification.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="meta-item">
                    <span>🕐</span>
                    <span>{new Date(notification.createdAt).toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Notification;
