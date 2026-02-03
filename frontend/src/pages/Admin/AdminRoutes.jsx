import AllocateStock from "./AllocateStock";
import Dashboard from "./Dashboard";
import { Routes, Route } from "react-router-dom";
import AllocationRecords from "./AllocationRecords";
import Notifications from "./Notifications";
import Complaints from "./Complaints";
import MakeVillageAdmin from "./MakeVillageAdmin";
import StockQuantityUpdation from "./StockQuantityUpdation";
import CreateStock from "./CreateStock";

function AdminRoutes() {
    return (
        <Routes>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="allocate-stock" element={<AllocateStock />} />
            <Route path="allocation-records" element={<AllocationRecords />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="complaints" element={<Complaints />} />
            <Route path="make-village-admin" element={<MakeVillageAdmin />} />
            <Route path="update-stock-quantity" element={<StockQuantityUpdation />} />
            <Route path="create-stock" element={<CreateStock />} />
        </Routes>
    );
}

export default AdminRoutes;
