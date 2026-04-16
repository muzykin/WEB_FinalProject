import { useState, useEffect } from 'react';
import { 
  Container, Typography, Box, CircularProgress, Alert, Paper, Chip 
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { axiosPrivate } from '../api/axios';
import dayjs from 'dayjs';

const AdminReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);
        const response = await axiosPrivate.get('/api/admin/reservations');
        setReservations(response.data.reservations || []);
      } catch (err) {
        console.error('Failed to fetch admin reservations:', err);
        setError('Could not load reservations data.');
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'guestName', headerName: 'Guest Name', width: 150 },
    { field: 'guestEmail', headerName: 'Email', width: 200 },
    { field: 'locationName', headerName: 'Hotel', width: 200 },
    { field: 'roomName', headerName: 'Room', width: 150 },
    { 
      field: 'checkIn', 
      headerName: 'Check In', 
      width: 120,
      valueFormatter: (params) => dayjs(params.value).format('YYYY-MM-DD')
    },
    { 
      field: 'checkOut', 
      headerName: 'Check Out', 
      width: 120,
      valueFormatter: (params) => dayjs(params.value).format('YYYY-MM-DD')
    },
    { field: 'guests', headerName: 'Guests', width: 80, type: 'number' },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 120,
      renderCell: (params) => (
        <Chip 
          label={params.value.toUpperCase()} 
          color={params.value === 'active' ? 'success' : 'error'} 
          size="small" 
          variant="outlined"
        />
      )
    },
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        All Reservations Management
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Paper elevation={3} sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={reservations}
          columns={columns}
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
            sorting: { sortModel: [{ field: 'id', sort: 'desc' }] }
          }}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
          disableRowSelectionOnClick
        />
      </Paper>
    </Container>
  );
};

export default AdminReservations;