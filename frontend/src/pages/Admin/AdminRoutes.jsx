import AllocateStock from "./AllocateStock";
import Dashboard from "./Dashboard";
import { Routes, Route } from "react-router-dom";
import AllocatedStock from "./AllocatedStock";
import Notifications from "./Notifications";
import Complaints from "./Complaints";
import MakeVillageAdmin from "./MakeVillageAdmin";
import StockQuantityUpdation from "./StockQuantityUpdation";

function AdminRoutes() {
    return (
        <Routes>
            <Route path="dashboard" element={<Dashboard />} />               {/* /admin */}
            <Route path="allocate-stock" element={<AllocateStock />} /> {/* /admin/allocate-stock */}
            <Route path="allocated-stock" element={<AllocatedStock />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="complaints" element={<Complaints />} />
            <Route path="make-village-admin" element={<MakeVillageAdmin />} />
            <Route path="update-stock-quantity" element={<StockQuantityUpdation />} />

        </Routes>
    );
}

export default AdminRoutes;
