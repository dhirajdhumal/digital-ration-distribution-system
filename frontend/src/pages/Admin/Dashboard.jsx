import './Dashboard.css';  
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../../context/authContext'; 

function Dashboard() {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    return (
        <div className="dashboard-page system-admin-page">
            {/* Header Section */}
            <div className="dashboard-header-section system-header">
                <div className="container">
                    <div className="welcome-banner">
                        <div className="welcome-content">
                            <h1 className="welcome-title">Welcome, {user?.name || "System Admin"}!</h1>
                            <p className="welcome-subtitle">System Administrator Dashboard - Central Control</p>
                            <div className="user-badge system-badge">
                                <span className="badge-icon">👨‍💼</span>
                                <span className="badge-text">System Administrator</span>
                                <span className="badge-village">🏛️ Central Office</span>
                            </div>
                        </div>
                        <div className="welcome-illustration">
                            <div className="illustration-circle system-circle">🎯</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="quick-stats-section">
                <div className="container">
                    <div className="stats-grid-admin">
                        <div className="stat-box system-stat">
                            <div className="stat-icon">📦</div>
                            <div className="stat-info">
                                <div className="stat-label">Total Stock</div>
                                <div className="stat-value">Managed</div>
                            </div>
                        </div>
                        <div className="stat-box system-stat">
                            <div className="stat-icon">🏘️</div>
                            <div className="stat-info">
                                <div className="stat-label">Village Admins</div>
                                <div className="stat-value">Active</div>
                            </div>
                        </div>
                        <div className="stat-box system-stat">
                            <div className="stat-icon">👥</div>
                            <div className="stat-info">
                                <div className="stat-label">Total Users</div>
                                <div className="stat-value">Registered</div>
                            </div>
                        </div>
                        <div className="stat-box system-stat">
                            <div className="stat-icon">📝</div>
                            <div className="stat-info">
                                <div className="stat-label">Complaints</div>
                                <div className="stat-value">Pending</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Services */}
            <div className="services-dashboard-section">
                <div className="container">
                    <h2 className="section-heading">System Administration</h2>
                    
                    {/* Stock Management */}
                    <div className="admin-section-group">
                        <h3 className="group-title">📦 Stock Management</h3>
                        <div className="services-grid-compact">
                            <div className="service-card-dash system-card" onClick={() => navigate('/admin/create-stock')}>
                                <div className="service-icon-medium">➕</div>
                                <h3 className="service-title-small">Create Stock</h3>
                                <p className="service-description-small">Add new stock items to inventory</p>
                                <button className="service-btn-small system-btn">Create →</button>
                            </div>

                            <div className="service-card-dash system-card" onClick={() => navigate('/admin/update-stock-quantity')}>
                                <div className="service-icon-medium">🔄</div>
                                <h3 className="service-title-small">Update Quantity</h3>
                                <p className="service-description-small">Update stock item quantities</p>
                                <button className="service-btn-small system-btn">Update →</button>
                            </div>

                            <div className="service-card-dash system-card" onClick={() => navigate('/admin/allocate-stock')}>
                                <div className="service-icon-medium">📤</div>
                                <h3 className="service-title-small">Distribute Stock</h3>
                                <p className="service-description-small">Allocate to village admins</p>
                                <button className="service-btn-small system-btn">Allocate →</button>
                            </div>

                            <div className="service-card-dash system-card" onClick={() => navigate('/admin/allocation-records')}>
                                <div className="service-icon-medium">📊</div>
                                <h3 className="service-title-small">Distribution Records</h3>
                                <p className="service-description-small">View allocation history</p>
                                <button className="service-btn-small system-btn">View →</button>
                            </div>
                        </div>
                    </div>

                    {/* User Management */}
                    <div className="admin-section-group">
                        <h3 className="group-title">👥 User Management</h3>
                        <div className="services-grid-compact">
                            <div className="service-card-dash system-card" onClick={() => navigate('/admin/make-village-admin')}>
                                <div className="service-icon-medium">⚙️</div>
                                <h3 className="service-title-small">Manage Roles</h3>
                                <p className="service-description-small">Promote or demote users</p>
                                <button className="service-btn-small system-btn">Manage →</button>
                            </div>

                            <div className="service-card-dash system-card" onClick={() => navigate('/admin/complaints')}>
                                <div className="service-icon-medium">📝</div>
                                <h3 className="service-title-small">User Complaints</h3>
                                <p className="service-description-small">View and resolve complaints</p>
                                <button className="service-btn-small system-btn">View →</button>
                            </div>

                            <div className="service-card-dash system-card" onClick={() => navigate('/admin/notifications')}>
                                <div className="service-icon-medium">📢</div>
                                <h3 className="service-title-small">Send Notifications</h3>
                                <p className="service-description-small">Notify about schemes & updates</p>
                                <button className="service-btn-small system-btn">Send →</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* System Info */}
            <div className="info-section system-info">
                <div className="container">
                    <h3 className="info-section-title">System Information</h3>
                    <div className="info-grid">
                        <div className="info-card system-info-card">
                            <h4>🎯 Mission</h4>
                            <p>Ensure fair distribution</p>
                            <p>Maintain transparency</p>
                        </div>
                        <div className="info-card system-info-card">
                            <h4>📊 Monitoring</h4>
                            <p>Real-time tracking</p>
                            <p>Complete audit trail</p>
                        </div>
                        <div className="info-card system-info-card">
                            <h4>🔒 Security</h4>
                            <p>Role-based access</p>
                            <p>Data encryption</p>
                        </div>
                        <div className="info-card system-info-card">
                            <h4>📞 Support</h4>
                            <p>Admin Helpline</p>
                            <p>24/7 Available</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
