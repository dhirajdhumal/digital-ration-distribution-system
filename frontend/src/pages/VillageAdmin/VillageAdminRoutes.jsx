import Dashboard from "./Dashboard";
import { Routes, Route } from "react-router-dom";

function VillageAdminRoutes() {
    return ( 
        <Routes>
            <Route path="dashboard" element={<Dashboard />} />               {/* /villageadmin/dashboard */}
        </Routes>
    );
}

export default VillageAdminRoutes;