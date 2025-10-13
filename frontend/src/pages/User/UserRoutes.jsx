import { Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import Complaint from "./Complaint";
import Notification from "./Notification";

function UserRoutes() {
    return ( 
        <Routes>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="complaint" element={<Complaint/>} />
            <Route path="notification" element={<Notification />} />
        </Routes>
     );
}

export default UserRoutes;