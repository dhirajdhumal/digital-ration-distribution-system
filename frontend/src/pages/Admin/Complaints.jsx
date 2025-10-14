import React, { useState, useEffect } from "react";
import api from "../../services/api";
import "./Complaints.css";

function Complaints() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/admin/complaints");
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
        <h3>Users Complaints</h3>
        {loading ? (
          <p>Loading Complaints...</p>
        ) : notifications.length === 0 ? (
          <p>No Complaints yet.</p>
        ) : (
          notifications.map((notification) => (
            <div key={notification._id} className="notification-card">
              <h4>{notification.title}</h4>
              <p>{notification.description}</p>
              {notification.user && (
                <p className="complaint-user">
                  <strong>Username - </strong> {notification.user.name} ({notification.user.email}) ({notification.user.role})
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Complaints;