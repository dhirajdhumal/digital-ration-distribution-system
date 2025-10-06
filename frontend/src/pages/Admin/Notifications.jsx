import React, { useContext, useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button
} from "@mui/material";
import api from "../../services/api";
import AuthContext from "../../context/authContext";
import "./Notifications.css";

function Notifications() {
  const { user } = useContext(AuthContext);
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationBody, setNotificationBody] = useState("");
  const [message, setMessage] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [editingId, setEditingId] = useState(null); // track current notification being updated

  // Fetch notifications
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

  // Handle create or update
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || user.role !== "admin") {
      setMessage("Only admins can send notifications.");
      return;
    }

    try {
      if (editingId) {
        // Update existing notification
        await api.put(`/admin/notifications/${editingId}`, {
          notificationTitle,
          notificationBody,
        });
        setMessage("Notification updated successfully");
      } else {
        // Create new notification
        await api.post("/admin/notifications", {
          notificationTitle,
          notificationBody,
        });
        setMessage("Notification sent successfully");
      }

      // Reset form
      setNotificationTitle("");
      setNotificationBody("");
      setEditingId(null);
      fetchNotifications(); // refresh list
    } catch (err) {
      console.error(err.response || err);
      setMessage("Failed to save notification");
    }
  };

  // Delete notification
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

  // Populate form for editing
  const handleEdit = (notification) => {
    setNotificationTitle(notification.notificationTitle);
    setNotificationBody(notification.notificationBody);
    setEditingId(notification.notificationId); // use notificationId for backend
    window.scrollTo({ top: 0, behavior: "smooth" }); // scroll to form
  };

  return (
    <>
      {/* Notification Form */}
      <div className="notification-container">
        <h2>{editingId ? "Update Notification" : "Send Notification"}</h2>
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
          <button type="submit">{editingId ? "Update Notification" : "Send Notification"}</button>
          {editingId && (
            <Button
              color="secondary"
              onClick={() => {
                // Cancel editing
                setEditingId(null);
                setNotificationTitle("");
                setNotificationBody("");
              }}
            >
              Cancel
            </Button>
          )}
        </form>
      </div>

      {/* All Notifications */}
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          All Notifications
        </Typography>
        <Grid container spacing={2}>
          {notifications.map((notification) => (
            <Grid item xs={12} md={6} lg={4} key={notification._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {notification.notificationTitle}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {notification.notificationBody}
                  </Typography>

                  {user?.role === "admin" && (
                    <>
                      <Button
                        color="primary"
                        variant="contained"
                        size="small"
                        onClick={() => handleEdit(notification)}
                        style={{ marginTop: "10px", marginRight: "5px" }}
                      >
                        Update
                      </Button>
                      <Button
                        color="error"
                        variant="contained"
                        size="small"
                        onClick={() => confirmDelete(notification.notificationId)}
                        style={{ marginTop: "10px" }}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
}

export default Notifications;
