import React, { useState, useEffect } from "react";
import api from "../../services/api";
import "./Complaints.css";

function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComplaints = async () => {
    try {
      const res = await api.get("/admin/complaints");
      setComplaints(res.data);
    } catch (err) {
      console.error("Error fetching complaints", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleStatusChange = async (complaintId, newStatus) => {
    try {
      await api.put(`/admin/complaints/${complaintId}/status`, {
        status: newStatus,
      });
      fetchComplaints();
    } catch (err) {
      console.error("Error updating complaint status", err);
    }
  };

  return (
    <div className="notifications-container">
      <div className="notification-list">
        <h3>Users Complaints</h3>
        {loading ? (
          <p>Loading Complaints...</p>
        ) : complaints.length === 0 ? (
          <p>No Complaints yet.</p>
        ) : (
          complaints.map((complaint) => (
            <div key={complaint._id} className="notification-card">
              <h4>{complaint.title}</h4>
              <p>{complaint.description}</p>
              {complaint.user && (
                <p className="complaint-user">
                  <strong>Username - </strong> {complaint.user.name} ({complaint.user.email}) 
                </p>
              )}
              <p>
                <strong>Status: </strong>
                <span
                  style={{
                    color: complaint.status === "resolved" ? "green" : "orange",
                    fontWeight: "bold",
                  }}
                >
                  {complaint.status}
                </span>
              </p>
              <div className="complaint-actions">
                {complaint.status === "pending" && (
                  <button
                    className="resolve-btn"
                    onClick={() => handleStatusChange(complaint._id, "resolved")}
                  >
                    Mark as Resolved
                  </button>
                )}
                {complaint.status === "resolved" && (
                  <button
                    className="pending-btn"
                    onClick={() => handleStatusChange(complaint._id, "pending")}
                  >
                    Mark as Pending
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Complaints;