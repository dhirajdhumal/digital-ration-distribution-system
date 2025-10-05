import { Routes, Route } from 'react-router-dom';
import { Container } from '@mui/material'; // Assuming you are using Material-UI
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Auth/Login.jsx';
import Register from './pages/Auth/Register';
import AdminPanel from './pages/Admin/AdminPanel.jsx'; //Import the AdminPanel component 
import VillageAdminPanel from './pages/VillageAdmin/VillageAdminPanel.jsx'; //Import the VillageAdminPanel component
import ProtectedRoute from './components/ProtectedRoute.jsx'; // Import ProtectedRoute component
import Dashboard from './pages/Dashboard.jsx'; // Import Dashboard component  

function App() {
  return (
    <>
      <div>
        <Navbar />
        <main>
          <Container>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/village-admin" element={<VillageAdminPanel />} />

              <Route path="/dashboard" element={<ProtectedRoute> <Dashboard /> </ProtectedRoute>} />
            </Routes>
          </Container>
        </main>
      </div>
    </>
  );
}

export default App;