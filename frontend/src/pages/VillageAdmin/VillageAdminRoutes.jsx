import Dashboard from "./Dashboard";
import AllocateStock from "./AllocateStock";
import { Routes, Route } from "react-router-dom";

function VillageAdminRoutes() {
    return ( 
        <Routes>
            <Route path="dashboard" element={<Dashboard />} />              {/* /villageadmin/dashboard */}
            <Route path="allocate-stock" element={<AllocateStock />} />              {/* /villageadmin/allocate-stock */}
        </Routes>
    );
}

export default VillageAdminRoutes;