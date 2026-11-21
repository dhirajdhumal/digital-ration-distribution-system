import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/authContext';
import './Home.css';

const Home = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleDashboardClick = () => {
        if (user?.role === 'admin') {
            navigate('/admin/dashboard');
        } else if (user?.role === 'villageAdmin') {
            navigate('/village-admin/dashboard');
        } else if (user?.role === 'user') {
            navigate('/user/dashboard');
        }
    };

    return (
        <div className="home">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <div className="emblem">🌾</div>
                    <h1>Digital Ration Distribution System</h1>
                    <p className="subtitle">Government of India | Public Distribution System</p>
                    <p className="description">
                        Ensuring Food Security and Transparent Distribution
                    </p>
                    
                    {/* Show different buttons based on login status */}
                    <div className="hero-buttons">
                        {user ? (
                            <>
                                <button onClick={handleDashboardClick} className="btn btn-primary">
                                    Go to Dashboard
                                </button>
                                <p style={{color: 'white', marginTop: '1rem'}}>
                                    Welcome back, {user.name}!
                                </p>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-primary">Citizen Login</Link>
                                <Link to="/register" className="btn btn-secondary">New Registration</Link>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="features">
                <h2>Key Features</h2>
                <div className="features-grid">
                    <div className="feature">
                        <div className="feature-icon">📱</div>
                        <h3>Digital Ration Card</h3>
                        <p>Access your details online anytime</p>
                    </div>
                    <div className="feature">
                        <div className="feature-icon">📦</div>
                        <h3>Stock Allocation</h3>
                        <p>Real-time tracking of rations</p>
                    </div>
                    <div className="feature">
                        <div className="feature-icon">⏰</div>
                        <h3>Time Slot Booking</h3>
                        <p>Book collection slots easily</p>
                    </div>
                    <div className="feature">
                        <div className="feature-icon">📢</div>
                        <h3>Notifications</h3>
                        <p>Get instant updates</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <p>&copy; 2024 Government of India. All Rights Reserved.</p>
            </footer>
        </div>
    );
};

export default Home;
