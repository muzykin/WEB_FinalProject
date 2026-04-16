import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
        >
          Paradise Hotel
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button color="inherit" component={RouterLink} to="/search">
            Rooms
          </Button>
          <Button color="inherit" component={RouterLink} to="/about">
            About
          </Button>

          {/* If user is NOT logged in */}
          {!auth?.user ? (
            <>
              <Button color="inherit" component={RouterLink} to="/login">
                Login
              </Button>
              <Button color="inherit" component={RouterLink} to="/register" variant="outlined" sx={{ ml: 1, color: 'white', borderColor: 'white' }}>
                Register
              </Button>
            </>
          ) : (
            /* If user IS logged in */
            <>
              {auth.user.role === 'admin' ? (
                <>
                  <Button color="inherit" component={RouterLink} to="/admin/locations">
                    Hotels
                  </Button>
                  <Button color="inherit" component={RouterLink} to="/admin/reservations">
                    All Reservations
                  </Button>
                  <Button color="inherit" component={RouterLink} to="/admin/dashboard">
                    Dashboard
                  </Button>
                </>
              ) : (
                <Button color="inherit" component={RouterLink} to="/my-reservations">
                  My Reservations
                </Button>
              )}
              
              <Button color="inherit" onClick={handleLogout} sx={{ ml: 2 }}>
                Logout ({auth.user.name})
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;