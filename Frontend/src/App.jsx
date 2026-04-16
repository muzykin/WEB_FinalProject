import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Routes>
      <Route path="/" element={<div>Home Page (Public)</div>} />
      <Route path="/about" element={<div>About Page (Public)</div>} />
      <Route path="/login" element={<div>Login Page</div>} />
      <Route path="/register" element={<div>Register Page</div>} />
      <Route path="/search" element={<div>Room Search Page</div>} />

      <Route path="/my-reservations" element={<div>My Reservations (User)</div>} />

      <Route path="/admin/dashboard" element={<div>Admin Dashboard</div>} />
      <Route path="/admin/reservations" element={<div>Admin Reservations</div>} />
      <Route path="/admin/locations" element={<div>Admin Locations</div>} />
    </Routes>
  )
}

export default App