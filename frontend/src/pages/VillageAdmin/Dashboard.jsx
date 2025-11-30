import './Dashboard.css';  
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../../context/authContext'; 

function Dashboard() {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    return (
        <div>
            <h1 style={{textAlign: 'center',marginTop: '50px', marginBottom: '50px'}}>Everything here For You {user?.name || "Admin"}</h1>
            <div className='adminCard'>

            <div className="adminPanel">
                <h1>Distribute ration</h1>
                <h4>Allocate stock to Users</h4>
                <button onClick={() => navigate('/village-admin/allocate-stock')}>Allocate</button>
            </div>

            <div className="adminPanel">
                <h1>Allocated Stock</h1>
                <h4>View Allocated Stock Details</h4>
                <button onClick={() => navigate('/village-admin/allocated-stock')}>View</button>
            </div>

            </div>
        </div>
    );
}

export default Dashboard;