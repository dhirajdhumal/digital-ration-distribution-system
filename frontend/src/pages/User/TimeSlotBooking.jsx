import { useState, useEffect } from "react";
import api from "../../services/api";
import "./UserPages.css";

function TimeSlotBooking() {
  const [myBooking, setMyBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMyBooking = async () => {
    try {
      const res = await api.get("/timeslots/my-booking");
      setMyBooking(res.data.booking);
    } catch (err) {
      console.error("Error fetching booking", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBooking();
  }, []);

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading your time slot...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">⏰ My Collection Time Slot</h1>
        <p className="page-subtitle">View your assigned ration collection schedule</p>
      </div>

      <div className="info-box">
        <span className="info-box-icon">ℹ️</span>
        <p className="info-box-text">
          Time slots are assigned by your village admin. You cannot book slots yourself. 
          Please arrive at the scheduled time to collect your rations.
        </p>
      </div>

      {myBooking && myBooking.status === "booked" && myBooking.timeSlotId ? (
        <div className="slot-card">
          <div className="slot-header">
            <h3 style={{ margin: 0, fontSize: '1.25rem' }}>
              ✓ Your Assigned Time Slot
            </h3>
          </div>

          <div className="slot-details-grid">
            <div className="slot-detail-box">
              <div className="slot-detail-label">📅 Collection Date</div>
              <div className="slot-detail-value">
                {new Date(myBooking.timeSlotId.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>

            <div className="slot-detail-box">
              <div className="slot-detail-label">🕐 Time Slot</div>
              <div className="slot-detail-value">
                {myBooking.timeSlotId.startTime} - {myBooking.timeSlotId.endTime}
              </div>
            </div>

            <div className="slot-detail-box">
              <div className="slot-detail-label">📍 Location</div>
              <div className="slot-detail-value">
                {myBooking.timeSlotId.village}
              </div>
            </div>

            <div className="slot-detail-box">
              <div className="slot-detail-label">⏰ Booked On</div>
              <div className="slot-detail-value">
                {new Date(myBooking.bookedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </div>
            </div>
          </div>

          <div className="slot-footer">
            <p className="slot-footer-text">
              <span>✓</span>
              <span>Please arrive at the scheduled time to collect your rations</span>
            </p>
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">📅</div>
          <h3 className="empty-state-title">No Time Slot Assigned</h3>
          <p className="empty-state-text">
            You don't have a time slot assigned yet. Your village admin will assign you a time slot 
            for ration collection. Please check back later or contact your village admin.
          </p>
        </div>
      )}
    </div>
  );
}

export default TimeSlotBooking;
