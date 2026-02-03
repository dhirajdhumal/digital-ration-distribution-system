import React, { useState, useEffect } from "react";
import api from "../../services/api";
import "./Notification.css";

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

  return (
    <div className="notifications-container">
      <div className="notification-list">
        <h3>Your Notifications</h3>
        {loading ? (
          <p>Loading notifications...</p>
        ) : notifications.length === 0 ? (
          <p>No notifications yet.</p>
        ) : (
          notifications.map((notification) => (
            <div key={notification._id} className="notification-card">
              <h4>{notification.notificationTitle}</h4>
              <p>{notification.notificationBody}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Notification;
