import { Typography, Container, Box } from '@mui/material';

const Home = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to Paradise Hotel
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Experience luxury and comfort in our world-class facilities.
        </Typography>
      </Box>
    </Container>
  );
};

export default Home;