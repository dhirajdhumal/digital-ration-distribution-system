import AllocateStock from "./AllocateStock";
import Dashboard from "./Dashboard";
import { Routes, Route } from "react-router-dom";
import AllocatedStock from "./AllocatedStock";
import Notifications from "./Notifications";
import Complaints from "./Complaints";

function AdminRoutes() {
    return (
        <Routes>
            <Route path="dashboard" element={<Dashboard />} />               {/* /admin */}
            <Route path="allocate-stock" element={<AllocateStock />} /> {/* /admin/allocate-stock */}
            <Route path="allocated-stock" element={<AllocatedStock />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="complaints" element={<Complaints />} />
        </Routes>
    );
}

export default AdminRoutes;
