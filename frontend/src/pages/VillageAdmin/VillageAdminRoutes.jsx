import Dashboard from "./Dashboard";
import AllocateStock from "./AllocateStock";
import TimeSlots from "./TimeSlots";
import AllocationRecords from "./AllocationRecords";
import { Routes, Route } from "react-router-dom";

function VillageAdminRoutes() {
    return ( 
        <Routes>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="allocate-stock" element={<AllocateStock />} />
            <Route path="timeslots" element={<TimeSlots />} />
            <Route path="allocation-records" element={<AllocationRecords />} />
        </Routes>
    );
}

export default VillageAdminRoutes;