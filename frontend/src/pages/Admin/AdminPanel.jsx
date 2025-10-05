import './AdminPanel.css';  
import { useNavigate } from 'react-router-dom';


function AdminPanel() {
    const navigate = useNavigate();


    return (
        <div>
            <h1 style={{textAlign: 'center',marginTop: '50px', marginBottom: '50px'}}>Everything here For You Admin</h1>
            <div className='adminCard'>
                <div className="adminPanel">
                <h1>Distribute ration</h1>
                <h4>Allocate stock to Village Admin</h4>
                <button onClick={() => navigate('/admin/allocate-stock')}>Allocate</button>
            </div>

            <div className="adminPanel">
                <h1>Allocated Stock</h1>
                <h4>View Allocated Stock Details</h4>
                <button onClick={() => navigate('/admin/allocated-stock')}>View</button>
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

            </div>
            
        </div>
    );
}

export default AdminPanel;
