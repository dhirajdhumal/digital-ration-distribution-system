import React, { useContext, useState, useEffect } from "react";
import api from "../../services/api";
import AuthContext from "../../context/authContext";
import "./Notifications.css";

function Notifications() {
  const { user } = useContext(AuthContext);
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationBody, setNotificationBody] = useState("");
  const [message, setMessage] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // Fetch all notifications
  const fetchNotifications = async () => {
    try {
      const res = await api.get("/admin/notifications");
      setNotifications(res.data);
    } catch (err) {
      console.error("Error fetching notifications", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Create or update
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || user.role !== "admin") {
      setMessage("Only admins can send notifications.");
      return;
    }

    try {
      if (editingId) {
        await api.put(`/admin/notifications/${editingId}`, {
          notificationTitle,
          notificationBody,
        });
        setMessage("Notification updated successfully");
      } else {
        await api.post("/admin/notifications", {
          notificationTitle,
          notificationBody,
        });
        setMessage("Notification sent successfully");
      }

      setNotificationTitle("");
      setNotificationBody("");
      setEditingId(null);
      fetchNotifications();
    } catch (err) {
      console.error(err.response || err);
      setMessage("Failed to save notification");
    }
  };

  // Delete
  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/notifications/${id}`);
      setMessage("Notification deleted successfully");
      fetchNotifications();
    } catch (err) {
      console.error(err.response || err);
      setMessage("Failed to delete notification");
    }
  };

  const confirmDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this notification?")) {
      handleDelete(id);
    }
  };

  // Edit existing
  const handleEdit = (notification) => {
    setNotificationTitle(notification.notificationTitle);
    setNotificationBody(notification.notificationBody);
    setEditingId(notification.notificationId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="notifications-container">
      {/* Notification Form */}
      <div className="notification-form">
        <h2>{editingId ? "Update Notification" : "Send Notification"}</h2>

        {message && (
          <div
            className={`alert ${
              message.includes("successfully") ? "success" : "error"
            }`}
          >
            {message}
            <button
              className="close-btn"
              onClick={() => setMessage("")}
            >
              ✕
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title:</label>
            <input
              type="text"
              value={notificationTitle}
              onChange={(e) => setNotificationTitle(e.target.value)}
              required
              placeholder="Enter notification title"
            />
          </div>

          <div className="form-group">
            <label>Body:</label>
            <textarea
              value={notificationBody}
              onChange={(e) => setNotificationBody(e.target.value)}
              required
              placeholder="Enter notification body"
            />
          </div>

          <div className="form-actions">
            <button type="submit">
              {editingId ? "Update Notification" : "Send Notification"}
            </button>
            {editingId && (
              <button
                type="button"
                className="cancel-btn"
                onClick={() => {
                  setEditingId(null);
                  setNotificationTitle("");
                  setNotificationBody("");
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* All Notifications */}
      <div className="notification-list">
        <h3>All Notifications</h3>


        {notifications.length === 0 ? (
          <p>No notifications found.</p>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification._id}
              className="notification-card"
            >
              <h4>{notification.notificationTitle}</h4>
              <p>{notification.notificationBody}</p>

              {user?.role === "admin" && (
                <div className="notification-actions">
                  <button
                    className="update-btn"
                    onClick={() => handleEdit(notification)}
                  >
                    Update
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() =>
                      confirmDelete(notification.notificationId)
                    }
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Notifications;
