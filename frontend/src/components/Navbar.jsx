import React, { useContext,useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/authContext";
import "./Navbar.css";
import api from "../services/api";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user || user.role !== "user") {
        setUnreadCount(0);
        return;
    }
    
    let isActive = true; // To prevent state updates if the component unmounts
    
  const fetchUnreadCount = async () => {
    try {
      const res = await api.get("/user/notifications/unread-count");
        if (isActive) {
            setUnreadCount(res.data.unreadCount);
        }
    } catch (err) {
      console.error("Error fetching notifications", err);
    } finally {

      isActive = false;
    }
  };
  fetchUnreadCount();
  }, []);


  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🌾</span>
          <span className="logo-text">Ration Distribution System</span>
        </Link>

        <div className="navbar-menu">
          {user ? (
            <>
              <Link to="/" className="nav-link">
                Home
              </Link>

              {user.role === "admin" && (
                <Link to="/admin/dashboard" className="nav-link">
                  Admin Dashboard
                </Link>
              )}

              {user.role === "villageAdmin" && (
                <Link to="/village-admin/dashboard" className="nav-link">
                  Village Admin
                </Link>
              )}

              {user.role === "user" && (
                <>
                  <Link to="/user/dashboard" className="nav-link">
                    Dashboard
                  </Link>
                  <Link className="nav-link position-relative d-inline-block">
                    Notifications{" "}
                    <span
                      className="position-absolute top-0 start-100 translate-middle badge rounded-circle text-white"
                      style={{ backgroundColor: "#f3942e", marginTop: "5px" }}
                    >
                      {unreadCount > 0 && unreadCount}
                    </span>
                  </Link>
                  
                </>
              )}

              <div className="navbar-user">
                <span className="user-name">👤 {user.name}</span>
                <button onClick={logout} className="btn-logout">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="btn-register">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
