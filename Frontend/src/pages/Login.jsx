import { Typography, Container, Box } from '@mui/material';

const Login = () => {
  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Login
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Login form will be implemented here.
        </Typography>
      </Box>
    </Container>
  );
};

export default Login;