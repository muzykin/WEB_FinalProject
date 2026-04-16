import { useState } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, Typography, Box, CircularProgress, Alert 
} from '@mui/material';
import { axiosPrivate } from '../api/axios';

const ReservationModal = ({ open, onClose, room, searchParams, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!room) return null;

  const handleConfirm = async () => {
    try {
      setLoading(true);
      setError('');
      
      // POST request to create reservation
      await axiosPrivate.post('/api/reservations', {
        roomId: room.id,
        checkIn: searchParams.checkIn.format('YYYY-MM-DD'),
        checkOut: searchParams.checkOut.format('YYYY-MM-DD'),
        guests: Number(searchParams.guests)
      });

      onSuccess(); // Close modal and show success message in parent
    } catch (err) {
      console.error('Reservation failed:', err);
      setError(err.response?.data?.message || 'Failed to create reservation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={!loading ? onClose : undefined} maxWidth="sm" fullWidth>
      <DialogTitle>Confirm Reservation</DialogTitle>
      <DialogContent dividers>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <Typography variant="h6" gutterBottom>
          {room.name}
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          {room.location.name} - {room.location.city}
        </Typography>

        <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Check-in:</strong> {searchParams.checkIn.format('MMMM D, YYYY')}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Check-out:</strong> {searchParams.checkOut.format('MMMM D, YYYY')}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Guests:</strong> {searchParams.guests}
          </Typography>
          <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
            Total Price: ${room.pricePerNight * searchParams.checkOut.diff(searchParams.checkIn, 'day')}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button 
          onClick={handleConfirm} 
          variant="contained" 
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Processing...' : 'Confirm Booking'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReservationModal;