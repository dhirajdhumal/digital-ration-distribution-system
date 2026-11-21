import React, { useContext, useState, useEffect } from "react";
import api from "../../services/api";
import AuthContext from "../../context/authContext";
import "./UserPages.css";

function Complaint() {
  const { user } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchComplaints = async () => {
    try {
      const res = await api.get("/user/complaints/my");
      setComplaints(res.data);
    } catch (err) {
      console.error("Error fetching Complaints", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/user/complaints", {
        title,
        description,
      });
      setTitle("");
      setDescription("");
      fetchComplaints();
    } catch (err) {
      console.error(err.response || err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">📝 File a Complaint</h1>
        <p className="page-subtitle">Report any issues regarding ration distribution</p>
      </div>

      {/* Complaint Form */}
      <div className="form-section">
        <h3 className="form-section-title">
          <span>✍️</span>
          <span>Submit New Complaint</span>
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="title">Complaint Subject *</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Enter complaint subject"
              />
            </div>

            <div className="form-field">
              <label htmlFor="description">Complaint Description *</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder="Describe your complaint in detail"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-submit" disabled={submitting}>
              {submitting ? (
                <>
                  <span className="loading-spinner" style={{width: '16px', height: '16px', display: 'inline-block', marginRight: '0.5rem'}}></span>
                  Submitting...
                </>
              ) : (
                'Submit Complaint'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Complaints List */}
      <div className="content-card">
        <h3 className="form-section-title">
          <span>📋</span>
          <span>Your Complaints</span>
        </h3>
        
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p className="loading-text">Loading your complaints...</p>
          </div>
        ) : complaints.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📝</div>
            <h3 className="empty-state-title">No Complaints Filed</h3>
            <p className="empty-state-text">
              You haven't filed any complaints yet. Use the form above to submit a complaint.
            </p>
          </div>
        ) : (
          <div className="items-list">
            {complaints.map((complaint) => (
              <div key={complaint._id} className="item-card">
                <div className="item-header">
                  <h4 className="item-title">{complaint.title}</h4>
                  <span className={`item-badge badge-${complaint.status}`}>
                    {complaint.status === "resolved" ? "✓ Resolved" : "⏳ Pending"}
                  </span>
                </div>
                
                <p className="item-content">{complaint.description}</p>
                
                <div className="item-meta">
                  <div className="meta-item">
                    <span>📅</span>
                    <span>Submitted: {new Date(complaint.createdAt).toLocaleDateString()}</span>
                  </div>
                  {complaint.resolvedAt && (
                    <div className="meta-item">
                      <span>✓</span>
                      <span>Resolved: {new Date(complaint.resolvedAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Complaint;
