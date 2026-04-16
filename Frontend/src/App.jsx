import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <>
      {/* Navbar will be displayed on all pages */}
      <Navbar />
      
      {/* Main content area */}
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<div>About Page (Public)</div>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/search" element={<div>Room Search Page</div>} />

          {/* User Routes (To be protected later) */}
          <Route path="/my-reservations" element={<div>My Reservations (User)</div>} />

          {/* Admin Routes (To be protected later) */}
          <Route path="/admin/dashboard" element={<div>Admin Dashboard</div>} />
          <Route path="/admin/reservations" element={<div>Admin Reservations</div>} />
          <Route path="/admin/locations" element={<div>Admin Locations</div>} />
        </Routes>
      </main>
    </>
  );
}

export default App;