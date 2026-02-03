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
                <h1>Allocation Records</h1>
                <h4>View allocation history</h4>
                <button onClick={() => navigate('/village-admin/allocation-records')}>View Records</button>
            </div>

            <div className="adminPanel">
                <h1>Manage Time Slots</h1>
                <h4>Create slots and assign users</h4>
                <button onClick={() => navigate('/village-admin/timeslots')}>Manage</button>
            </div>

            </div>
        </div>
    );
}

export default Dashboard;