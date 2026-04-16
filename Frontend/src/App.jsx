import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

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
          <Route path="/search" element={<div>Room Search Page</div>} />

          {/* Protected Routes for ALL authenticated users (Guests & Admins) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/my-reservations" element={<div>My Reservations (User)</div>} />
          </Route>

          {/* Protected Routes for ADMINS only */}
          <Route element={<ProtectedRoute requireAdmin={true} />}>
            <Route path="/admin/dashboard" element={<div>Admin Dashboard</div>} />
            <Route path="/admin/reservations" element={<div>Admin Reservations</div>} />
            <Route path="/admin/locations" element={<div>Admin Locations</div>} />
          </Route>
        </Routes>
      </main>
    </>
  );
}

export default App;