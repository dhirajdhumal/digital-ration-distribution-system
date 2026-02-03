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
                <h1>Create Stock</h1>
                <h4>Add new stock items to inventory</h4>
                <button onClick={() => navigate('/admin/create-stock')}>Create</button>
            </div>

            <div className="adminPanel">
                <h1>Distribute ration</h1>
                <h4>Allocate stock to Village Admin</h4>
                <button onClick={() => navigate('/admin/allocate-stock')}>Allocate</button>
            </div>

            <div className="adminPanel">
                <h1>Distribution Records</h1>
                <h4>View allocation history</h4>
                <button onClick={() => navigate('/admin/allocation-records')}>View Records</button>
            </div>

            <div className="adminPanel">
                <h1>Send Notifications</h1>
                <h4>Notify Users About Schemes & Updates</h4>
                <button onClick={() => navigate('/admin/notifications')}>Send</button>
            </div>

            <div className="adminPanel">
                <h1>User Complaints</h1>
                <h4>View User Complaints</h4>
                <button onClick={() => navigate('/admin/complaints')}>View</button>
            </div>

            <div className="adminPanel">
                <h1>Manage User Roles</h1>
                <h4>Promote or demote users</h4>
                <button onClick={() => navigate('/admin/make-village-admin')}>Manage</button>
            </div>

            <div className="adminPanel">
                <h1>Update Stock Quantity</h1>
                <h4>Update the quantity of stock items</h4>
                <button onClick={() => navigate('/admin/update-stock-quantity')}>Update Here</button>
            </div>

            </div>
            
        </div>
    );
}

export default Dashboard;
