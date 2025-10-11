import { Routes, Route } from 'react-router-dom';
import { Container } from '@mui/material'; // Assuming you are using Material-UI
import './App.css';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Auth/Login.jsx';
import Register from './pages/Auth/Register';
import ProtectedRoute from './components/ProtectedRoute.jsx'; // Import ProtectedRoute component
import Dashboard from './pages/Dashboard.jsx'; // Import Dashboard component  
import AdminRoutes from './pages/Admin/AdminRoutes.jsx';   
import VillageAdminRoutes from './pages/VillageAdmin/VillageAdminRoutes.jsx';

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
              <Route path="/dashboard" element={<ProtectedRoute> <Dashboard /> </ProtectedRoute>} />

              <Route path="/admin/*" element={<ProtectedRoute adminOnly={true}> <AdminRoutes /> </ProtectedRoute>} />
              <Route path="/village-admin/*" element={<ProtectedRoute villageAdminOnly={true}> <VillageAdminRoutes /> </ProtectedRoute>} />
            </Routes>
          </Container>
        </main>
      </div>
    </>
  );
}

export default App;