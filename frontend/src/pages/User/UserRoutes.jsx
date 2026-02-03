import { Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import Complaint from "./Complaint";
import Notification from "./Notification";
import AllocatedRations from "./AllocatedRations";
import TimeSlotBooking from "./TimeSlotBooking";

function UserRoutes() {
    return ( 
        <Routes>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="complaint" element={<Complaint/>} />
            <Route path="notification" element={<Notification />} />
            <Route path="allocated-rations" element={<AllocatedRations />} />
            <Route path="timeslot-booking" element={<TimeSlotBooking />} />
        </Routes>
     );
}

export default UserRoutes;