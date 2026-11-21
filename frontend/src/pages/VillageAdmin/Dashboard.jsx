import './Dashboard.css';  
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../../context/authContext'; 

function Dashboard() {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    return (
        <div className="dashboard-page village-admin-page">
            {/* Header Section */}
            <div className="dashboard-header-section admin-header">
                <div className="container">
                    <div className="welcome-banner">
                        <div className="welcome-content">
                            <h1 className="welcome-title">Welcome, {user?.name || "Village Admin"}!</h1>
                            <p className="welcome-subtitle">Village Administrator Dashboard</p>
                            <div className="user-badge admin-badge">
                                <span className="badge-icon">🏘️</span>
                                <span className="badge-text">Village Admin</span>
                                <span className="badge-village">📍 {user?.village || "Village"}</span>
                            </div>
                        </div>
                        <div className="welcome-illustration">
                            <div className="illustration-circle admin-circle">⚙️</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="quick-stats-section">
                <div className="container">
                    <div className="stats-grid-small">
                        <div className="stat-box admin-stat">
                            <div className="stat-icon">👥</div>
                            <div className="stat-info">
                                <div className="stat-label">Total Users</div>
                                <div className="stat-value">Active</div>
                            </div>
                        </div>
                        <div className="stat-box admin-stat">
                            <div className="stat-icon">📦</div>
                            <div className="stat-info">
                                <div className="stat-label">Stock Status</div>
                                <div className="stat-value">Available</div>
                            </div>
                        </div>
                        <div className="stat-box admin-stat">
                            <div className="stat-icon">⏰</div>
                            <div className="stat-info">
                                <div className="stat-label">Time Slots</div>
                                <div className="stat-value">Managed</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Services */}
            <div className="services-dashboard-section">
                <div className="container">
                    <h2 className="section-heading">Administrative Functions</h2>
                    <div className="services-grid admin-services">
                        <div className="service-card-dash admin-card" onClick={() => navigate('/village-admin/allocate-stock')}>
                            <div className="service-icon-large">📦</div>
                            <h3 className="service-title">Distribute Rations</h3>
                            <p className="service-description">Allocate stock items to registered users in your village</p>
                            <button className="service-btn admin-btn">Allocate Stock →</button>
                        </div>

                        <div className="service-card-dash admin-card" onClick={() => navigate('/village-admin/allocation-records')}>
                            <div className="service-icon-large">📊</div>
                            <h3 className="service-title">Allocation Records</h3>
                            <p className="service-description">View complete allocation history and distribution records</p>
                            <button className="service-btn admin-btn">View Records →</button>
                        </div>

                        <div className="service-card-dash admin-card" onClick={() => navigate('/village-admin/timeslots')}>
                            <div className="service-icon-large">⏰</div>
                            <h3 className="service-title">Manage Time Slots</h3>
                            <p className="service-description">Create collection slots and assign users to time slots</p>
                            <button className="service-btn admin-btn">Manage Slots →</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Admin Guidelines */}
            <div className="info-section admin-info">
                <div className="container">
                    <h3 className="info-section-title">Administrator Guidelines</h3>
                    <div className="info-grid">
                        <div className="info-card admin-info-card">
                            <h4>📋 Distribution Protocol</h4>
                            <p>Follow fair distribution practices</p>
                            <p>Maintain accurate records</p>
                        </div>
                        <div className="info-card admin-info-card">
                            <h4>⏰ Time Management</h4>
                            <p>Schedule slots efficiently</p>
                            <p>Avoid overcrowding</p>
                        </div>
                        <div className="info-card admin-info-card">
                            <h4>📞 Support</h4>
                            <p>Admin Helpline: 1800-XXX-XXXX</p>
                            <p>Available 24/7</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
