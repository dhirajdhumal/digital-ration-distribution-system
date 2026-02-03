import { useState, useEffect } from "react";
import api from "../../services/api";
import "./Dashboard.css";

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
    return <div style={{ textAlign: "center", marginTop: "50px" }}>Loading...</div>;
  }

  return (
    <div className="notifications-container">
      <h2 style={{ textAlign: "center", marginTop: "30px" }}>
        My Time Slot Booking
      </h2>

      <div style={{
        backgroundColor: "#e3f2fd",
        padding: "15px",
        borderRadius: "8px",
        marginBottom: "25px",
        textAlign: "center"
      }}>
        <p style={{ margin: 0, color: "#1976d2", fontSize: "14px" }}>
          ℹ️ Time slots are assigned by your village admin. You cannot book slots yourself.
        </p>
      </div>

      {/* Current Booking */}
      {myBooking && myBooking.status === "booked" && myBooking.timeSlotId ? (
        <div style={{
          border: "2px solid #4caf50",
          borderRadius: "12px",
          padding: "25px",
          backgroundColor: "#f9fff9",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
        }}>
          <div style={{
            backgroundColor: "#4caf50",
            color: "white",
            padding: "12px 20px",
            borderRadius: "8px",
            marginBottom: "20px",
            textAlign: "center"
          }}>
            <h3 style={{ margin: 0, fontSize: "18px" }}>
              ✓ Your Assigned Time Slot
            </h3>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "15px",
            marginBottom: "20px"
          }}>
            <div style={{
              padding: "15px",
              backgroundColor: "white",
              borderRadius: "8px",
              border: "1px solid #e0e0e0"
            }}>
              <div style={{ fontSize: "12px", color: "#666", marginBottom: "5px" }}>
                📅 Date
              </div>
              <div style={{ fontSize: "16px", fontWeight: "bold", color: "#2c3e50" }}>
                {new Date(myBooking.timeSlotId.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>

            <div style={{
              padding: "15px",
              backgroundColor: "white",
              borderRadius: "8px",
              border: "1px solid #e0e0e0"
            }}>
              <div style={{ fontSize: "12px", color: "#666", marginBottom: "5px" }}>
                🕐 Time
              </div>
              <div style={{ fontSize: "16px", fontWeight: "bold", color: "#2c3e50" }}>
                {myBooking.timeSlotId.startTime} - {myBooking.timeSlotId.endTime}
              </div>
            </div>

            <div style={{
              padding: "15px",
              backgroundColor: "white",
              borderRadius: "8px",
              border: "1px solid #e0e0e0"
            }}>
              <div style={{ fontSize: "12px", color: "#666", marginBottom: "5px" }}>
                📍 Village
              </div>
              <div style={{ fontSize: "16px", fontWeight: "bold", color: "#2c3e50" }}>
                {myBooking.timeSlotId.village}
              </div>
            </div>
          </div>

          <div style={{
            padding: "15px",
            backgroundColor: "#fff3e0",
            borderRadius: "8px",
            border: "1px solid #ffb74d"
          }}>
            <div style={{ fontSize: "12px", color: "#e65100", marginBottom: "5px" }}>
              ⏰ Booked On
            </div>
            <div style={{ fontSize: "14px", color: "#e65100" }}>
              {new Date(myBooking.bookedAt).toLocaleString('en-US', {
                dateStyle: 'medium',
                timeStyle: 'short'
              })}
            </div>
          </div>

          <div style={{
            marginTop: "20px",
            padding: "15px",
            backgroundColor: "#e8f5e9",
            borderRadius: "8px",
            textAlign: "center"
          }}>
            <p style={{ margin: 0, color: "#2e7d32", fontSize: "14px", fontWeight: "500" }}>
              ✓ Please arrive at the scheduled time to collect your rations
            </p>
          </div>
        </div>
      ) : (
        <div style={{
          border: "2px solid #ff9800",
          borderRadius: "12px",
          padding: "40px",
          backgroundColor: "#fff9f0",
          textAlign: "center"
        }}>
          <div style={{ fontSize: "48px", marginBottom: "15px" }}>
            📅
          </div>
          <h3 style={{ color: "#e65100", marginBottom: "10px" }}>
            No Time Slot Assigned
          </h3>
          <p style={{ color: "#666", marginBottom: "20px" }}>
            You don't have a time slot assigned yet.
          </p>
          <div style={{
            padding: "15px",
            backgroundColor: "white",
            borderRadius: "8px",
            border: "1px solid #ffb74d",
            maxWidth: "500px",
            margin: "0 auto"
          }}>
            <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
              Your village admin will assign you a time slot for ration collection.
              Please check back later or contact your village admin.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default TimeSlotBooking;
