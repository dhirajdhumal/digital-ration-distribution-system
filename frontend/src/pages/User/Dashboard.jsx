import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../../context/authContext";
import './Dashboard.css';

function Dashboard() {
    const navigate = useNavigate();
    const {user} = useContext(AuthContext);

    return (
        <div className="dashboard-page">
            {/* Header Section */}
            <div className="dashboard-header-section">
                <div className="container">
                    <div className="welcome-banner">
                        <div className="welcome-content">
                            <h1 className="welcome-title">Welcome, {user?.name || "User"}!</h1>
                            <p className="welcome-subtitle">Citizen Dashboard - Public Distribution System</p>
                            <div className="user-badge">
                                <span className="badge-icon">👤</span>
                                <span className="badge-text">Registered Citizen</span>
                                <span className="badge-village">📍 {user?.village || "Village"}</span>
                            </div>
                        </div>
                        <div className="welcome-illustration">
                            <div className="illustration-circle">🌾</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="quick-stats-section">
                <div className="container">
                    <div className="stats-grid-small">
                        <div className="stat-box">
                            <div className="stat-icon">📦</div>
                            <div className="stat-info">
                                <div className="stat-label">Ration Status</div>
                                <div className="stat-value">Active</div>
                            </div>
                        </div>
                        <div className="stat-box">
                            <div className="stat-icon">⏰</div>
                            <div className="stat-info">
                                <div className="stat-label">Collection Slot</div>
                                <div className="stat-value">Assigned</div>
                            </div>
                        </div>
                        <div className="stat-box">
                            <div className="stat-icon">📢</div>
                            <div className="stat-info">
                                <div className="stat-label">Notifications</div>
                                <div className="stat-value">New</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Services */}
            <div className="services-dashboard-section">
                <div className="container">
                    <h2 className="section-heading">Available Services</h2>
                    <div className="services-grid">
                        <div className="service-card-dash" onClick={() => navigate('/user/allocated-rations')}>
                            <div className="service-icon-large">📦</div>
                            <h3 className="service-title">Your Allocated Rations</h3>
                            <p className="service-description">View your allocated ration items and quantities</p>
                            <button className="service-btn">View Rations →</button>
                        </div>

                        <div className="service-card-dash" onClick={() => navigate('/user/timeslot-booking')}>
                            <div className="service-icon-large">⏰</div>
                            <h3 className="service-title">My Collection Slot</h3>
                            <p className="service-description">Check your assigned collection time slot</p>
                            <button className="service-btn">View Slot →</button>
                        </div>

                        <div className="service-card-dash" onClick={() => navigate('/user/complaint')}>
                            <div className="service-icon-large">📝</div>
                            <h3 className="service-title">File Complaint</h3>
                            <p className="service-description">Report any issues regarding ration distribution</p>
                            <button className="service-btn">File Complaint →</button>
                        </div>

                        <div className="service-card-dash" onClick={() => navigate('/user/notification')}>
                            <div className="service-icon-large">📢</div>
                            <h3 className="service-title">Notifications & Schemes</h3>
                            <p className="service-description">View all notifications and government schemes</p>
                            <button className="service-btn">View Notifications →</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Information Section */}
            <div className="info-section">
                <div className="container">
                    <div className="info-grid">
                        <div className="info-card">
                            <h4>📞 Helpline</h4>
                            <p>Toll Free: 1800-XXX-XXXX</p>
                            <p>Available 24/7</p>
                        </div>
                        <div className="info-card">
                            <h4>⏰ Collection Hours</h4>
                            <p>Monday - Saturday</p>
                            <p>9:00 AM - 5:00 PM</p>
                        </div>
                        <div className="info-card">
                            <h4>📍 Distribution Center</h4>
                            <p>{user?.village || "Your Village"}</p>
                            <p>Fair Price Shop</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
