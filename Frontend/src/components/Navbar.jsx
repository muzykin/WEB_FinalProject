import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Helper function to style active navigation links
  const navStyle = (path) => {
    const isActive = location.pathname.startsWith(path) && path !== '/' || location.pathname === path;
    
    return {
      mx: 0.5,
      borderBottom: isActive ? '3px solid white' : '3px solid transparent',
      borderRadius: 0,
      opacity: isActive ? 1 : 0.8,
      pb: '6px', // Compensate for the border bottom height
      '&:hover': {
        opacity: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)'
      }
    };
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit', fontWeight: 'bold' }}
        >
          Paradise Hotel
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button color="inherit" component={RouterLink} to="/search" sx={navStyle('/search')}>
            Rooms
          </Button>
          <Button color="inherit" component={RouterLink} to="/about" sx={navStyle('/about')}>
            About
          </Button>

          {/* Unauthenticated User Links */}
          {!auth?.user ? (
            <>
              <Button color="inherit" component={RouterLink} to="/login" sx={navStyle('/login')}>
                Login
              </Button>
              <Button 
                color="inherit" 
                component={RouterLink} 
                to="/register" 
                variant="outlined" 
                sx={{ ml: 2, color: 'white', borderColor: 'white', borderRadius: 2 }}
              >
                Register
              </Button>
            </>
          ) : (
            /* Authenticated User Links */
            <>
              {auth.user.role === 'admin' ? (
                /* Admin Only Links */
                <>
                  <Button color="inherit" component={RouterLink} to="/admin/locations" sx={navStyle('/admin/locations')}>
                    Hotels
                  </Button>
                  <Button color="inherit" component={RouterLink} to="/admin/rooms" sx={navStyle('/admin/rooms')}>
                    Manage Rooms
                  </Button>
                  <Button color="inherit" component={RouterLink} to="/admin/reservations" sx={navStyle('/admin/reservations')}>
                    All Reservations
                  </Button>
                  <Button color="inherit" component={RouterLink} to="/admin/dashboard" sx={navStyle('/admin/dashboard')}>
                    Dashboard
                  </Button>
                </>
              ) : (
                /* Regular User Only Links */
                <Button color="inherit" component={RouterLink} to="/my-reservations" sx={navStyle('/my-reservations')}>
                  My Reservations
                </Button>
              )}
              
              <Button 
                color="inherit" 
                onClick={handleLogout} 
                sx={{ ml: 2, border: '1px solid rgba(255,255,255,0.3)', borderRadius: 2 }}
              >
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