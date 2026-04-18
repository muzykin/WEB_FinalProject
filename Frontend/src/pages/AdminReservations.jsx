import { useState, useEffect } from 'react';
import { Container, Typography, Box, CircularProgress, Alert, Paper, Chip, IconButton } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import CancelIcon from '@mui/icons-material/Cancel';
import { axiosPrivate } from '../api/axios';

const AdminReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

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

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleCancelReservation = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) return;

    // Admins use the same endpoint as users to cancel reservations
    try {
      await axiosPrivate.delete(`/api/reservations/${id}`);
      setSuccessMsg('Reservation cancelled successfully.');
      fetchReservations(); // Refresh the table
    } catch (err) {
      console.error('Cancel failed:', err);
      setError(err.response?.data?.message || 'Failed to cancel reservation.');
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'guestName', headerName: 'Guest Name', flex: 1, minWidth: 150 },
    { field: 'guestEmail', headerName: 'Email', flex: 1, minWidth: 180 },
    { 
      field: 'locationName', 
      headerName: 'Hotel', 
      flex: 1, 
      minWidth: 150,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ whiteSpace: 'normal', lineHeight: 1.2 }}>
          {params.row.locationName} <br/> 
          <Typography component="span" variant="caption" color="text.secondary">
            ({params.row.roomName})
          </Typography>
        </Typography>
      )
    },
    { 
      field: 'checkIn', 
      headerName: 'Check In', 
      width: 120,
      valueGetter: (params) => dayjs(params.value).format('YYYY-MM-DD')
    },
    { 
      field: 'checkOut', 
      headerName: 'Check Out', 
      width: 120,
      valueGetter: (params) => dayjs(params.value).format('YYYY-MM-DD')
    },
    { field: 'guests', headerName: 'Guests', width: 80, type: 'number' },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 120,
      renderCell: (params) => (
        <Chip 
          label={params.value.toUpperCase()} 
          color={params.value === 'active' ? 'success' : 'default'} 
          size="small" 
          variant="outlined"
          sx={{ fontWeight: 'bold' }}
        />
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <Box>
          {params.row.status === 'active' && (
            <IconButton 
              color="error" 
              onClick={() => handleCancelReservation(params.row.id)} 
              size="small"
              title="Cancel Reservation"
            >
              <CancelIcon />
            </IconButton>
          )}
        </Box>
      ),
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
        All Reservations (Admin)
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>{error}</Alert>}
      {successMsg && <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMsg('')}>{successMsg}</Alert>}

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
          rowHeight={60}
        />
      </Paper>
    </Container>
  );
};

export default AdminReservations;