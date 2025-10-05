import React, { useContext, useState } from "react";
import api from "../../services/api";
import AuthContext from "../../context/authContext";
import "./Notifications.css";

function Notifications() {
  const { user } = useContext(AuthContext);
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationBody, setNotificationBody] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || user.role !== "admin") {
      setMessage("Only admins can send notifications.");
      return;
    }

    try {
      await api.post("/admin/notifications", {
        notificationTitle,
        notificationBody,
      });
      setMessage("Notification sent successfully");
      setNotificationTitle("");
      setNotificationBody("");
    } catch (err) {
      console.error(err.response || err);
      setMessage("Failed to send notification");
    }
  };

  return (
    <div className="notification-container">
      <h2>Send Notification</h2>
      {message && (
        <p
          className={`message ${
            message.includes("successfully") ? "success" : "error"
          }`}
        >
          {message}
        </p>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title:</label>
          <input
            type="text"
            value={notificationTitle}
            onChange={(e) => setNotificationTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Body:</label>
          <textarea
            value={notificationBody}
            onChange={(e) => setNotificationBody(e.target.value)}
            required
          />
        </div>
        <button type="submit">Send Notification</button>
      </form>
    </div>
  );
}

export default Notifications;
