import { Box, Typography, Button, Container, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PoolIcon from '@mui/icons-material/Pool';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import SpaIcon from '@mui/icons-material/Spa';

// Feature card component
const FeatureCard = ({ icon, title, description }) => (
  <Paper 
    elevation={3} 
    sx={{ 
      p: 4, 
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center', 
      borderRadius: 3,
      transition: 'transform 0.3s ease-in-out, box-shadow 0.3s', 
      '&:hover': { 
        transform: 'translateY(-10px)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
      } 
    }}
  >
    <Box sx={{ color: 'primary.main', mb: 2, display: 'flex', justifyContent: 'center' }}>
      {icon}
    </Box>
    <Typography variant="h5" gutterBottom fontWeight="bold">
      {title}
    </Typography>
    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6, flexGrow: 1 }}>
      {description}
    </Typography>
  </Paper>
);

const Home = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <Box
        sx={{
          position: 'relative',
          height: '80vh',
          minHeight: '600px',
          display: 'flex',
          alignItems: 'center',
          backgroundImage: 'url(https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1920&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 20, 40, 0.65)', 
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, color: 'white', textAlign: 'center' }}>
          <Typography 
            variant="h2" 
            component="h1" 
            fontWeight="bold" 
            gutterBottom
            sx={{ textShadow: '2px 2px 8px rgba(0,0,0,0.6)' }}
          >
            Welcome to Paradise
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              mb: 5, 
              maxWidth: '800px', 
              mx: 'auto', 
              fontWeight: 300,
              textShadow: '1px 1px 4px rgba(0,0,0,0.6)' 
            }}
          >
            Experience luxury, comfort, and world-class facilities across the most beautiful locations. Your perfect getaway starts here.
          </Typography>
          <Button 
            variant="contained" 
            size="large" 
            color="primary"
            sx={{ 
              px: 6, 
              py: 1.5, 
              fontSize: '1.2rem', 
              borderRadius: '30px',
              textTransform: 'none',
              fontWeight: 'bold',
              boxShadow: '0 8px 20px rgba(0,0,0,0.4)'
            }}
            onClick={() => navigate('/search')}
          >
            Book Your Stay Now
          </Button>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ my: 10 }}>
        <Typography variant="h3" align="center" fontWeight="bold" gutterBottom sx={{ mb: 2 }}>
          Why Choose Us
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 8, maxWidth: 600, mx: 'auto' }}>
          We provide everything you need for an unforgettable vacation, tailored to your every desire.
        </Typography>
        
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, 
            gap: 4, 
            alignItems: 'stretch' 
          }}
        >
          <Box sx={{ flex: 1, display: 'flex' }}>
            <FeatureCard 
              icon={<PoolIcon sx={{ fontSize: 60 }} />}
              title="Infinity Pools"
              description="Relax in our temperature-controlled infinity pools with breathtaking panoramic views of the surrounding landscapes."
            />
          </Box>
          <Box sx={{ flex: 1, display: 'flex' }}>
            <FeatureCard 
              icon={<SpaIcon sx={{ fontSize: 60 }} />}
              title="Wellness & Spa"
              description="Rejuvenate your body and mind with our award-winning spa treatments, massages, and holistic therapies."
            />
          </Box>
          <Box sx={{ flex: 1, display: 'flex' }}>
            <FeatureCard 
              icon={<RestaurantIcon sx={{ fontSize: 60 }} />}
              title="Fine Dining"
              description="Savor exquisite international and local dishes prepared by our Michelin-starred culinary team."
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;