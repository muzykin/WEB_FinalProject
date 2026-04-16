import { Routes, Route } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import AdminReservations from './pages/AdminReservations';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import RoomSearch from './pages/RoomSearch';
import MyReservations from './pages/MyReservations';

function App() {
  return (  
    <>
      <Navbar />
      
      <main>
        <Routes>
          {/* Public Routes (Accessible by anyone) */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<div>About Page (Public)</div>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/search" element={<RoomSearch />} />

          {/* Protected Routes for ALL authenticated users (Guests & Admins) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/my-reservations" element={<MyReservations />} />
          </Route>

          {/* Protected Routes for ADMINS only */}
          <Route element={<ProtectedRoute requireAdmin={true} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/reservations" element={<AdminReservations />} />
            <Route path="/admin/locations" element={<div>Admin Locations</div>} />
          </Route>
        </Routes>
      </main>
    </>
  );
}

export default App;