import { useState, useEffect } from 'react';
import { 
  Container, Grid, Typography, Box, TextField, Button, 
  FormControlLabel, Checkbox, Paper, Alert, CircularProgress 
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { axiosPublic } from '../api/axios';
import RoomCard from '../components/RoomCard';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DEFAULT_SEARCH_PARAMS = {
  checkIn: dayjs().add(1, 'day'),
  checkOut: dayjs().add(3, 'day'),
  guests: 2,
  city: '',
  search: '',
  rating: '',
  freeParking: false,
  wellnessCenter: false
};

const RoomSearch = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useState(DEFAULT_SEARCH_PARAMS);

  const fetchRooms = async (paramsToUse) => {
    try {
      setLoading(true);
      setError('');
      
      const params = {
        checkIn: paramsToUse.checkIn.format('YYYY-MM-DD'),
        checkOut: paramsToUse.checkOut.format('YYYY-MM-DD'),
        guests: paramsToUse.guests,
        ...(paramsToUse.city && { city: paramsToUse.city }),
        ...(paramsToUse.search && { search: paramsToUse.search }),
        ...(paramsToUse.rating && { rating: paramsToUse.rating }),
        ...(paramsToUse.freeParking && { freeParking: true }),
        ...(paramsToUse.wellnessCenter && { wellnessCenter: true }),
      };

      const response = await axiosPublic.get('/api/rooms/availability', { params });
      setRooms(response.data.rooms || []);
    } catch (err) {
      console.error('Search failed:', err);
      setError('Failed to fetch available rooms. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchRooms(searchParams);
  };

  const handleReset = () => {
    setSearchParams(DEFAULT_SEARCH_PARAMS);
    fetchRooms(DEFAULT_SEARCH_PARAMS);
  };

  useEffect(() => {
    fetchRooms(DEFAULT_SEARCH_PARAMS);
  }, []);

  const handleReserve = (room) => {
    if (!auth?.user) {
      navigate('/login');
      return;
    }
    alert(`Reservation flow for Room ${room.id} will be here!`);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="xl" sx={{ mt: 4, mb: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
          Find Your Perfect Room
        </Typography>

        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Grid container spacing={2} alignItems="center">
            {/* Row 1 */}
            <Grid item xs={12} sm={6} md={3}>
              <DatePicker 
                label="Check In Date"
                value={searchParams.checkIn}
                onChange={(newValue) => setSearchParams({...searchParams, checkIn: newValue})}
                disablePast
                slotProps={{ textField: { fullWidth: true, size: 'small' } }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <DatePicker 
                label="Check Out Date"
                value={searchParams.checkOut}
                onChange={(newValue) => setSearchParams({...searchParams, checkOut: newValue})}
                minDate={searchParams.checkIn.add(1, 'day')}
                slotProps={{ textField: { fullWidth: true, size: 'small' } }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField 
                label="Guests" 
                type="number" 
                size="small"
                fullWidth 
                InputProps={{ inputProps: { min: 1, max: 10 } }}
                value={searchParams.guests}
                onChange={(e) => setSearchParams({...searchParams, guests: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField 
                label="City" 
                size="small"
                fullWidth 
                placeholder="e.g. Varna"
                value={searchParams.city}
                onChange={(e) => setSearchParams({...searchParams, city: e.target.value})}
              />
            </Grid>
            
            {/* Row 2 */}
            <Grid item xs={12} sm={6} md={3}>
              <TextField 
                label="Hotel Name" 
                size="small"
                fullWidth 
                value={searchParams.search}
                onChange={(e) => setSearchParams({...searchParams, search: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField 
                label="Min Rating" 
                type="number" 
                size="small"
                fullWidth 
                InputProps={{ inputProps: { min: 1, max: 5, step: 0.1 } }}
                value={searchParams.rating}
                onChange={(e) => setSearchParams({...searchParams, rating: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'flex-start', md: 'center' } }}>
                <FormControlLabel 
                  control={<Checkbox checked={searchParams.freeParking} onChange={(e) => setSearchParams({...searchParams, freeParking: e.target.checked})} />} 
                  label="Free Parking" 
                />
                <FormControlLabel 
                  control={<Checkbox checked={searchParams.wellnessCenter} onChange={(e) => setSearchParams({...searchParams, wellnessCenter: e.target.checked})} />} 
                  label="Wellness Center" 
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={12} md={3}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button variant="outlined" size="large" fullWidth onClick={handleReset} disabled={loading}>
                  Clear
                </Button>
                <Button variant="contained" size="large" fullWidth onClick={handleSearch} disabled={loading}>
                  Search
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {rooms.length === 0 ? (
              <Grid item xs={12}>
                <Typography variant="h6" color="text.secondary" align="center" sx={{ mt: 4 }}>
                  No rooms found matching your criteria. Try changing dates or removing filters.
                </Typography>
              </Grid>
            ) : (
              rooms.map((room) => (
                <Grid item key={room.id} xs={12} sm={6} md={4} lg={3}>
                  <RoomCard room={room} onReserve={handleReserve} />
                </Grid>
              ))
            )}
          </Grid>
        )}
      </Container>
    </LocalizationProvider>
  );
};

export default RoomSearch;