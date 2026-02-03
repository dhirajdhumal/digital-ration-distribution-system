import React, { useState, useEffect, useContext } from "react";
import api from "../../services/api";
import AuthContext from "../../context/authContext";
import "../Admin/AllocateStock.css";

function TimeSlots() {
  const { user } = useContext(AuthContext);
  const [timeSlots, setTimeSlots] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  // Form states for creating time slot
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [maxCapacity, setMaxCapacity] = useState(50);

  // State for assigning users
  const [selectedSlot, setSelectedSlot] = useState("");
  const [selectedUser, setSelectedUser] = useState("");

  // State for editing time slots
  const [editingSlot, setEditingSlot] = useState(null);
  const [editDate, setEditDate] = useState("");
  const [editStartTime, setEditStartTime] = useState("");
  const [editEndTime, setEditEndTime] = useState("");
  const [editMaxCapacity, setEditMaxCapacity] = useState(50);

  const fetchTimeSlots = async () => {
    try {
      const res = await api.get("/timeslots/village");
      setTimeSlots(res.data);
    } catch (err) {
      console.error("Error fetching time slots", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get("/village-admin/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users", err);
    }
  };

  useEffect(() => {
    fetchTimeSlots();
    fetchUsers();
  }, []);

  const handleCreateSlot = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await api.post("/timeslots/create", {
        date,
        startTime,
        endTime,
        maxCapacity: Number(maxCapacity),
        village: user.village,
      });

      setMessage("Time slot created successfully");
      setDate("");
      setStartTime("");
      setEndTime("");
      setMaxCapacity(50);
      await fetchTimeSlots();
      setRefreshKey(prev => prev + 1);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error creating time slot");
    } finally {
      setLoading(false);
    }
  };

  const handleAssignUser = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!selectedSlot || !selectedUser) {
      setMessage("Please select both slot and user");
      return;
    }

    try {
      const res = await api.post("/timeslots/assign", {
        timeSlotId: selectedSlot,
        userId: selectedUser,
      });

      setMessage(res.data.message || "User assigned successfully");
      setSelectedSlot("");
      setSelectedUser("");
      await fetchTimeSlots();
      setRefreshKey(prev => prev + 1);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error assigning user");
    }
  };

  const handleRemoveUser = async (slotId, userId) => {
    if (!window.confirm("Are you sure you want to remove this user from the slot?")) {
      return;
    }

    try {
      const res = await api.post("/timeslots/remove", {
        timeSlotId: slotId,
        userId: userId,
      });

      setMessage(res.data.message || "User removed successfully");
      await fetchTimeSlots();
      setRefreshKey(prev => prev + 1);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error removing user");
    }
  };

  const handleDeleteSlot = async (id) => {
    if (!window.confirm("Are you sure you want to delete this time slot?")) {
      return;
    }

    try {
      await api.delete(`/timeslots/${id}`);
      setMessage("Time slot deleted successfully");
      await fetchTimeSlots();
      setRefreshKey(prev => prev + 1);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error deleting time slot");
    }
  };

  const handleEditSlot = (slot) => {
    setEditingSlot(slot._id);
    setEditDate(new Date(slot.date).toISOString().split('T')[0]);
    setEditStartTime(slot.startTime);
    setEditEndTime(slot.endTime);
    setEditMaxCapacity(slot.maxCapacity);
  };

  const handleCancelEdit = () => {
    setEditingSlot(null);
    setEditDate("");
    setEditStartTime("");
    setEditEndTime("");
    setEditMaxCapacity(50);
  };

  const handleUpdateSlot = async (slotId) => {
    setMessage("");

    try {
      await api.put(`/timeslots/${slotId}`, {
        date: editDate,
        startTime: editStartTime,
        endTime: editEndTime,
        maxCapacity: Number(editMaxCapacity),
      });

      setMessage("Time slot updated successfully");
      handleCancelEdit();
      // Clear selected slot to force dropdown refresh
      setSelectedSlot("");
      await fetchTimeSlots();
      // Force re-render of dropdown
      setRefreshKey(prev => prev + 1);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error updating time slot");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#4caf50';
      case 'full': return '#ff9800';
      case 'completed': return '#2196f3';
      case 'cancelled': return '#f44336';
      default: return '#666';
    }
  };

  // Get list of users who already have active bookings
  const getBookedUserIds = () => {
    const bookedIds = new Set();
    timeSlots.forEach(slot => {
      if (slot.bookedBy && slot.bookedBy.length > 0) {
        slot.bookedBy.forEach(booking => {
          if (booking.user && booking.user._id) {
            bookedIds.add(booking.user._id);
          }
        });
      }
    });
    return bookedIds;
  };

  // Filter users to show only those without active bookings
  const getAvailableUsers = () => {
    const bookedUserIds = getBookedUserIds();
    return users.filter(u => !bookedUserIds.has(u._id));
  };

  const availableUsers = getAvailableUsers();

  return (
    <div className="allocate-stock-container">
      {/* Create Time Slot */}
      <div className="card">
        <h2>Create Time Slot for {user?.village}</h2>

        {message && (
          <div
            className={`alert ${
              message.toLowerCase().includes("success") ? "success" : "error"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleCreateSlot} className="form">
          <label>
            Date:
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              disabled={loading}
              required
            />
          </label>

          <label>
            Start Time:
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              disabled={loading}
              required
            />
          </label>

          <label>
            End Time:
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              disabled={loading}
              required
            />
          </label>

          <label>
            Max Capacity:
            <input
              type="number"
              value={maxCapacity}
              onChange={(e) => setMaxCapacity(e.target.value)}
              min={1}
              disabled={loading}
              required
            />
          </label>

          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Time Slot"}
          </button>
        </form>
      </div>

      {/* Assign User to Slot */}
      <div className="card" style={{ marginTop: "30px" }}>
        <h2>Assign User to Time Slot</h2>
        
        {availableUsers.length === 0 && users.length > 0 && (
          <p style={{ color: "#ff9800", marginBottom: "15px" }}>
            ⚠️ All users have been assigned to time slots. Remove a user from a slot to reassign them.
          </p>
        )}

        <form onSubmit={handleAssignUser} className="form">
          <label>
            Select Time Slot:
            <select
              key={refreshKey}
              value={selectedSlot}
              onChange={(e) => setSelectedSlot(e.target.value)}
              required
            >
              <option value="">Select a time slot</option>
              {timeSlots
                .filter(slot => slot.status === 'active' && slot.currentBookings < slot.maxCapacity)
                .map((slot) => (
                  <option key={slot._id} value={slot._id}>
                    {new Date(slot.date).toLocaleDateString()} - {slot.startTime} to {slot.endTime} 
                    ({slot.currentBookings}/{slot.maxCapacity})
                  </option>
                ))}
            </select>
          </label>

          <label>
            Select User ({availableUsers.length} available):
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              required
              disabled={availableUsers.length === 0}
            >
              <option value="">
                {availableUsers.length === 0 ? "No users available" : "Select a user"}
              </option>
              {availableUsers.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name}
                </option>
              ))}
            </select>
          </label>

          <button type="submit" disabled={availableUsers.length === 0}>
            Assign User to Slot
          </button>
        </form>
      </div>

      {/* All Time Slots */}
      <div className="card" style={{ marginTop: "30px" }}>
        <h2>All Time Slots for {user?.village}</h2>
        {timeSlots.length === 0 ? (
          <p>No time slots created yet.</p>
        ) : (
          timeSlots.map((slot) => (
            <div
              key={slot._id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "20px",
                marginBottom: "20px",
                backgroundColor: editingSlot === slot._id ? "#fff9e6" : "#f9f9f9",
              }}
            >
              {editingSlot === slot._id ? (
                // Edit Mode
                <div>
                  <h3 style={{ marginBottom: "20px", color: "#ff9800" }}>
                    ✏️ Editing Time Slot
                  </h3>
                  <div style={{ display: "grid", gap: "15px", marginBottom: "20px" }}>
                    <label style={{ display: "flex", flexDirection: "column" }}>
                      <strong>Date:</strong>
                      <input
                        type="date"
                        value={editDate}
                        onChange={(e) => setEditDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        style={{ padding: "8px", marginTop: "5px", borderRadius: "4px", border: "1px solid #ddd" }}
                      />
                    </label>
                    <label style={{ display: "flex", flexDirection: "column" }}>
                      <strong>Start Time:</strong>
                      <input
                        type="time"
                        value={editStartTime}
                        onChange={(e) => setEditStartTime(e.target.value)}
                        style={{ padding: "8px", marginTop: "5px", borderRadius: "4px", border: "1px solid #ddd" }}
                      />
                    </label>
                    <label style={{ display: "flex", flexDirection: "column" }}>
                      <strong>End Time:</strong>
                      <input
                        type="time"
                        value={editEndTime}
                        onChange={(e) => setEditEndTime(e.target.value)}
                        style={{ padding: "8px", marginTop: "5px", borderRadius: "4px", border: "1px solid #ddd" }}
                      />
                    </label>
                    <label style={{ display: "flex", flexDirection: "column" }}>
                      <strong>Max Capacity:</strong>
                      <input
                        type="number"
                        value={editMaxCapacity}
                        onChange={(e) => setEditMaxCapacity(e.target.value)}
                        min={slot.currentBookings}
                        style={{ padding: "8px", marginTop: "5px", borderRadius: "4px", border: "1px solid #ddd" }}
                      />
                      <small style={{ color: "#666", marginTop: "5px" }}>
                        Minimum: {slot.currentBookings} (current bookings)
                      </small>
                    </label>
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      onClick={() => handleUpdateSlot(slot._id)}
                      style={{
                        padding: "10px 20px",
                        backgroundColor: "#4caf50",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontWeight: "600",
                      }}
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      style={{
                        padding: "10px 20px",
                        backgroundColor: "#666",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                    <div>
                      <h3 style={{ margin: "0 0 10px 0" }}>
                        {new Date(slot.date).toLocaleDateString()} - {slot.startTime} to {slot.endTime}
                      </h3>
                      <p style={{ margin: "5px 0" }}>
                        <strong>Capacity:</strong> {slot.currentBookings}/{slot.maxCapacity}
                      </p>
                      <span
                        style={{
                          padding: "4px 12px",
                          borderRadius: "4px",
                          backgroundColor: getStatusColor(slot.status),
                          color: "white",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}
                      >
                        {slot.status}
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button
                        onClick={() => handleEditSlot(slot)}
                        style={{
                          padding: "8px 16px",
                          backgroundColor: "#2196f3",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteSlot(slot._id)}
                        style={{
                          padding: "8px 16px",
                          backgroundColor: "#f44336",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                        disabled={slot.currentBookings > 0}
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Booked Users */}
                  {slot.bookedBy && slot.bookedBy.length > 0 && (
                    <div style={{ marginTop: "15px" }}>
                      <h4 style={{ marginBottom: "10px" }}>Booked Users:</h4>
                      <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                          <thead>
                            <tr style={{ backgroundColor: "#e3f2fd" }}>
                              <th style={{ padding: "10px", textAlign: "left", borderBottom: "2px solid #2196f3" }}>Name</th>
                              <th style={{ padding: "10px", textAlign: "left", borderBottom: "2px solid #2196f3" }}>Email</th>
                              <th style={{ padding: "10px", textAlign: "left", borderBottom: "2px solid #2196f3" }}>Booked At</th>
                              <th style={{ padding: "10px", textAlign: "left", borderBottom: "2px solid #2196f3" }}>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {slot.bookedBy.map((booking) => (
                              <tr key={booking._id} style={{ borderBottom: "1px solid #eee" }}>
                                <td style={{ padding: "10px" }}>{booking.user?.name || "N/A"}</td>
                                <td style={{ padding: "10px" }}>{booking.user?.email || "N/A"}</td>
                                <td style={{ padding: "10px" }}>
                                  {new Date(booking.bookedAt).toLocaleString()}
                                </td>
                                <td style={{ padding: "10px" }}>
                                  <button
                                    onClick={() => handleRemoveUser(slot._id, booking.user._id)}
                                    style={{
                                      padding: "4px 12px",
                                      backgroundColor: "#ff9800",
                                      color: "white",
                                      border: "none",
                                      borderRadius: "4px",
                                      cursor: "pointer",
                                      fontSize: "12px",
                                    }}
                                  >
                                    Remove
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default TimeSlots;
