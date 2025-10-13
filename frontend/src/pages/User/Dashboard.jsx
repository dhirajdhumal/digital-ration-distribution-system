import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../../context/authContext";
import './Dashboard.css';

function Dashboard() {
    const navigate = useNavigate();
    const {user} = useContext(AuthContext);

    return (
        <div>
            <h1 style={{textAlign: 'center',marginTop: '50px', marginBottom: '50px'}}>Everything here For You {user?.name || "Uset"}</h1>
            <div className="userCard">
                <div className="userPanel">
                    <h1>Complaint Here</h1>
                    <h4>Report any issues regarding ration.</h4>
                    <button onClick={() => navigate('/user/complaint')}>Complaint</button>
                </div>
                <div className="userPanel">
                    <h1>Your Notifications/Schmes</h1>
                    <h4>See Your all notifications and Schemes.</h4>
                    <button onClick={() => navigate('/user/notification')}>View Here!</button>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;