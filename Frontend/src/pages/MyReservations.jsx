import { useState, useEffect } from 'react';
import { 
  Container, Typography, Box, CircularProgress, Alert, 
  Card, CardContent, Grid, Button, Chip, Dialog, 
  DialogTitle, DialogContent, DialogActions, Snackbar 
} from '@mui/material';
import { axiosPrivate } from '../api/axios';
import dayjs from 'dayjs';

const MyReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Cancel Modal State
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const response = await axiosPrivate.get('/api/reservations/me');
      setReservations(response.data.reservations || []);
    } catch (err) {
      console.error('Failed to fetch reservations:', err);
      setError('Could not load your reservations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleCancelClick = (reservation) => {
    setSelectedReservation(reservation);
    setCancelModalOpen(true);
  };

  const handleCancelConfirm = async () => {
    if (!selectedReservation) return;
    
    try {
      setCancelLoading(true);
      await axiosPrivate.delete(`/api/reservations/${selectedReservation.id}`);
      
      setSuccessMessage('Reservation cancelled successfully');
      setCancelModalOpen(false);
      setSelectedReservation(null);
      
      // Refresh the list
      fetchReservations();
    } catch (err) {
      console.error('Failed to cancel reservation:', err);
      setError('Failed to cancel reservation. It might be too late.');
      setCancelModalOpen(false);
    } finally {
      setCancelLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        My Reservations
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {reservations.length === 0 && !error ? (
        <Alert severity="info">You have no reservations yet. Go to Rooms to book a stay!</Alert>
      ) : (
        <Grid container spacing={3}>
          {reservations.map((res) => (
            <Grid item xs={12} md={6} key={res.id}>
              <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" component="div">
                      {res.roomName} - {res.roomType}
                    </Typography>
                    <Chip 
                      label={res.status.toUpperCase()} 
                      color={res.status === 'active' ? 'success' : 'error'} 
                      size="small" 
                    />
                  </Box>

                  <Typography color="text.secondary" gutterBottom>
                    {res.locationName}, {res.locationCity}
                  </Typography>

                  <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                    <Typography variant="body2">
                      <strong>Check-in:</strong> {dayjs(res.checkIn).format('MMMM D, YYYY')}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Check-out:</strong> {dayjs(res.checkOut).format('MMMM D, YYYY')}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Guests:</strong> {res.guests}
                    </Typography>
                  </Box>
                </CardContent>
                
                {res.status === 'active' && (
                  <Box sx={{ p: 2, pt: 0 }}>
                    <Button 
                      variant="outlined" 
                      color="error" 
                      fullWidth 
                      onClick={() => handleCancelClick(res)}
                    >
                      Cancel Reservation
                    </Button>
                  </Box>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Cancel Confirmation Modal */}
      <Dialog open={cancelModalOpen} onClose={() => !cancelLoading && setCancelModalOpen(false)}>
        <DialogTitle>Cancel Reservation</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to cancel your reservation at <strong>{selectedReservation?.locationName}</strong> for <strong>{dayjs(selectedReservation?.checkIn).format('MMMM D')}</strong>?
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelModalOpen(false)} disabled={cancelLoading}>
            Keep Reservation
          </Button>
          <Button 
            onClick={handleCancelConfirm} 
            color="error" 
            variant="contained"
            disabled={cancelLoading}
            startIcon={cancelLoading ? <CircularProgress size={20} /> : null}
          >
            Yes, Cancel It
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Notification Snackbar */}
      <Snackbar 
        open={!!successMessage} 
        autoHideDuration={6000} 
        onClose={() => setSuccessMessage('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSuccessMessage('')} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default MyReservations;