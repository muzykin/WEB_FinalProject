import { Container, Typography, Box, Grid, Paper, Divider } from '@mui/material';

const About = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 6, mb: 12 }}>
      {/* Page Header */}
      <Typography variant="h2" component="h1" align="center" fontWeight="bold" gutterBottom>
        About Paradise Hotel
      </Typography>
      <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 6, maxWidth: 700, mx: 'auto' }}>
        Discover the perfect blend of modern luxury, exceptional comfort, and world-class service.
      </Typography>

      {/* Centered Wide Hero Image */}
      <Box sx={{ width: '100%', mb: 8, display: 'flex', justifyContent: 'center' }}>
        <img 
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&h=500&q=80" 
          alt="Paradise Hotel Resort" 
          style={{ 
            width: '100%', 
            maxHeight: '500px', 
            objectFit: 'cover', 
            borderRadius: '16px', 
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)' 
          }}
        />
      </Box>

      {/* Main Text Content */}
      <Grid container spacing={6} justifyContent="center">
        <Grid item xs={12} md={10}>
          <Typography variant="h4" gutterBottom color="primary" fontWeight="bold" align="center">
            Our Heritage & Vision
          </Typography>
          <Divider sx={{ mb: 4, width: 80, mx: 'auto', bgcolor: 'primary.main', borderWidth: 2 }} />
          
          <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, fontSize: '1.1rem', textAlign: 'justify', color: 'text.primary' }}>
            Founded in 2010, Paradise Hotel Group has evolved from a single, intimate boutique property into a globally recognized premier hospitality brand. Our fundamental mission is to craft unforgettable experiences that seamlessly blend the rich, authentic local culture of our destinations with world-class, uncompromising luxury.
          </Typography>
          
          <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, fontSize: '1.1rem', textAlign: 'justify', color: 'text.primary' }}>
            Whether you are visiting us for a crucial business conference, a romantic getaway, or a peaceful retreat from the bustling city life, our deeply dedicated team ensures that absolutely every aspect of your stay is perfectly tailored to your unique preferences. From the moment you walk through our grand lobby doors, you are treated not just as a guest, but as a cherished member of the Paradise family.
          </Typography>

          <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, fontSize: '1.1rem', textAlign: 'justify', color: 'text.primary' }}>
            We pride ourselves on our meticulous attention to detail, our award-winning culinary experiences, and our state-of-the-art wellness centers. Every Paradise location is strategically chosen and designed to offer breathtaking views, ultimate privacy, and easy access to local landmarks, ensuring your stay is nothing short of magical.
          </Typography>
        </Grid>
      </Grid>

      {/* 4 Beautiful Statistic Cards at the bottom */}
      <Box sx={{ mt: 10 }}>
        <Grid container spacing={4} justifyContent="center">
          {[
            { number: '15+', label: 'Years of Excellence', color: '#1976d2' },
            { number: '50k+', label: 'Happy Guests', color: '#2e7d32' },
            { number: '4', label: 'Luxury Locations', color: '#ed6c02' },
            { number: '24/7', label: 'Concierge Service', color: '#9c27b0' }
          ].map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 4, 
                  textAlign: 'center', 
                  borderRadius: 3,
                  borderTop: `6px solid ${stat.color}`, // Colored line at the top of each card
                  transition: 'transform 0.3s ease',
                  '&:hover': { transform: 'translateY(-10px)' } // Hover effect
                }}
              >
                <Typography variant="h3" fontWeight="bold" sx={{ color: stat.color, mb: 1 }}>
                  {stat.number}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" fontWeight="medium">
                  {stat.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default About;