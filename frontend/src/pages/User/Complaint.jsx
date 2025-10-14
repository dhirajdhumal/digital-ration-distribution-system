import React, { useContext, useState, useEffect } from "react";
import api from "../../services/api";
import AuthContext from "../../context/authContext";
import "./Complaint.css";

function Complaint() {
  const { user } = useContext(AuthContext);
  const [title, setTittle] = useState("");
  const [description, setDescription] = useState("");
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComplaints = async () => {
    try {
      const res = await api.get("/user/complaints/my");
      setComplaints(res.data);
    } catch (err) {
      console.error9("Error fetching Complaints", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/user/complaints", {
        title,
        description,
      });
      setTittle("");
      setDescription("");
      fetchComplaints();
    } catch (err) {
      console.error(err.response || err);
    }
  };

  return (
    <div className="notifications-container">
      <div className="notification-form">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Complaint Sub</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTittle(e.target.value)}
              required
              placeholder="Enter Complaint Sub here"
            />
          </div>
          <div className="form-group">
            <label>Complaint Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Discribe Your Complaint Here"
            />
          </div>

          <div className="form-action">
            <button type="submit">Submit Complaint</button>
          </div>
        </form>
      </div>

      <div className="notification-list">
        <h3>Your Complaints</h3>
        {loading ? (
          <p>Loading Complaints...</p>
        ) : complaints.length === 0 ? (
          <p>No complaints yet.</p>
        ) : (
          complaints.map((complaint) => (
            <div key={complaint._id} className="notification-card">
              <h4>{complaint.title}</h4>
              <p>{complaint.description}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Complaint;
