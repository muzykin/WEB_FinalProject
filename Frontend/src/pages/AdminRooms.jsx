import { useState, useEffect } from 'react';
import { 
  Container, Typography, Box, CircularProgress, Alert, Paper, Button,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, 
  Grid, IconButton, Snackbar, MenuItem, Select, InputLabel, FormControl
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useForm, Controller } from 'react-hook-form';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { axiosPrivate } from '../api/axios';

const AdminRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [locations, setLocations] = useState([]); // Needed for the dropdown
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modal State
  const [openModal, setOpenModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form setup
  const { register, handleSubmit, reset, setValue, control, formState: { errors } } = useForm();

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch both rooms and locations (to populate the select dropdown)
      const [roomsRes, locsRes] = await Promise.all([
        axiosPrivate.get('/api/admin/rooms'),
        axiosPrivate.get('/api/locations')
      ]);
      
      setRooms(roomsRes.data.rooms || []);
      setLocations(locsRes.data.locations || []);
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
      setError('Could not load data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (room = null) => {
    setEditingRoom(room);
    if (room) {
      // Prefill form for editing
      setValue('locationId', room.location.id);
      setValue('name', room.name);
      setValue('type', room.type);
      setValue('capacity', room.capacity);
      setValue('pricePerNight', room.pricePerNight);
      setValue('description', room.description);
    } else {
      // Reset form for creating new
      reset({ locationId: '', name: '', type: 'Standard', capacity: 2, pricePerNight: 100, description: '' });
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingRoom(null);
    reset();
  };

  const onSubmit = async (data) => {
    try {
      setIsSaving(true);
      
      // Ensure numerical values are correctly typed
      const payload = {
        ...data,
        locationId: Number(data.locationId),
        capacity: Number(data.capacity),
        pricePerNight: Number(data.pricePerNight)
      };

      if (editingRoom) {
        await axiosPrivate.put(`/api/admin/rooms/${editingRoom.id}`, payload);
        setSuccessMsg('Room updated successfully!');
      } else {
        await axiosPrivate.post('/api/admin/rooms', payload);
        setSuccessMsg('Room created successfully!');
      }
      handleCloseModal();
      fetchData(); // Refresh grids
    } catch (err) {
      console.error('Save failed:', err);
      setError(err.response?.data?.message || 'Failed to save room.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this room? It might fail if there are active reservations.')) return;
    
    try {
      await axiosPrivate.delete(`/api/admin/rooms/${id}`);
      setSuccessMsg('Room deleted successfully!');
      fetchData();
    } catch (err) {
      console.error('Delete failed:', err);
      setError(err.response?.data?.message || 'Failed to delete room.');
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Room Name', flex: 1, minWidth: 150 },
    { 
      field: 'location', 
      headerName: 'Hotel', 
      flex: 1, 
      minWidth: 200,
      renderCell: (params) => params.row?.location?.name || 'Unknown'
    },
    { field: 'type', headerName: 'Type', width: 130 },
    { field: 'capacity', headerName: 'Capacity', width: 100, type: 'number' },
    { 
      field: 'pricePerNight', 
      headerName: 'Price ($)', 
      width: 100, 
      type: 'number',
      renderCell: (params) => `$${params.row?.pricePerNight || 0}`
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton color="primary" onClick={() => handleOpenModal(params.row)} size="small">
            <EditIcon />
          </IconButton>
          <IconButton color="error" onClick={() => handleDelete(params.row.id)} size="small">
            <DeleteIcon />
          </IconButton>
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Manage Rooms
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => handleOpenModal()}
        >
          Add Room
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>{error}</Alert>}

      <Paper elevation={3} sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={rooms}
          columns={columns}
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } }
          }}
          disableRowSelectionOnClick
        />
      </Paper>

      {/* Create / Edit Modal */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>{editingRoom ? 'Edit Room' : 'Add New Room'}</DialogTitle>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <DialogContent dividers>
            <Grid container spacing={2}>
              {/* Dropdown for Hotel Location */}
              <Grid item xs={12}>
                <FormControl fullWidth error={!!errors.locationId}>
                  <InputLabel id="location-select-label">Hotel Location</InputLabel>
                  <Controller
                    name="locationId"
                    control={control}
                    rules={{ required: 'You must select a hotel location' }}
                    defaultValue=""
                    render={({ field }) => (
                      <Select
                        {...field}
                        labelId="location-select-label"
                        label="Hotel Location"
                      >
                        {locations.map((loc) => (
                          <MenuItem key={loc.id} value={loc.id}>
                            {loc.name} ({loc.city})
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Room Name"
                  {...register('name', { required: 'Name is required' })}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Room Type (e.g. Standard, Suite)"
                  {...register('type', { required: 'Type is required' })}
                  error={!!errors.type}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Capacity (Guests)"
                  type="number"
                  inputProps={{ min: "1", max: "10" }}
                  {...register('capacity', { required: 'Capacity is required', min: 1 })}
                  error={!!errors.capacity}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Price Per Night ($)"
                  type="number"
                  inputProps={{ min: "1" }}
                  {...register('pricePerNight', { required: 'Price is required', min: 1 })}
                  error={!!errors.pricePerNight}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  {...register('description')}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal}>Cancel</Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Room'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Snackbar open={!!successMsg} autoHideDuration={4000} onClose={() => setSuccessMsg('')}>
        <Alert severity="success" onClose={() => setSuccessMsg('')} sx={{ width: '100%' }}>
          {successMsg}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminRooms;